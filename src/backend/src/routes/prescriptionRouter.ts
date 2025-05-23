// routes/prescriptionRouter.ts
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Prescription from '../models/prescription';
import { authMiddleware } from './profileRouter';

const router = express.Router();

// ─── GET LATEST PRESCRIPTION ─────────────────────────────────
router.get(
    '/',
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const patientId = req.query.patientId as string | undefined;
            if (!patientId) {
                res.status(400).json({ error: 'patientId query parameter is required' });
                return;
            }
            const prescription = await Prescription.findOne({ patient: patientId })
                .sort({ createdAt: -1 });

            if (!prescription) {
                res.status(404).json({ error: 'No prescription found for that patient' });
                return;
            }

            res.json({ prescription });
        } catch (err) {
            console.error('❌ Error fetching prescription:', err);
            res.status(500).json({ error: 'Failed to fetch prescription.' });
        }
    }
);

// ─── CREATE NEW PRESCRIPTION ────────────────────────────────
router.post(
    '/',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const doctorId = (req as any).accountId as string | undefined;
            if (!doctorId) {
                res.status(401).json({ error: 'Unauthorized: no doctor ID' });
                return;
            }

            const { patientId, medicines } = req.body as {
                patientId: string;
                medicines: Array<{
                    name: string;
                    dosage: string;
                    frequency?: string;
                    duration?: string;
                }>;
            };

            if (!patientId || !Array.isArray(medicines) || medicines.length === 0) {
                res.status(400).json({
                    error: 'patientId and at least one medicine are required'
                });
                return;
            }

            const newPresc = new Prescription({
                doctor: new mongoose.Types.ObjectId(doctorId),  // your doctor _id is a real ObjectId
                patient: patientId,                             // keep this as a string
                medicines
            });
            await newPresc.save();

            res.status(201).json({
                message: 'Prescription created',
                prescription: newPresc
            });
        } catch (err) {
            console.error('❌ Prescription save error:', err);
            res.status(500).json({ error: 'Failed to save prescription.' });
        }
    }
);

export default router;
