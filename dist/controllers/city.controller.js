"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCity = exports.updateCity = exports.getCityById = exports.getAllCities = exports.createCity = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCity = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name)
            return res.status(400).json({ message: "City name is required!" });
        const city = await prisma.cities.create({ data: { name } });
        res.status(201).json({ message: "City created successfully", city });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create city" });
    }
};
exports.createCity = createCity;
const getAllCities = async (req, res) => {
    try {
        const cities = await prisma.cities.findMany({ include: { places: true } });
        res.json(cities);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve cities data" });
    }
};
exports.getAllCities = getAllCities;
const getCityById = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await prisma.cities.findUnique({
            where: { id },
            include: { places: true },
        });
        if (!city)
            return res.status(404).json({ message: "City not found" });
        res.json(city);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve city details" });
    }
};
exports.getCityById = getCityById;
const updateCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const city = await prisma.cities.update({
            where: { id },
            data: { name },
        });
        res.json({ message: "City updated successfully", city });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update city" });
    }
};
exports.updateCity = updateCity;
const deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.cities.delete({ where: { id } });
        res.json({ message: "City deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete city" });
    }
};
exports.deleteCity = deleteCity;
