import type {
  Collection,
  Cat,
  Toy,
  Emotion,
  Human,
} from "../types.js";
import { generateUUID } from "./utils.js";

/**
 * Sample dataset for Meowbase
 * Contains three collections: shelter, neighborhood, and home
 */

// Common emotions
const emotions: Emotion[] = [
  { id: generateUUID(), name: "content" },
  { id: generateUUID(), name: "playful" },
  { id: generateUUID(), name: "sleepy" },
  { id: generateUUID(), name: "curious" },
  { id: generateUUID(), name: "grumpy" },
  { id: generateUUID(), name: "affectionate" },
  { id: generateUUID(), name: "anxious" },
  { id: generateUUID(), name: "hungry" },
];

// Common toys
const toys: Toy[] = [
  {
    id: generateUUID(),
    name: "Feather Wand",
    image: "https://example.com/toys/feather-wand.jpg",
    type: "interactive",
    description: "A colorful feather on a string",
  },
  {
    id: generateUUID(),
    name: "Catnip Mouse",
    image: "https://example.com/toys/catnip-mouse.jpg",
    type: "plush",
    description: "Soft mouse filled with catnip",
  },
  {
    id: generateUUID(),
    name: "Laser Pointer",
    image: "https://example.com/toys/laser-pointer.jpg",
    type: "interactive",
    description: "Red dot of endless entertainment",
  },
  {
    id: generateUUID(),
    name: "Cardboard Box",
    image: "https://example.com/toys/cardboard-box.jpg",
    type: "hideout",
    description: "The classic cat toy",
  },
  {
    id: generateUUID(),
    name: "Crinkle Ball",
    image: "https://example.com/toys/crinkle-ball.jpg",
    type: "ball",
    description: "Makes satisfying crinkly sounds",
  },
  {
    id: generateUUID(),
    name: "String",
    image: "https://example.com/toys/string.jpg",
    type: "simple",
    description: "Just a piece of string, but cats love it",
  },
];

// Common humans
const humans: Human[] = [
  {
    id: generateUUID(),
    name: "Sarah",
    isFoodGiver: true,
    isScary: false,
  },
  {
    id: generateUUID(),
    name: "Mike",
    isFoodGiver: false,
    isScary: false,
  },
  {
    id: generateUUID(),
    name: "The Vet",
    isFoodGiver: false,
    isScary: true,
  },
  {
    id: generateUUID(),
    name: "Neighbor Tom",
    isFoodGiver: true,
    isScary: false,
  },
  {
    id: generateUUID(),
    name: "Mail Carrier",
    isFoodGiver: false,
    isScary: true,
  },
];

// Shelter cats - cats waiting for adoption
const shelterCats: Cat[] = [
  {
    id: generateUUID(),
    name: "Whiskers",
    image: "https://example.com/cats/whiskers.jpg",
    birthday: new Date("2022-03-15"),
    favoriteToy: toys[1], // Catnip Mouse
    description: "A friendly tabby who loves attention and treats",
    currentEmotion: emotions[5], // affectionate
    importantHumans: [humans[0]], // Sarah
  },
  {
    id: generateUUID(),
    name: "Shadow",
    image: "https://example.com/cats/shadow.jpg",
    birthday: new Date("2021-11-20"),
    favoriteToy: toys[3], // Cardboard Box
    description:
      "Black cat with striking green eyes, a bit shy at first",
    currentEmotion: emotions[6], // anxious
    importantHumans: [humans[0]], // Sarah
  },
  {
    id: generateUUID(),
    name: "Luna",
    image: "https://example.com/cats/luna.jpg",
    birthday: new Date("2023-01-10"),
    favoriteToy: toys[0], // Feather Wand
    description: "Energetic kitten with a gray and white coat",
    currentEmotion: emotions[1], // playful
    importantHumans: [humans[0]], // Sarah
  },
  {
    id: generateUUID(),
    name: "Oliver",
    image: "https://example.com/cats/oliver.jpg",
    birthday: new Date("2020-07-04"),
    favoriteToy: toys[2], // Laser Pointer
    description: "Orange tabby who thinks he's the boss",
    currentEmotion: emotions[0], // content
    importantHumans: [humans[0]], // Sarah
  },
  {
    id: generateUUID(),
    name: "Mittens",
    image: "https://example.com/cats/mittens.jpg",
    birthday: new Date("2022-09-12"),
    favoriteToy: toys[4], // Crinkle Ball
    description: "Tuxedo cat with adorable white paws",
    currentEmotion: emotions[3], // curious
    importantHumans: [humans[0]], // Sarah
  },
];

