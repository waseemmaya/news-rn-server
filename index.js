require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/mongodb");
var { ObjectId } = require("mongodb");
const News = require("./models/NewsSchema");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

connectDB();

app.get("/news", async (req, res, next) => {
  console.log("in GET news");
  const news = await News.find({}).sort({ _id: -1 });

  console.log("news: ", news.length);
  res.send({
    news,
  });
});

app.post("/news", async (req, res, next) => {
  try {
    console.log("in POST news");
    const { body } = req;
    const { newsObj } = body;
    // console.log("newsObj: ", newsObj);
    if (!newsObj) {
      throw Error("No news object found");
    }

    let news = new News(newsObj);
    news = await news.save();

    res.send({
      status: "success",
      newsObj: news,
    });
  } catch (error) {
    console.log("error: ", error);
    res.sendStatus(404).send({
      error: error,
    });
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`News server is running on : http://localhost:${port}`);
});
