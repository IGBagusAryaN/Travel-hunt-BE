import axios from 'axios';

// Tipe untuk setiap tempat wisata
interface Place {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  place_scores: { criteriasId: string; score: number }[];
}

// Tipe untuk data per kota
interface City {
  city: string;
  description: string;
  image_url: string;
  places: Place[];
}

// Fungsi untuk mengambil data dari API eksternal
async function getDataFromAPI(city: string): Promise<City> {
  try {
    const response = await axios.get('https://api.npoint.io/a69febcd9fb911ebf3c7');
    const data = response.data as City[];

    console.log("status:", response.status);
    console.log("headers:", response.headers);
    console.log("data:", JSON.stringify(data, null, 2));

    // Cari kota berdasarkan nama
    const foundCity = data.find(item => item.city.toLowerCase() === city.toLowerCase());

    if (!foundCity) {
      throw new Error(`City "${city}" not found`);
    }

    // Validasi struktur setiap tempat wisata
    foundCity.places.forEach((place) => {
      if (!place.place_scores || !Array.isArray(place.place_scores)) {
        console.warn(`Warning: Tempat dengan id ${place.id} tidak memiliki place_scores array`);
        place.place_scores = []; // Hindari error saat proses AHP
      }
    });

    return foundCity;
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

export { getDataFromAPI, City, Place };
