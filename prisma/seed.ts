import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.slot.deleteMany({});
  await prisma.venue.deleteMany({});

  const venues = [
    {
      name: "Thunderbolt Football Arena",
      sport: "Football",
      location: "Fatehabad Road, Agra",
      rating: 4.9,
      price: 600,
      occupancy: 28,
      capacity: 50,
      latitude: 27.1578,
      longitude: 78.0384,
      description:
        "FIFA Quality Pro synthetic football turf equipped with 500-lux LED floodlights, professional dugout, spectator stands, and refreshment zone.",
      imageUrl:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
      features: "Outdoor,Floodlights,FIFA-Approved Synthetic Turf",
      facilities: "Locker Rooms,Showers,Parking Space,Spectator Seating,Cafeteria",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 500 },
        { time: "07:00 AM - 08:00 AM", price: 500 },
        { time: "05:00 PM - 06:00 PM", price: 600 },
        { time: "07:00 PM - 08:00 PM", price: 700 },
        { time: "08:00 PM - 09:00 PM", price: 700 },
      ],
    },
    {
      name: "Blue Wave Olympic Pool",
      sport: "Swimming",
      location: "Taj Nagari, Agra",
      rating: 4.8,
      price: 200,
      occupancy: 18,
      capacity: 40,
      latitude: 27.1612,
      longitude: 78.0469,
      description:
        "Agra's premier Olympic-sized swimming pool featuring temperature-controlled water, 10 lap lanes, and certified safety lifeguards on duty.",
      imageUrl:
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=80",
      features: "Indoor,Heated Pool,10 Lap Lanes",
      facilities: "Locker Rooms,Hot Showers,Lifeguard on Duty,Free Wi-Fi",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 180 },
        { time: "07:00 AM - 08:00 AM", price: 180 },
        { time: "05:00 PM - 06:00 PM", price: 220 },
        { time: "06:00 PM - 07:00 PM", price: 220 },
      ],
    },
    {
      name: "Smash Arena Badminton Club",
      sport: "Badminton",
      location: "Sanjay Place, Agra",
      rating: 4.9,
      price: 300,
      occupancy: 14,
      capacity: 30,
      latitude: 27.2001,
      longitude: 78.0081,
      description:
        "State-of-the-art BWF standard synthetic mat courts with non-glare LED illumination, air conditioning, and equipment rentals.",
      imageUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      features: "Indoor,AC,Non-Glare LED,BWF Mats",
      facilities: "Locker Rooms,Drinking Water,Racket Rental,Pro Shop",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 250 },
        { time: "07:00 AM - 08:00 AM", price: 250 },
        { time: "05:00 PM - 06:00 PM", price: 300 },
        { time: "07:00 PM - 08:00 PM", price: 350 },
      ],
    },
    {
      name: "Grand Slam Tennis Academy",
      sport: "Tennis",
      location: "Dayal Bagh, Agra",
      rating: 4.7,
      price: 450,
      occupancy: 8,
      capacity: 20,
      latitude: 27.2215,
      longitude: 78.0125,
      description:
        "US Open hard-surface synthetic courts offering ball machines, floodlit night play, and certified coaching staff.",
      imageUrl:
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
      features: "Outdoor,Floodlights,Synthetic Hard Court",
      facilities: "Locker Rooms,Ball Machine,Pro Shop,Coaching Available",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 400 },
        { time: "07:00 AM - 08:00 AM", price: 400 },
        { time: "06:00 PM - 07:00 PM", price: 500 },
      ],
    },
    {
      name: "Skyline Hoop Basketball Court",
      sport: "Basketball",
      location: "Khandari, Agra",
      rating: 4.8,
      price: 400,
      occupancy: 22,
      capacity: 35,
      latitude: 27.2105,
      longitude: 77.9950,
      description:
        "Indoor maple wood basketball court featuring acrylic backboards, breakaway rims, glass spectator lounge, and scoreboard system.",
      imageUrl:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
      features: "Indoor,AC,Maple Hardwood Floor",
      facilities: "Digital Scoreboard,Locker Rooms,Parking,Hydration Bar",
      slotTimes: [
        { time: "07:00 AM - 08:00 AM", price: 350 },
        { time: "05:00 PM - 06:00 PM", price: 400 },
        { time: "07:00 PM - 08:00 PM", price: 450 },
      ],
    },
    {
      name: "Strikers Indoor Cricket Box",
      sport: "Cricket",
      location: "Shahganj, Agra",
      rating: 4.9,
      price: 700,
      occupancy: 16,
      capacity: 25,
      latitude: 27.1750,
      longitude: 77.9850,
      description:
        "Heavy-duty indoor cricket net arena with automated bowling machine, speed radars, synthetic turf pitch, and night lighting.",
      imageUrl:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
      features: "Indoor,Bowling Machine,Speed Radar",
      facilities: "Kit Rental,Locker Rooms,Beverage Station,Parking",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 600 },
        { time: "07:00 PM - 08:00 PM", price: 750 },
        { time: "08:00 PM - 09:00 PM", price: 800 },
      ],
    },
    {
      name: "Nitro Pickleball Zone",
      sport: "Pickleball",
      location: "Civil Lines, Agra",
      rating: 4.9,
      price: 350,
      occupancy: 10,
      capacity: 24,
      latitude: 27.1950,
      longitude: 78.0050,
      description:
        "Dedicated pickleball courts with anti-glare surfaces, quick-change nets, custom lighting, and beginner-friendly paddle hire.",
      imageUrl:
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
      features: "Outdoor,Dedicated Pickleball Surface,Floodlit",
      facilities: "Paddle Hire,Locker Rooms,Lounge Area",
      slotTimes: [
        { time: "06:30 AM - 07:30 AM", price: 300 },
        { time: "06:00 PM - 07:00 PM", price: 400 },
      ],
    },
    {
      name: "Pacific Sand Volleyball Arena",
      sport: "Volleyball",
      location: "Bichpuri, Agra",
      rating: 4.6,
      price: 350,
      occupancy: 14,
      capacity: 30,
      latitude: 27.1850,
      longitude: 77.9250,
      description:
        "Professional silica sand volleyball court for beach-style & competitive match play with adjustable net heights and high-intensity floodlights.",
      imageUrl:
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
      features: "Silica Sand,Floodlights,Adjustable Net",
      facilities: "Foot Wash Station,Locker Rooms,Seating",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 300 },
        { time: "05:00 PM - 06:00 PM", price: 400 },
      ],
    },
    {
      name: "Maracana Turf Stadium",
      sport: "Football",
      location: "Bodla, Agra",
      rating: 4.8,
      price: 650,
      occupancy: 35,
      capacity: 60,
      latitude: 27.1910,
      longitude: 77.9620,
      description:
        "Large 7-a-side & 9-a-side synthetic turf field with shock pad underlayment, stadium seating for 200 fans, and night tournament setup.",
      imageUrl:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
      features: "Outdoor,Stadium Lights,7v7 Pitch",
      facilities: "Stadium Stand,VIP Lounge,Locker Rooms,Cafeteria",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 550 },
        { time: "08:00 PM - 09:00 PM", price: 750 },
      ],
    },
    {
      name: "Shuttle Masters Badminton Hub",
      sport: "Badminton",
      location: "Balkeshwar, Agra",
      rating: 4.7,
      price: 280,
      occupancy: 18,
      capacity: 35,
      latitude: 27.2150,
      longitude: 78.0350,
      description:
        "6-court indoor badminton complex featuring Yonex synthetic court mats, high clearance ceiling, and automated shuttle launchers.",
      imageUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
      features: "6 Courts,Indoor,AC,Yonex Mats",
      facilities: "Locker Rooms,Stringing Service,Pro Shop",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 250 },
        { time: "07:00 PM - 08:00 PM", price: 300 },
      ],
    },
    {
      name: "Royal Palms Tennis Club",
      sport: "Tennis",
      location: "Taj Road, Agra",
      rating: 4.9,
      price: 500,
      occupancy: 6,
      capacity: 16,
      latitude: 27.1650,
      longitude: 78.0250,
      description:
        "Exclusive red-clay tennis courts surrounded by lush gardens, complete with clubhouse refreshments and night lighting.",
      imageUrl:
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
      features: "Outdoor,Red Clay Court,Floodlit",
      facilities: "Clubhouse Lounge,Showers,Towel Service,Parking",
      slotTimes: [
        { time: "06:00 AM - 07:00 AM", price: 450 },
        { time: "06:00 PM - 07:00 PM", price: 550 },
      ],
    },
  ];

  for (const v of venues) {
    const { slotTimes, ...venueData } = v;
    await prisma.venue.create({
      data: {
        ...venueData,
        slots: {
          create: slotTimes,
        },
      },
    });
  }

  console.log(`Successfully seeded ${venues.length} sports venues into the database.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });