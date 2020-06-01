# Flatbars

A simple CLI tool for templating using `Handlebars`.

For information on syntax and other Handlebars specifics check out [this guide](https://handlebarsjs.com/guide/).

--- 

It might be installed as a global tool to render a simple mustache/handlebars template of some kind

```bash
$ npm install -g flatbars
$ flatbars dataView.json myTemplate.handlebars > output.html
```

or as a package.json devDependency in a build process

```bash
$ npm install flatbars --save-dev
```
```json
{
  "scripts": {
    "build": "flatbars dataView.json myTemplate.handlebars > dist/output.html"
  }
}
```
```bash
$ npm run build
```

## Helpers
In order to use Handlebar helpers you just need to create a `js` file that exposes a `register` function. This function is going to be called with the Handlebars instance as first argument.

```js
// helpers.js
const helpers = () => { }

helpers.register = function (Handlebars) {
    Handlebars.registerHelper('loud', (s) => s.toUpperCase());
}

module.exports = helpers;
```
```handlebars
<!-- myTemplate.handlebars -->
{{loud title}}
```
```json
{
    "title": "This is my title!"
}
```

To render just run this:
```bash
$ flatbars dataView.json myTemplate.handlebars helpers.js > output.html
```

## Partials
Using partials on your template is also simple, you just pass paths to partials using `-p` flag:

```handlebars
<!-- myTemplate.handlebars -->
<ul class="people_list">
  {{#each people}}
    <li>{{> mypartial}}</li>
  {{/each}}
</ul>
```
```handlebars
<!-- myPartial.handlebars -->
{{firstname}} {{loud lastname}}
```
```json
{
   "people": [
        {
            "firstname": "John",
            "lastname": "Doe"
        },
        {
            "firstname": "Janne",
            "lastname": "Smith"
        },
        {
            "firstname": "Richard",
            "lastname": "Miles"
        }
    ]
}
```
```bash
$ flatbars -p partial.handlebars dataView.json myTemplate.handlebars > output.html
```

## stdin support 
It also supports stdin, just pass `'-'` as your data view argument:

```bash
$ cat dataView.json | flatbars -p partial.handlebars - myTemplate.handlebars helpers.js > output.html
```