import * as $R from 'ramda';
import http from '@/http-client';
import { IFetchParams } from '@/models/calendar.model';
import { Dates } from '@/helpers';

/* eslint-disable */
class StatisticsService {
  async getWorkTime(fetchParams: IFetchParams): Promise<any> {
    const params = $R.map(Dates.formatISO)(fetchParams);
    return http.get(`/v1/statistics/work-time`, { params });
  }
}

export default new StatisticsService();
