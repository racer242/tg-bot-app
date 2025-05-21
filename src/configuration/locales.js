const locales = {
  en: {
    isDefault: true,
    start: `👋 Hello! I'm a AIAPI bot 🤖!`,
    help: `How can I help you man? 🥸`,
    buttons: {
      name: "Get name",
      change: "Change name",
      help: "Help",
      state: "Get state",
    },
    commands: {
      name: "Get name",
      change: "Change name",
      help: "Help",
      state: "Get state",
    },
    on: {
      audio:
        "This is audio: 🎶 Title <code>${t}</code> \n🎸 Performer <code>${p}</code>",
      contact: "This is contact: 🐵 First name\n${f}\n\n🙈 Last name\n${l }",
      unknown: "🤷‍♂️ Can't say anything about this attachment yet...",
      canceled: "✖️ Canceled!",
      test: "THIS IS TEST!",
      caption:
        "☝️ By the way, a comment has been added to the attachment:\n${t}",
    },
  },
  ru: {
    start: `👋 Привет! Я AIAPI бот 🤖!`,
    help: `Чем тебе помочь, человек❓`,
    buttons: {
      name: "Get name",
      change: "Change name",
      help: "Help",
      state: "Get state",
    },
    commands: {
      name: "Get name",
      change: "Change name",
      help: "Help",
      state: "Get state",
    },
    on: {
      state: "",
      audio:
        "This is audio: 🎶 Title <code>${t}</code> \n🎸 Performer <code>${p}</code>",
      contact: "This is contact: 🐵 First name\n${f}\n\n🙈 Last name\n${l }",
      unknown: "🤷‍♂️ Can't say anything about this attachment yet...",
      canceled: "✖️ Canceled!",
      test: "THIS IS TEST!",
      caption:
        "☝️ By the way, a comment has been added to the attachment:\n${t}",
    },
  },
};

export default locales;
