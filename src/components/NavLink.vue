<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, watch, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})

const route = useRoute()
const path = computed<string>(() => route.path)
const isActive = ref<boolean>(false)

const assignActive = (newPath: string): void => {
  newPath === props.link ? (isActive.value = true) : (isActive.value = false)
}

onMounted(async () => {
  assignActive(path.value)
})

watch(
  () => path.value,
  (newPath) => {
    assignActive(newPath)
  }
)
</script>
<template>
  <RouterLink
    :to="link"
    class="uppercase px-2 md:px-6 text-center text-[13px] md:text-[16px]"
    :class="isActive ? 'text-yellow' : 'opacity-70 text-white'"
    >{{ text }}</RouterLink
  >
</template>
