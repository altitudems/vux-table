export default function VuiTableColumnDefinition (options) {
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
      editComponent: null
    },
    ...options
  }
}
