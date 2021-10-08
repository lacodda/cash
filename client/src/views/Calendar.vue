<template>
  <el-main>
    <calendar v-loading="loading" :data="data" />
  </el-main>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { ElMain } from "element-plus";
import Calendar from "@/components/Calendar/Calendar";
import { useStore } from "vuex";

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
      await store.dispatch("workTime/fetch");
    });

    return { data, loading };
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
