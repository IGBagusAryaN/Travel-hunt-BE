import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all place scores
export const getAllPlaceScores = async (_req: Request, res: Response) => {
  try {
    const data = await prisma.place_scores.findMany({
      include: {
        place_id: true,
        criteria_id: true,
      },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data', error });
  }
};

// Get score by ID
export const getPlaceScoreById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const score = await prisma.place_scores.findUnique({
      where: { id },
      include: {
        place_id: true,
        criteria_id: true,
      },
    });

    if (!score) return res.status(404).json({ message: 'Data tidak ditemukan' });

    res.json(score);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data', error });
  }
};

// Create score
export const createPlaceScore = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan data', error });
  }
};

// Update score
export const updatePlaceScore = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate data', error });
  }
};

// Delete score
export const deletePlaceScore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.place_scores.delete({ where: { id } });
    res.json({ message: 'Berhasil menghapus data' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data', error });
  }
};
