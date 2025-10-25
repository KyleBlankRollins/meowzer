---
title: Getting Started
description: Learn how to get started with Meowbase
---

Welcome to the Getting Started section! This section will help you understand the basics of Meowbase.

## What is Meowbase?

Meowbase is an IndexedDB wrapper that mimics a database for learning purposes. It provides a MongoDB-like document model with:

- Document-based collections stored in IndexedDB
- LRU cache with automatic eviction
- Full CRUD operations for collections and documents
- Sample dataset for learning and demos

## Quick Example

```javascript
import { Meowbase } from "meowbase";

const db = new Meowbase();

// Load sample data
await db.loadSampleData();

// Query cats
const result = db.findCat("shelter", "whiskers-001");
```

## Next Steps

Check out the [Installation](/getting-started/installation) guide to get started!
