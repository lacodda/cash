import { Injectable } from '@nestjs/common';
import { RangeDto } from '../dto';

import { WorkTimeService } from '../work-time/work-time.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly workTimeService: WorkTimeService) {}

  async getWorkTimeStatistics(dto: RangeDto) {
    const storages = await this.workTimeService.findAll(dto);
    return storages;
  }
}
