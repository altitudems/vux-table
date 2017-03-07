<template lang="pug">
  input(
    ref="input",
    type="text",
    v-bind:value="value",
    v-on:input="$emit('input', $event.target.value)")
</template>

<script>
export default {
  name: 'vux-text-input',
  props: {
    value: {
      required: false,
      default: ''
    }
  }
}
</script>

<style>
  /* No styles */
</style>
