import express from 'express';
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem } from '../controllers/watchlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema } from '../validators/watchlistValidators.js';

const router = express.Router();

router.use(authMiddleware);
    
// Add a movie to the watchlist
router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);

// Update a watchlist item
router.put("/:id", validateRequest(addToWatchlistSchema), updateWatchlistItem);

// Remove a movie from the watchlist
router.delete("/:id", removeFromWatchlist);

export default router;