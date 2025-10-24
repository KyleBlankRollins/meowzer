---
title: Collections API
description: API reference for collection operations
---

Learn about collection operations in Meowbase.

## Overview

Collections are the top-level containers for cats in Meowbase. Each collection is stored in localStorage and can be loaded into memory for fast access.

## Key Concepts

- Collections are stored in localStorage with the prefix `meowbase-{id}`
- Maximum of 5 collections can be loaded in memory at once
- Collections use LRU (Least Recently Used) eviction when memory is full
- Each collection can hold up to 100 cats

## Available Operations

- [Create Collection](/api/collections/create)
- [Load Collection](/api/collections/load)
- [Save Collection](/api/collections/save)
