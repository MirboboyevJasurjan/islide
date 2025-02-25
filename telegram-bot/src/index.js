import { Bot, session } from "grammy"; // GrammY kutubxonasi
import { config } from "dotenv"; // .env uchun
import axios from "axios"; // Backend bilan bog‘lanish uchun
import { languageKeyboard } from "./keyboards.js"; // Til tanlash uchun klaviatura
import { languages } from "./languages.js"; // Tilga mos matnlar

// .env faylni o‘qish
config();

const botToken = process.env.BOT_TOKEN || "7793318007:AAFzak44vGv_fdDrtyfzVb2r5GhZKJCptNs";
const bot = new Bot(botToken); // Botni yaratish

// Sessiyani sozlash
bot.use(session({ initial: () => ({ step: null, data: {} }) }));

// Foydalanuvchi tilini saqlash
const userLanguages = new Map();

// Start komandasi - Bot ishga tushishi bilan boshlanadi
bot.command("start", async (ctx) => {
    console.log("Start command received");
    const userLang = userLanguages.get(ctx.from.id) || "uz";
    const langMessages = languages[userLang];
    ctx.session.step = "ask_language"; // Qadamni belgilash
    // Til tanlash uchun xabar yuborish
    await ctx.reply(
        `${langMessages.welcome}\n\n${langMessages.choose_language}`,
        { reply_markup: languageKeyboard }
    );
});

// Tilni tanlash uchun callback query
bot.callbackQuery(/^lang_(.+)$/, async (ctx) => {
    console.log("Language selection callback received");
    const lang = ctx.match[1]; // Masalan: en, ru, uz
    userLanguages.set(ctx.from.id, lang);
    ctx.session.data.language = lang; // Sessiyada saqlash
    await ctx.answerCallbackQuery();
    const langMessages = languages[lang];
    // Foydalanuvchidan ism va familiyasini so‘rash
    await ctx.reply(`${langMessages.name_prompt}`);
    ctx.session.step = "ask_name"; // Keyingi qadam
});

// Javoblarni qabul qilish va sessiyada saqlash
bot.on("message:text", async (ctx) => {
    console.log("Text message received");
    const step = ctx.session.step;
    if (step === "ask_name") {
        ctx.session.data.name = ctx.message.text;
        await ctx.reply("Endi taqdimot mavzusini kiriting:");
        ctx.session.step = "ask_topic";
    } else if (step === "ask_topic") {
        ctx.session.data.topic = ctx.message.text;
        await ctx.reply("Slaydlar sonini tanlang (10 va 20 orasida son kiriting):");
        ctx.session.step = "ask_slide_count";
    } else if (step === "ask_slide_count") {
        const slideCount = parseInt(ctx.message.text, 10);
        if (!isNaN(slideCount) && slideCount >= 10 && slideCount <= 20) {
            ctx.session.data.slidesCount = slideCount;
            await ctx.reply("Quyidagi dizaynlardan birini tanlang:", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Minimal Dizayn", callback_data: "template1" }],
                        [{ text: "Modern Dizayn", callback_data: "template2" }],
                    ],
                },
            });
            ctx.session.step = "choose_template";
        } else {
            await ctx.reply("Iltimos, 10 va 20 orasidagi sonni kiriting.");
        }
    }
});

// Dizaynni tanlash
bot.callbackQuery(/^template(\d+)$/, async (ctx) => {
    console.log("Template selection callback received");
    ctx.session.data.template = ctx.match[1]; // Tanlangan template ID
    await ctx.answerCallbackQuery();
    await ctx.reply(
        `Siz "${ctx.session.data.template}" dizaynini tanladingiz. Ma'lumotlaringiz to‘liq yig‘ildi.`
    );
    // Ma'lumotlarni tasdiqlash
    const userData = ctx.session.data;
    await ctx.reply(
        `Tasdiqlang:
        - Ism: ${userData.name}
        - Til: ${userData.language}
        - Mavzu: ${userData.topic}
        - Slaydlar soni: ${userData.slidesCount}
        - Dizayn: ${userData.template}
        
        Prezentatsiyani yaratishni boshlash uchun /generate buyrug'ini yuboring.`
    );
    ctx.session.step = "ready_to_generate"; // Keyingi bosqich
});

// /generate komandasida backendga so‘rov yuborish
bot.command("generate", async (ctx) => {
  console.log("Generate command received");
  if (ctx.session.step === "ready_to_generate") {
      const userData = ctx.session.data; // Foydalanuvchi ma'lumotlari
      console.log("Sending data to backend:", userData); // Log the data being sent

      try {
          console.log("Before axios.post"); // Add this log
          const response = await axios.post("http://localhost:3000/generate-pptx", userData); // Backend URL
          console.log("After axios.post"); // Add this log
          console.log("Backend response:", response.data); // Log the backend response

          const pptxFile = response.data.file; // Backenddan qaytgan fayl
          if (!pptxFile) {
              throw new Error("No file received from backend");
          }

          // Foydalanuvchiga tayyor faylni yuborish
          await ctx.replyWithDocument({
              source: pptxFile,
              filename: "Your_Presentation.pptx",
          });
      } catch (error) {
          console.error("Xatolik:", error);
          let errorMessage = "Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.";
          if (error.response && error.response.data) {
              errorMessage = `Server xatoligi: ${error.response.data.message}`;
          }
          await ctx.reply(errorMessage);
      }
  } else {
      await ctx.reply("Iltimos, avval barcha ma'lumotlarni kiriting!");
  }
});

// Botni boshlash
console.log("Bot is starting...");
bot.start();