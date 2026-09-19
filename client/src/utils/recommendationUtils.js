export function normalizeTags(tags) {
  const tagList = Array.isArray(tags) ? tags : String(tags || "").split(",");

  return tagList
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");
}

export function formatTags(tags) {
  return normalizeTags(tags).join(", ");
}

export function createRecommendationUpdate({
  title,
  description,
  category,
  tags,
}) {
  return {
    title,
    description,
    category,
    tags: normalizeTags(tags),
  };
}