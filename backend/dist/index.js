"use strict";
// import express from 'express';
// import { Client } from 'pg';
// import dotenv from 'dotenv';
// import cors from 'cors';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app = express();
// const port = process.env.PORT || 3000;
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
// startServer();
//******************************************************************************************************************** */
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
function createPackageTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.query(`
            CREATE TABLE IF NOT EXISTS package (
                id SERIAL PRIMARY KEY,
                packageName VARCHAR(50) NOT NULL,
                description VARCHAR(69) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
            console.log("Table 'package' created successfully");
        }
        catch (error) {
            console.error("Error creating table:", error);
        }
        finally {
            // Do not close the client here to allow reuse
        }
    });
}
app.get('/api/packages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query('SELECT * FROM package');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.post('/api/packages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageName, description } = req.body;
    try {
        const result = yield client.query(`
            INSERT INTO package (packageName, description)
            VALUES ($1, $2)
            RETURNING *
        `, [packageName, description]);
        res.status(201).json({ message: 'Package added successfully', package: result.rows[0] });
    }
    catch (error) {
        console.error('Error adding package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.put('/api/packages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const result = yield client.query(`
            UPDATE package
            SET description = $1
            WHERE id = $2
            RETURNING *
        `, [description, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Package not found' });
        }
        res.status(200).json({ message: 'Package updated successfully', package: result.rows[0] });
    }
    catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.delete('/api/packages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield client.query(`
            DELETE FROM package
            WHERE id = $1
            RETURNING *
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Package not found' });
        }
        res.status(200).json({ message: 'Package deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield createPackageTable();
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
        catch (error) {
            console.error('Error connecting to PostgreSQL:', error);
            process.exit(1);
        }
    });
}
startServer();
