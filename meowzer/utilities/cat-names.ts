/**
 * Cat Name Generator for Meowzer
 *
 * Generates random cat names combining food themes, cat themes, and pop culture
 */

/**
 * Cat name generator with food-themed and cat-themed combinations
 */
export class CatNameGenerator {
  private static readonly foodPrefixes = [
    "Biscuit",
    "Mochi",
    "Waffles",
    "Noodle",
    "Pepper",
    "Ginger",
    "Cookie",
    "Dumpling",
    "Pickles",
    "Nacho",
    "Taco",
    "Sushi",
    "Tofu",
    "Bean",
    "Pudding",
    "Muffin",
    "Peanut",
    "Butterscotch",
    "Marshmallow",
    "Cinnamon",
    "Honey",
    "Olive",
    "Basil",
    "Paprika",
    "Cayenne",
    "Cheese",
    "Potato",
    "Ramen",
    "Pretzel",
    "Bagel",
    "Croissant",
    "Cashew",
    "Walnut",
    "Pistachio",
    "Almond",
    "Cocoa",
    "Latte",
    "Espresso",
    "Mocha",
    "Brownie",
    "Truffle",
    "Caramel",
  ];

  private static readonly catSuffixes = [
    "paws",
    "whisker",
    "tail",
    "meow",
    "purr",
    "fur",
    "claw",
    "fang",
    "bean",
    "toe",
    "nose",
    "ear",
  ];

  private static readonly starWarsCats = [
    "Luke Skywhisker",
    "Princess Leia Pawgana",
    "Obi-Wan Catnobi",
    "Darth Mewlius",
    "Han Solo-mon",
    "Chew-cat-ca",
    "Yoda",
    "Anakin Skywhisker",
    "Padmé Meowdala",
    "Mace Winpurr",
    "Qui-Gon Kitten",
    "Count Mewku",
    "Paw-patine",
    "Boba Fett-us",
    "Jango Fett-us",
    "Rey Skywhisker",
    "Kylo Ren",
    "Finn-egan",
    "Poe Damepurr",
    "BB-Cat",
    "R2-Mew2",
    "C-3PO-nce",
    "Meowbacca",
    "Lando Catissian",
    "Admiral Ackpurr",
  ];

  private static readonly simpleCatNames = [
    "Shadow",
    "Luna",
    "Midnight",
    "Oreo",
    "Smokey",
    "Tiger",
    "Simba",
    "Felix",
    "Garfield",
    "Tom",
    "Mittens",
    "Boots",
    "Socks",
    "Patches",
    "Calico",
    "Tabby",
    "Whiskers",
    "Fluffy",
  ];

  private static usedNames = new Set<string>();

  /**
   * Generate a random cat name from all available styles
   */
  static generate(): string {
    const nameTypes = [
      () => this.generateFoodName(),
      () => this.generateCompoundName(),
      () => this.getRandomFrom(this.starWarsCats),
      () => this.getRandomFrom(this.simpleCatNames),
    ];

    const generator = this.getRandomFrom(nameTypes);
    return generator();
  }

  /**
   * Generate a unique cat name (won't repeat until reset)
   */
  static generateUnique(): string {
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const name = this.generate();
      if (!this.usedNames.has(name)) {
        this.usedNames.add(name);
        return name;
      }
      attempts++;
    }

    // Fallback: generate a name with a number suffix
    const baseName = this.generate();
    const suffix = Math.floor(Math.random() * 1000);
    const uniqueName = `${baseName} ${suffix}`;
    this.usedNames.add(uniqueName);
    return uniqueName;
  }

  /**
   * Generate multiple unique names
   */
  static generateMultiple(count: number): string[] {
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(this.generateUnique());
    }
    return names;
  }

  /**
   * Reset the used names tracker
   */
  static resetUsedNames(): void {
    this.usedNames.clear();
  }

  /**
   * Get all available pre-defined names
   */
  static getAllNames(): string[] {
    return [
      ...this.foodPrefixes,
      ...this.starWarsCats,
      ...this.simpleCatNames,
    ];
  }

  private static generateFoodName(): string {
    return this.getRandomFrom(this.foodPrefixes);
  }

  private static generateCompoundName(): string {
    const prefix = this.getRandomFrom(this.foodPrefixes);
    const suffix = this.getRandomFrom(this.catSuffixes);
    return `${prefix}${suffix}`;
  }

  private static getRandomFrom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}
