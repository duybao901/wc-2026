import { Controller, Get, Post } from '@nestjs/common';
import { ScoreSyncService } from './score-sync.service';

@Controller('score-sync')
export class ScoreSyncController {
  constructor(private readonly scoreSync: ScoreSyncService) {}

  @Get('status')
  status() {
    return this.scoreSync.getStatus();
  }

  @Post('run')
  run() {
    return this.scoreSync.syncOnce();
  }
}
