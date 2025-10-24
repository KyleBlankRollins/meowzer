/**
 * Example: Using Meowbase with IndexedDB
 */

import { Meowbase } from "../meowzer/meowbase/meowbase.js";
import type { Cat } from "../meowzer/meowbase/types.js";

async function main() {
  // Create Meowbase instance (defaults to IndexedDB)
  const db = new Meowbase({
    maxLoadedCollections: 5,
    maxCollectionSize: 100,
  });

  // IMPORTANT: Initialize must be called before any operations
  await db.initialize();

  try {
    // Create a new collection
    const createResult = await db.createCollection("My Cats", []);
    if (!createResult.success) {
      console.error(
        "Failed to create collection:",
        createResult.message
      );
      return;
    }
    console.log("✅ Collection created:", createResult.data?.name);

    // Load the collection into memory
    const loadResult = await db.loadCollection("My Cats");
    if (!loadResult.success) {
      console.error("Failed to load collection:", loadResult.message);
      return;
    }
    console.log("✅ Collection loaded:", loadResult.data?.name);

    // Create a cat
    const newCat: Cat = {
      id: crypto.randomUUID(),
      name: "Fluffy",
      image: "🐱",
      birthday: new Date("2020-01-15"),
      favoriteToy: {
        id: crypto.randomUUID(),
        name: "Yarn Ball",
        image: "🧶",
        type: "toy",
        description: "A ball of red yarn",
      },
      description: "A fluffy white cat who loves to play",
      currentEmotion: {
        id: "1",
        name: "Happy",
      },
      importantHumans: [
        {
          id: crypto.randomUUID(),
          name: "Alice",
          isFoodGiver: true,
          isScary: false,
        },
      ],
    };

    // Add cat to the collection
    const addResult = await db.addCatToCollection("My Cats", newCat);
    if (!addResult.success) {
      console.error("Failed to add cat:", addResult.message);
      return;
    }
    console.log("✅ Cat added:", newCat.name);

    // Save changes to IndexedDB
    const saveResult = await db.saveCollection("My Cats");
    if (!saveResult.success) {
      console.error("Failed to save collection:", saveResult.message);
      return;
    }
    console.log("✅ Collection saved to IndexedDB");

    // List all collections
    const listResult = await db.listCollections();
    if (listResult.success) {
      console.log("📂 Collections:");
      listResult.data?.forEach((info) => {
        console.log(`  - ${info.name} (${info.catCount} cats)`);
      });
    }

    // Get collection without loading into memory
    const getResult = await db.getCollection("My Cats");
    if (getResult.success) {
      console.log(
        "📊 Collection has",
        getResult.data?.children.length,
        "cats"
      );
    }

    // Update a cat
    const updatedCat: Cat = {
      ...newCat,
      description: "An even fluffier white cat!",
    };
    const updateResult = await db.updateCatInCollection(
      "My Cats",
      updatedCat
    );
    if (updateResult.success) {
      console.log("✅ Cat updated");
    }

    // Save again
    await db.saveCollection("My Cats");
    console.log("✅ Changes saved");

    // Find a specific cat
    const findResult = await db.findCatInCollection(
      "My Cats",
      "Fluffy"
    );
    if (findResult.success) {
      console.log("🔍 Found cat:", findResult.data?.name);
    }

    // Cleanup: Delete collection
    const deleteResult = await db.deleteCollection("My Cats");
    if (deleteResult.success) {
      console.log("🗑️  Collection deleted");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    // Close database connection
    await db.close();
    console.log("👋 Database connection closed");
  }
}

// Run the example
main().catch(console.error);
