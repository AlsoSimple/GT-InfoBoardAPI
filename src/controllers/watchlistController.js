import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
    const {movieId, status, rating, notes} = req.body;

    const movie = await prisma.movie.findUnique({
        where: { id: movieId },
    });

    // Check if movie exists
    if (!movie) {
        return res.status(404).json({ 
            error: "Movie not found" 
        });
    }

    // Check if already exists

    const existingInWatchlist = await prisma.watchlistItem.findUnique({
        where: { 
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId,
            }},
    });

    if (existingInWatchlist) {
        return res.status(400).json({ 
            error: "Movie already in watchlist" 
        });
    }

    const watchListItem = await prisma.watchlistItem.create({
        data: {
            userId: req.user.id,
            movieId: movieId,
            status: status || "PLANNED",
            rating: rating,
            notes: notes
        }
    });

    res.status(201).json({
        status: "success",
        data: {
            watchListItem
        },
    });
};

const removeFromWatchlist = async (req, res) => {
    // Find watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Ensure only owner can delete
    if (watchlistItem.userId !== req.user.id) {
        return res
            .status(403)
            .json({ error: "Not allowed to update this watchlist item" });
    }

    await prisma.watchlistItem.delete({
        where: { id: req.params.id },
    });

    res.status(200).json({ 
        status: "success", 
        message: "Watchlist item removed" });
};

const updateWatchlistItem = async (req, res) => {
    const { status, rating, notes } = req.body;

    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    if (watchlistItem.userId !== req.user.id) {
        return res
            .status(403)
            .json({ error: "Not allowed to update this watchlist item" });
    }

    const updated = await prisma.watchlistItem.update({
        where: { id: req.params.id },
        data: {
            status: status,
            rating: rating,
            notes: notes,
            updatedAt: new Date(),
        },
    });

    res.status(200).json({ status: "success", data: { updated } });
};

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem };

