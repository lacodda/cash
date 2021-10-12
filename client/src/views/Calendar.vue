<template>
  <el-main>
    <calendar v-loading="loading" :data="data" @save="save" />
  </el-main>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMain } from "element-plus";
import Calendar from "@/components/Calendar/Calendar";
import { IDayData } from "@/models/CalendarModel";

export default defineComponent({
  components: {
    ElMain,
    Calendar,
  },
  setup() {
    const store = useStore();
    const data = computed(() => store.state.workTime.data);
    const loading = computed(() => store.state.workTime.loading.data);

    onMounted(async () => {
      store.dispatch("workTime/fetch");
    });

    async function save(dayData: IDayData): Promise<void> {
      await store.dispatch("workTime/createOrUpdate", dayData);
      await store.dispatch("workTime/fetch");
    }

    return { data, loading, save };
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
