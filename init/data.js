const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Relax with stunning ocean views in Malibu.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    category: "Beach",
    geometry: {
      type: "Point",
      coordinates: [-118.7798, 34.0259], // Malibu
    },
  },

  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of NYC.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    category: "Iconic Cities",
    geometry: {
      type: "Point",
      coordinates: [-74.006, 40.7128], // NYC
    },
  },

  {
    title: "Mountain Retreat",
    description: "Peaceful cabin in Aspen.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    category: "Mountains",
    geometry: {
      type: "Point",
      coordinates: [-106.8175, 39.1911], // Aspen
    },
  },

  {
    title: "Historic Villa in Tuscany",
    description: "Experience Italian countryside charm.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    category: "Trending",
    geometry: {
      type: "Point",
      coordinates: [11.2558, 43.7696], // Florence
    },
  },

  {
    title: "Treehouse Getaway",
    description: "Live among trees in Portland.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    },
    price: 800,
    location: "Portland",
    country: "United States",
    category: "Camping",
    geometry: {
      type: "Point",
      coordinates: [-122.6765, 45.5231],
    },
  },

  {
    title: "Beachfront Paradise",
    description: "Luxury beach condo in Cancun.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    category: "Beach",
    geometry: {
      type: "Point",
      coordinates: [-86.8515, 21.1619],
    },
  },

  {
    title: "Lake Tahoe Cabin",
    description: "Cozy lakeside escape.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    category: "Lake",
    geometry: {
      type: "Point",
      coordinates: [-120.0324, 39.0968],
    },
  },

  {
    title: "Luxury Penthouse LA",
    description: "City skyline views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    category: "Iconic Cities",
    geometry: {
      type: "Point",
      coordinates: [-118.2437, 34.0522],
    },
  },

  {
    title: "Swiss Alps Chalet",
    description: "Ski paradise in Verbier.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb",
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    category: "Mountains",
    geometry: {
      type: "Point",
      coordinates: [7.2283, 46.0965],
    },
  },

  {
    title: "Safari Lodge",
    description: "Wildlife experience in Serengeti.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
    },
    price: 4000,
    location: "Serengeti",
    country: "Tanzania",
    category: "Trending",
    geometry: {
      type: "Point",
      coordinates: [34.6857, -2.3333],
    },
  },

  {
    title: "Canal House Amsterdam",
    description: "Historic canal stay.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4",
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
    category: "Iconic Cities",
    geometry: {
      type: "Point",
      coordinates: [4.9041, 52.3676],
    },
  },

  {
    title: "Private Island Fiji",
    description: "Exclusive island experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    category: "Luxury",
    geometry: {
      type: "Point",
      coordinates: [178.065, -17.7134],
    },
  },
  {
    title: "Cliffside Villa in Santorini",
    description: "Whitewashed villa with stunning sunset views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    price: 3200,
    location: "Santorini",
    country: "Greece",
    category: "Beach",
    geometry: { type: "Point", coordinates: [25.4615, 36.3932] },
  },
  {
    title: "Desert Camp in Wadi Rum",
    description: "Experience Bedouin life under the stars.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
    price: 700,
    location: "Wadi Rum",
    country: "Jordan",
    category: "Camping",
    geometry: { type: "Point", coordinates: [35.42, 29.5733] },
  },
  {
    title: "Luxury Apartment in Paris",
    description: "Eiffel Tower view apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    },
    price: 2800,
    location: "Paris",
    country: "France",
    category: "Iconic Cities",
    geometry: { type: "Point", coordinates: [2.3522, 48.8566] },
  },
  {
    title: "Glass Igloo in Lapland",
    description: "Watch northern lights from your bed.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1482192505345-5655af888cc4",
    },
    price: 3500,
    location: "Lapland",
    country: "Finland",
    category: "Arctic",
    geometry: { type: "Point", coordinates: [26.9346, 67.9222] },
  },
  {
    title: "Ryokan Stay in Kyoto",
    description: "Traditional Japanese experience.",
    image: {
      filename: "listingimage",
      url: "https://ryokansofjapan.com/wp-content/uploads/2024/07/Fufu-Kyoto-Garden-Ryokan.jpg",
    },
    price: 1800,
    location: "Kyoto",
    country: "Japan",
    category: "Trending",
    geometry: { type: "Point", coordinates: [135.7681, 35.0116] },
  },
  {
    title: "Overwater Villa Bora Bora",
    description: "Luxury villa above turquoise lagoon.",
    image: {
      filename: "listingimage",
      url: "https://static1.thetravelimages.com/wordpress/wp-content/uploads/2023/02/overwater-bungalows-in-french-polynesia-bora-bora-and-moorea.jpg",
    },
    price: 9000,
    location: "Bora Bora",
    country: "French Polynesia",
    category: "Luxury",
    geometry: { type: "Point", coordinates: [-151.7415, -16.5004] },
  },
  {
    title: "Jungle Treehouse in Amazon",
    description: "Stay deep inside rainforest.",
    image: {
      filename: "listingimage",
      url: "https://i.pinimg.com/originals/a8/9f/27/a89f27d643f619e69be25ddd98eec5d9.jpg",
    },
    price: 950,
    location: "Amazon",
    country: "Brazil",
    category: "Camping",
    geometry: { type: "Point", coordinates: [-60.025, -3.4653] },
  },
  {
    title: "City Loft in Berlin",
    description: "Trendy stay in central Berlin.",
    image: {
      filename: "listingimage",
      url: "https://a0.muscache.com/im/pictures/miso/Hosting-49943674/original/1bc70276-63ed-424f-b74b-a3cef6a45daf.jpeg?im_w=720&width=720&quality=70&auto=webp&format=jpg",
    },
    price: 1500,
    location: "Berlin",
    country: "Germany",
    category: "Iconic Cities",
    geometry: { type: "Point", coordinates: [13.405, 52.52] },
  },
];

module.exports = { data: sampleListings };
