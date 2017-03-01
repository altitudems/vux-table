export default {
  props: {
    value: {
      required: false,
      default: null
    },
    column: {
      type: Object,
      required: true
    },
    row: {
      type: Object,
      required: false
    }
  }
}
