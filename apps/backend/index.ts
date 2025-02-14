import express from "express";
import { GenerateImage, GenerateImageFromPack, TrainModel } from "common/types";
import { prismaClient } from "db";

const PORT = process.env.PORT || 3001;

const app = express();

const USER_ID = "asdasd";
app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  if (!parsedBody.success) {
    const errMessages = parsedBody.error.errors.map((err) => err.message);
    res.status(411).json({
      success: false,
      message: errMessages,
    });
    return;
  }
  const data = await prismaClient.model.create({
    data: {
      name: parsedBody.data.name,
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethnicity: parsedBody.data.ethnicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: USER_ID,
    },
  });
  res.status(200).json({
    success: true,
    message: "Trained The model",
    modelId: data.id,
  });
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);

  if (!parsedBody.success) {
    const errMessages = parsedBody.error.errors.map((err) => err.message);
    res.status(411).json({
      success: false,
      message: errMessages,
    });
    return;
  }
  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      modelId: parsedBody.data.modelId,
      userId: USER_ID,
      imageUrl: "",
    },
  });
  res.status(200).json({
    success: true,
    message: "Generated The image",
    imageId: data.id,
  });
});

app.post("/pack/generate", async (req, res) => {
  const parsedBody = GenerateImageFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    const errMessages = parsedBody.error.errors.map((err) => err.message);
    res.status(411).json({
      success: false,
      message: errMessages,
    });
  }
  const prompts = await prismaClient.packPrompt.findMany({
    where: {
      packId: parsedBody.data?.packId,
    },
  });
  const images = await prismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt) => ({
      prompt: prompt.prompt,
      userId: USER_ID,
      modelId: parsedBody.data?.modelId,
      imageUrl: "",
    })),
  });
  res.status(200).json({
    success: true,
    message: "Generated The pack",
    images: images.map((image) => image.id),
  });
});

app.get("/pack/list", async (req, res) => {
  const parsedBody = GenerateImageFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    const errMessages = parsedBody.error.errors.map((err) => err.message);
    res.status(411).json({
      success: false,
      message: errMessages,
    });
  }
  const packs = await prismaClient.packs.findMany({});
  res.status(200).json({
    success: true,
    message: "List of packs",
    packs: packs,
  });
});

app.get("/image/list",async (req, res) => {
  const imageIds = req.query.images as string[];
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  const imagesData = await prismaClient.outputImages.findMany({
    where: {
      id: {
        in: imageIds,
      },
    },
    skip: offset,
    take: limit,
  });

  res.status(200).json({
    success: true,
    message: "List of images",
    images: imagesData,
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
