import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCity = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Nama kota wajib disi!" });
    const city = await prisma.cities.create({ data: { name } });
    res.status(201).json({ message: "Kota berhasil dibuat", city });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat kota" });
  }
};

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await prisma.cities.findMany({ include: { places: true } });
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data kota" });
  }
};

export const getCityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const city = await prisma.cities.findUnique({
      where: { id },
      include: { places: true },
    });
    if (!city) return res.status(404).json({ message: "Kota tidak ditemukan" });
    res.json(city);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail kota" });
  }
};

export const updateCity = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { name } = req.body
  
      const city = await prisma.cities.update({
        where: { id },
        data: { name },
      })
  
      res.json({ message: 'Kota berhasil diupdate', city })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Gagal mengupdate kota' })
    }
  }

export const deleteCity = async (req: Request, res: Response) => {
    try {

        const {id} = req.params 

        await prisma.cities.delete({where: {id}} )
            res.json({message: 'Kota berhasil dihapus'})
    
    } catch (error) {
console.error(error)
res.status(500).json({message: 'Gagal menghapus kota'})
    }
        

    
}
