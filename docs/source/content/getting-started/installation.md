---
title: Installation
description: How to install Meowbase in your project
next: /getting-started/basic-usage
---

Learn how to install Meowbase in your project.

## Using npm

```bash
npm install meowbase
```

## Using the Local Package

If you're working in the monorepo, you can reference it locally:

```json
{
  "dependencies": {
    "meowbase": "file:../meowbase"
  }
}
```

## Verify Installation

Once installed, you can verify it works:

```javascript
import { Meowbase } from "meowbase";

console.log("Meowbase loaded!");
```
