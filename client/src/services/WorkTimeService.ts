import http from '@/http-client';
import { IFetchParams } from '@/models/calendar.model';

/* eslint-disable */
class WorkTimeService {
  async getAll(params: IFetchParams): Promise<any> {
    return http.get(`/v1/work-time`, { params });
  }

  async get(id: string): Promise<any> {
    return http.get(`/v1/work-time/${id}`);
  }

  async create(data: any): Promise<any> {
    return http.post(`/v1/work-time`, data);
  }

  async update(id: any, data: any): Promise<any> {
    return http.patch(`/v1/work-time/${id}`, data);
  }

  async delete(id: any): Promise<any> {
    return http.delete(`/v1/work-time/${id}`);
  }

  async deleteAll(): Promise<any> {
    return http.delete(`/v1/work-time`);
  }
}

export default new WorkTimeService();
