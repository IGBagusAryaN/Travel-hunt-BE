"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlaceScore = exports.updatePlaceScore = exports.createPlaceScore = exports.getPlaceScoreById = exports.getAllPlaceScores = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllPlaceScores = async (_req, res) => {
    try {
        const data = await prisma.place_scores.findMany({
            include: {
                place_id: true,
                criteria_id: true,
            },
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch data', error });
    }
};
exports.getAllPlaceScores = getAllPlaceScores;
const getPlaceScoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const score = await prisma.place_scores.findUnique({
            where: { id },
            include: {
                place_id: true,
                criteria_id: true,
            },
        });
        if (!score)
            return res.status(404).json({ message: 'Data not found' });
        res.json(score);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch data', error });
    }
};
exports.getPlaceScoreById = getPlaceScoreById;
const createPlaceScore = async (req, res) => {
    try {
        const { score, placesId, criteriasId } = req.body;
        const data = await prisma.place_scores.create({
            data: {
                score: parseFloat(score),
                placesId,
                criteriasId,
            },
        });
        res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create data', error });
    }
};
exports.createPlaceScore = createPlaceScore;
const updatePlaceScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, placesId, criteriasId } = req.body;
        const data = await prisma.place_scores.update({
            where: { id },
            data: {
                score: parseFloat(score),
                placesId,
                criteriasId,
            },
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update data', error });
    }
};
exports.updatePlaceScore = updatePlaceScore;
const deletePlaceScore = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.place_scores.delete({ where: { id } });
        res.json({ message: 'Data deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete data', error });
    }
};
exports.deletePlaceScore = deletePlaceScore;
