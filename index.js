'use strict'
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

function isStdin(view) {
    return view === '-'
}

function isJsFile(view) {
    const extension = path.extname(view)
    return extension === '.js' || extension === '.cjs'
}

function wasNotFound(err) {
    return err.code && err.code === 'ENOENT';
}

async function render(viewArg, templateArg, helpersArg, partialsPaths) {
    const view = await readView(viewArg)
    const template = await readTemplate(templateArg)

    if (helpersArg) {
        const helpers = await requireHelpers(helpersArg)
        helpers.register(Handlebars);
    }

    if (partialsPaths) {
        const partials = await readPartials(partialsPaths)
        Object.entries(partials).forEach(([name, str]) => {
            Handlebars.registerPartial(name, str);
        });
    }

    return Handlebars.compile(template)(view)
}

async function readView(viewArg) {
    function parseView(str) {
        try {
            return JSON.parse(str)
        } catch (err) {
            throw ('Could not parse view as JSON.\n' +
                'Tips: functions are not valid JSON and keys / values must be surround with double quotes.\n\n' +
                err.stack)
        }
    }

    if (isJsFile(viewArg)) {
        return require(path.join(process.cwd(), viewArg))
    } else {
        let view
        if (isStdin(viewArg)) {
            view = process.openStdin()
        } else {
            view = fs.createReadStream(viewArg)
        }
        const str = await streamToStr(view)
        return parseView(str)
    }
}

async function readTemplate(templateArg) {
    var template = fs.createReadStream(templateArg);
    return streamToStr(template);
}

async function requireHelpers(helpersArg) {
    if (isJsFile(helpersArg)) {
        return require(path.join(process.cwd(), helpersArg))
    }
    throw ('Could not require helpers file.');
}

async function readPartials(partialsPaths) {
    function getPartialName(filename) {
        const extension = path.extname(filename)
        return path.basename(filename, extension)
    }

    const partials = {}

    for (let i = 0; i < partialsPaths.length; i++) {
        const partialPath = partialsPaths[i];
        const partial = fs.createReadStream(partialPath)
        const str = await streamToStr(partial)
        partials[getPartialName(partialPath)] = str
    }

    return partials
}

function streamToStr(stream) {
    return new Promise((resolve, reject) => {
        let data = ''
        stream.on('data', function onData(chunk) {
            data += chunk
        }).once('end', function onEnd() {
            resolve(data.toString())
        }).on('error', function onError(err) {
            if (wasNotFound(err)) {
                reject(`Could not find file: ${err.path}.`)
            } else {
                reject(`Error while reading file: ${err.message}.`)
            }
        })
    })
}

(function (factory) {
    module.exports = factory()
}(() => { return { render } }))
