# Facet

Facet demonstrates how different documentation architectures shape the same content, like a prism refracting light. The Meowzer docs serve as a consistent docs set, the beam of white light. Each documentation architecture (DITA, Diataxis, EPPO) acts as a facet of the prism, refracting that baseline content into distinct, colorful implementations that highlight the unique characteristics and trade-offs of each approach.

By comparing these architectural implementations side-by-side, Facet makes the strengths and weaknesses of each documentation philosophy tangible and teaches their core concepts through concrete examples.

## Glossary

- **Docs set**: The baseline documentation content. The individual pages and topics that make up the Meowzer docs. This is the "white light" that gets refracted through different architectural approaches.
- **Docs architecture**: The various philosophies and approaches to documentation, like DITA, Diataxis, and EPPO. These are the "facets of the prism" that shape how the docs set is structured and presented.
- **Architectural implementation**: The "colored light". A specific version of the docs set structured according to a particular architecture's principles.

## Documentation Architectures

The default docs set uses regular markdown with no content reuse or information types.

Here are other architectures I have implemented or am considering:

- **Unstructured markdown** (baseline/default)
- **DITA**
  - Fully structured using DITAOT
  - Semi-structured using DITA information types and reuse but not the DITA pipeline
- **Diataxis**
- **Every Page is Page One (EPPO)**

## Deliverables

### Documentation Website

A website that can toggle between the different docs architectures and has the ability to compare them side-by-side.

### Monorepo

A monorepo for the site that contains all of the different approaches. The branch strategy has two limitations: it forces people to need to switch between branches, which makes direct comparison difficult; it makes building the content sources for a single website much more difficult.

### Blog Posts

Blog posts explaining the different approaches and using Meowzer to guide readers through them. These will be published on my personal site, not the Meowzer docs site.

### Technical Implementation

See [technical-implementation.md](./technical-implementation.md) for details on build strategy, URL structure, and component architecture.

## Content Strategy

### Content Source Strategy

Each docs architecture needs to be written separately and not share content. This demonstrates the true maintenance burden and allows each architecture to optimize for its philosophy.

### Content Mapping

Content must be mapped between architectures to enable toggling and side-by-side comparison. When someone switches from Diataxis to DITA on page X, they should land on the equivalent page in DITA.

A manifest/map is needed for every page/topic and how they relate to the other architectures. Example structure:

```json
{
  "getting-started": {
    "unstructured": "/docs/unstructured/readme",
    "diataxis": "/docs/diataxis/tutorials/your-first-cat",
    "dita": "/docs/dita/tasks/installation"
  }
}
```

## Learning & Metrics

### Learning Path Design

For now, the learning paths are mostly self-guided exploration. Could be used in workshops or async discussions.

Target audiences:

- Beginners learning tech writing
- Experienced writers exploring new frameworks
- Developers learning to write docs

### Task Inventory

For the clicks-to-information metric, a canonical set of tasks that work across all architectures:

**User tasks:**

- "Change my cat's color"
- "Add an accessory"
- "Share my cat"

**Developer tasks:**

- "Initialize the SDK"
- "Handle behavior events"
- "Create a custom plugin"

**Troubleshooting:**

- "My cat won't animate"
- "Build fails with X error"

### Clicks-to-Information Tracking

The tracking will only happen client-side and only begin when users specify that they are beginning a task. It will end when they say that they are done with the task.

This metric helps evaluate which docs architecture performs best for specific task types.

## Community & Maintenance

### Community Contributions

I'd love to have community contributions to:

- Improve the words of the docs
- Refine the implementation of the docs architectures
- Add new docs architectures

### Feature Update Policy

**Decision needed:** Do new features go in all architectures, or just the default?

## Meta Documentation

The site needs documentation about the Meowzer docs and their purpose. This should include a landing page that teaches the purpose of the docs as a learning tool.

Content to include:

- **What Meowzer is** - a fake product created specifically for teaching documentation concepts
- **How to use this resource** - which architecture demonstrates what learning goals
- **Task-based comparisons** - "Here's the same task in each docs architecture"
- **Performance data** - clicks-to-information results and analysis
- **When to use each docs architecture** - guidance for applying these approaches in real projects
- **User flow comparisons** - how different architectures guide users through common tasks

## Open Questions

- **Database vs JSON for mapping**: Should I use MongoDB to handle topic mapping between architectures? It increases technical overhead, but could save mental effort due to being able to build relationships.
