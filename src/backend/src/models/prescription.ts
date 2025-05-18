import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMedicine {
    name: string;
    dosage: string;
    frequency?: string;
    duration?: string;
}

export interface IPrescription extends Document {
    doctor: mongoose.Types.ObjectId;
    patient: string;           // ← now a string, so you can store "P1234"
    medicines: IMedicine[];
    createdAt: Date;
    updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
    {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String },
        duration: { type: String },
    },
    { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
    {
        doctor: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
        },
        patient: {
            type: String,      // ← store your “Pxxxx” patient IDs
            required: true,
        },
        medicines: {
            type: [MedicineSchema],
            required: true,
        },
    },
    { timestamps: true }
);

export default model<IPrescription>('Prescription', PrescriptionSchema);
