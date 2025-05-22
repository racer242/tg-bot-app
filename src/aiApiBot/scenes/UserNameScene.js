import { message } from "telegraf/filters";

const { Composer, Scenes } = require("telegraf");

class UserNameScene {
  constructor() {}

  init() {
    const first_handler = new Composer();
    const last_handler = new Composer();
    const exit = new Composer();

    first_handler.hears(/.+/, async (ctx) => {
      await ctx.replyWithHTML(ctx.i18n.t("enter.firstName"));
      return ctx.wizard.next();
    });

    last_handler.hears(/.+/, async (ctx) => {
      ctx.wizard.state.firstName = ctx.message.text;
      await ctx.replyWithHTML(ctx.i18n.t("enter.lastName"));
      return ctx.wizard.next();
    });

    exit.on(message("text"), async (ctx) => {
      ctx.wizard.state.lastName = ctx.message.text;
      let f = ctx.wizard.state.firstName;
      let l = ctx.wizard.state.lastName;
      await ctx.replyWithHTML(ctx.i18n.t("on.name", { f, l }));
      ctx.session.firstName = f;
      ctx.session.lastName = l;
      return ctx.scene.leave();
    });

    const wizard_scene = new Scenes.WizardScene(
      "wizard_scene",
      first_handler,
      last_handler,
      exit
    );
    return new Scenes.Stage([wizard_scene]);
  }

  async start(ctx, next) {
    return ctx.scene.enter("wizard_scene");
  }
}
export default UserNameScene;
