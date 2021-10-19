import { createStore } from 'vuex';
import workTime from './work-time';

export default createStore({
  modules: {
    workTime,
  },
});
