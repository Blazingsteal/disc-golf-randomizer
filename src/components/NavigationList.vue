<template>
  <v-navigation-drawer
    :floating="true"
    v-model="navStore.navBar"
    :temporary="true"
    location="left"
  >
    <v-list density="comfortable" variant="elevated">
      <v-list-item
        v-for="(path, i) in paths"
        :key="i"
        :active="path.index === selected"
        variant="flat"
        color="primary-selected"
        :prepend-icon="path.icon"
        class="text-subtitle-1"
        @click="path.action()"
      >
        <v-list-item-title>{{ path.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {navStore} from "@/store/navStore"

const selected = ref(0);
const visibility = ref(true);
const paths = ref([
  {
    name: "Wheel selector", index: 0, icon: "mdi-disc", action() {
      selected.value = this.index;
      navStore.currentMode = this.index;
    }
  },
  {
    name: "Shot selector", index: 1, icon: "mdi-strategy", action() {
      selected.value = this.index;
      navStore.currentMode = this.index;
    }
  },
  {
    name: "Disc selector", index: 2, icon: "mdi-disc", action() {
      selected.value = this.index;
      navStore.currentMode = this.index;
    }
  },
  {
    name: "Putting style selector", index: 3, icon: "mdi-disc", action() {
      selected.value = this.index;
      navStore.currentMode = this.index;
    }
  },
  {
    name: "All", index: 4, icon: "mdi-all-inclusive", action() {
      selected.value = this.index;
      navStore.currentMode = this.index;
    }
  },
  {
    name: "Settings", index: 5, icon: "mdi-wrench", action() {
      navStore.showSettings = true;
    }
  }
]);

</script>


<style scoped>

</style>