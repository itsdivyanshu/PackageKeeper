import { Router } from 'express';
import { addFavorite, getFavorites, deleteFavorite } from '../controllers/favoriteController';

const router = Router();

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/:id', deleteFavorite);

export default router;
