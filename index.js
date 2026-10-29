
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import mainRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

import dns from "dns";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

dotenv.config();


dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


app.use("/api", mainRouter)


app.get("/", (req, res) => {
    res.send("Hello from backend.");
});

mongoose.connect(process.env.MONGODBURL)

    .then(() => console.log("Connected to MongoDB"))


    .catch((error) => console.log(error));


app.listen(8000, () => console.log("server is running on port 8000."));