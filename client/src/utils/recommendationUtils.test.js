import {
  createRecommendationUpdate,
  formatTags,
  normalizeTags,
} from "./recommendationUtils";

describe("normalizeTags", () => {
  test("splits comma-separated tags and trims whitespace", () => {
    expect(normalizeTags(" react, javascript , testing ")).toEqual([
      "react",
      "javascript",
      "testing",
    ]);
  });

  test("removes empty tags", () => {
    expect(normalizeTags("react, , , testing,")).toEqual([
      "react",
      "testing",
    ]);
  });

  test("accepts an existing tag array", () => {
    expect(normalizeTags([" frontend ", "backend"])).toEqual([
      "frontend",
      "backend",
    ]);
  });

  test("returns an empty array for missing tags", () => {
    expect(normalizeTags()).toEqual([]);
  });
});

describe("recommendation formatting and updates", () => {
  test("formats tags for display", () => {
    expect(formatTags(["react", "testing"])).toBe("react, testing");
  });

  test("creates the API update payload with normalized tags", () => {
    expect(
      createRecommendationUpdate({
        title: "Testing with Jest",
        description: "A unit testing resource",
        category: "Development",
        tags: "jest, javascript",
      })
    ).toEqual({
      title: "Testing with Jest",
      description: "A unit testing resource",
      category: "Development",
      tags: ["jest", "javascript"],
    });
  });
});