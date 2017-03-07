<template lang="pug">
	div(v-if="value") {{ usCurrency }}
</template>

<script>
export default {
  name: 'vux-currency',
  props: {
    value: {
      required: false,
      default: null
    }
  },
  computed: {
    usCurrency: function () {
      if (isNaN(this.value)) return this.value
      return '$' + Number(this.value).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
    }
  }
}
</script>

<style>
  /* No styles */
</style>
