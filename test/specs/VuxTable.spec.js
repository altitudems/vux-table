import VuxTable from 'src/VuxTable.vue'
import VuxRow from 'src/components/VuxRow.vue'
import VuxColumn from 'src/components/VuxColumn.vue'
import VuxTextInput from 'src/components/VuxTextInput.vue'
import VuxTableColumnDefinition from 'src/factories/VuxTableColumnDefinition'
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
    VuxTableColumnDefinition({ label: 'Id', isHidden: true }),
    VuxTableColumnDefinition({ key: 'name', label: 'Name', isSorting: true, isSortable: true, sortDirection: 'desc', editComponent: VuxTextInput }),
    VuxTableColumnDefinition({ key: 'cost', label: 'Recruitment Cost' }),
    VuxTableColumnDefinition({ key: 'stamina', label: 'Stamina', isSortable: true }),
    VuxTableColumnDefinition({ key: 'power', label: 'Power' })
  ]
}

const heroesTableTemplate = `
  <vux-table
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
  </vux-table>
`

describe('VuxTable.vue', function () {
  it('should render table', function () {
    const vm = createVM(
      this,
      heroesTableTemplate,
      {
        components: { VuxTable, VuxRow, VuxColumn, VuxTextInput },
        data: { heroes: createHeroes(), columns: createColumns(), visible: true }
      }
    )
    vm.$el.should.be.ok
    vm.$el.querySelector('table.vux-table').should.exist
    vm.$el.querySelector('table.vux-table tbody').getElementsByTagName('tr').length.should.equal(4)
  })

  it('should hide hidden columns', function () {
    const vm = createVM(
      this,
      heroesTableTemplate,
      {
        components: { VuxTable, VuxRow, VuxColumn, VuxTextInput },
        data: { heroes: createHeroes(), columns: createColumns(), visible: true }
      }
    )
    vm.$el.querySelectorAll('table.vux-table thead th').length.should.equal(6)
  })

  it('should sort by column values after mount', function () {
    const vm = createVM(
      this,
      heroesTableTemplate,
      {
        components: { VuxTable, VuxRow, VuxColumn, VuxTextInput },
        data: { heroes: createHeroes(), columns: createColumns(), visible: true }
      }
    )
    vm.$el.querySelectorAll('table.vux-table tbody td')[0].textContent.should.equal('Bruce Lee')
  })

  // it('should select row and emit event', function () {
  //   const vm = createVM(
  //     this,
  //     heroesTableTemplate,
  //     {
  //       components: { VuxTable, VuxRow, VuxColumn, VuxTextInput },
  //       data: { heroes: createHeroes(), columns: createColumns(), visible: true }
  //     }
  //   )

  //   let payload = null

  //   vm.$refs.component.$on('vux-row-selection-change', (p) => { payload = p })
  //   vm.$el.querySelectorAll('table.vux-table tbody th input')[0].click()
  //   vm.$el.querySelectorAll('table.vux-table tbody th input')[3].click()

  //   vm.$refs.component.$nextTick(() => {
  //     payload.should.exist
  //     payload.length.should.equal(1)
  //   })
  // })
  describe('Events emitting', function () {
    describe('@vux-row-selection-change', function () {
      it('should be called after selecting any row', function (done) {
        const eventsLog = []

        const vm = createVM(
          this,
          heroesTableTemplate,
          {
            components: { VuxTable, VuxRow, VuxColumn, VuxTextInput },
            data: { heroes: createHeroes(), columns: createColumns(), visible: true }
          }
        )

        vm.$refs.component.$on('vux-row-selection-change', (p) => { eventsLog.push(p) })

        vm.$el.querySelectorAll('table.vux-table tbody th input')[0].click()

        vm.$nextTick(() => {
          expect(eventsLog).to.exist
          done()
        })
      })
    })
  })
})
