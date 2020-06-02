const test = require('tape')
const child_process = require('child_process')
const moduleVersion = require('../package').version

function exec() {
    return child_process.exec.apply(child_process, arguments)
}

test('writes rendered template into stdout when received view data from a file', function (t) {
    exec('bin/index.js ./tests/view.json ./tests/simple/template.handlebars', (err, stdout, stderr) => {
        t.equal(err, null)
        t.equal(stderr, '')
        t.equal(stdout, 'hello world')
        t.end()
    })
})

test('writes rendered template into stdout when receive view data from stdin', function (t) {
    exec('cat ./tests/view.json | bin/index.js - ./tests/simple/template.handlebars', (err, stdout, stderr) => {
        t.equal(err, null)
        t.equal(stderr, '')
        t.equal(stdout, 'hello world')
        t.end()
    })
})

test('writes rendered template into stdout using passed helper functions', function (t) {
    exec('bin/index.js ./tests/view.json ./tests/with-helpers/template.handlebars ./tests/with-helpers/helpers.js', (err, stdout, stderr) => {
        t.equal(err, null)
        t.equal(stderr, '')
        t.equal(stdout, 'HELLO WORLD')
        t.end()
    })
})

test('writes error when fails to require helpers file', function (t) {
    exec('bin/index.js ./tests/view.json ./tests/with-helpers/template.handlebars ./not_found.file', (err, stdout, stderr) => {
        t.equal(stderr, 'Could not require helpers file.\n')
        t.end();
    });
});

test('writes rendered template into stdout using passed partial templates', function (t) {
    exec('bin/index.js '
        + '-p ./tests/with-partials/partial1.handlebars '
        + '-p ./tests/with-partials/partial2.handlebars '
        + './tests/view.json ./tests/with-partials/template.handlebars', (err, stdout, stderr) => {
            t.equal(err, null)
            t.equal(stderr, '')
            t.equal(stdout, 'partial 1 > hello world\npartial 2 > hello world')
            t.end()
        })
})

test('writes error when file not found', function (t) {
    exec('cat ./tests/view.json | bin/index.js - ./not_found.file', (err, stdout, stderr) => {
        t.equal(stderr, 'Could not find file: ./not_found.file.\n')
        t.end();
    });
});

test('writes parsing errors when given invalid JSON', function (t) {
    exec('echo {title:"hello world"} | bin/index.js - ./tests/simple/template.handlebars', (err, stdout, stderr) => {
        t.notEqual(stderr.indexOf('Could not parse view as JSON'), -1)
        t.end()
    })
})

test('writes command usage into stderr when runned with wrong number of arguments', function (t) {
    exec('bin/index.js', (err, stdout, stderr) => {
        t.notEqual(stderr.indexOf('Syntax: flatbars'), -1)
        t.end()
    })
})

test('writes module version into stdout when runned with -v', function (t) {
    exec('bin/index.js -v', (err, stdout, stderr) => {
        t.equal(stdout, moduleVersion + '\n')
        t.end()
    })
})