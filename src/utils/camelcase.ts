export const toCamelCase = (sentence) => {
  if (typeof sentence !== 'string') {
    return '';
  }

  const trimmed = sentence.trim();

  if (trimmed.length === 0) {
    return '';
  }

  // Heuristic: If it has no spaces/hyphens/underscores and starts with lowercase and has an uppercase letter, assume camelCase
  const isCamelCase =
    /^[a-z][a-zA-Z0-9]*$/.test(trimmed) && /[A-Z]/.test(trimmed);

  if (isCamelCase) {
    return trimmed;
  }

  return trimmed
    .toLowerCase()
    .split(/[\s-_]+/) // Split by space, hyphen, or underscore
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
};
