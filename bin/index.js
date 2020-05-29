#!/usr/bin/env node

const Flatbars = require('..')
const pkg = require('../package')

function hasVersionArg() {
    return ['--version', '-v'].some((opt) => process.argv.indexOf(opt) > -1)
}

let partialsPaths = []
let partialArgIndex = -1

while ((partialArgIndex = process.argv.indexOf('-p')) > -1) {
    partialsPaths.push(process.argv.splice(partialArgIndex, 2)[1])
}

const viewArg = process.argv[2]
const templateArg = process.argv[3]
const helpersArg = process.argv[4]

if (hasVersionArg()) {
    return console.log(pkg.version)
}

if (!templateArg || !viewArg) {
    console.error('Syntax: flatbars <view> <template> [helper]')
    process.exit(1)
}

Flatbars.render(viewArg, templateArg, helpersArg, partialsPaths)
    .then((out) => process.stdout.write(out))
    .catch(err => {
        console.error(err)
        process.exit(1)
    })