export default function VuxTableColumnDefinition (options) {
  return {
    ...{
      key: 'id',
      label: 'Id',
      isDisabled: false,
      isHidden: false,
      isSortable: false,
      isSorting: false,
      sortDirection: 'desc',
      isFilterable: false,
      displayComponent: null,
      editComponent: null,
      span: 1
    },
    ...options
  }
}
