#!/usr/bin/env node

const { program } = require('commander');
const fs = require('node:fs');
const path = require('node:path');
const pkg = require('./../package.json');
const SwaggerUIOfflinePackager = require('./../index.js')

program
    .name('swagger-ui-offline-packager')
    .alias('sop')
    .description('Swagger UI Offline Packager')
    .version(pkg.version)
    .argument('<swaggerFilename>', 'Path to the Swagger (OpenAPI) file (YAML or JSON)')
    .argument('[outputFilename]', 'Path to the output HTML file')
    .action(async (swaggerFilename, outputFilename) => {
        if (!fs.existsSync(swaggerFilename)) {
            console.error(`Error: The swagger file "${swaggerFilename}" does not exist.`);
            process.exit(1);
        }

        if (!['.yaml', '.yml', '.json'].includes(path.extname(swaggerFilename).toLowerCase())) {
            console.error(`Error: The swagger file "${swaggerFilename}" has an unknown format.`);
            process.exit(1);
        }

        if (!outputFilename) {
            const baseName = path.basename(swaggerFilename, path.extname(swaggerFilename));
            outputFilename = path.join(path.dirname(swaggerFilename), `${baseName}.html`);
        }

        const packager = new SwaggerUIOfflinePackager();
        await packager.pack(swaggerFilename, outputFilename);
    });

program.parse(process.argv);