
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
export const MONGO_URI = `mongodb+srv://medmatchproject2025:${process.env.MONGO_PASSWORD}@medmatchcluster.rrxor.mongodb.net/MedPortalDB?retryWrites=true&w=majority&appName=MedMatchCluster`;
