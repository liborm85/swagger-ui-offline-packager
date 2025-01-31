# Swagger UI Offline Packager

A tool that generates a single, self-contained HTML file from an OpenAPI definition (YAML or JSON), rendering it in Swagger UI. This allows you to view API documentation offline, without needing an internet connection or a separate web server.

## Features
- Converts OpenAPI (YAML or JSON) into a standalone Swagger UI HTML file
- The generated file works completely offline
- Easy to use, no external dependencies required

Perfect for sharing API documentation in a simple, portable format! 🚀

## Installation

You can install Swagger UI Offline Packager globally or locally using npm.

**Global Installation**

To install the package globally, run:

```sh
npm install -g swagger-ui-offline-packager
```
This allows you to use the `swagger-ui-offline-packager` command anywhere in your terminal. You can also use the shorter alias `sop`.

**Local Installation**

To install the package locally in your project, run:

```sh
npm install swagger-ui-offline-packager
```
You can then use it within your project scripts or via `npx`:

```sh
npx swagger-ui-offline-packager
```
or with the alias:

```sh
npx sop
```

## Usage

To generate a standalone Swagger UI HTML file, run the command with the required input file:
```
sop <swagger-file> [output-html-file]
```

**Parameters:**
- swagger-file *(required)* – Path to the Swagger (OpenAPI) file in YAML or JSON format.
- output-html-file *(optional)* – Path to the output HTML file. If not provided, the output file will be named based on the input file.

For more information, use:
```sh
sop --help
```

## Examples:
Generate an HTML file with the default output name (generates api.html in the same directory):

```sh
sop api.yaml
```

Specify a custom output file:

```sh
sop api.yaml my-api-docs.html
```

Using npx (if installed locally):

```sh
npx sop api.json docs.html
```

## License

MIT