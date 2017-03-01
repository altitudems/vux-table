<template lang="pug">
  tr(v-if="value", class="vui-table-row", :class="{ 'is-selected': isSelected }")
    th.vui-select-column(v-if="isSelectable")
      input(type="checkbox", :checked="isSelected", @click="$emit('row-select-toggle', value)")
    td(v-for="column in columns", v-if="!column.isHidden")
      vui-cell(v-model="value[column.key]", :column="column")
    td
      slot
</template>

<script>
  import VuiCell from './VuiCell'

  export default {
    name: 'VuiRow',
    props: {
      value: {
        type: Object
      },
      columns: {
        type: Array,
        required: true
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
    components: { VuiCell }
  }
</script>
