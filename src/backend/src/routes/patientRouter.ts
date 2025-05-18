import express, { Request, Response, NextFunction } from "express";
import Account, { IAccount, Role } from "../models/Account";
import jwt from "jsonwebtoken";
const router = express.Router();

// Reusing authMiddleware from profileRouter

// Define the patient type for inline usage
type Patient = {
    id: string;
    name: string;
    age: number;
    gender: string;
    dob: string;
    lastVisit: string;
};

// Auth middleware using the built‑in RequestHandler type.
const authMiddleware: express.RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", req.headers.authorization);
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
        (req as any).accountId = decoded.id; // attach the account id to the request object
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized: Invalid token." });
        return;
    }
};

// ───── ADD PATIENT ─────────────────────────────────────────
router.post("/patients/add", authMiddleware,
    async (req: Request, res: Response) => {
        const { name, age, gender, dob, id } = req.body;
        const accountId = (req as any).accountId;

        try {
            const account = await Account.findById(accountId);
            console.log(account);
            console.log(Role);
            if (!account || !account.roles.includes(Role.DOCTOR)) {
                res.status(403).json({ error: "Unauthorized doctor access" });
                return;
            }

            if (!account.doctorProfile.patients) account.doctorProfile.patients = [];
            account.doctorProfile.patients.push({ id, name, age, gender, dob, lastVisit: "Today" });
            await account.save();

            res.status(200).json({ message: "Patient added", patient: { id, name, age, gender, dob, lastVisit: "Today" } });
            return;
        } catch (err) {
            res.status(500).json({ error: "Failed to add patient" });
            return;
        }
    });

// ───── DELETE PATIENT ───────────────────────────────────────
router.delete(
    "/patients/:id",
    authMiddleware,
    (async function (req: Request, res: Response): Promise<void> {
        const accountId = (req as any).accountId;
        const patientId = req.params.id;

        try {
            const account = await Account.findById(accountId);
            if (!account || !account.roles.includes(Role.DOCTOR)) {
                res.status(403).json({ error: "Unauthorized doctor access" });
                return;
            }

            account.doctorProfile.patients = account.doctorProfile.patients.filter(
                (p: Patient) => p.id !== patientId
            );
            await account.save();

            res.status(200).json({ message: "Patient deleted" });
        } catch (err) {
            res.status(500).json({ error: "Failed to delete patient" });
        }
    }) as express.RequestHandler
);

router.get(
    "/patients",
    authMiddleware,
    (async function (req: Request, res: Response): Promise<void> {
        try {
            const accountId = (req as any).accountId;
            const account = await Account.findById(accountId);

            if (!account || !account.roles.includes(Role.DOCTOR)) {
                res.status(403).json({ error: "Unauthorized doctor access" });
                return;
            }

            const patients = account.doctorProfile?.patients || [];
            res.status(200).json({ patients });
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch patients" });
        }
    }) as express.RequestHandler
);


export default router;
