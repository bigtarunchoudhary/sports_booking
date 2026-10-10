import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.venue.deleteMany({});

  await prisma.venue.createMany({
    data: [
      {
        name: "Blue Wave Swimming Pool",
        sport: "Swimming",
        location: "MG Road",
        rating: 4.8,
        price: 150,
        occupancy: 18,
        capacity: 40,
        latitude: 12.9756,
        longitude: 77.6050,
        description: "Dive into our Olympic-sized swimming pool featuring temperature-controlled water, professional lap lanes, and certified safety lifeguards on duty. Perfect for recreational swimming, training, or water aerobics.",
        imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Elite Football Turf",
        sport: "Football",
        location: "City Center",
        rating: 4.6,
        price: 500,
        occupancy: 9,
        capacity: 20,
        latitude: 12.9719,
        longitude: 77.6412,
        description: "Experience professional-grade FIFA-approved synthetic turf designed for intense matches. Equipped with advanced floodlights for night games, a spectators lounge, and clean shower facilities.",
        imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
      },
      {
        name: "Ace Badminton Arena",
        sport: "Badminton",
        location: "JP Nagar",
        rating: 4.7,
        price: 250,
        occupancy: 12,
        capacity: 24,
        latitude: 12.9352,
        longitude: 77.6245,
        description: "Play like a pro on our premium synthetic court mats with optimal shock absorption. Features high clearance ceilings, professional non-glare LED lighting, and personal lockers.",
        imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      },


    ],
  });

  console.log("Database seeded!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });