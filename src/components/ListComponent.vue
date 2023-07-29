<template>
  <v-row :dense="true">
    <v-col cols="12">
      <span class="text-h5">{{ props.title }}</span>
    </v-col>
    <v-col
      v-for="(item, idx) in items"
      cols="12"
      class="d-flex w-100"
    >
      <v-sheet width="100%">
        <v-text-field
          v-model="items[idx]"
          variant="outlined"
          density="compact"
          color="primary"
          :clearable="true"
          hide-details
        >
          <template #append>
            <v-btn
              variant="outlined"
              color="error"
              @click="$emit('deleteItem', idx)"
            >
              <v-icon icon="mdi-delete"/>
            </v-btn>
          </template>
        </v-text-field>
      </v-sheet>
    </v-col>
    <v-col cols="12" class="d-flex justify-center">
      <v-btn
        @click="$emit('newItem')"
        variant="outlined"
        color="primary"
        size="large"
      >
        <v-icon icon="mdi-plus"/>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: string[],
  title: string
}>();

defineEmits<{
  (e: "newItem"): void,
  (e: "deleteItem", index: number): void
}>();
</script>

<style scoped>

</style>