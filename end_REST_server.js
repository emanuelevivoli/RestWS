var express = require("express");
var cors = require('cors')
var app = express()

// import {PythonShell} from 'python-shell';
let {PythonShell} = require('python-shell')

app.use(cors())


app.listen(4000, () => {
 console.log("Server running on port 4000");
});

app.get("/", (req, res) => {
    let pyshell = new PythonShell('nlp.py', { mode: 'text'});
    // const formula = req.query.formula;
    console.log(req.query.sentence)
    // console.log(res)
    
    const sentence = req.query.sentence;

    // sends a message to the Python script via stdin
    pyshell.send(sentence);

    pyshell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(message);
        res.json(message);
    });

    // end the input stream and allow the process to exit
    pyshell.end(function (err,code,signal) {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
        console.log('finished');
    });

    // PythonShell.run('echo_args.py', {
    //     args: ['hello', 'world']
    // }, function (err, results) {
    //     if (err) return done(err);
    //     results.should.be.an.Array.and.have.lengthOf(2);
    //     results.should.eql(['hello', 'world']);
    //     done();
    // });

    // console.log(req.query);
    // console.log(res);
    
   });

