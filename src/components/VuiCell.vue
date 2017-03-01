<template lang="pug">
  component(v-if="component", :is="component", v-model="value")
  div(v-else, v-html="value")
</template>

<script>
  export default {
    name: 'VuiCell',
    props: {
      value: {
        required: true
      },
      column: {
        type: Object,
        required: false
      }
    },
    computed: {
      component () {
        if (this.column) {
          return this.column.displayComponent || null
        }
      }
    }
  }
</script>
