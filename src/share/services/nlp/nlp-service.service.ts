/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, OnModuleInit } from '@nestjs/common';
import { dockStart } from '@nlpjs/basic';

@Injectable()
export class NlpServiceService implements OnModuleInit {
  private nlp: any;

  // Esta función se ejecuta cuando el módulo se inicializa
  async onModuleInit() {
    const dock = await dockStart();
    this.nlp = dock.get('nlp');
    await this.nlp.train();
    console.log('NLP model trained and ready!');
  }

  // Función para procesar mensajes usando nlp.js
  async processMessage(language: string, message: string) {
    if (!this.nlp) {
      throw new Error('NLP model is not initialized.');
    }
    return await this.nlp.process(language, message);
  }
}
