"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoriteController_1 = require("../controllers/favoriteController");
const router = (0, express_1.Router)();
router.post('/', favoriteController_1.addFavorite);
router.get('/', favoriteController_1.getFavorites);
router.delete('/:id', favoriteController_1.deleteFavorite);
exports.default = router;
