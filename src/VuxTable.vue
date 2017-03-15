<template lang="pug">
  .vux-table-container
    table.vux-table(
      :class="{ 'is-bordered': isBordered, 'is-striped': isStriped, 'is-narrow': isNarrow }"
    )
      thead
        tr
          th.vux-select-column(v-if="isSelectable")
            input(type="checkbox", :checked="selectedRowKeys.length === value.length", @click="toggleAllRowSelections")
          th(v-for="column in columns", v-if="!column.isHidden")
            vux-column-header(:value="column", @column-header-click="onColumnHeaderClick")
          th.vux-actions-column(v-if="$scopedSlots['row-actions-column']")
            | {{actionsLabel}}
        slot(name="thead")
      tbody
        vux-row(
          v-for="record in value",
          :key="valueKey",
          :value="record",
          :dirtyValue="getDirtyValueForRow(record)",
          :columns="columns",
          :isEditable="isEditable",
          :isEditing="isEditable && editingRowKeys.indexOf(record[valueKey]) > -1",
          :isSelectable="isSelectable",
          :isSelected="isSelectable && selectedRowKeys.indexOf(record[valueKey]) > -1",
          @row-select-toggle="onRowSelectToggle",
          @edit="onRowEdit",
          @save="onRowSave",
          @revert="onRowRevert",
          @delete="onRowDelete",
          @input="onRowInput"
        )
          slot(
            name="row-actions-column",
            :row="record",
            :isEditable="isEditable",
            :isEditing="isEditable && editingRowKeys.indexOf(record[valueKey]) > -1",
            :isSelectable="isSelectable",
            :isSelected="isSelectable && selectedRowKeys.indexOf(record[valueKey]) > -1",
            :toggleSelected="onRowSelectToggle",
            :edit="onRowEdit",
            :save="onRowSave",
            :revert="onRowRevert",
            :delete="onRowDelete"
          )

        tr(v-if="value.length === 0")
          td(:colspan="columns.filter(t => !t.isHidden).length + 2")
            | No records to display
        slot
        slot(name="tbody")
      tfoot
        slot(name="tfoot")
</template>

<script>
  import VuxColumnHeader from './components/VuxColumnHeader'
  import VuxRow from './components/VuxRow'
  import { sortAlphaNumeric } from './helpers/sort.js'

  export default {
    components: { VuxColumnHeader, VuxRow },
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
      editingRowKeys: [],
      dirtyValue: null
    }),
    computed: {
      sortingColumn () {
        return this.columns.find(c => c.isSorting)
      }
    },
    watch: {
      selectedRowKeys (newValue) {
        this.$emit('row-selection-change', this.value.filter(v => this.selectedRowKeys.indexOf(v[this.valueKey]) > -1))
      },
      editingRowKeys (newValue) {
        this.$emit('row-editing-change', this.value.filter(v => this.editingRowKeys.indexOf(v[this.valueKey]) > -1))
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
        for (const c of this.columns) {
          if (c !== column) {
            c.isSorting = false
          } else {
            c.sortDirection = !c.isSorting ? 'desc' : c.sortDirection === 'desc' ? 'asc' : 'desc'
            c.isSorting = true
          }
        }
        this.sort()
        this.$emit('column-header-click', column)
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
            this.$emit('sort-order-change')
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
      onRowEdit (row) {
        if (row[this.valueKey]) {
          if (this.editingRowKeys.indexOf(row[this.valueKey]) === -1) {
            this.editingRowKeys.push(row[this.valueKey])
          }
        }
      },
      onRowSave (row) {
        if (row[this.valueKey]) {
          // Remove from editing keys list
          if (this.editingRowKeys.indexOf(row[this.valueKey]) > -1) {
            this.editingRowKeys.splice(this.editingRowKeys.indexOf(row[this.valueKey]), 1)
          }
          // If row has changed, perform save
          const dirtyRow = this.getDirtyValueForRow(row)

          if (dirtyRow) {
            // Clone value
            const newValue = this.value.slice(0)
            // Find existing record
            const index = this.value.findIndex(v => v[this.valueKey] === dirtyRow[this.valueKey])
            const dirtyIndex = this.dirtyValue.findIndex(v => v[this.valueKey] === dirtyRow[this.valueKey])
            if (index > -1) {
              // Replace record details
              newValue.splice(index, 1, dirtyRow)
              // Emit input event
              this.$emit('row-save', dirtyRow)
              this.$emit('input', newValue)
            }
            if (dirtyIndex > -1) {
              // Remove dirty record
              this.dirtyValue.splice(dirtyIndex, 1)
            }
          }
        }
      },
      onRowDelete (row) {
        if (row[this.valueKey]) {
          // Remove from editing keys list
          if (this.editingRowKeys.indexOf(row[this.valueKey]) > -1) {
            this.editingRowKeys.splice(this.editingRowKeys.indexOf(row[this.valueKey]), 1)
          }
          // If row has changed, perform delete
          const dirtyRow = this.getDirtyValueForRow(row)

          // Clone value
          const newValue = this.value.slice(0)
          // Find existing record
          const index = this.value.findIndex(v => v[this.valueKey] === row[this.valueKey])

          if (dirtyRow) {
            const dirtyIndex = this.dirtyValue.findIndex(v => v[this.valueKey] === dirtyRow[this.valueKey])
            if (dirtyIndex > -1) {
              // Remove dirty record
              this.dirtyValue.splice(dirtyIndex, 1)
            }
          }
          if (index > -1) {
            // Remove record
            newValue.splice(index, 1)
          }

          // Emit input event
          this.$emit('row-delete', row)
          this.$emit('input', newValue)
        }
      },
      onRowRevert (row) {
        if (row[this.valueKey]) {
          // Remove from editing keys list
          if (this.editingRowKeys.indexOf(row[this.valueKey]) > -1) {
            this.editingRowKeys.splice(this.editingRowKeys.indexOf(row[this.valueKey]), 1)
          }
          // If row has changed, perform revert
          const dirtyRow = this.getDirtyValueForRow(row)

          console.log(dirtyRow)

          if (dirtyRow) {
            // Find existing record
            const dirtyIndex = this.dirtyValue.findIndex(v => v[this.valueKey] === row[this.valueKey])
            console.log(dirtyIndex)
            if (dirtyIndex > -1) {
              // Remove dirty record
              this.dirtyValue.splice(dirtyIndex, 1)
            }
          }
        }
      },
      onRowInput (dirtyRow) {
        if (!this.dirtyValue) {
          this.dirtyValue = []
        }
        const dirtyIndex = this.dirtyValue.findIndex(v => v[this.valueKey] === dirtyRow[this.valueKey])

        if (dirtyIndex > -1) {
          this.dirtyValue.splice(dirtyIndex, 1, dirtyRow)
        } else {
          this.dirtyValue.push(dirtyRow)
        }
      },
      getDirtyValueForRow (row) {
        return this.dirtyValue ? this.dirtyValue.find(v => v[this.valueKey] === row[this.valueKey]) : null
      },
      columnsForRow (row) {
        return this.columns.map((c) => ({
          ...c,
          ...{
            _value: row[c.key] || null
          }
        }))
      }
    },
    created () {
      console.log(this)
      this.sort()
    }
  }
</script>

<style>
  /* No styles */
</style>
