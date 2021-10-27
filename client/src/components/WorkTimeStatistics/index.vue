<template>
  <el-card shadow="never" class="statistics__card">
    <template #header>
      <div class="card-header">
        <span>Card name!</span>
        <!-- <el-button class="button" type="text">Operation button</el-button> -->
      </div>
    </template>
    <div class="statistics__body">
      {{ statistics.timeSum }}
    </div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { ElCard } from 'element-plus';
import { secondsToHours } from 'date-fns/fp';
import { IWorkTimeStatistics } from '@/models/statistics.model';

function transformData(statistics: IWorkTimeStatistics) {
  return {
    timeSum: secondsToHours(statistics.timeSum),
  };
}

export default defineComponent({
  components: { ElCard },
  props: {
    data: {
      type: IWorkTimeStatistics,
    },
  },

  setup(props) {
    const statistics = computed(() => transformData(props.data));
    return { statistics };
  },
});
</script>
<style lang="scss" scoped>
.statistics {
  &__card {
    height: 100%;
  }
}
</style>
