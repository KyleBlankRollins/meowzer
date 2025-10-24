# Curved Path Movement

Autonomous cats now move along smooth curved paths using GSAP's MotionPath plugin. This creates more natural, organic movement patterns instead of straight-line navigation.

## How It Works

When cats wander or play, they automatically generate varied curved paths with intelligent waypoints:

### Wandering Paths (3 styles)

- **Sine Wave**: Smooth, flowing curves like a lazy river (33% chance)
- **Progressive Curve**: Starts straight, curves more at the end (33% chance)
- **Random Offsets**: Organic, unpredictable paths (33% chance)

### Playing Paths (3 styles)

- **Zigzag**: Sharp alternating turns for erratic movement (40% chance)
- **Sharp Turn**: Sudden direction change mid-path, like pouncing (30% chance)
- **Spiral**: Circling approach, playful stalking behavior (30% chance)

### Speed Variation

Cats now **slow down when navigating curves**, especially at higher speeds:

- Decelerate to ~60% speed when approaching waypoints
- Accelerate back to full speed after passing the curve
- Creates realistic momentum and weight to movement

## Live Demo

<mb-meowzer-demo></mb-meowzer-demo>

Watch the autonomous cats above - they're now moving along curved paths instead of straight lines! Notice how:

- **Wandering cats** take varied paths - sometimes flowing sine waves, sometimes progressive curves
- **Playful cats** use different tactics - zigzags, sharp pounces, or spiral approaches
- Cats **slow down in curves** and speed up on straightaways
- Each movement is unique with randomized path styles
- Cats smoothly face the direction of movement along the curve

## Implementation Details

The curved path system uses GSAP's MotionPath plugin with custom easing for realistic movement. The behavior system (`meowbrain`) automatically generates waypoints based on:

1. **Distance to target** - Longer distances get more waypoints (roughly 1 per 150px)
2. **Random path style** - Each movement randomly selects from 3 different path patterns
3. **Speed-based easing** - Fast movements (>150 px/s) automatically slow at waypoints
4. **Variable curviness** - Randomized between 1.0-1.5 for wandering, style-specific for playing

### Path Options

The `moveAlongPath` method (used internally by behaviors) accepts these options:

```typescript
cat.moveAlongPath(points, duration, {
  curviness: 1.2, // How curved the path (0-2, default: 1)
  autoRotate: false, // Auto-rotate cat along path (default: false)
  ease: "power1.inOut", // GSAP easing function
});
```

### Curviness Values

- `0`: Straight lines between points (like old behavior)
- `0.6`: Tight zigzag curves for sharp turns
- `0.9`: Medium curves for pouncing movements
- `1.0-1.5`: Gentle to moderate curves for wandering (randomized)
- `1.3`: Smooth spirals for circling behavior

## Benefits

Enhanced curved paths make autonomous cats feel more:

- **Natural** - Real cats don't walk in perfectly straight lines
- **Varied** - 6 different path styles prevent repetitive movement
- **Realistic** - Speed variation through curves mimics real momentum and weight
- **Unpredictable** - Randomized path selection keeps movement fresh
- **Organic** - Movement appears intentional and lifelike
- **Engaging** - More interesting to watch with diverse movement patterns
