"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCriteria = exports.updateCriteria = exports.createCriteria = exports.getCriteriaById = exports.getAllCriterias = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCriterias = async (req, res) => {
    try {
        const criterias = await prisma.criterias.findMany();
        res.json(criterias);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch data', error });
    }
};
exports.getAllCriterias = getAllCriterias;
const getCriteriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const criteria = await prisma.criterias.findUnique({ where: { id } });
        if (!criteria)
            return res.status(404).json({ message: 'Criteria not found' });
        res.json(criteria);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch data', error });
    }
};
exports.getCriteriaById = getCriteriaById;
const createCriteria = async (req, res) => {
    try {
        const { name } = req.body;
        const newCriteria = await prisma.criterias.create({ data: { name } });
        res.status(201).json(newCriteria);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create data', error });
    }
};
exports.createCriteria = createCriteria;
const updateCriteria = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updated = await prisma.criterias.update({
            where: { id },
            data: { name },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update data', error });
    }
};
exports.updateCriteria = updateCriteria;
const deleteCriteria = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.criterias.delete({ where: { id } });
        res.json({ message: 'Criteria deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete data', error });
    }
};
exports.deleteCriteria = deleteCriteria;
