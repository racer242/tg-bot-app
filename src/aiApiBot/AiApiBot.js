import { Markup } from "telegraf"; // , Extra
import TelegramBot from "./TelegramBot";
import { message } from "telegraf/filters";

/**
 * [TelegramBot description]
 *
 */
class AiApiBot extends TelegramBot {
  constructor() {
    super();
  }

  async initCtx(ctx) {
    ctx.session ??= { state: "idle", name: "unknown" };
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

  async init(params) {
    await super.init(params);

    // this.bot.command("state", (ctx) => {
    //   let state = ctx.state.command?.splitArgs[0];
    //   ctx.session.state = state;
    //   ctx.replyWithHTML(ctx.i18n.t("on.caption", { t }));
    // });

    this.bot.command("state", (ctx) => {
      let t = state;
      ctx.replyWithHTML(ctx.i18n.t("on.caption", { t }));
    });

    this.bot.on(message("sticker"), (ctx) => {
      if (ctx.update?.message?.sticker?.emoji) {
        ctx.reply(ctx.update.message.sticker.emoji);
      } else {
        ctx.reply("🤷‍♂️");
      }
    });

    const captionReply = async (ctx) => {
      if (ctx.message?.caption) {
        let t = ctx.message.caption;
        ctx.replyWithHTML(ctx.i18n.t("on.caption", { t }));
      }
    };

    this.bot.on(message("audio"), async (ctx) => {
      if (ctx.update?.message?.audio) {
        let t = ctx.update.message.audio.title ?? ctx.i18n.t("nobodyKnows");
        let p = ctx.update.message.audio.performer ?? ctx.i18n.t("nobodyKnows");
        ctx.replyWithHTML(ctx.i18n.t("on.audio", { t, p }));
      } else {
        ctx.reply("🤷‍♂️");
      }
      captionReply(ctx);
    });
    this.bot.on(message("contact"), async (ctx) => {
      if (ctx.update?.message?.contact) {
        let f =
          ctx.update.message.contact.first_name ?? ctx.i18n.t("nobodyKnows");
        let l =
          ctx.update.message.contact.last_name ?? ctx.i18n.t("nobodyKnows");
        ctx.replyWithHTML(ctx.i18n.t("on.contact", { f, l }));
      } else {
        ctx.reply("🤷‍♂️");
      }
      captionReply(ctx);
    });

    const otherFormatsReply = async (ctx) => {
      if (ctx?.chat?.type === "group") return;
      ctx.replyWithHTML(ctx.i18n.t("on.unknown"));
      captionReply(ctx);
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
      ctx.replyWithHTML(ctx.i18n.t("on.canceled"), Markup.removeKeyboard());
    });

    this.bot.hears(/^\.\.\./, (ctx) => {
      if (ctx?.chat?.type === "group") {
        ctx.message.text = ctx.message.text.slice(3);
        ctx.replyWithHTML(ctx.i18n.t("on.test"), Markup.removeKeyboard());
      } else {
        ctx.replyWithHTML(ctx.i18n.t("on.test"), Markup.removeKeyboard());
      }
    });
  }
}

export default AiApiBot;
