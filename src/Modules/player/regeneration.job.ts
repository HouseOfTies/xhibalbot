import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PlayerService } from '../player/player.service';

@Injectable()
export class RegenerationJob {
  constructor(private readonly playerService: PlayerService) {}

  @Interval(10 * 1000)
  async handleRegeneration() {
    await this.playerService.regenerateStats();
  }
}
