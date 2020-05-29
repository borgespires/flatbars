# Flatbars

```bash
flatbars view.json template.handlebars > dist/example.html
```

```bash
flatbars view.json template.handlebars helpers.js > dist/example.html
```

```bash
flatbars -p partial.handlebars view.json template.handlebars helpers.js > dist/example.html
```

```bash
cat view.json | flatbars -p partial.handlebars - template.handlebars helpers.js > dist/example.html
```