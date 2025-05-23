import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Account, { IAccount, Role } from "./models/Account";
import profileRouter from "./routes/profileRouter";
import patientRouter from "./routes/patientRouter";
import prescriptionRouter from './routes/prescriptionRouter';
import { MONGO_URI } from './config';


const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use("/api", profileRouter);
app.use("/api", patientRouter);
app.use('/api/prescriptions', prescriptionRouter);


mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// =======================
// API ENDPOINTS
// =======================

// Get Medicines
app.get('/api/medicines', (req: Request, res: Response): void => {
    (async () => {
        try {
            const db = mongoose.connection.db;
            if (!db) throw new Error('MongoDB not ready');
            const drugs = await db
                .collection('drugs')
                .find({}, { projection: { name: 1, _id: 0 } })
                .toArray();
            res.json(drugs);
        } catch (error: any) {
            console.error('Fetch error:', error.message);
            res.status(500).json({ error: 'Failed to fetch medicines' });
        }
    })();
});

// DDI Check
app.post('/api/interactions', (req: Request, res: Response): void => {
    (async () => {
        try {
            const selectedMedicines: string[] = req.body.medicines;
            if (!Array.isArray(selectedMedicines) || selectedMedicines.length < 2 || selectedMedicines.length > 5) {
                return res.status(400).json({ error: 'Provide 2-5 medicines as an array' });
            }

            const db = mongoose.connection.db;
            if (!db) throw new Error('MongoDB not ready');

            const drugs = await db.collection('drugs').find({ name: { $in: selectedMedicines } }).toArray();
            const drugMap: Record<string, any[]> = {};
            drugs.forEach((drug) => {
                drugMap[drug.name.toLowerCase()] = drug.interactions || [];
            });

            const interactions: { pair: string; description: string }[] = [];
            for (let i = 0; i < selectedMedicines.length; i++) {
                for (let j = i + 1; j < selectedMedicines.length; j++) {
                    const a = selectedMedicines[i].toLowerCase();
                    const b = selectedMedicines[j].toLowerCase();
                    const aToB = drugMap[a]?.find((d) => d.name.toLowerCase() === b);
                    const bToA = drugMap[b]?.find((d) => d.name.toLowerCase() === a);
                    if (aToB) interactions.push({ pair: `${a} and ${b}`, description: aToB.description });
                    else if (bToA) interactions.push({ pair: `${a} and ${b}`, description: bToA.description });
                }
            }

            res.json(interactions);
        } catch (err: any) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to fetch interactions' });
        }
    })();
});

// Simplify Interactions
app.post('/api/simplify_interactions', (req: Request, res: Response): void => {
    (async () => {
        const { interactions } = req.body;
        if (!interactions?.length) return res.status(400).json({ error: 'No interactions provided' });

        try {
            const simplified = await Promise.all(
                interactions.map(async ({ pair, description }: { pair: string; description: string }) => {
                    const prompt = `Explain this drug interaction in a short, clear, and understandable way. Keep all important details from the description. Do not add any extra commentary or unrelated information.

Description: "${description}"`;
                    const response = await axios.post(
                        'https://openrouter.ai/api/v1/chat/completions',
                        {
                            model: 'meta-llama/llama-3.3-8b-instruct:free',
                            messages: [{ role: 'user', content: prompt }],
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                                'Content-Type': 'application/json',
                                'HTTP-Referer': 'http://localhost:5173',
                                'X-Title': 'MedMatch DDI Checker',
                            },
                        }
                    );
                    const shortDescription = response.data.choices?.[0]?.message?.content?.trim() || 'Could not simplify.';
                    return { pair, shortDescription };
                })
            );
            res.json(simplified);
        } catch (err: any) {
            console.error('OpenRouter API error:', err.response?.data || err.message);
            res.status(500).json({ error: 'Failed to simplify interactions' });
        }
    })();
});

// Updated Registration Endpoint for Multi-Role Account
app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
        const { email, password, role, confirmRoleAddition } = req.body;
        // Validate required fields.
        if (!email || !password || !role) {
            res.status(400).json({ error: "Email, password, and role are required." });
            return;
        }

        const existingAccount: IAccount | null = await Account.findOne({ email });

        if (existingAccount) {
            // If the account already includes the requested role, return an error.
            if (existingAccount.roles.includes(role)) {
                res.status(400).json({ error: "User already exists with this role." });
                return;
            } else {
                if (!confirmRoleAddition) {
                    res.status(409).json({
                        error: "Account exists",
                        message:
                            "This email is already registered. Do you want to add the new role to your existing account?",
                        addNewRole: true,
                    });
                    return;
                } else {
                    existingAccount.roles.push(role);
                    await existingAccount.save();
                    const token = jwt.sign(
                        { id: existingAccount._id },
                        process.env.JWT_SECRET as string,
                        { expiresIn: "1h" }
                    );
                    res.json({ token, user: existingAccount });
                    return;
                }
            }
        } else {
            const hashed = await bcrypt.hash(password, 10);
            const newAccount = new Account({
                email,
                password: hashed,
                roles: [role],
            });
            await newAccount.save();
            const token = jwt.sign(
                { id: newAccount._id },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );
            res.json({ token, user: newAccount });
            return;
        }
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Failed to register user" });
        return;
    }
});

// Updated Login Endpoint
app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email });
        if (!account) {
            res.status(400).json({ error: "User not found" });
            return;
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: account._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );
        res.json({ token, user: account });
        return;
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: "Failed to login" });
        return;
    }
});

app.post("/api/auth/check-email", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        console.log(req.body);
        if (!email) {
            res.status(400).json({ error: "Email is required." });
            return;
        }
        const existingAccount: IAccount | null = await Account.findOne({ email });
        // Respond with a boolean flag indicating if the email exists.
        res.status(200).json({ exists: !!existingAccount });
        return;
    } catch (err: any) {
        console.error("Error checking email:", err.message);
        res.status(500).json({ error: "Error checking email" });
        return;
    }
});


// =======================
// Graceful Shutdown
// =======================
process.on("SIGINT", () => {
    mongoose.connection.close().then(() => {
        console.log("MongoDB connection closed due to app termination");
        process.exit(0);
    });
});