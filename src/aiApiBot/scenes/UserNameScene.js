import { message } from "telegraf/filters";

const { Composer, Scenes, Markup } = require("telegraf");

class UserNameScene {
  constructor() {}

  init() {
    const first_handler = async (ctx) => {
      await ctx.replyWithHTML(ctx.i18n.t("enter.firstName"));
      return ctx.wizard.next();
    };

    const last_handler = async (ctx) => {
      ctx.wizard.state.firstName = ctx.message.text;
      await ctx.replyWithHTML(ctx.i18n.t("enter.lastName"));
      return ctx.wizard.next();
    };

    const age_handler = async (ctx) => {
      ctx.wizard.state.lastName = ctx.message.text;
      await ctx.replyWithHTML(
        ctx.i18n.t("enter.age"),
        Markup.inlineKeyboard([
          Markup.button.callback(ctx.i18n.t("buttons.back"), `reLastName`),
        ])
      );
      return ctx.wizard.next();
    };

    const exit = new Composer();
    exit.on(message("text"), async (ctx) => {
      ctx.wizard.state.age = ctx.message.text;
      console.log(ctx.wizard);

      let f = ctx.wizard.state.firstName;
      let l = ctx.wizard.state.lastName;
      let a = ctx.wizard.state.age;
      await ctx.replyWithHTML(ctx.i18n.t("on.name", { f, l, a }));
      ctx.session.firstName = f;
      ctx.session.lastName = l;
      ctx.session.age = a;
      return ctx.scene.leave();
    });

    const wizard_scene = new Scenes.WizardScene(
      "wizard_scene",
      first_handler,
      last_handler,
      age_handler,
      exit
    );

    wizard_scene.action("reLastName", async (ctx) => {
      await ctx.replyWithHTML(ctx.i18n.t("enter.lastName"));
      return ctx.wizard.back();
    });

    wizard_scene.use(async (ctx, next) => {
      // await ctx.replyWithHTML(ctx.i18n.t("on.test"));
      return next();
    });

    return wizard_scene;
  }

  async start(ctx, next) {
    return ctx.scene.enter("wizard_scene");
  }
}
export default UserNameScene;
