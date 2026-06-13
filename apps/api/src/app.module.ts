import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { GroupsController } from './groups/groups.controller';
import { MatchesController } from './matches/matches.controller';
import { HealthController } from './health.controller';
import { ScheduleRepository } from './schedule.repository';
import { ScoreSyncController } from './score-sync/score-sync.controller';
import { ScoreSyncService } from './score-sync/score-sync.service';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  controllers: [HealthController, GroupsController, MatchesController, ScoreSyncController],
  providers: [ScheduleRepository, ScoreSyncService]
})
export class AppModule {}
