<template>
  <el-header>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="home">Home</el-menu-item>
      <el-menu-item index="calendar">Calendar</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMenuItem, ElHeader, ElMenu, ElSubMenu } from "element-plus";

export default defineComponent({
  components: {
    ElMenuItem,
    ElHeader,
    ElMenu,
    ElSubMenu,
  },
  setup() {
    const activeIndex = ref("home");
    const router = useRouter();
    const route = useRoute();

    const handleSelect = (name, keyPath) => {
      router.push({ name });
    };
    return {
      activeIndex,
      handleSelect,
    };
  },
});
</script>
