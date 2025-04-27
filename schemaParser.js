const fs = require('node:fs');
const path = require('node:path');
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const yaml = require('yaml');
const { JSONPath } = require('jsonpath-plus');
const semver = require('semver');

const yamlParser = {
    canParse: ['.yaml', '.yml'],
    parse: async (file) => {
        console.log('Resolving schema ' + file.url + '...');
        let data = file.data;
        if (Buffer.isBuffer(data)) {
            data = data.toString();
        }

        if (typeof data === "string") {
            try {
                return yaml.parse(data);
            } catch (e) {
                throw new $RefParser.ParserError(e?.message || "Parser Error", file.url);
            }
        } else {
            return data;
        }
    }
};

const isRequiredDereference = function (schema) {
    const refs = JSONPath({path: '$..`$ref', json: schema});

    // All references for Swagger UI with OpenAPI 3.1.0+ requires dereference
    if (refs.length > 0 && typeof schema.openapi === 'string') {
        if (schema.openapi) {
            if (semver.satisfies(schema.openapi, '>=3.1.0')) {
                return true;
            }
        }
    }

    // External references must be dereferenced
    return refs.some(ref => typeof ref === 'string' && !ref.startsWith('#'))
};

async function parseSchema(filename, options = {}) {
    console.log('Loading schema ' + filename + '...');

    let schema;
    let fileContent = fs.readFileSync(path.resolve(filename), 'utf8');
    let extension = path.extname(filename).toLowerCase();
    if ((extension === '.yaml') || (extension === '.yml')) {
        schema = yaml.parse(fileContent);
    } else if (extension === '.json') {
        schema = JSON.parse(fileContent);
    }

    if (!isRequiredDereference(schema)) {
        return schema;
    }

    const requiredOptions = {
        parse: {
            yaml: yamlParser
        }
    };

    schema = await $RefParser.dereference(filename, {...options, ...requiredOptions});

    if (typeof schema.components !== 'undefined' && typeof schema.openapi === 'string') {
        delete schema.components.schemas;
        delete schema.components.requestBodies;
        delete schema.components.responses;
    }

    return schema;
}

module.exports = {
    parseSchema: parseSchema,
};