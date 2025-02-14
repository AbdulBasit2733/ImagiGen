import { z } from "zod";

export const TrainModel = z.object({
  name: z.string(),
  type: z.enum(["Man", "Woman", "Others"]),
  age: z.number(),
  ethnicity: z.enum([
    "White",
    "Black",
    "African",
    "American",
    "Hispanic",
    "Latino",
    "Asian",
    "Alaska",
    "Other"
  ]),
  eyeColor: z.enum([
    "Brown",
    "Blue",
    "Green",
    "Hazel",
    "Gray",
    "Amber",
    "Other",
  ]),
  bald: z.boolean(),
  images: z.array(z.string()),
});

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
});

export const GenerateImageFromPack = z.object({
  modelId: z.string(),
  packId: z.string(),
});
