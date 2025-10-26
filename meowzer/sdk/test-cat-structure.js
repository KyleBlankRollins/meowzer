import { Meowzer } from "./dist/meowzer-sdk.js";

const meowzer = new Meowzer({ storage: { enabled: false } });
await meowzer.init();

const cat = await meowzer.cats.create({ 
  name: "Test",
  metadata: { tags: ["playful"], customData: "value" }
});

console.log("Cat structure:");
console.log("id:", cat.id);
console.log("name:", cat.name);
console.log("seed:", cat.seed);
console.log("metadata:", cat.metadata);
console.log("position:", cat.position);
console.log("state:", cat.state);

await meowzer.destroy();
