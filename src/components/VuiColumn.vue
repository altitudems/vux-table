<template lang="pug">
  td(:colspan="span")
    component(v-if="component", :is="component", v-bind:value="value", @input="onInput")
    template(v-else)
      | {{value}}
      slot
</template>

<script>
  export default {
    name: 'VuiColumn',
    props: {
      value: {
        default: '',
        required: false
      },
      isEditing: {
        default: false,
        isRequired: false
      },
      displayComponent: {
        default: null,
        required: false
      },
      editComponent: {
        default: null,
        required: false
      },
      span: {
        default: 1,
        required: false
      }
    },
    computed: {
      component () {
        if (this.isEditing) {
          return this.editComponent || null
        } else {
          return this.displayComponent || null
        }
      }
    },
    methods: {
      onInput (value) {
        this.$emit('input', value)
      }
    }
  }
</script>

<style>
  /* No styles */
</style>
