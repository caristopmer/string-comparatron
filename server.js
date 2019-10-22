const express = require('express');
const app = express();
const PORT = 8080;

/**
 * Confirm that a supplied string is a valid software verson accoriding to the
 * major.minor.patch pattern.
 * @param {string} string The string to validate.
 */
const validSoftwareVersion = (string) => {
  const versionRegex = /^\d{1,2}((\.\d{1,2}){0,2})?$/;
  return versionRegex.test(string);
};

/**
 * Helper function to add back decimal points on minor and patch segments before
 * converting to a number, in order to preserve leading zeros when comparing.
 * @param {string} segmentString The segment to parse.
 * @param {number} index Index of the loop.
 */
const parseSegment = (segmentString, index) => {
  return index != 0 ? +`.${segmentString}` : +segmentString;
};

/**
 * Determine whether a valid software version number came before, after, or is equal to another.
 * @param {string} version1 The first version string.
 * @param {string} version2 The second version string.
 */
const compareValidVersionNumbers = (version1, version2) => {
  const [v1Segments, v2Segments] = [version1.split('.'), version2.split('.')];
  // Iterate through the version segments and compare.
  for (let i = 0; i < v1Segments.length; i++) {
    // Check for lack of additional segments (minor version, patch).
    if (v2Segments[i] === undefined) {
      // Check to see if the additional segment actually differentiates the versions.
      if(parseSegment(v1Segments[i], i) > 0) {return 'After'};
    } else if (parseSegment(v1Segments[i], i) > parseSegment(v2Segments[i], i)) {
      return 'After';
    } else if (parseSegment(v1Segments[i], i) < parseSegment(v2Segments[i], i)) {
      return 'Before';
    };
  };
  // Handle the case where the second version number is longer than the first.
  if (v2Segments.length > v1Segments.length && +v2Segments[v1Segments.length] > 0) {
    return 'Before';
  } else {
    return 'Equal';
  };
};

/**
 * Compare two strings that are not valid version numbers, in the same way that
 * version numbers would be. Decimal points and whitespace are removed from the supplied
 * strings and are compared character by character based on ASCII value.
 * @param {string} string1 The first string.
 * @param {string} string2 The second string.
 */
const compareStringsAsVersionNumbers = (string1, string2) => {
  let scrubbedString1 = string1.replace(/[ \.]/g, '').split('');
  let scrubbedString2 = string2.replace(/[ \.]/g, '').split('');
  // Iterate through the strings character by character to compare ascii values.
  for (let i = 0; i < scrubbedString1.length; i++) {
    // If string one is longer, it is automatically 'after' the second.
    if (scrubbedString2[i] === undefined) {
      return 'After';
    } else if (scrubbedString1[i].charCodeAt(0) > scrubbedString2[i].charCodeAt(0)) {
      return 'After';
    } else if (scrubbedString1[i].charCodeAt(0) < scrubbedString2[i].charCodeAt(0)) {
      return 'Before';
    };
  };
  // If string two is longer, it is automatically 'after' the first.
  if (scrubbedString2.length > scrubbedString1.length) {
    return 'Before';
  } else {
    return 'Equal';
  };
};

/**
 * Orchestrator function for handling the comparison of two passed in strings
 * as software version numbers.
 * @param {*} req The incoming request.
 * @param {*} res The outgoing response.
 */
const compareStrings = (req, res) => {
  const firstString = req.query.first;
  const secondString = req.query.second;
  let result;

  // Check that two strings were received.
  if (!firstString || !secondString) {
    result = 'Please provide two strings to compare via query parameters. Thank you!';
  } else {
    if (validSoftwareVersion(firstString) && validSoftwareVersion(secondString)) {
      result = compareValidVersionNumbers(firstString, secondString);
    } else {
      result = compareStringsAsVersionNumbers(firstString, secondString);
    };
  };
  res.send(result);
};

app.get('/comparatron', compareStrings);

app.listen(PORT, () => {
  console.log(`String Comparatron listening on port ${PORT}...`);
});
