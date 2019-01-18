const fs = require('fs');
const path = require('path');

const normalPath = path.normalize(`${__dirname}/aiken.txt`);
const str = fs.readFileSync(normalPath, 'utf8');
const aikenToMoodleXML = require('../src');
const assert = require("chai").assert;

const createCallback = (assertFun) => {
  return (res,err) => {
    let questions = (res && res.questions) ? res.questions : res;
    assertFun(questions,err);
  }
}

describe('Test1', () => {
  it('should contain sth', () => {
    aikenToMoodleXML(str, (res,err)=>{
      console.log(res);
      // assert(!!res,true)
    });
  });

}); 

