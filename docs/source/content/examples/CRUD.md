---
title: CRUD Operations
description: Interactive examples of Create, Read, Update, and Delete operations with Meowbase
---

Create your own custom cats using our character creator! Uses Meowkit to build cats and Meowbase to store them.

<mb-meowbase-provider>
  <mb-cat-creator></mb-cat-creator>
</mb-meowbase-provider>

## How it works

The cat creator above uses **Meowkit** to build ProtoCat objects from your settings, then stores them in **Meowbase** with IndexedDB. Your cats persist between page refreshes!

### Creating cats

1. Choose your cat's appearance (color, pattern, fur length)
2. Set the size
3. Give your cat a name and description
4. Click "Create Cat" to save

### Live Preview

As you adjust the settings, the preview updates in real-time showing you exactly what your cat will look like.

### Creating cats

Use the form to add new cats with a name, age, and color.

### Reading cats

All cats in the collection are displayed in the list below the form.

### Updating cats

Click the "Edit" button on any cat to update their information.

### Deleting cats

Click the "Delete" button to remove a cat from the collection.
