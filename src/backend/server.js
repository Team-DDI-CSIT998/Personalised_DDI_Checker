const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from src/.env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Log the MONGO_PASSWORD to verify it’s loaded
console.log('MONGO_PASSWORD:', process.env.MONGO_PASSWORD);

// Construct MONGO_URI using the environment variable
const MONGO_URI = `mongodb+srv://medmatchproject2025:${process.env.MONGO_PASSWORD}@medmatchcluster.rrxor.mongodb.net/drugbank_db?retryWrites=true&w=majority&appName=MedMatchCluster`;

// Connect to MongoDB and start the server only after connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the server after successful connection
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Event listeners for MongoDB connection status
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Endpoint to fetch all medicine names
app.get('/api/medicines', async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            throw new Error('MongoDB connection not ready');
        }
        console.log('Fetching drugs from MongoDB...');
        const drugs = await mongoose.connection.db.collection('drugs')
            .find({}, { projection: { name: 1, _id: 0 } })
            .toArray();
        res.json(drugs);
    } catch (error) {
        console.error('Error fetching drugs:', error.message);
        res.status(500).json({ error: 'Failed to fetch medicines' });
    }
});

// Endpoint to check drug-drug interactions
app.post('/api/interactions', async (req, res) => {
    try {
        const selectedMedicines = req.body.medicines;

        // Validate input: minimum 2, maximum 5 drugs
        if (!selectedMedicines || !Array.isArray(selectedMedicines)) {
            return res.status(400).json({ error: 'Medicines must be provided as an array' });
        }
        if (selectedMedicines.length < 2) {
            return res.status(400).json({ error: 'At least two medicines are required' });
        }
        if (selectedMedicines.length > 5) {
            return res.status(400).json({ error: 'Maximum of 5 medicines allowed' });
        }

        // Fetch drug documents from MongoDB
        const drugs = await mongoose.connection.db.collection('drugs')
            .find({ name: { $in: selectedMedicines } })
            .toArray();

        // Create a map for quick access to each drug's interactions
        const drugMap = {};
        drugs.forEach(drug => {
            drugMap[drug.name.toLowerCase()] = drug.interactions || [];
        });

        // Generate all unique pairs (e.g., for [A, B, C, D] → A-B, A-C, A-D, B-C, B-D, C-D)
        const pairs = [];
        for (let i = 0; i < selectedMedicines.length; i++) {
            for (let j = i + 1; j < selectedMedicines.length; j++) {
                pairs.push([selectedMedicines[i], selectedMedicines[j]]);
            }
        }

        // Check interactions for each pair
        const interactions = [];
        for (const pair of pairs) {
            const [drugA, drugB] = pair.map(name => name.toLowerCase());
            const interactionsA = drugMap[drugA] || [];
            const interactionsB = drugMap[drugB] || [];

            // Check drugA → drugB
            const interactionFromA = interactionsA.find(int => int.name.toLowerCase() === drugB);
            if (interactionFromA) {
                interactions.push({
                    pair: `${pair[0]} and ${pair[1]}`,
                    description: interactionFromA.description
                });
                continue; // Skip checking B → A if A → B is found
            }

            // Check drugB → drugA
            const interactionFromB = interactionsB.find(int => int.name.toLowerCase() === drugA);
            if (interactionFromB) {
                interactions.push({
                    pair: `${pair[0]} and ${pair[1]}`,
                    description: interactionFromB.description
                });
            }
        }

        res.json(interactions);
    } catch (error) {
        console.error('Error fetching interactions:', error.message);
        res.status(500).json({ error: 'Failed to fetch interactions' });
    }
});

// Handle process termination gracefully
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});