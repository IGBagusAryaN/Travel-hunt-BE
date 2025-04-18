import axios from 'axios';

// Mendefinisikan tipe untuk data yang diambil dari API
interface Place {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  place_scores: { criteriasId: string; score: number }[]; // ← ini string ya
}

interface CityData {
  [city: string]: Place[];
}

// Fungsi untuk mengambil data dari API eksternal
async function getDataFromAPI(city: string): Promise<Place[]> {
  try {
    const response = await axios.get('https://api.npoint.io/a69febcd9fb911ebf3c7');

    const data = response.data as CityData;

    console.log("status:", response.status);
    console.log("headers:", response.headers);
    console.log("data:", JSON.stringify(response.data, null, 2)); // Lebih mudah dibaca

    // Pastikan data valid
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response structure');
    }

    const cityData = data[city];

    if (!Array.isArray(cityData)) {
      throw new Error(`City "${city}" not found or data is not an array`);
    }

    // Validasi struktur setiap place
    cityData.forEach((place, index) => {
      if (!place.place_scores || !Array.isArray(place.place_scores)) {
        console.warn(`Warning: Tempat dengan id ${place.id} tidak memiliki place_scores array`);
        place.place_scores = []; // Untuk mencegah error lanjutan
      }
    });

    return cityData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching data from API:', error.message);
      throw new Error('Unable to fetch data');
    } else {
      console.error('Unknown error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}

export { getDataFromAPI };
