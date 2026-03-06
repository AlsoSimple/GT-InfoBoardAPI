import { prisma } from "../config/db.js";

// Fields to include when selecting event creator info
const CREATOR_SELECT = {
    id: true,
    username: true,
};

const createEvent = async (req, res) => {
    try {
        const { text, startDate, endDate } = req.body;

        const event = await prisma.event.create({
            data: {
                text,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                createdBy: req.user.id,
            },
            include: {
                creator: { select: CREATOR_SELECT },
            },
        });

        res.status(201).json({
            status: "success",
            data: event,
        });
    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const { sortBy = "startDate", order = "asc", creatorId } = req.query;

        const validSortFields = {
            startDate: "startDate",
            createdAt: "createdAt",
            creator: "createdBy",
        };
        const sortField = validSortFields[sortBy] ?? "startDate";
        const sortOrder = order === "desc" ? "desc" : "asc";

        const where = creatorId ? { createdBy: creatorId } : {};

        const events = await prisma.event.findMany({
            where,
            orderBy: { [sortField]: sortOrder },
            include: {
                creator: { select: CREATOR_SELECT },
            },
        });

        res.status(200).json({
            status: "success",
            data: events,
        });
    } catch (error) {
        console.error("Get events error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
            include: {
                creator: { select: CREATOR_SELECT },
            },
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({
            status: "success",
            data: event,
        });
    } catch (error) {
        console.error("Get event by id error:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { text, startDate, endDate } = req.body;

        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const updated = await prisma.event.update({
            where: { id: req.params.id },
            data: {
                ...(text !== undefined && { text }),
                ...(startDate !== undefined && { startDate: new Date(startDate) }),
                ...(endDate !== undefined && { endDate: new Date(endDate) }),
            },
            include: {
                creator: { select: CREATOR_SELECT },
            },
        });

        res.status(200).json({
            status: "success",
            data: updated,
        });
    } catch (error) {
        console.error("Update event error:", error);
        res.status(500).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: req.params.id },
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await prisma.event.delete({
            where: { id: req.params.id },
        });

        res.status(200).json({
            status: "success",
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error("Delete event error:", error);
        res.status(500).json({ message: error.message });
    }
};

export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
