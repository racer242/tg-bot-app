import express from "express";
import createError from "http-errors";
import logger from "morgan";

import path from "path";

import TranslateBot from "./aiApiBot/AiApiBot";

const telegramBot = new TranslateBot();

telegramBot.init();

telegramBot.start();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(telegramBot.webhookCallback());

app.get("/", async (req, res) => {
  res.json({ status: true, message: "Our AIAPI bot works" });
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.end(err.message);
});

export default app;
