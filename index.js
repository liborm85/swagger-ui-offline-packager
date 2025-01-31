
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');
const { inlineSource } = require('inline-source');
const { minify } = require('html-minifier-terser');

class SwaggerUIOfflinePackager {
    constructor() {
    }

    async pack(inputFilename, outputFilename) {
        const swaggerTemplate = __dirname + '/swagger.template.html';

        let spec;
        let file = fs.readFileSync(path.resolve(inputFilename), 'utf8');

        let extension = path.extname(inputFilename).toLowerCase();
        if ((extension === '.yaml') || (extension === '.yml')) {
            console.log('Converting YAML...');

            spec = yaml.parse(file);

            console.log('YAML converted.');
            console.log('');
        } else if (extension === '.json') {
            spec = JSON.parse(file);
        }

        console.log('Building standalone HTML...');

        let htmlTemplate = fs.readFileSync(path.resolve(swaggerTemplate), 'utf8');
        htmlTemplate = htmlTemplate.replace(`'{swagger-spec}'`, JSON.stringify(spec, null, 2));

        await minify(htmlTemplate, {
            collapseWhitespace: true,
            minifyJS: true
        }).then(async (data) => {
            await inlineSource(data, {
                rootpath: path.resolve('./'),
                saveRemote: false
            }).then((html) => {
                if (spec.info === undefined) {
                    spec.info = {};
                }

                html = html.replaceAll('{swagger-title}', spec.info?.title);

                if (spec.info?.version) {
                    html = html.replaceAll('{swagger-version}', spec.info.version);
                } else {
                    html = html.replaceAll(' - {swagger-version}', '');
                }

                if (spec.info?.contact?.name) {
                    html = html.replaceAll('{swagger-author}', spec.info.contact.name);
                } else {
                    html = html.replaceAll(' - {swagger-author}', '');
                }

                fs.writeFileSync(path.resolve(outputFilename), html);

                console.log('Standalone HTML builded.');

                console.log('');
                console.log('Standalone HTML file ' + outputFilename + ' created successfully.');
            }).catch((err) => {
                console.error('Error: ' + err.message);
                return process.exit(1);
            });

        }).catch((err) => {
            console.error('Error: ' + err.message);
            return process.exit(1);
        });
    }

}

module.exports = SwaggerUIOfflinePackager;