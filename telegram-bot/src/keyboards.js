import { InlineKeyboard } from 'grammy';

export const languageKeyboard = new InlineKeyboard()
  .text("English 🇬🇧", "lang_en")
  .text("Русский 🇷🇺", "lang_ru")
  .text("O'zbek 🇺🇿", "lang_uz");
