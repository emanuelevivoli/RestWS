var express = require("express");
var cors = require('cors')
var app = express()
// const fetch = require("node-fetch");
const axios = require('axios');

// global.fetch = fetch
// global.Headers = fetch.Headers;

app.use(cors())

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

const Url = 'http://localhost:4000';

const people = [
    'lele',
    'gyorgi',
    'pedro',
    'raj',
    'foteini',
    'marcus',
    'saleha',
    'tosin',
    'gustav',
    'murphy'
];

dict = {}

app.get("/answer", (req, res, next) => {
    const params = req.query;
    let appoggio
    if (people.includes(params.user)){
        if (!(params.user in dict)){
            dict[params.user] = {
                'sentences': [],
                'corrects': [],
                'score': 0
            }
        }

        console.log(params.formula)

        dict[params.user]['sentences'].push(params.formula)

        
        async function getAnswer(param) {
            try {
                // Optionally the request above could also be done as
                const response = await axios.get(Url + '/', {
                    params: {
                        formula: param
                    }
                });
                console.log('await response', response.data);
                return response.data

            } catch (error) {
                console.error(error);
            }
        }

        const response = getAnswer(params.formula).then(data => {
            real_result = data

            correct = params.result == real_result
        
            dict[params.user]['corrects'].push(correct)

            if (correct){
                dict[params.user]['score'] = (dict[params.user]['score'] * (dict[params.user]['corrects'].length - 1) + 1) / dict[params.user]['corrects'].length
            }else{
                dict[params.user]['score'] = dict[params.user]['score'] * (dict[params.user]['corrects'].length - 1) / dict[params.user]['corrects'].length
            }

            res.json({
                'score': dict[params.user]['score'],
                'model_result': real_result,
                'user_result': params.result
            });
        })

        console.log("I'm not waiting")

        // const Data={
        //     formula: params.formula
        // }

        // function httpGetAsync(theUrl, params)
        // {
        //     var xmlHttp = new XMLHttpRequest();
        //     xmlHttp.onreadystatechange = function() { 
        //         return xmlHttp.responseText;
        //     }
        //     xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        //     xmlHttp.send(params);
        // }

        // app = httpGetAsync(Url, {'params': params.formula})

        // real_result = await appoggio

        // let fetchData = { 
        //     method: 'POST', 
        //     body: params.formula //headers: new Headers()
        // }
        // real_result = fetch(Url, fetchData)
        //     .then(data => {
        //         return String(data)
        //     })
        //     .then(res => {
        //         console.log(res)
        //     })
        //     .catch(error => console.log(error))
        
        

    }else{
        res.json({
            'score': 'none',
            'model_result': 'none',
            'user_result': 'none'
        });
    }
    // console.log(req.query);
   });

