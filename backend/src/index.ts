import express from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// async function createPackageTable() {
//     try {
//         await client.connect();
//         await client.query(`
//             CREATE TABLE IF NOT EXISTS package (
//                 id SERIAL PRIMARY KEY,
//                 packageName VARCHAR(50) NOT NULL,
//                 description VARCHAR(69) NOT NULL,
//                 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//             )
//         `);
//         console.log("Table 'package' created successfully");
//     } catch (error) {
//         console.error("Error creating table:", error);
//     } finally {
//         // Do not close the client here to allow reuse
//     }
// }

// app.get('/api/packages', async (req, res) => {
//     // res.send("Get all packages"); //check
//     try {
//         const result = await client.query('SELECT * FROM package');
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching packages:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/api/packages', async (req, res) => {
//     const { packageName, description } = req.body;
//     try {
//         const result = await client.query(`
//             INSERT INTO package (packageName, description)
//             VALUES ($1, $2)
//             RETURNING *
//         `, [packageName, description]);
//         res.status(201).json({ message: 'Package added successfully', package: result.rows[0] });
//     } catch (error) {
//         console.error('Error adding package:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// async function startServer() {
//     try {
//         await createPackageTable();
//         app.listen(port, () => {
//             console.log(`Server is running on port ${port}`);
//         });
//     } catch (error) {
//         console.error('Error connecting to PostgreSQL:', error);
//         process.exit(1);
//     }
// }

app.use(cors());
app.use(express.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function createPackageTable() {
    try {
        await client.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS package (
                id SERIAL PRIMARY KEY,
                packageName VARCHAR(50) NOT NULL,
                description VARCHAR(69) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'package' created successfully");
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        //client to reuse 
    }
}

app.get('/api/packages', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM package');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/packages', async (req, res) => {
    const { packageName, description } = req.body;
    try {
        const result = await client.query(`
            INSERT INTO package (packageName, description)
            VALUES ($1, $2)
            RETURNING *
        `, [packageName, description]);
        res.status(201).json({ message: 'Package added successfully', package: result.rows[0] });
    } catch (error) {
        console.error('Error adding package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/packages/:id', async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const result = await client.query(`
            UPDATE package
            SET description = $1
            WHERE id = $2
            RETURNING *
        `, [description, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Package not found' });
        }
        res.status(200).json({ message: 'Package updated successfully', package: result.rows[0] });
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/packages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(`
            DELETE FROM package
            WHERE id = $1
            RETURNING *
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Package not found' }); 
        }
        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function startServer() {
    try {
        await createPackageTable();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error); 
        process.exit(1);
    }
}

startServer();
