export const createSlug = (name: string) => {
  return name.toLowerCase().split(" ").join("-");
};
