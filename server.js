const express = require('express');
const app = express();
const PORT = 8080;

// use compare versions plugin, but also implement on my own

// orchestrator func called by endpoint
// others that do the work of comparison
// handle any string, not just software versions

const compareValidVersionNumbers = (version1, version2) => {
  // if both valid versions, split them both and iterate through to compare
  // make sure to check the are the same length

  const [v1Segments, v2Segments] = [segmentVersionString(version1), segmentVersionString(version2)];
  for (let i = 0; i < segmentVersionString(version1).length; i++) {
    const v1SegmentsEnded = v1Segments[i] === undefined;
    const v2SegmentsEnded = v2Segments[i] === undefined;
    if (v1SegmentsEnded) {
      if(+v2Segments[i] > 0) {return 'Before'};
    } else if (v2SegmentsEnded) {
      if(+v1Segments[i] > 0) {return 'After'};
    } else if (+v1Segments[i] > +v2Segments[i]) {
      return 'After';
    } else if (+v1Segments[i] < +v2Segments[i]) {
      return 'Before';
    }
  };
  return 'Equal';
};

const compareStringsAsVersionNumbers = (string1, string2) => {
  // if they aren't valid, remove all spaces and periods and compare step by step in order of ascii value

};

const validSoftwareVersion = (string) => {
  const versionRegex = /^\d{1,2}((\.\d{1,2}){0,2})?$/;
  return versionRegex.test(string);
};

const segmentVersionString = (string) => {
  return string.split('.');
};

const compareStrings = (req, res) => {
  const firstString = req.query.first;
  const secondString = req.query.second;
  let result;

  if (validSoftwareVersion(firstString) && validSoftwareVersion(secondString)) {
    result = compareValidVersionNumbers(firstString, secondString);
  } else {
    result = compareStringsAsVersionNumbers(firstString, secondString);
  }



  res.send( JSON.stringify({
      first: segmentVersionString(firstString),
      second: segmentVersionString(secondString),
      valid1: validSoftwareVersion(firstString),
      valid2: validSoftwareVersion(secondString),
      result: result
  }));
};

app.get('/comparatron', compareStrings);

app.listen(PORT, () => {
  console.log(`String Comparatron listening on port ${PORT}...`);
});