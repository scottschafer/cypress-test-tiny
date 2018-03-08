describe('sessionTest', () => {
  

  // load a session file and the files it refers to.
  // returns a promise that is only resolved after everything is loaded.
  
  function loadSession(srcSessionFile) {
      
    // return a promise that is resolves only when all session files are loaded (and mocks are initialized)
    return new Cypress.Promise((resolve, reject) => {

      // a map of file names to contents
      const fileContents = {};

      // read the session file (an array of file names)
      cy.readFile( __dirname + "/data/" + srcSessionFile).then(fileList => {
        console.log("fileList = " + JSON.stringify(fileList));
        let remaining = fileList.length; // # of remaining files to load
        if (remaining === 0) {
          // special case for empty array
          resolve({fileList:[], fileContents: {} });
        }
        else {
          // iterate through array, loading each file
          fileList.forEach(fileName => {
            console.log("fileName = " + fileName);
            cy.readFile( __dirname + "/data/" + fileName).then(contents => {
              console.log("loaded " + fileName);
              // we've loaded a file, so put it in our map
              fileContents[fileName] = contents;

              --remaining;              
              if (remaining === 0) {

                // all files for the session have been loaded, we can mock the first API now
                console.log("calling resolve");

                resolve({fileList:fileList, fileContents: fileContents });
              }
            });
          });
        }
      });
    });
  }


  it("handles load session", function () {
    // TODO: figure out why we get this:
    //   Cypress Warning: Cypress detected that you returned a promise in a test, but also invoked one or more cy commands...
    // In the meantime, this does work
    
     return loadSession("session.json").then((session) => {
      expect(JSON.stringify(session.fileList)).to.eq('["1.json","2.json"]');
      expect(JSON.stringify(session.fileContents)).to.eq('{"1.json":{"1":"test"},"2.json":{"2":"test"}}');
    });
  });

})
