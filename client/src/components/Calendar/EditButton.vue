<template>
  <el-popover placement="left-start" :width="160" v-model:visible="visible"
    ><div class="popover">
      <div class="popover__header">Time</div>
      <div class="popover__body">
        <el-time-picker v-model="time" placeholder="Time" />
      </div>
      <div class="popover__footer">
        <el-button size="mini" type="text" @click="visible = false"
          >cancel</el-button
        >
        <el-button type="primary" size="mini" @click="visible = false"
          >confirm</el-button
        >
      </div>
    </div>
    <template #reference>
      <transition name="fade">
        <el-button
          v-show="show || visible"
          icon="el-icon-edit"
          size="mini"
          circle
          @click="visible = true"
        ></el-button>
      </transition>
    </template>
  </el-popover>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import { ElButton, ElPopover, ElTimePicker, ElRow, ElCol } from "element-plus";
import * as $R from "ramda";

export default defineComponent({
  name: "EditButton",

  components: {
    ElButton,
    ElPopover,
    ElTimePicker,
    ElRow,
    ElCol,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    let visible = ref(false);
    const time = ref(new Date(2016, 9, 10, 9, 0));

    return {
      visible,
      time,
    };
  },
});
</script>

<style lang="scss">
.popover {
  display: grid;
  gap: 12px;
  &__header {
  }
  &__body {
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}
.el-date-editor {
  --el-date-editor-width: auto;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
