import express from "express";
import {GenerateImage,GenerateImageFromPack, TrainModel} from 'common/types'
import {prismaClient} from 'db'

const PORT = process.env.PORT || 3001;

const app = express();

const USER_ID = "asdasd"
app.post("/ai/training", async (req, res) => {
    const parsedBody = TrainModel.safeParse(req.body);
    if(!parsedBody.success){
        const errMessages = parsedBody.error.errors.map((err) => err.message);
        res.status(411).json({
            success:false,
            message:errMessages,
        });
        return
    }
    const data = await prismaClient.model.create({
        data:{
            name:parsedBody.data.name,
            type:parsedBody.data.type,
            age:parsedBody.data.age,
            ethnicity:parsedBody.data.ethnicity,
            eyeColor:parsedBody.data.eyeColor,
            bald:parsedBody.data.bald,
            userId:USER_ID
        }
    });
    res.status(200).json({
        success:true,
        message:"Trained The model",
        modelId:data.id
    })
});

app.post("/ai/generate", (req, res) => {});

app.post("/pack/generate", (req, res) => {});

app.get("/pack/list", (req, res) => {});

app.get("/pack/bulk", (req, res) => {});

app.get("/image", (req, res) => {});

app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
