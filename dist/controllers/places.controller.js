"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.getPlaceById = exports.getAllPlaces = exports.createPlace = void 0;
const client_1 = require("@prisma/client");
const claudinaryConfig_1 = __importDefault(require("../libs/claudinaryConfig"));
const streamifier_1 = __importDefault(require("streamifier"));
const prisma = new client_1.PrismaClient();
const createPlace = async (req, res) => {
    try {
        const { name, description, citiesId } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = claudinaryConfig_1.default.uploader.upload_stream({ folder: 'travel-hunt/places' }, (error, result) => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(stream);
            });
        };
        const result = await streamUpload();
        const place = await prisma.places.create({
            data: {
                name,
                description,
                citiesId,
                image_url: result.secure_url,
            },
        });
        return res.status(201).json(place);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
};
exports.createPlace = createPlace;
const getAllPlaces = async (_req, res) => {
    try {
        const places = await prisma.places.findMany({
            include: { city_id: true, place_scores: true },
        });
        res.json(places);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch places data' });
    }
};
exports.getAllPlaces = getAllPlaces;
const getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const place = await prisma.places.findUnique({
            where: { id },
            include: { city_id: true, place_scores: true },
        });
        if (!place)
            return res.status(404).json({ message: 'Place not found' });
        res.json(place);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch place details' });
    }
};
exports.getPlaceById = getPlaceById;
const updatePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image_url, citiesId } = req.body;
        const place = await prisma.places.update({
            where: { id },
            data: {
                name,
                description,
                image_url,
                citiesId,
            },
        });
        res.json({ message: 'Place updated successfully', place });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update place' });
    }
};
exports.updatePlace = updatePlace;
const deletePlace = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.places.delete({ where: { id } });
        res.json({ message: 'Place deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete place' });
    }
};
exports.deletePlace = deletePlace;
