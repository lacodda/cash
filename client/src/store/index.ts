import { createStore } from 'vuex';
import workTime from './work-time';
import statistics from './statistics';

export default createStore({
  modules: {
    workTime,
    statistics,
  },
});
