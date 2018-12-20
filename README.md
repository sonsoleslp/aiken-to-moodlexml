# Aiken to MoodleXML

[![Build Status](https://travis-ci.org/sonsoleslp/aiken-to-moodlexml.svg?branch=master)](https://travis-ci.org/sonsoleslp/aiken-to-moodlexml) 
[![dependencies Status](https://david-dm.org/sonsoleslp/aiken-to-moodlexml/status.svg)](https://david-dm.org/sonsoleslp/aiken-to-moodlexml) [![devDependencies Status](https://david-dm.org/sonsoleslp/aiken-to-moodlexml/dev-status.svg)](https://david-dm.org/sonsoleslp/aiken-to-moodlexml?type=dev) 
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


This JS library parses Aiken quizzes into MoodleXML files.

## Usage

```
import aikenToMoodleXML from 'aiken-to-moodlexml';
// ...
aikenToMoodleXML(aikenString, (result, error) => {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
}); 
```
## Examples

On the server

```
import aikenToMoodleXML from 'aiken-to-moodlexml';
const fs = require('fs');
const path = require('path');

const xmlString = fs.readFileSync("/path/to/your/aiken/file.txt", 'utf8');

aikenToMoodleXML(aikenString, (result, error) => {
	if (error) {
		console.error(error);
	} else {
		console.log(result);
	}
}); 

```

On a JS SPA

```
import aikenToMoodleXML from 'aiken-to-moodlexml';
// ...
fetch("https://myweb.org/aiken.txt")
  .then(res=>res.text())
  .then(aikenString => {
  	aikenToMoodleXML(aikenString, (result, error) => {
  		if (error) {
  			console.error(error);
  		} else {
  			console.log(result);
  		}
  	}); 
});
```

## Development 
 
### Commands
- `npm run clean` - Remove `lib/` directory
- `npm test` - Run tests with linting and coverage results.
- `npm test:only` - Run tests without linting or coverage.
- `npm test:watch` - You can even re-run tests on file changes!
- `npm test:prod` - Run tests with minified code.
- `npm run test:examples` - Test written examples on pure JS for better understanding module usage.
- `npm run lint` - Run ESlint with airbnb-config
- `npm run cover` - Get coverage report for your code.
- `npm run build` - Babel will transpile ES6 => ES5 and minify the code.
- `npm run prepublish` - Hook for npm. Do all the checks before publishing your module.

## License

MIT © Sonsoles López Pernas
