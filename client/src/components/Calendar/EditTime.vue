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
        <el-button type="primary" size="mini" @click="save">confirm</el-button>
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
import { defineComponent, ref, computed, PropType } from "vue";
import { ElButton, ElPopover, ElTimePicker } from "element-plus";
import { IDayData } from "@/models/CalendarModel";

export default defineComponent({
  name: "EditTime",

  components: {
    ElButton,
    ElPopover,
    ElTimePicker,
  },
  props: {
    dayData: {
      type: Object as PropType<IDayData>,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    defaultTime: {
      type: Date,
    },
  },
  emits: ["save"],
  
  setup(props, { emit }) {
    let visible = ref(false);
    let time_ = ref(null);

    const time: IDayData = computed({
      get: () => time_.value || props.dayData.time || props.defaultTime,
      set: (val) => {
        time_.value = val;
      },
    });

    function save(): void {
      emit("save", { ...props.dayData, time: time.value });
      visible.value = false;
    }

    return {
      visible,
      time,
      save,
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
