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
                'posi_nega': [],
                'score': 0
            }
        }

        console.log(params.sentence)

        dict[params.user]['sentences'].push(params.sentence)

        
        async function getAnswer(param) {
            try {
                // Optionally the request above could also be done as
                const response = await axios.get(Url + '/', {
                    params: {
                        sentence: param
                    }
                });
                console.log('await response', response.data);
                return response.data

            } catch (error) {
                console.error(error);
            }
        }

        const response = getAnswer(params.sentence).then(data => {

            data = data == 'True'
        
            dict[params.user]['posi_nega'].push(data)
            console.log('final data', Boolean(data))

            if (Boolean(data)){
                dict[params.user]['score'] = (dict[params.user]['score'] * (dict[params.user]['posi_nega'].length - 1) + 1) / dict[params.user]['posi_nega'].length
            }else{
                dict[params.user]['score'] = dict[params.user]['score'] * (dict[params.user]['posi_nega'].length - 1) / dict[params.user]['posi_nega'].length
            }

            res.json({
                'score': dict[params.user]['score'],
                'model_result': Boolean(data)
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
            'model_result': 'none'
        });
    }
    // console.log(req.query);
   });

