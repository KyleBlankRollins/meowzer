/**
 * Example: Using Meowbase with localStorage (backwards compatibility)
 */

import { Meowbase } from "../meowzer/meowbase/meowbase.js";
import { StorageAdapter } from "../meowzer/meowbase/storage/index.js";

async function main() {
  // Create Meowbase instance with localStorage adapter
  const db = new Meowbase(
    {
      maxLoadedCollections: 5,
      maxCollectionSize: 100,
    },
    new StorageAdapter() // Use localStorage instead of IndexedDB
  );

  // Initialize (no-op for localStorage, but keeps API consistent)
  await db.initialize();

  try {
    // All operations work the same way as IndexedDB
    const result = await db.createCollection("Test Cats", []);
    if (result.success) {
      console.log("✅ Collection created in localStorage");
    }

    // Load collection
    await db.loadCollection("Test Cats");

    // Add a cat
    await db.addCatToCollection("Test Cats", {
      id: crypto.randomUUID(),
      name: "Whiskers",
      image: "😺",
      birthday: new Date(),
      favoriteToy: {
        id: crypto.randomUUID(),
        name: "Mouse",
        image: "🐭",
        type: "toy",
        description: "A toy mouse",
      },
      description: "A playful cat",
      currentEmotion: { id: "1", name: "Happy" },
      importantHumans: [],
    });

    // Save
    await db.saveCollection("Test Cats");
    console.log("✅ Saved to localStorage");

    // List collections
    const list = await db.listCollections();
    if (list.success) {
      console.log("Collections:", list.data);
    }

    // Cleanup
    await db.deleteCollection("Test Cats");
    console.log("🗑️  Deleted from localStorage");
  } finally {
    await db.close();
  }
}

main().catch(console.error);
