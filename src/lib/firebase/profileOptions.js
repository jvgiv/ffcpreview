export const AGE_RANGE_OPTIONS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

export function isValidAgeRange(value) {
  return AGE_RANGE_OPTIONS.includes(value);
}