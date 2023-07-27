<template>
  <v-app>
    <NavigationList/>
    <v-icon
      class="nav-control"
      :class="navStore.navBar ? 'opened' : 'closed'"
      :icon="navStore.navBar ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
      @click="navStore.navBar = !navStore.navBar"
      size="x-large"
    />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
import NavigationList from "@/components/NavigationList.vue";
import {navStore} from "@/store/navStore";
</script>

<style>
.nav-control {
  position: sticky;
  z-index: 100;
  left: 256px;
  top: 24px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgb(var(--v-theme-surface-1));
  border-radius: 0 8px 8px 0;
}

.nav-control:hover {
  background: rgb(var(--v-theme-surface-2));
}

.opened {
  transform: translateX(0%);
}

.closed {
  transform: translateX(-256px);
}
</style>