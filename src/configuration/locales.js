const locales = {
  en: {
    isDefault: true,
    start: `👋 Hello! I'm a AIAPI bot 🤖!`,
    help: `How can I help you man? 🥸`,
    floodBlocked: `Not so fast! 👮‍♂️`,
    buttons: {
      name: "Get name",
      change: "Change name",
      help: "Help",
      state: "Get state",
      back: "Back",
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
      contact: "This is contact:\n\n🐵 First name\n${f}\n\n🙈 Last name\n${l }",
      unknown: "🤷‍♂️ Can't say anything about this attachment yet...",
      canceled: "✖️ Canceled!",
      test: "THIS IS TEST!",
      message: "THIS IS MESSAGE!",
      caption:
        "☝️ By the way, a comment has been added to the attachment:\n${t}",
      name: "Your name is:\n\n🐵 First name\n${f}\n\n🙈 Last name\n${l}\n\nage\n${a}",
      state: "☝️ Current state is:\n${t}",
    },
    enter: {
      firstName: "Enter your first name:",
      lastName: "Enter your last name:",
      age: "Enter your age:",
      reage: "Reenter your age:",
    },
  },
  ru: {
    start: `👋 Привет! Я AIAPI бот 🤖!`,
    help: `Чем тебе помочь, человек❓`,
    floodBlocked: `Not so fast! 👮‍♂️`,
    buttons: {
      name: "Get name",
      change: "Change name",
      help: "Help",
      state: "Get state",
      back: "Back",
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
      contact: "This is contact:\n\n🐵 First name\n${f}\n\n🙈 Last name\n${l}",
      unknown: "🤷‍♂️ Can't say anything about this attachment yet...",
      canceled: "✖️ Canceled!",
      test: "THIS IS TEST!",
      message: "THIS IS MESSAGE!",
      caption:
        "☝️ By the way, a comment has been added to the attachment:\n${t}",
      name: "Your name is:\n\n🐵 First name\n${f}\n\n🙈 Last name\n${l}\n\nage\n${a}",
      state: "☝️ Current state is:\n${t}",
    },
    enter: {
      firstName: "Enter your first name:",
      lastName: "Enter your last name:",
      age: "Enter your age:",
    },
  },
};

export default locales;
