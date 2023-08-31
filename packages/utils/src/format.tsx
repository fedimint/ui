/**
 * Given a string, turn it into an "ellipsis sandwich" with the start and
 * end showing. If the text is shorter than it would be with an ellipsis,
 * the full string is returned instead.
 */
export function formatEllipsized(text: string, size = 6) {
  if (text.length <= size * 2 + 3) {
    return text;
  }
  return `${text.substring(0, size)}...${text.substring(text.length - size)}`;
}