// Neighborhood cats - community cats that roam the area
const neighborhoodCats: Cat[] = [
  {
    id: generateUUID(),
    name: "Streetwise",
    image: "https://example.com/cats/streetwise.jpg",
    birthday: new Date("2019-05-20"),
    favoriteToy: toys[5], // String
    description:
      "Tough alley cat who knows every shortcut in the neighborhood",
    currentEmotion: emotions[3], // curious
    importantHumans: [humans[3], humans[0]], // Neighbor Tom, Sarah
  },
  {
    id: generateUUID(),
    name: "Patches",
    image: "https://example.com/cats/patches.jpg",
    birthday: new Date("2020-03-08"),
    favoriteToy: toys[3], // Cardboard Box
    description:
      "Calico cat with a patchwork coat, friendly to everyone",
    currentEmotion: emotions[0], // content
    importantHumans: [humans[3], humans[1]], // Neighbor Tom, Mike
  },
  {
    id: generateUUID(),
    name: "Bandit",
    image: "https://example.com/cats/bandit.jpg",
    birthday: new Date("2021-08-14"),
    favoriteToy: toys[1], // Catnip Mouse
    description:
      "Gray cat with a mask-like pattern, loves to steal socks",
    currentEmotion: emotions[1], // playful
    importantHumans: [humans[3]], // Neighbor Tom
  },
  {
    id: generateUUID(),
    name: "Princess",
    image: "https://example.com/cats/princess.jpg",
    birthday: new Date("2018-12-25"),
    favoriteToy: toys[0], // Feather Wand
    description: "Elegant white Persian who rules the neighborhood",
    currentEmotion: emotions[4], // grumpy
    importantHumans: [humans[3], humans[0], humans[1]], // Neighbor Tom, Sarah, Mike
  },
];

// Home cats - owned indoor cats
const homeCats: Cat[] = [
  {
    id: generateUUID(),
    name: "Mr. Fluffington",
    image: "https://example.com/cats/mr-fluffington.jpg",
    birthday: new Date("2019-02-14"),
    favoriteToy: toys[2], // Laser Pointer
    description:
      "Long-haired Maine Coon who demands respect and treats",
    currentEmotion: emotions[7], // hungry
    importantHumans: [humans[0], humans[1]], // Sarah, Mike
  },
  {
    id: generateUUID(),
    name: "Bella",
    image: "https://example.com/cats/bella.jpg",
    birthday: new Date("2020-06-10"),
    favoriteToy: toys[0], // Feather Wand
    description:
      "Siamese with beautiful blue eyes and a talkative personality",
    currentEmotion: emotions[5], // affectionate
    importantHumans: [humans[0], humans[1]], // Sarah, Mike
  },
  {
    id: generateUUID(),
    name: "Simba",
    image: "https://example.com/cats/simba.jpg",
    birthday: new Date("2021-04-22"),
    favoriteToy: toys[3], // Cardboard Box
    description: "Golden tabby who thinks he's a lion",
    currentEmotion: emotions[2], // sleepy
    importantHumans: [humans[0], humans[1]], // Sarah, Mike
  },
  {
    id: generateUUID(),
    name: "Cleo",
    image: "https://example.com/cats/cleo.jpg",
    birthday: new Date("2022-10-31"),
    favoriteToy: toys[4], // Crinkle Ball
    description: "Black cat born on Halloween, brings good luck",
    currentEmotion: emotions[1], // playful
    importantHumans: [humans[0], humans[1]], // Sarah, Mike
  },
  {
    id: generateUUID(),
    name: "Gizmo",
    image: "https://example.com/cats/gizmo.jpg",
    birthday: new Date("2023-05-18"),
    favoriteToy: toys[5], // String
    description: "Mischievous tabby kitten who gets into everything",
    currentEmotion: emotions[1], // playful
    importantHumans: [humans[0], humans[1]], // Sarah, Mike
  },
  {
    id: generateUUID(),
    name: "Duchess",
    image: "https://example.com/cats/duchess.jpg",
    birthday: new Date("2017-09-03"),
    favoriteToy: toys[1], // Catnip Mouse
    description:
      "Senior gray cat who prefers quiet naps and gentle pets",
    currentEmotion: emotions[2], // sleepy
    importantHumans: [humans[0], humans[1]], // Sarah, Mike
  },
];

/**
 * Get the sample dataset with three collections
 */
export function getSampleDataset(): Collection[] {
  return [
    {
      id: generateUUID(),
      name: "shelter",
      children: shelterCats,
    },
    {
      id: generateUUID(),
      name: "neighborhood",
      children: neighborhoodCats,
    },
    {
      id: generateUUID(),
      name: "home",
      children: homeCats,
    },
  ];
}

/**
 * Get statistics about the sample dataset
 */
export function getSampleDatasetStats() {
  const collections = getSampleDataset();
  const totalCats = collections.reduce(
    (sum, collection) => sum + collection.children.length,
    0
  );

  return {
    collectionCount: collections.length,
    totalCats,
    collections: collections.map((c) => ({
      name: c.name,
      catCount: c.children.length,
    })),
  };
}
