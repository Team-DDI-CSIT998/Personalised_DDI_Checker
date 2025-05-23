// routes/profileRouter.ts
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Account, { IAccount, Role } from "../models/Account";
import dotenv from 'dotenv';
import path from 'path';

const router = express.Router();

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Auth middleware using the built‑in RequestHandler type.
const authMiddleware: express.RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "Unauthorized: No token provided." });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized: Invalid token format." });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        (req as any).accountId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized: Invalid token." });
        return;
    }
};

router.post("/profile/update", authMiddleware, async (req: Request, res: Response) => {
    try {
        const accountId = (req as any).accountId;
        if (!accountId) {
            res.status(400).json({ error: "No account ID provided." });
            return;
        }

        const { profileData } = req.body;
        if (!profileData) {
            res.status(400).json({ error: "No profile data provided." });
            return;
        }

        const account: IAccount | null = await Account.findById(accountId);
        if (!account) {
            res.status(404).json({ error: "Account not found." });
            return;
        }

        // Update the appropriate embedded profile based on role
        if (account.roles.includes(Role.DOCTOR) && profileData.doctorProfile) {
            account.doctorProfile = {
                ...account.doctorProfile,
                ...profileData.doctorProfile,
            };
        } else if (account.roles.includes(Role.PATIENT) && profileData.patientProfile) {
            account.patientProfile = {
                ...account.patientProfile,
                ...profileData.patientProfile,
            };
        } else {
            account.doctorProfile = { ...account.doctorProfile, ...profileData };
            account.patientProfile = { ...account.patientProfile, ...profileData };
        }

        await account.save();
        res.status(200).json({ message: "Profile updated successfully.", account });
        return;
    } catch (err: any) {
        console.error("Profile update error:", err.message);
        console.error("Profile update error:", err.stack);
        res.status(500).json({ error: "Failed to update profile." });
        return;
    }
});

router.get("/profile/me", authMiddleware, (async function (
    req: Request,
    res: Response
): Promise<void> {
    try {
        const accountId = (req as any).accountId;
        const account: IAccount | null = await Account.findById(accountId);

        if (!account) {
            res.status(404).json({ error: "Account not found" });
            return;
        }

        res.status(200).json({
            doctorProfile: account.doctorProfile,
            patientProfile: account.patientProfile,
            roles: account.roles,
            email: account.email
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch profile." });
    }
}) as express.RequestHandler);

export { authMiddleware };
export default router;
