import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import cloudinary from '../libs/claudinaryConfig'
import streamifier from 'streamifier'

const prisma = new PrismaClient()

export const createPlace = async (req: Request, res: Response) => {
  try {
    const { name, description, citiesId } = req.body
    const file = req.file

    if (!file) {
      return res.status(400).json({ message: 'Image is required' })
    }

    const streamUpload = () => {
      return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'travel-hunt/places' },
          (error, result) => {
            if (result) {
              resolve(result)
            } else {
              reject(error)
            }
          }
        )
        streamifier.createReadStream(file.buffer).pipe(stream)
      })
    }

    const result = await streamUpload()

    const place = await prisma.places.create({
      data: {
        name,
        description,
        citiesId,
        image_url: result.secure_url,
      },
    })

    return res.status(201).json(place)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'An error occurred', error })
  }
}

export const getAllPlaces = async (_req: Request, res: Response) => {
  try {
    const places = await prisma.places.findMany({
      include: { city_id: true, place_scores: true },
    })

    res.json(places)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch places data' })
  }
}

export const getPlaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const place = await prisma.places.findUnique({
      where: { id },
      include: { city_id: true, place_scores: true },
    })

    if (!place) return res.status(404).json({ message: 'Place not found' })

    res.json(place)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch place details' })
  }
}

export const updatePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, image_url, citiesId } = req.body

    const place = await prisma.places.update({
      where: { id },
      data: {
        name,
        description,
        image_url,
        citiesId,
      },
    })

    res.json({ message: 'Place updated successfully', place })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update place' })
  }
}

export const deletePlace = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.places.delete({ where: { id } })

    res.json({ message: 'Place deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete place' })
  }
}
