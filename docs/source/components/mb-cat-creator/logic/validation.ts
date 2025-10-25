/**
 * Validation logic for cat creator
 */

/**
 * Validate cat name
 */
export function validateCatName(name: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = name.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: "Please enter a name for your cat",
    };
  }

  if (trimmed.length < 2) {
    return {
      valid: false,
      error: "Cat name must be at least 2 characters",
    };
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      error: "Cat name must be 50 characters or less",
    };
  }

  return { valid: true };
}

/**
 * Validate cat description
 */
export function validateDescription(description: string): {
  valid: boolean;
  error?: string;
} {
  if (description.length > 500) {
    return {
      valid: false,
      error: "Description must be 500 characters or less",
    };
  }

  return { valid: true };
}

/**
 * Validate entire form for cat creation
 */
export function validateCatForm(data: {
  name: string;
  description: string;
}): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const nameValidation = validateCatName(data.name);
  if (!nameValidation.valid && nameValidation.error) {
    errors.push(nameValidation.error);
  }

  const descValidation = validateDescription(data.description);
  if (!descValidation.valid && descValidation.error) {
    errors.push(descValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
