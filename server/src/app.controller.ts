import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { GlobalGuard } from './guards/global.guard';

@Controller()
@UseGuards(GlobalGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }
}
