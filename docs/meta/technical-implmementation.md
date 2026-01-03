# Site technical implementation

## Blog posts

The blog posts WILL NOT be handled by the docs site. I will post them to my personal site.

## Build strategy

- Each architecture is a content collection
- Shared components for navigation/toggle
- Build generates all approaches in one pass

## URL strategy

Each architecture should have its own subdirectory. For example:

```
/docs/unstructured/getting-started
/docs/diataxis/getting-started
/docs/dita/getting-started
```

## Side-by-side comparison of architectures

Does Astro Starlight have the concept of a portal? Can we create a new router within a component? If so, implementation would be fairly straightforward:

1. On comparison, capture target architecture, copy current URL
2. Mutate the URL to substitute the old architecture with the target architecture
3. Pass new URL to custom comparison component
4. Render custom comparison component at same level as the router for the initial page and render target architecture page

## Architecture toggling

When someone switches from Diataxis to DITA on page X, they should land on the equivalent page in DITA. This means we'll need to maintain some sort of manifest/map for every page/topic and how they relate to the other architectures.

## Content mapping

Manifest could look something like this:

```json
{
  "getting-started": {
    "unstructured": "/docs/unstructured/readme",
    "diataxis": "/docs/diataxis/tutorials/your-first-cat",
    "dita": "/docs/dita/tasks/installation"
  }
}
```

Is JSON the best tool here?

## Introduce a database?

Should I look at using MongoDB to handle things like the topic mapping between architectures? It increases technical overhead, but could save some mental effort due to being able to build relationships.

## Clicks to information (metric tracking)

The tracking will only happen client side and only begin when users specify that they are beginning a task. It will end when they say that they are done with the task.

## Search

I won't be implementing search. But if I end up using MongoDB, I could use Atlas and its search capabilities.

## Mobile experience

Need to think more about what the comparison should look and feel like on mobile.
