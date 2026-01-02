// utils/storyPointParser.js
export function parseStoryPoints(cardName) {
  if (!cardName) return 0;

  // Match (5), [5], or just 5 at the end
  const match = cardName.match(/[\(\[](\d+)[\)\]]|\b(\d+)\b$/);
  if (match) {
    return parseInt(match[1] || match[2], 10);
  }
  return 0;
}