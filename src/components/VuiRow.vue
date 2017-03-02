<template lang="pug">
  tr(class="vui-table-row", :class="{ 'is-selected': isSelected, 'is-editing': isEditing, 'is-edited': isEdited  }")
    th.vui-select-column(v-if="isSelectable && value")
      input(type="checkbox", :checked="isSelected", @click="$emit('row-select-toggle', value)")
    template(v-for="column in columns", v-if="!column.isHidden")
      vui-column(
        :value="dirtyValue ? dirtyValue[column.key] : value[column.key]",
        :isEditing="isEditing",
        :displayComponent="column.displayComponent",
        :editComponent="column.editComponent",
        :span="column.span",
        @input="onColumnInput($event, value[column.key], column)"
      )
    slot
</template>

<script>
  import VuiColumn from './VuiColumn'

  export default {
    name: 'VuiRow',
    props: {
      value: {
        type: Object,
        required: false
      },
      dirtyValue: {
        type: Object,
        required: false
      },
      columns: {
        type: Array,
        required: false,
        default: () => []
      },
      isEditable: {
        type: Boolean,
        default: false
      },
      isEditing: {
        type: Boolean,
        default: false
      },
      isSelectable: {
        type: Boolean,
        default: false
      },
      isSelected: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isEdited () { return typeof this.dirtyValue !== 'undefined' && this.dirtyValue !== null }
    },
    methods: {
      onColumnInput (newValue, oldValue, column) {
        const dirtyValue = { ...this.value }
        dirtyValue[column.key] = newValue
        this.$emit('input', dirtyValue)
      }
    },
    components: { VuiColumn }
  }
</script>

<style>
  /* No styles */
</style>
