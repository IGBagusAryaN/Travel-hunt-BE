import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Cities
  const cityNames = ['Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Surabaya'];
  const cities = await Promise.all(
    cityNames.map((name) =>
      prisma.cities.create({
        data: { name },
      })
    )
  );

  // 2. Seed Criterias
  const criteriaNames = ['harga', 'lokasi', 'fasilitas', 'keamanan', 'aktivitas'];
  const criterias = await Promise.all(
    criteriaNames.map((name) =>
      prisma.criterias.create({
        data: { name },
      })
    )
  );

  // 3. Seed Places (5 tempat per kota - data asli)
  const placeData: Record<string, string[]> = {
    Bali: [
      'Pantai Kuta',
      'Tanah Lot',
      'Ubud Monkey Forest',
      'Danau Batur',
      'Garuda Wisnu Kencana',
    ],
    Jakarta: [
      'Monas',
      'Ancol',
      'Kota Tua',
      'Taman Mini Indonesia Indah',
      'Museum Nasional',
    ],
    Yogyakarta: [
      'Candi Prambanan',
      'Candi Borobudur',
      'Malioboro',
      'Keraton Yogyakarta',
      'Goa Pindul',
    ],
    Bandung: [
      'Kawah Putih',
      'Farmhouse Lembang',
      'Tangkuban Perahu',
      'Trans Studio Bandung',
      'Dago Dreampark',
    ],
    Surabaya: [
      'Tugu Pahlawan',
      'Monumen Kapal Selam',
      'Kebun Binatang Surabaya',
      'Jembatan Suramadu',
      'House of Sampoerna',
    ],
  };

  const places: any[] = [];

  for (const city of cities) {
    const names = placeData[city.name as keyof typeof placeData];
    for (const name of names) {
      const place = await prisma.places.create({
        data: {
          name,
          description: `Tempat wisata populer: ${name}`,
          image_url: `https://source.unsplash.com/random/800x600?${encodeURIComponent(name)}`,
          citiesId: city.id,
        },
      });
      places.push(place);
    }
  }

  // 4. Seed Place Scores
  for (const place of places) {
    for (const criteria of criterias) {
      const randomScore = parseFloat((Math.random() * 4 + 1).toFixed(2)); // antara 1 - 5
      await prisma.place_scores.create({
        data: {
          placesId: place.id,
          criteriasId: criteria.id,
          score: randomScore,
        },
      });
    }
  }

  // 5. Seed Criteria Comparisons
  const criteriaMap = new Map<string, string>();
  criterias.forEach((c) => criteriaMap.set(c.name.toLowerCase(), c.id));

  const comparisons = [
    { criteriaAId: 'harga', criteriaBId: 'lokasi', value: 3 },
    { criteriaAId: 'lokasi', criteriaBId: 'harga', value: 1 / 3 },
    { criteriaAId: 'harga', criteriaBId: 'fasilitas', value: 2 },
    { criteriaAId: 'fasilitas', criteriaBId: 'harga', value: 1 / 2 },
    { criteriaAId: 'harga', criteriaBId: 'keamanan', value: 5 },
    { criteriaAId: 'keamanan', criteriaBId: 'harga', value: 1 / 5 },
    { criteriaAId: 'harga', criteriaBId: 'aktivitas', value: 4 },
    { criteriaAId: 'aktivitas', criteriaBId: 'harga', value: 1 / 4 },
    { criteriaAId: 'lokasi', criteriaBId: 'fasilitas', value: 0.5 },
    { criteriaAId: 'fasilitas', criteriaBId: 'lokasi', value: 2 },
    { criteriaAId: 'lokasi', criteriaBId: 'keamanan', value: 3 },
    { criteriaAId: 'keamanan', criteriaBId: 'lokasi', value: 1 / 3 },
    { criteriaAId: 'lokasi', criteriaBId: 'aktivitas', value: 2 },
    { criteriaAId: 'aktivitas', criteriaBId: 'lokasi', value: 1 / 2 },
    { criteriaAId: 'fasilitas', criteriaBId: 'keamanan', value: 4 },
    { criteriaAId: 'keamanan', criteriaBId: 'fasilitas', value: 1 / 4 },
    { criteriaAId: 'fasilitas', criteriaBId: 'aktivitas', value: 3 },
    { criteriaAId: 'aktivitas', criteriaBId: 'fasilitas', value: 1 / 3 },
    { criteriaAId: 'keamanan', criteriaBId: 'aktivitas', value: 2 },
    { criteriaAId: 'aktivitas', criteriaBId: 'keamanan', value: 1 / 2 },
    // perbandingan diri sendiri
    { criteriaAId: 'harga', criteriaBId: 'harga', value: 1 },
    { criteriaAId: 'lokasi', criteriaBId: 'lokasi', value: 1 },
    { criteriaAId: 'fasilitas', criteriaBId: 'fasilitas', value: 1 },
    { criteriaAId: 'keamanan', criteriaBId: 'keamanan', value: 1 },
    { criteriaAId: 'aktivitas', criteriaBId: 'aktivitas', value: 1 },
  ];

  for (const comp of comparisons) {
    const criteriaAId = criteriaMap.get(comp.criteriaAId);
    const criteriaBId = criteriaMap.get(comp.criteriaBId);

    if (criteriaAId && criteriaBId) {
      await prisma.criteria_comparisons.create({
        data: {
          criteriaAId,
          criteriaBId,
          value: comp.value,
        },
      });
    } else {
      console.error(`Error: ${comp.criteriaAId} atau ${comp.criteriaBId} tidak ditemukan`);
    }
  }

  console.log('Seeder berhasil dijalankan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
