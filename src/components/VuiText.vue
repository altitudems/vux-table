<template lang="pug">
	span(v-if="value") {{ value }}
</template>

<script>
export default {
  name: 'vui-text',
  props: {
    value: {
      required: false,
      default: null
    }
  }
}
</script>

<style>
  /* No styles */
</style>
