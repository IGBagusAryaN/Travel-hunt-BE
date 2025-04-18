import { Request, Response } from 'express';
import { getDataFromAPI } from '../utils/apiData';


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


function calculateFuzzyAHP(places: any[], weights: { [key: string]: [number, number] }): any[] {
  return places.map(place => {
    const totalScore = place.place_scores.reduce((total : any, score: any) => {
      const weight = weights[score.criteriasId];
      if (!weight || !Array.isArray(weight)) {
        throw new Error(`Bobot tidak ditemukan atau format salah untuk kriteria: ${score.criteriasId}`);
      }
      const fuzzyAverage = (weight[0] + weight[1]) / 2; 
      const weightedScore = score.score * fuzzyAverage; 
      return total + weightedScore;
    }, 0);

    return {
      ...place,
      totalScore
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}


async function getRecommendations(req: Request, res: Response): Promise<Response> {
  const { city, weights } = req.body;
  
  if (!city || !weights) {
    return res.status(400).json({ error: 'City and weights are required' });
  }

  try {
 
    const places = await getDataFromAPI(city);

  
    const fuzzyWeights = convertToFuzzyWeights(weights);

    const result = calculateFuzzyAHP(places, fuzzyWeights);

   
    return res.json({ recommendations: result });
  } catch (error: unknown) {

    if (error instanceof Error) {
    
      return res.status(500).json({ error: error.message });
    } else {
   
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}

export { getRecommendations };
