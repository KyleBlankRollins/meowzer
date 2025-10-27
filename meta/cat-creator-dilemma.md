OK, now comes the more difficult part. We need to take all of the related files and figure out a hierarchy and strategy that makese sense.

Inventory of related files:

- meowzer/meowzer/ui/components/cat-creator/cat-creator.ts
- meowzer/ui/components/cat-appearance-form/logic/cat-creation.ts
- meowzer/ui/components/cat-appearance-form/logic/validation.ts
- meowzer/ui/components/cat-appearance-form/templates/form-fields.ts
- meowzer/ui/components/cat-appearance-form/templates/preview.ts
- meowzer/ui/components/cat-preview/cat-preview.ts
- meowzer/ui/components/cat-personality-picker/cat-personality-picker.ts

Here are the priorities for this restructure:

1. cat-creator.ts remains the parent component
2. /cat-appearance-form/templates/preview.ts should be migrated to /cat-preview/cat-preview.ts
3. /cat-personality-picker/cat-personality-picker.ts should replace the simple personality selection button in cat-creator.ts
4. /cat-appearance-form/logic/cat-creation.ts, /cat-appearance-form/logic/validation.ts, and /cat-appearance-form/templates/form-fields.ts should probably be combined into another component that has its own directory.
