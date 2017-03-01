<template lang="pug">
  .vui-table-container
    table.vui-table(
      :class="{ 'is-bordered': isBordered, 'is-striped': isStriped, 'is-narrow': isNarrow }"
    )
      thead
        slot(name="thead-top")
        tr
          th.vui-select-column(v-if="isSelectable")
            input(type="checkbox", :checked="selectedRowKeys.length === value.length", @click="toggleAllRowSelections")
          th(v-for="column in columns", v-if="!column.isHidden")
            vui-column-header(:value="column", @vui-column-header-click="onColumnHeaderClick")
          th.vui-actions-column(v-if="$scopedSlots['row-actions-column']")
            | {{actionsLabel}}
        slot(name="thead-bottom")
      tbody
        vui-row(
          v-for="record in value",
          :key="valueKey",
          :value="record",
          :columns="columns",
          :isEditable="isEditable",
          :isEditing="isEditable && editingRowKeys.indexOf(record[valueKey]) > -1",
          :isSelectable="isSelectable",
          :isSelected="isSelectable && selectedRowKeys.indexOf(record[valueKey]) > -1",
          @row-select-toggle="onRowSelectToggle",
          @toggle-row-editing="onToggleRowEditing"
        )
          slot(
            name="row-actions-column",
            :record="record",
            :isEditable="isEditable",
            :isEditing="isEditable && editingRowKeys.indexOf(record[valueKey]) > -1",
            :isSelectable="isSelectable",
            :isSelected="isSelectable && selectedRowKeys.indexOf(record[valueKey]) > -1"
          )

        tr(v-if="value.length === 0")
          td(:colspan="columns.filter(t => !t.isHidden).length + 2")
            | No records to display
        slot
      tfoot
        slot(name="tfoot")
</template>

<script>
  import VuiColumnHeader from './components/VuiColumnHeader'
  import VuiRow from './components/VuiRow'
  import { sortAlphaNumeric } from './helpers/sort.js'

  export default {
    components: { VuiColumnHeader, VuiRow },
    props: {
      columns: {
        type: Array,
        default: () => [],
        required: false
      },
      value: {
        type: Array,
        default: () => [],
        required: true
      },
      valueKey: {
        type: String,
        required: true
      },
      isSelectable: {
        type: Boolean,
        default: false,
        required: false
      },
      isEditable: {
        type: Boolean,
        default: false,
        required: false
      },
      isNarrow: {
        type: Boolean,
        default: false,
        required: false
      },
      isBordered: {
        type: Boolean,
        default: false,
        required: false
      },
      isStriped: {
        type: Boolean,
        default: false,
        required: false
      },
      useDefaultSorting: {
        type: Boolean,
        default: true,
        required: false
      },
      actionsLabel: {
        type: String,
        default: 'Actions'
      }
    },
    data: () => ({
      selectedRowKeys: [],
      editingRowKeys: []
    }),
    computed: {
      sortingColumn () {
        return this.columns.find(c => c.isSorting)
      }
    },
    watch: {
      selectedRowKeys (newValue) {
        this.$emit('vui-row-selection-change', this.value.filter(v => this.selectedRowKeys.indexOf(v[this.valueKey]) > -1))
      }
    },
    methods: {
      toggleAllRowSelections () {
        if (this.selectedRowKeys.length > 0) {
          this.selectedRowKeys = []
        } else {
          this.selectedRowKeys = this.value.map(d => d[this.valueKey])
        }
      },
      onColumnHeaderClick (column) {
        for (let c of this.columns) {
          if (c !== column) {
            c.isSorting = false
          } else {
            c.sortDirection = !c.isSorting ? 'desc' : c.sortDirection === 'desc' ? 'asc' : 'desc'
            c.isSorting = true
          }
        }
        this.sort()
        this.$emit('vui-column-header-click', column)
      },

      sort () {
        if (this.useDefaultSorting) {
          if (this.sortingColumn) {
            this.value.sort((a, b) => {
              if (this.sortingColumn.sortDirection === 'desc') {
                return sortAlphaNumeric(a[this.sortingColumn.key], b[this.sortingColumn.key])
              } else {
                return sortAlphaNumeric(b[this.sortingColumn.key], a[this.sortingColumn.key])
              }
            })
            this.$emit('vui-table-order-change')
          }
        }
      },
      onRowSelectToggle (row) {
        if (row[this.valueKey]) {
          if (this.selectedRowKeys.indexOf(row[this.valueKey]) > -1) {
            this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(row[this.valueKey]), 1)
          } else {
            this.selectedRowKeys.push(row[this.valueKey])
          }
        }
      },
      onToggleRowEditing (row) {
        if (row[this.valueKey]) {
          if (this.editingRowKeys.indexOf(row[this.valueKey]) > -1) {
            this.editingRowKeys.splice(this.editingRowKeys.indexOf(row[this.valueKey]), 1)
          } else {
            this.editingRowKeys.push(row[this.valueKey])
          }
        }
      },
      columnsForRecord (record) {
        return this.columns.map((c) => ({
          ...c,
          ...{
            _value: record[c.key] || null
          }
        }))
      }
    },
    created () {
      this.sort()
    }
  }
</script>
