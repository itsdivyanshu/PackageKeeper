"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFavorite = exports.getFavorites = exports.addFavorite = void 0;
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect();
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, reason } = req.body;
    try {
        const result = yield client.query('INSERT INTO package (name, reason) VALUES ($1, $2) RETURNING *', [name, reason]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'Unknown error' });
        }
    }
});
exports.addFavorite = addFavorite;
const getFavorites = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield client.query('SELECT * FROM favorite_packages ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'Unknown error' });
        }
    }
});
exports.getFavorites = getFavorites;
const deleteFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield client.query('DELETE FROM favorite_packages WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'Unknown error' });
        }
    }
});
exports.deleteFavorite = deleteFavorite;
