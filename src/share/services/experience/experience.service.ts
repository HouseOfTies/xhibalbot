import { Injectable } from '@nestjs/common';

@Injectable()
export class ExperienceService {
  getRequiredExp(level: number): number {
    return Math.floor(50 * Math.pow(level, 2) + 50 * Math.pow(level, 1.5));
  }
}
