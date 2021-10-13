import http from "@/HttpClient";
import { IFetchParams } from "@/models/CalendarModel";

/* eslint-disable */
class WorkTimeService {
  getAll(params: IFetchParams): Promise<any> {
    return http.get("/work-time", { params });
  }

  get(id: string): Promise<any> {
    return http.get(`/work-time/${id}`);
  }

  create(data: any): Promise<any> {
    return http.post("/work-time", data);
  }

  update(id: any, data: any): Promise<any> {
    return http.put(`/work-time/${id}`, data);
  }

  delete(id: any): Promise<any> {
    return http.delete(`/work-time/${id}`);
  }

  deleteAll(): Promise<any> {
    return http.delete(`/work-time`);
  }
}

export default new WorkTimeService();
