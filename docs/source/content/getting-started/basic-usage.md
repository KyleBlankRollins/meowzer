---
title: Basic Usage
description: Learn the basics of using Meowbase
previous: /getting-started/installation
next: /api/collections
---

Learn how to use Meowbase for basic operations.

## Creating Collections

```javascript
const db = new Meowbase();

// Create a new collection
const result = db.createCollection("my-cats");

if (result.success) {
  console.log("Collection created!");
}
```

## Adding Cats

```javascript
const cat = {
  id: "fluffy-001",
  name: "Fluffy",
  age: 3,
  color: "orange",
  toys: [],
  emotions: [],
  humans: [],
};

db.addCat("my-cats", cat);
```

## Querying Cats

```javascript
const result = db.findCat("my-cats", "fluffy-001");

if (result.success) {
  console.log(result.data);
}
```
