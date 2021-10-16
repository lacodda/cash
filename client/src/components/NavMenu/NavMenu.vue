<template>
  <el-header>
    <el-menu
      :default-active="activeIndex"
      class="el-menu__navmenu"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="(item, key) in menu"
        :key="key"
        :index="item.index"
        >{{ item.name }}</el-menu-item
      >
    </el-menu>
  </el-header>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMenuItem, ElHeader, ElMenu, ElSubMenu } from "element-plus";
import { useI18n } from "vue-i18n";
import * as $R from "ramda";

export default defineComponent({
  components: {
    ElMenuItem,
    ElHeader,
    ElMenu,
    ElSubMenu,
  },

  setup() {
    const { t } = useI18n();

    const menu = [
      { index: "home", name: t("menu.home") },
      { index: "calendar", name: t("menu.calendar") },
      { index: "statistics", name: t("menu.statistics") },
    ];

    const activeIndex = ref("");
    const router = useRouter();
    const route = useRoute();

    watch(route, (value) => {
      if (value && $R.find($R.propEq("index", value.name), menu)) {
        activeIndex.value = value.name.toString();
      }
    });

    const handleSelect = (name, keyPath) => {
      router.push({ name });
    };
    return {
      menu,
      activeIndex,
      handleSelect,
      t,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-menu {
  &__navmenu {
    user-select: none;
  }
}
</style>
