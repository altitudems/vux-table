<template lang="pug">
	div(v-if="value", v-html="value")
</template>

<script>
export default {
  name: 'vux-html',
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
