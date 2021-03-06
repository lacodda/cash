<template>
  <calendar
    v-loading="loading"
    :data="data"
    @save="save"
    @remove="remove"
    @selectMonth="selectMonth"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import Calendar from "@/components/Calendar/Calendar";
import { IDayData, IFetchParams } from "@/models/calendar.model";

export default defineComponent({
  components: {
    Calendar,
  },

  setup() {
    const store = useStore();
    const data = computed(() => store.state.workTime.data);
    const loading = computed(() => store.state.workTime.loading.data);
    const savedParams = ref({});

    function selectMonth(params: IFetchParams) {
      savedParams.value = params;
      store.dispatch("workTime/fetch", params);
    }

    async function save(dayData: IDayData): Promise<void> {
      await store.dispatch("workTime/createOrUpdate", dayData);
      await store.dispatch("workTime/fetch", savedParams.value);
    }

    async function remove(dayData: IDayData): Promise<void> {
      if (!dayData._id) {
        return;
      }
      await store.dispatch("workTime/delete", dayData);
      await store.dispatch("workTime/fetch", savedParams.value);
    }

    return { data, loading, selectMonth, save, remove };
  },
});
</script>
<style lang="scss" scoped>
.loading {
  position: absolute !important;
  height: 100%;
  width: 100%;
}
</style>
