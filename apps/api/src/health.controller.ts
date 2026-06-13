import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'wc2026-api',
      timestamp: new Date().toISOString()
    };
  }
}
