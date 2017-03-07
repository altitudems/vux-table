/* global requestAnimationFrame */
import 'style-loader!css-loader!mocha-css'
import 'style-loader!css-loader!./helpers/style.css'
import 'style-loader!css-loader!sass-loader!../src/assets/sass/VuxTable.sass'

// create a div where mocha can add its stuff
const mochaDiv = document.createElement('DIV')
mochaDiv.id = 'mocha'
document.body.appendChild(mochaDiv)

import 'mocha/mocha.js'
import chai from 'chai'
window.mocha.setup('bdd')
chai.should()

let vms = []

beforeEach(function () {
  this.DOMElement = document.createElement('DIV')
  this.DOMElement.id = `test-${Math.floor(Math.random() * 1000000)}`
  document.body.appendChild(this.DOMElement)
})

afterEach(function () {
  const testReportElements = document.getElementsByClassName('test')
  const lastReportElement = testReportElements[testReportElements.length - 1]

  if (!lastReportElement) return
  const el = document.getElementById(this.DOMElement.id)
  lastReportElement.appendChild(el)
  // Save the vm to hide it later
  if (this.DOMElement.vm) vms.push(this.DOMElement.vm)
})

// Hide all tests at the end to prevent some weird bugs
before(function () {
  vms = []
})
after(function () {
  requestAnimationFrame(function () {
    vms.forEach(vm => { vm.visible = false })
  })
})

const specsContext = require.context('./specs', true)
specsContext.keys().forEach(specsContext)

window.mocha.checkLeaks()
window.mocha.run()
