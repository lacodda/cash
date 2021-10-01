<template>
  <el-scrollbar height="100vh">
    <nav-menu />
    <router-view />
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import { ElScrollbar } from "element-plus";
import NavMenu from "@/components/NavMenu/NavMenu";

export default defineComponent({
  components: {
    ElScrollbar,
    NavMenu,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  color: #2c3e50;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
</style>
