import { Telegraf, session } from "telegraf";
import TelegrafI18n from "telegraf-i18n";
import commandMiddleware from "telegraf-cmd-args";
import axios from "axios";
import fs from "fs";
import _ from "lodash";

import locales from "../configuration/locales";
/**
 * [TelegramBot description]
 *
 */
class TelegramBot {
  bot;
  defaultLocale;
  params;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }

  getParams(ctx) {
    return {};
  }

  /**
   */
  getInitSessionData(ctx) {
    return {};
  }

  /**
   */
  async initCtx(ctx) {
    ctx.session ??= {
      messageLog: [],
      ...this.getInitSessionData(),
    };
    ctx.params = {
      timeWindow: 5000,
      maxMessages: 10,
      ...this.getParams(ctx),
    };
  }

  /**
   */
  async getCommandsMenu(ctx) {
    return ctx ? [] : null;
  }

  async setCommandsMenu(ctx) {
    return this.bot.telegram.setMyCommands(await this.getCommandsMenu(ctx));
  }

  async replyHelp(ctx) {
    return ctx.replyWithHTML(ctx.i18n.t("help"));
  }

  async errorHandler(error) {
    console.log(error);
  }

  async rateLimitMiddleware(ctx, next) {
    const now = Date.now();

    ctx.session.messageLog = ctx.session.messageLog.filter(
      (timestamp) => timestamp > now - ctx.params.timeWindow
    );
    if (ctx.session.messageLog.length >= ctx.params.maxMessages) {
      return ctx.reply(ctx.i18n.t("floodBlocked"));
    }
    ctx.session.messageLog.push(now);
    return next();
  }

  /**
   */
  init() {
    [this.defaultLocale] = Object.entries(locales).find(
      ([, value]) => value.isDefault
    );

    this.i18n = new TelegrafI18n({
      defaultLanguage: this.defaultLocale,
      allowMissing: false,
    });

    let cloneLocales = _.cloneDeep(locales);

    Object.entries(cloneLocales).forEach(([key, value]) => {
      this.i18n.loadLocale(key, value);
    });

    if (process.env.TELEGRAM_LOG === "true") {
      this.bot.use(Telegraf.log());
    }
    this.bot.use(session());
    this.bot.use(this.i18n.middleware());
    this.bot.use(async (ctx, next) => {
      try {
        return await commandMiddleware(ctx, next);
      } catch (e) {
        console.log(e);
        return next();
      }
    });
    this.bot.use(async (ctx, next) => {
      this.initCtx(ctx);
      return next();
    });

    this.bot.start(async (ctx) => {
      this.setCommandsMenu(ctx);
      return await ctx.replyWithHTML(
        ctx.i18n.t("start", {
          username: ctx.from.username,
        })
      );
    });

    this.bot.help(async (ctx) => {
      await this.setCommandsMenu(ctx);
      return this.replyHelp(ctx);
    });

    this.bot.action("help", async (ctx, next) => {
      await this.setCommandsMenu(ctx);
      return this.replyHelp(ctx);
    });

    this.bot.use(this.rateLimitMiddleware);

    this.bot.on("polling_error", this.errorHandler);

    this.bot.catch(this.errorHandler);
  }

  async startPollMode() {
    console.log("Starting a bot in poll mode");

    axios
      .get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteWebhook`)
      .then(() => {
        this.bot.launch();
      });
    // .catch(this.errorHandler);
  }

  async startHttpMode() {
    console.log("Starting a bot in http mode");

    this.bot.launch({
      webhook: {
        domain: process.env.SERVER_URL,
        port: process.env.PORT,
      },
    });
  }

  async startHttpsMode() {
    console.log("Starting a bot in https mode");

    const tlsOptions = {
      key: fs.readFileSync("/credentials/server-key.pem"),
      cert: fs.readFileSync("/credentials/server-cert.pem"),
    };

    await this.bot.telegram.setWebhook(
      `${process.env.SERVER_URL}:${process.env.PORT}/${process.env.SECRET_PATH}`
    );

    await this.bot.startWebhook(
      process.env.SECRET_PATH,
      tlsOptions,
      process.env.PORT
    );
  }

  start() {
    switch (process.env.MODE) {
      case "http":
        this.startHttpMode();
        break;
      case "https":
        this.startHttpsMode();
        break;
      default:
        this.startPollMode();
    }
  }

  webhookCallback() {
    return this.bot.webhookCallback(process.env.SECRET_PATH);
  }
}

export default TelegramBot;

/*
https://telegraf.js.org/classes/Context.html



https://telegraf.js.org/classes/Telegraf.html

bot methods:

action
catch
command
drop
email
gameQuery
guard
hashtag
hears
help
inlineQuery
launch
mention
phone
settings
spoiler
start
stop
textLink
textMention
url
use




on events:

"text"
"callback_query"
"message"
"channel_post"
"chat_member"
"chosen_inline_result"
"edited_channel_post"
"edited_message"
"inline_query"
"my_chat_member"
"pre_checkout_query"
"poll_answer"
"poll"
"shipping_query"
"chat_join_request"
"channel_chat_created"
"connected_website"
"delete_chat_photo"
"group_chat_created"
"invoice"
"left_chat_member"
"message_auto_delete_timer_changed"
"migrate_from_chat_id"
"migrate_to_chat_id"
"new_chat_members"
"new_chat_photo"
"new_chat_title"
"passport_data"
"proximity_alert_triggered"
"pinned_message"
"successful_payment"
"supergroup_chat_created"
"voice_chat_scheduled"
"voice_chat_started"
"voice_chat_ended"
"voice_chat_participants_invited"
"forward_date"
"animation"
"document"
"audio"
"contact"
"dice"
"game"
"location"
"photo"
"sticker"
"venue"
"video"
"video_note"
"voice"
*/
