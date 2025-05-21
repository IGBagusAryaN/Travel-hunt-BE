import { Request, Response } from 'express';
import { getDataFromAPI } from '../utils/apiData';

const criteriaMap: Record<number, string> = {
  1: "facilities",
  2: "price",
  3: "distance",
  4: "parking",
  5: "photo_spot",
  6: "rating",
};

function convertToFuzzyWeights(weights: Record<string, number>): Record<string, [number, number]> {
  const fuzzyWeights: Record<string, [number, number]> = {};
  for (const name in weights) {
    const value = weights[name];
    const lower = Math.max(0, value - 0.05); 
    const upper = Math.min(1, value + 0.05); 
    fuzzyWeights[name] = [lower, upper];
  }
  return fuzzyWeights;
}

function calculateFuzzyWeightedSum(places: any[], weights: { [key: string]: [number, number] }): any[] {
  // Step 1
  const totalFuzzyAverage = Object.values(weights).reduce((sum, [low, high]) => sum + (low + high) / 2, 0);
  const maxScorePerCriteria = 5;
  const maxPossibleScore = totalFuzzyAverage * maxScorePerCriteria;

  return places.map(place => {
    const rawScore = place.place_scores.reduce((total: number, score: any) => {
      const criteriaName = criteriaMap[score.criteriasId];
      const weight = weights[criteriaName];

      if (!weight) return total;

      const fuzzyAvg = (weight[0] + weight[1]) / 2;
      const weighted = (score?.score || 0) * fuzzyAvg;
      return total + weighted;
    }, 0);

    // Step 2
    const normalizedScore = (rawScore / maxPossibleScore) * 5;

    return {
      ...place,
      totalScore: parseFloat(normalizedScore.toFixed(2)), 
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}


export async function getRecommendations(req: Request, res: Response): Promise<Response> {
  const { city } = req.params;
  const { weights } = req.body;

  if (!city || !weights) {
    return res.status(400).json({ error: 'City and weights are required' });
  }

  try {
    const cityData = await getDataFromAPI(city.toString());
    const places = cityData?.places || [];

    if (!Array.isArray(places) || places.length === 0) {
      return res.status(404).json({ error: 'No places found for this city' });
    }

    const fuzzyWeights = convertToFuzzyWeights(weights);
    const recommendations = calculateFuzzyWeightedSum(places, fuzzyWeights);

    return res.json({ recommendations });
  } catch (error: unknown) {
    console.error('Recommendation error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
