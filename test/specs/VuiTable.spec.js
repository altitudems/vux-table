import VuiTable from 'src/VuiTable.vue'
import VuiRow from 'src/components/VuiRow.vue'
import VuiColumn from 'src/components/VuiColumn.vue'
import VuiTextInput from 'src/components/VuiTextInput.vue'
import VuiTableColumnDefinition from 'src/factories/VuiTableColumnDefinition'
import { expect } from 'chai'
import { createVM } from '../helpers/utils.js'

export function createHeroes () {
  return [
    { id: 1, cost: 19.99, name: 'Sylvester Stalone', stamina: '18', power: 40 },
    { id: 2, cost: 'First Born', name: 'Chuck Norris', stamina: '100', power: 100 },
    { id: 3, cost: 5.50, name: 'Bruce Lee', stamina: '92', power: 40 },
    { id: 4, cost: 0.01, name: 'Jackie chan', stamina: '78', power: 40 }
  ]
}

export function createColumns () {
  return [
    VuiTableColumnDefinition({ label: 'Id', isHidden: true }),
    VuiTableColumnDefinition({ key: 'name', label: 'Name', isSorting: true, isSortable: true, sortDirection: 'desc', editComponent: VuiTextInput }),
    VuiTableColumnDefinition({ key: 'cost', label: 'Recruitment Cost' }),
    VuiTableColumnDefinition({ key: 'stamina', label: 'Stamina', isSortable: true }),
    VuiTableColumnDefinition({ key: 'power', label: 'Power' })
  ]
}

const heroesTableTemplate = `
  <vui-table
    ref="component"
    v-model="heroes"
    :columns="columns"
    value-key="id"
    :is-editable="true"
    :is-selectable="true"
    :is-draggable="true"
    :use-default-sorting="true"
    :is-bordered="false"
    :is-striped="false"
    :is-narrow="false"
    :draggableOptions="{group:'heroes'}"
  >
    <template slot="row-actions-column" scope="props">
      <th>
        <button v-if="!props.isEditing" @click="props.edit(props.row)">Edit</button>
        <button v-if="!props.isEditing" @click="props.delete(props.row)">Delete</button>
        <button v-if="props.isEditing" @click="props.save(props.row)">Save</button>
        <button v-if="props.isEditing" @click="props.revert(props.row)">Cancel</button>
      </th>
    </template>

    <vui-row>
      <vui-column span="12" value="Custom VuiColumn"></vui-column>
    </vui-row>

    <tr slot="thead">
      <td colspan="100">Custom header row</td>
    </tr>
    <tr slot="tbody">
      <td colspan="100">Custom body row</td>
    </tr>
    <tr slot="tfoot">
      <td colspan="100">Custom footer row</td>
    </tr>
  </vui-table>
`

describe('VuiTable.vue', function () {
  it('should render table', function () {
    const vm = createVM(
      this,
      heroesTableTemplate,
      {
        components: { VuiTable, VuiRow, VuiColumn, VuiTextInput },
        data: { heroes: createHeroes(), columns: createColumns(), visible: true }
      }
    )
    vm.$el.should.be.ok
    vm.$el.querySelector('table.vui-table').should.exist
    vm.$el.querySelector('table.vui-table tbody').getElementsByTagName('tr').length.should.equal(6)
  })

  it('should hide hidden columns', function () {
    const vm = createVM(
      this,
      heroesTableTemplate,
      {
        components: { VuiTable, VuiRow, VuiColumn, VuiTextInput },
        data: { heroes: createHeroes(), columns: createColumns(), visible: true }
      }
    )
    vm.$el.querySelectorAll('table.vui-table thead th').length.should.equal(6)
  })

  it('should sort by column values after mount', function () {
    const vm = createVM(
      this,
      heroesTableTemplate,
      {
        components: { VuiTable, VuiRow, VuiColumn, VuiTextInput },
        data: { heroes: createHeroes(), columns: createColumns(), visible: true }
      }
    )
    vm.$el.querySelectorAll('table.vui-table tbody td')[0].textContent.should.equal('Bruce Lee')
  })

  // it('should select row and emit event', function () {
  //   const vm = createVM(
  //     this,
  //     heroesTableTemplate,
  //     {
  //       components: { VuiTable, VuiRow, VuiColumn, VuiTextInput },
  //       data: { heroes: createHeroes(), columns: createColumns(), visible: true }
  //     }
  //   )

  //   let payload = null

  //   vm.$refs.component.$on('vui-row-selection-change', (p) => { payload = p })
  //   vm.$el.querySelectorAll('table.vui-table tbody th input')[0].click()
  //   vm.$el.querySelectorAll('table.vui-table tbody th input')[3].click()

  //   vm.$refs.component.$nextTick(() => {
  //     payload.should.exist
  //     payload.length.should.equal(1)
  //   })
  // })
  describe('Events emitting', function () {
    describe('@vui-row-selection-change', function () {
      it('should be called after selecting any row', function (done) {
        const eventsLog = []

        const vm = createVM(
          this,
          heroesTableTemplate,
          {
            components: { VuiTable, VuiRow, VuiColumn, VuiTextInput },
            data: { heroes: createHeroes(), columns: createColumns(), visible: true }
          }
        )

        vm.$refs.component.$on('vui-row-selection-change', (p) => { eventsLog.push(p) })

        vm.$el.querySelectorAll('table.vui-table tbody th input')[0].click()

        vm.$nextTick(() => {
          expect(eventsLog).to.exist
          done()
        })
      })
    })
  })
})
