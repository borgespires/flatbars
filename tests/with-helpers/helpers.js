const helper = function () { }

helper.register = function (Handlebars) {
    Handlebars.registerHelper('loud', (s) => s.toUpperCase())
}

module.exports = helper