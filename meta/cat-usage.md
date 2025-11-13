Here's where the `Cat` class is used in this project (excluding docs):

## Main Usage Locations:

**1. SDK (sdk)**

- cat-manager.ts - Creates instances with `new Cat(protoCat)` at line 144
- meowzer-cat.ts - Holds a reference to `Cat` in the `_cat` private field and exposes it via `_internalCat` getter

**2. SDK Cat Modules (cat-modules)**
All these modules receive and work with `Cat` instances:

- cat-lifecycle.ts - For pause/resume/destroy operations
- cat-accessories.ts - For hat management and sprite updates
- cat-interactions.ts - For need/yarn/laser interactions
- cat-events.ts - For event aggregation and forwarding

**3. MeowBrain (meowbrain)**

- brain.ts - Constructor takes a `Cat` parameter
- builder.ts - Creates brains that reference cats
- behavior-orchestrator.ts - Works with `Cat` instances
- behaviors.ts - All behavior functions accept `Cat` as parameter
- interaction-detector.ts
- interaction-listener.ts
- interest-evaluator.ts

**4. Meowtion (meowtion)**

- cat.ts - **Definition location** (line 35)
- index.ts - Exports the `Cat` class
- animator.ts - Uses `Cat` type

**5. Tests**

- meowbrain.test.ts - Creates `Cat` instances for testing

The `Cat` class from `meowtion` is the core animation/physics class, which gets wrapped by `MeowzerCat` in the SDK to provide higher-level functionality.
