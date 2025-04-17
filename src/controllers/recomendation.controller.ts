import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fungsi untuk menghitung matriks perbandingan dan bobot kriteria
const calculateComparisonMatrix = async () => {
  const comparisons = await prisma.criteria_comparisons.findMany();

  // Ambil semua kriteria unik
  const criterias = await prisma.criterias.findMany();
  const n = criterias.length;

  // Inisialisasi matriks NxN
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(1));

  // Isi matriks perbandingan
  comparisons.forEach((comparison: { criteriaAId: any; criteriaBId: any; value: number; }) => {
    const i = criterias.findIndex((c: { id: any; }) => c.id === comparison.criteriaAId);
    const j = criterias.findIndex((c: { id: any; }) => c.id === comparison.criteriaBId);

    if (i !== -1 && j !== -1) {
      matrix[i][j] = comparison.value;
      matrix[j][i] = 1 / comparison.value;
    }
  });

  // Normalisasi dan bobot
  const normalizedMatrix = normalizeMatrix(matrix);
  const weights = calculateWeights(normalizedMatrix);

  return weights;
};

const normalizeMatrix = (matrix: number[][]) => {
  const n = matrix.length;
  const columnSums = Array(n).fill(0);

  // Hitung total tiap kolom
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      columnSums[j] += matrix[i][j];
    }
  }

  // Normalisasi
  return matrix.map(row =>
    row.map((value, j) => value / columnSums[j])
  );
};

const calculateWeights = (normalizedMatrix: number[][]) => {
  return normalizedMatrix.map(row => {
    const sum = row.reduce((a, b) => a + b, 0);
    return sum / row.length;
  });
};

// Fungsi normalisasi untuk TOPSIS
const normalizeMatrixForTopsis = (matrix: number[][]) => {
  const n = matrix.length;
  const m = matrix[0].length;

  // Hitung akar kuadrat dari jumlah kuadrat setiap kolom
  const columnSums = Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      columnSums[j] += Math.pow(matrix[i][j], 2);
    }
  }

  const normalizedMatrix = matrix.map(row =>
    row.map((value, j) => value / Math.sqrt(columnSums[j]))
  );

  return normalizedMatrix;
};

// Get recommendation with TOPSIS
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const weights = await calculateComparisonMatrix();

    const criterias = await prisma.criterias.findMany();
    const places = await prisma.places.findMany({
      include: {
        place_scores: true,
      },
    });

    // Matriks keputusan (alternatif x kriteria)
    const decisionMatrix = places.map((place) => 
      criterias.map((criteria) => 
        place.place_scores.find((ps) => ps.criteriasId === criteria.id)?.score || 0
      )
    );

    // Normalisasi matriks keputusan
    const normalizedMatrix = normalizeMatrixForTopsis(decisionMatrix);

    // Matriks terbobot
    const weightedMatrix = normalizedMatrix.map((row, i) =>
      row.map((value, j) => value * weights[j])  // Kalikan dengan bobot kriteria
    );

    // Tentukan solusi ideal dan terburuk
    const idealPositive = weightedMatrix[0].map((_, colIdx) => 
      Math.max(...weightedMatrix.map(row => row[colIdx]))  // Solusi ideal positif
    );
    const idealNegative = weightedMatrix[0].map((_, colIdx) => 
      Math.min(...weightedMatrix.map(row => row[colIdx]))  // Solusi ideal negatif
    );

    // Hitung jarak ke solusi ideal dan terburuk
    const distancesToIdealPositive = weightedMatrix.map(row => 
      Math.sqrt(row.reduce((sum, value, idx) => sum + Math.pow(value - idealPositive[idx], 2), 0))
    );
    const distancesToIdealNegative = weightedMatrix.map(row => 
      Math.sqrt(row.reduce((sum, value, idx) => sum + Math.pow(value - idealNegative[idx], 2), 0))
    );

    // Hitung indeks kepuasan (Ci) untuk setiap alternatif
    const ciValues = distancesToIdealNegative.map((distToNegative, idx) => 
      distToNegative / (distToNegative + distancesToIdealPositive[idx])
    );

    // Gabungkan hasil rekomendasi dan urutkan berdasarkan Ci
    const recommendations = places.map((place, idx) => ({
      place,
      ci: ciValues[idx],
    }));

    recommendations.sort((a, b) => b.ci - a.ci);  // Urutkan dari yang terbaik

    res.json(recommendations);
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
