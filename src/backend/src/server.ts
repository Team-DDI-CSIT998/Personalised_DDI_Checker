import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = `mongodb+srv://medmatchproject2025:${process.env.MONGO_PASSWORD}@medmatchcluster.rrxor.mongodb.net/drugbank_db?retryWrites=true&w=majority&appName=MedMatchCluster`;

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
                    const prompt = `Explain this drug interaction simply and briefly:\n"${description}"`;
                    const response = await axios.post(
                        'https://openrouter.ai/api/v1/chat/completions',
                        {
                            model: 'mistralai/mistral-small-3.1-24b-instruct:free',
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

// Register
app.post('/api/auth/register', (req: Request, res: Response): void => {
    (async () => {
        try {
            const { username, email, password } = req.body;
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ error: 'User already exists' });

            const hashed = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashed });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            res.json({ token, user: newUser });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: 'Failed to register user' });
        }
    })();
});

// Login
app.post('/api/auth/login', (req: Request, res: Response): void => {
    (async () => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ error: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            res.json({ token, user });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: 'Failed to login' });
        }
    })();
});

// Graceful Shutdown
process.on('SIGINT', () => {
    mongoose.connection.close().then(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});
