/* eslint-disable no-console */
const aikenToMoodleXML = require('../lib');
const fs = require('fs');
const path = require('path');

const normalPath = path.normalize(`${__dirname}/../test/aiken.txt`);
const outputPath = path.normalize(`${__dirname}/../test/moodle.xml`);
const contents = fs.readFileSync(normalPath, 'utf8');

const callback = (result, error) => {
	if (error) {
		console.error(error);
		return;
	}
	fs.writeFileSync(outputPath, result);
	// console.log(result);

}
aikenToMoodleXML(contents, callback); 