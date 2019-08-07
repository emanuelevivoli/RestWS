var express = require("express");
var cors = require('cors')
var app = express()

// import {PythonShell} from 'python-shell';
let {PythonShell} = require('python-shell')

app.use(cors())

//Open the port 4000 for listening
app.listen(4000, () => {
 console.log("Server running on port 4000");
});

//How to treat a get request
app.get("/", (req, res) => {
    //generate a new python shell, to execute the nlp.py script with our formula
    let pyshell = new PythonShell('nlp.py', { mode: 'text'});
    console.log(req.query.formula)

    const formula = req.query.formula;

    // sends a message to the Python script via stdin
    pyshell.send(formula);

    //Wait for an answer from the script and send it as res (response)
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
   });

