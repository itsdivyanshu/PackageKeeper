import { Request, Response } from 'express';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const addFavorite = async (req: Request, res: Response) => {
  const { name, reason } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO package (name, reason) VALUES ($1, $2) RETURNING *',
      [name, reason]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
};

export const getFavorites = async (_req: Request, res: Response) => {
  try {
    const result = await client.query('SELECT * FROM favorite_packages ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM favorite_packages WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
};
