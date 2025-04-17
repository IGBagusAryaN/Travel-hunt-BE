import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCriterias = async (req: Request, res: Response) => {
  try {
    const criterias = await prisma.criterias.findMany();
    res.json(criterias);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data', error });
  }
};

export const getCriteriaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const criteria = await prisma.criterias.findUnique({ where: { id } });

    if (!criteria) return res.status(404).json({ message: 'Kriteria tidak ditemukan' });

    res.json(criteria);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data', error });
  }
};

export const createCriteria = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newCriteria = await prisma.criterias.create({ data: { name } });
    res.status(201).json(newCriteria);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat data', error });
  }
};

export const updateCriteria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updated = await prisma.criterias.update({
      where: { id },
      data: { name },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate data', error });
  }
};

export const deleteCriteria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.criterias.delete({ where: { id } });
    res.json({ message: 'Kriteria berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data', error });
  }
};
