// models/MedicalRecord.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalRecord extends Document {
    patient: mongoose.Types.ObjectId; // Reference to the Account document (acting as a patient)
    note: string; // Free text limited to 1000 words
    attachments?: string[]; // URLs or file paths for any uploaded documents/images
}

const MedicalRecordSchema = new Schema<IMedicalRecord>(
    {
        patient: { type: Schema.Types.ObjectId, ref: "Account", required: true },
        note: {
            type: String,
            required: true,
            validate: {
                validator: function (value: string) {
                    if (!value) return true;
                    return value.split(/\s+/).length <= 1000;
                },
                message: "Note cannot exceed 1000 words.",
            },
        },
        attachments: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema);
