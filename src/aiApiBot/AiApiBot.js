import { Markup, Scenes } from "telegraf"; // , Extra
import TelegramBot from "./TelegramBot";
import { message } from "telegraf/filters";
import UserNameScene from "./scenes/UserNameScene";

/**
 * [TelegramBot description]
 *
 */
class AiApiBot extends TelegramBot {
  constructor() {
    super();
  }

  async initCtx(ctx) {
    ctx.session ??= {
      state: "idle",
      firstName: "John",
      lastName: "Sina",
      age: 50,
    };
  }

  async getCommandsMenu(ctx) {
    return [
      { command: "/help", description: ctx.i18n.t("commands.help") },
      { command: "/name", description: ctx.i18n.t("commands.name") },
      { command: "/change", description: ctx.i18n.t("commands.change") },
      { command: "/state", description: ctx.i18n.t("commands.state") },
    ];
  }

  async replyHelp(ctx) {
    await ctx.replyWithHTML(
      ctx.i18n.t("help"),
      Markup.inlineKeyboard([
        Markup.button.callback(ctx.i18n.t("buttons.name"), "name"),
        Markup.button.callback(ctx.i18n.t("buttons.change"), "change"),
        Markup.button.callback(ctx.i18n.t("buttons.state"), "state"),
        Markup.button.callback(ctx.i18n.t("buttons.help"), "help"),
      ])
    );
  }

  async errorHandler(error) {
    console.log("!!!!", error, "!!!!");
  }

  async init(params) {
    await super.init(params);

    this.userNameScene = new UserNameScene();
    this.bot.use(new Scenes.Stage([this.userNameScene.init()]).middleware());

    this.bot.command("state", (ctx, next) => {
      let t = ctx.session.state;
      return ctx.replyWithHTML(ctx.i18n.t("on.state", { t }));
    });

    this.bot.action("state", async (ctx, next) => {
      let t = ctx.session.state;
      return ctx.replyWithHTML(ctx.i18n.t("on.state", { t }));
    });

    this.bot.command("change", async (ctx, next) => {
      return this.userNameScene.start(ctx);
    });

    this.bot.action("change", async (ctx, next) => {
      return this.userNameScene.start(ctx);
    });

    this.bot.command("name", async (ctx, next) => {
      let { firstName: f, lastName: l, age: a } = ctx.session;
      return ctx.replyWithHTML(ctx.i18n.t("on.name", { f, l, a }));
    });

    this.bot.action("name", async (ctx, next) => {
      let { firstName: f, lastName: l, age: a } = ctx.session;
      return ctx.replyWithHTML(ctx.i18n.t("on.name", { f, l, a }));
    });

    this.bot.on(message("sticker"), (ctx) => {
      if (ctx.update?.message?.sticker?.emoji) {
        return ctx.reply(ctx.update.message.sticker.emoji);
      } else {
        return ctx.reply("🤷‍♂️");
      }
    });

    const captionReply = async (ctx) => {
      if (ctx.message?.caption) {
        let t = ctx.message.caption;
        return ctx
          .replyWithHTML(ctx.i18n.t("on.caption", { t }))
          .catch(this.errorHandler);
      }
      return null;
    };

    this.bot.on(message("audio"), async (ctx) => {
      if (ctx.update?.message?.audio) {
        let t = ctx.update.message.audio.title ?? ctx.i18n.t("nobodyKnows");
        let p = ctx.update.message.audio.performer ?? ctx.i18n.t("nobodyKnows");
        let reply = await ctx.replyWithHTML(ctx.i18n.t("on.audio", { t, p }));
        let caption = captionReply(ctx);
        return caption ? caption : reply;
      } else {
        return ctx.reply("🤷‍♂️");
      }
    });
    this.bot.on(message("contact"), async (ctx) => {
      if (ctx.update?.message?.contact) {
        let f =
          ctx.update.message.contact.first_name ?? ctx.i18n.t("nobodyKnows");
        let l =
          ctx.update.message.contact.last_name ?? ctx.i18n.t("nobodyKnows");
        let reply = await ctx.replyWithHTML(ctx.i18n.t("on.contact", { f, l }));
        let caption = captionReply(ctx);
        return caption ? caption : reply;
      } else {
        return ctx.reply("🤷‍♂️");
      }
    });

    const otherFormatsReply = async (ctx) => {
      if (ctx?.chat?.type === "group") return;
      let reply = await ctx
        .replyWithHTML(ctx.i18n.t("on.unknown"))
        .catch(this.errorHandler);
      let caption = captionReply(ctx);
      return caption ? caption : reply;
    };

    this.bot.on(message("animation"), otherFormatsReply);
    this.bot.on(message("document"), otherFormatsReply);
    this.bot.on(message("dice"), otherFormatsReply);
    this.bot.on(message("game"), otherFormatsReply);
    this.bot.on(message("location"), otherFormatsReply);
    this.bot.on(message("photo"), otherFormatsReply);
    this.bot.on(message("venue"), otherFormatsReply);
    this.bot.on(message("video"), otherFormatsReply);
    this.bot.on(message("video_note"), otherFormatsReply);
    this.bot.on(message("voice"), otherFormatsReply);

    this.bot.hears(/✖️ .+/, async (ctx) => {
      return ctx
        .replyWithHTML(ctx.i18n.t("on.canceled"), Markup.removeKeyboard())
        .catch(this.errorHandler);
    });

    this.bot.hears(/^\.\.\./, (ctx) => {
      if (ctx?.chat?.type === "group") {
        return ctx
          .replyWithHTML(ctx.i18n.t("on.test"), Markup.removeKeyboard())
          .catch(this.errorHandler);
      } else {
        return ctx
          .replyWithHTML(ctx.i18n.t("on.test"), Markup.removeKeyboard())
          .catch(this.errorHandler);
      }
    });

    this.bot.on(message("text"), async (ctx) => {
      await ctx
        .replyWithHTML(ctx.i18n.t("on.message"))
        .catch(this.errorHandler);
      return await ctx
        .replyWithHTML(ctx.update.message.text, Markup.removeKeyboard())
        .catch(this.errorHandler);
    });

    this.bot.use(async (ctx, next) => {
      console.time(`Processing update ${ctx.update.update_id}`);
      await next();
      console.timeEnd(`Processing update ${ctx.update.update_id}`);
    });
  }
}

export default AiApiBot;
