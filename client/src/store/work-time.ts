import * as $R from "ramda";
import WorkTimeService from "@/services/WorkTimeService";

export const types = {
  SET_WORK_TIME_DATA: "SET_WORK_TIME_DATA",
  SET_LOADING: "SET_LOADING",
};

export default {
  state() {
    return {
      data: [],
      loading: {
        data: false,
      },
    };
  },
  getters: {},
  actions: {
    async fetch({ commit }) {
      commit(types.SET_LOADING, { data: true });

      const data = $R.pathOr(
        [],
        ["data", "data"],
        await WorkTimeService.getAll()
      );

      commit(types.SET_WORK_TIME_DATA, data);
      commit(types.SET_LOADING, { data: false });
    },
  },
  mutations: {
    [types.SET_WORK_TIME_DATA](state: any, payload: any) {
      state.data = payload;
    },
    [types.SET_LOADING](state: any, payload: any) {
      const data = $R.mergeDeepRight(state.loading, payload);
      state.loading = data;
    },
  },
  namespaced: true,
};
