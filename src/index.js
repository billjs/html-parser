const parser = require('./parser')
const generator = require('./generator')

module.exports = {
  parse: parser.parse,
  generate: generator.generate
}
