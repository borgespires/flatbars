var test = require('tape')
var flatbars = require('..')

test('render simple template', async function (t) {
    const out = await flatbars.render('./tests/view.json', './tests/simple/template.handlebars')
    t.same(out, 'hello world')
    t.end()
})

test('helper functions', async function (t) {
    const view = './tests/view.json'
    const template = './tests/with-helpers/template.handlebars'

    const out = await flatbars.render(view, template, './tests/with-helpers/helpers.js')
    
    t.same(out, 'HELLO WORLD')
    t.end()
})

test('render with partials', async function (t) {
    const view = './tests/view.json'
    const template = './tests/with-partials/template.handlebars'
    const partials = ['./tests/with-partials/partial1.handlebars', './tests/with-partials/partial2.handlebars']

    const out = await flatbars.render(view, template, undefined, partials)
    
    t.same(out, 'partial 1 > hello world\npartial 2 > hello world')
    t.end()
})

test('render simple template', async function (t) {
    const out = await flatbars.render('./tests/view.json', './tests/simple/template.handlebars')
    t.same(out, 'hello world')
    t.end()
})

// test('render from stdin', async function (t) {
// })

// test('invalid JSON', async function (t) {
// })

test('fail to find file', async function (t) {
    try {
        await flatbars.render('./tests/view.json', 'fake_file')
        t.fail('should throw an error')
    } catch(err) {
        t.true(err.match(/Could not find file: fake_file./))
    }
    
    t.end()
})

test('fail to require helpers file', async function (t) {
    const view = './tests/view.json'
    const template = './tests/with-helpers/template.handlebars'
    try {
        await flatbars.render(view, template, 'fake_file')
        t.fail('should throw an error')
    } catch(err) {
        t.true(err.match(/Could not require helpers file./))
    }
    
    t.end()
})