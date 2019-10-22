# String Comparatron

This is a simple web service that provides an endpoint to compare two software version strings. When two strings are provided, the service will return either 'Before', 'After', or 'Equal' depending on if the version in the first string is before, after, or equal to that of the second string, respectively. At this time, the Comparatron assumes that valid software versions are in the MAJOR.MINOR.PATCH format. If either of the provided strings are not valid version numbers, they are each stripped of any white space and decimal points and are compared character by character according to ASCII values.

## Running the Application
To run the service on your host machine, you'll need to have NodeJS installed. Once you've cloned the repository, you'll want to run:

`npm install`

`node server.js`

This will start up the service on your local machine, and you can now make requests to `http://localhost:8080/comparatron`. GET requests to the endpoint should resemble the following examples, using the `first` & `second` query parameters:

`http://localhost:8080/comparatron/?first=1.1.1&second=1.1.1` -> `Equal`
`http://localhost:8080/comparatron/?first=0.4.12&second=3.1.19` -> `Before`
`http://localhost:8080/comparatron/?first=Non-version number strings?&second=Can be compared too!` -> `After`

## Notes
Ideas for future improvements include:
 - Add in support for running with Docker.
 - Enhance error handling and make the service more robust for dealing with version numbers that don't conform to the MAJOR.MINOR.PATCH pattern.
