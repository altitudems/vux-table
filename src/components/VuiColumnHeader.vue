<template lang="pug">
  .vui-column-header(:class="columnClass", @click="onClick") {{value.label}}
</template>

<script>
  export default {
    name: 'VuiColumnHeader',
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    computed: {
      columnClass () {
        return {
          'is-sortable': this.value.isSortable,
          'is-sorting': this.value.isSorting,
          'sort-desc': this.value.isSorting && this.value.sortDirection === 'desc',
          'sort-asc': this.value.isSorting && this.value.sortDirection === 'asc'
        }
      }
    },
    methods: {
      onClick () {
        if (this.value.isSortable) this.$emit('column-header-click', this.value)
      }
    }
  }
</script>

<style>
  .vui-column-header.is-sortable {
    cursor: pointer;
    user-select: none;
  }

  .vui-column-header.is-sortable::after {
    content: '\25bc';
    vertical-align: middle;
    font-size: 0.75em;
    margin-left: 0.5em;
    opacity: 0.25;
  }

  .vui-column-header.is-sorting::after {
    opacity: 1;
  }

  .vui-column-header.sort-asc::after {
    content: '\25b2';
  }
</style>
