import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
};

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

    if (!score) return res.status(404).json({ message: 'Data not found' });

    res.json(score);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
};

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
    res.status(500).json({ message: 'Failed to create data', error });
  }
};

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
    res.status(500).json({ message: 'Failed to update data', error });
  }
};

export const deletePlaceScore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.place_scores.delete({ where: { id } });
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete data', error });
  }
};
