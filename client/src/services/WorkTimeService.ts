import http from "@/HttpClient.ts";

/* eslint-disable */
class WorkTimeService {
  getAll(): Promise<any> {
    return http.get("/work-time");
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
