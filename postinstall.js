const fse = require('fs-extra')
const path = require('path')
const topDir = __dirname
const tinymceSource = path.join(topDir, 'node_modules', 'tinymce')
const tinymceTarget = path.join(topDir, 'public', 'tinymce')

fse.emptyDirSync(tinymceTarget)
fse.copySync(tinymceSource, tinymceTarget, { overwrite: true })
