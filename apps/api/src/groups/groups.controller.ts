import { Controller, Get } from '@nestjs/common';
import { ScheduleRepository } from '../schedule.repository';

@Controller('groups')
export class GroupsController {
  constructor(private readonly schedule: ScheduleRepository) {}

  @Get()
  getGroups() {
    return this.schedule.getGroups();
  }
}
