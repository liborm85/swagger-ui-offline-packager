
const fs = require('node:fs');
const path = require('node:path');
const { inlineSource } = require('inline-source');
const { minify } = require('html-minifier-terser');
const { parseSchema } = require('./schemaParser');

class SwaggerUIOfflinePackager {
    constructor() {
    }

    async pack(inputFilename, outputFilename) {
        const swaggerTemplate = __dirname + '/swagger.template.html';

        let spec = await parseSchema(inputFilename);

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

                console.log('');
                console.log('Standalone HTML file ' + outputFilename + ' has been created successfully.');
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