import { Injectable } from '@nestjs/common';

@Injectable()
export class ExperienceService {
  /**
   * Calcula la experiencia requerida para subir de nivel general.
   * Fórmula: 50 * level^2 + 50 * level^1.5
   */
  getRequiredExp(level: number): number {
    return Math.floor(50 * Math.pow(level, 2) + 50 * Math.pow(level, 1.5));
  }

  /**
   * Calcula la experiencia requerida para subir de nivel en minería.
   * Fórmula: 30 * miningLevel^1.8
   */
  getRequiredMiningExp(miningLevel: number): number {
    return Math.floor(30 * Math.pow(miningLevel, 1.8));
  }

  /**
   * Calcula la experiencia requerida para subir de nivel en magia.
   * Fórmula: 40 * magicLevel^2 + 60 * magicLevel^1.5
   */
  getRequiredMagicExp(magicLevel: number): number {
    return Math.floor(
      40 * Math.pow(magicLevel, 2) + 60 * Math.pow(magicLevel, 1.5),
    );
  }

  /**
   * Calcula la experiencia requerida para subir de nivel en habilidades de combate (puño, espada, distancia, defensa).
   * Fórmula: 25 * skillLevel^2 + 30 * skillLevel^1.7
   */
  getRequiredSkillExp(skillLevel: number): number {
    return Math.floor(
      25 * Math.pow(skillLevel, 2) + 30 * Math.pow(skillLevel, 1.7),
    );
  }
}
