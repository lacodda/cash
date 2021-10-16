<template>
  <el-scrollbar height="100vh">
    <nav-menu />
    <el-main>
      <router-view />
    </el-main>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import { ElScrollbar, ElMain } from "element-plus";
import NavMenu from "@/components/NavMenu/NavMenu";

export default defineComponent({
  components: {
    ElScrollbar,
    ElMain,
    NavMenu,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap");

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "Open Sans", sans-serif;
  color: #2c3e50;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}
</style>
