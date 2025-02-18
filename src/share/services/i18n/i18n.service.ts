import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18nService {
  private translations: Record<string, any> = {};

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations() {
    const localesPath = path.resolve(process.cwd(), './src/locales');

    ['en', 'es'].forEach((lang) => {
      const filePath = path.join(localesPath, `${lang}.json`);
      if (fs.existsSync(filePath)) {
        this.translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } else {
        console.error(`⚠️ Translations not founded into: ${filePath}`);
      }
    });
  }

  translate(
    lang: string,
    key: string,
    variables?: Record<string, any>,
  ): string {
    const defaultLang = 'en';

    console.log(`🔍 Buscando traducción: lang=${lang}, key=${key}`);

    let translation = this.translations[lang];

    key.split('.').forEach((part) => {
      translation = translation?.[part];
    });

    if (!translation) {
      console.warn(`⚠️ No se encontró traducción para ${key}, usando inglés`);
      translation = this.translations[defaultLang];

      key.split('.').forEach((part) => {
        translation = translation?.[part];
      });
    }

    if (!translation) {
      console.error(`❌ No se encontró ninguna traducción para ${key}`);
      return key;
    }

    if (variables) {
      return Object.keys(variables).reduce(
        (text, varKey) => text.replace(`{${varKey}}`, variables[varKey]),
        translation,
      );
    }

    return translation;
  }
}
