import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { ScheduleRepository } from '../schedule.repository';

interface UpdateResultBody {
  homeScore?: unknown;
  awayScore?: unknown;
}

@Controller('matches')
export class MatchesController {
  constructor(private readonly schedule: ScheduleRepository) {}

  @Get()
  getMatches(@Query('group') group?: string, @Query('date') date?: string) {
    return this.schedule.getMatches({ group, date });
  }

  @Patch(':fifaMatchNo/result')
  async updateResult(@Param('fifaMatchNo') fifaMatchNo: string, @Body() body: UpdateResultBody) {
    const matchNo = Number(fifaMatchNo);
    const homeScore = Number(body.homeScore);
    const awayScore = Number(body.awayScore);

    if (!Number.isInteger(matchNo) || matchNo <= 0) {
      throw new BadRequestException('fifaMatchNo must be a positive integer');
    }

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
      throw new BadRequestException('homeScore and awayScore must be non-negative integers');
    }

    const updated = await this.schedule.updateResult(matchNo, { homeScore, awayScore });

    if (!updated) {
      throw new NotFoundException(`Match ${matchNo} not found`);
    }

    return updated;
  }
}
