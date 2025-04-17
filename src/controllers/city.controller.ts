import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCity = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "City name is required!" });
    const city = await prisma.cities.create({ data: { name } });
    res.status(201).json({ message: "City created successfully", city });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create city" });
  }
};

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await prisma.cities.findMany({ include: { places: true } });
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve cities data" });
  }
};

export const getCityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const city = await prisma.cities.findUnique({
      where: { id },
      include: { places: true },
    });
    if (!city)
      return res.status(404).json({ message: "City not found" });
    res.json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve city details" });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const city = await prisma.cities.update({
      where: { id },
      data: { name },
    });

    res.json({ message: "City updated successfully", city });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update city" });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.cities.delete({ where: { id } });
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete city" });
  }
};
