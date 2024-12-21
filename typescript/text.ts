/**
 * Truncate text to fit within a specified number of lines and characters.
 * @param text - The input text to truncate.
 * @param maxLines - The maximum number of lines to allow.
 * @param maxCharacters - The maximum number of characters per line.
 * @returns The truncated text with an ellipsis (...) if necessary.
 */
export function truncateText(
  text: string,
  maxLines: number,
  maxCharacters: number
) {
  const words = text.split(" ");
  let result = "";
  let lineCount = 0;
  let charactersCount = 0;

  for (const word of words) {
    if (lineCount < maxLines) {
      if (charactersCount + word.length <= maxCharacters) {
        result += `${word} `;
        charactersCount += word.length + 1; // +1 for the space
      } else {
        lineCount++;
        charactersCount = 0; // Reset character count for a new line
      }
    } else {
      break;
    }
  }

  if (lineCount >= maxLines) {
    result = result.trim() + "...";
  }

  return result.trim();
}

export function capitalize(word: string) {
  if (!word) return word;
  return `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
}
