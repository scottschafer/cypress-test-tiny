describe('sessionTest', () => {
  

  let fileContents = {};
  let fileList = [];

  // load a session file and the files it refers to.
  // returns a promise that is only resolved after everything is loaded.
  
  function loadSession(srcSessionFile) {
      
      // read the session file (an array of file names)
      const sessionPath = __dirname + "/../importSession/sessions/" + srcSessionFile;
      return cy.readFile(sessionPath).then(inFileList => {
        fileList = inFileList;
        let remaining = fileList.length; // # of remaining files to load
        if (remaining === 0) {
          // special case for empty array
          resolve({fileList:[], fileContents: {} });
        }
        else {
          // iterate through array, loading each file
          fileList.forEach(fileName => {
            cy.readFile( __dirname + "/../importSession/data/" + fileName).then(contents => {
              console.log("loaded " + fileName);
              fileContents[fileName] = contents;

              --remaining;              
              if (remaining === 0) {

                // all files for the session have been loaded, we can mock the first API now
              }
            });
          });
        }
      },
      error => {
        alert("error = " + JSON.stringify(error));
      }
    );
  }


  it("handles load session", function () {
    // TODO: figure out why we get this:
    //   Cypress Warning: Cypress detected that you returned a promise in a test, but also invoked one or more cy commands...
    // In the meantime, this does work
    
    console.log("running test");

    loadSession("session.json").then(() => {
      expect(JSON.stringify(fileList)).to.eq('["1.json","2.json"]');
      expect(JSON.stringify(fileContents)).to.eq('{"1.json":{"1":"test"},"2.json":{"2":"test"}}');
    });
    
  });


})
