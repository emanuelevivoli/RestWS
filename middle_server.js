var express = require("express");
var cors = require('cors')
var app = express()
// const fetch = require("node-fetch");
const axios = require('axios');

app.use(cors())

//We are listening on port 3000
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

//The end server is listening on localhost:4000
const Url = 'http://localhost:4000';

//Allowed usernames
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

//How to respond to a get request on localhost:3000/answer
app.get("/answer", (req, res, next) => {
    const params = req.query;
    if (people.includes(params.user)){
	//Ignore unknown users
        if (!(params.user in dict)){
            dict[params.user] = {
                'sentences': [],
                'corrects': [],
                'score': 0
            }
        }

        console.log(params.formula)

	//Let s log the formula
        dict[params.user]['sentences'].push(params.formula)

        //Asks for verified answer from the end server
        async function getAnswer(param) {
            try {
                //use Axios to make the get request (await in function forces function to be async)
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

	//Ask for the server s answer
        const response = getAnswer(params.formula).then(data => {
		//then process it
            real_result = data

            correct = params.result == real_result
        
            dict[params.user]['corrects'].push(correct)

            if (correct){
                dict[params.user]['score'] = (dict[params.user]['score'] * (dict[params.user]['corrects'].length - 1) + 1) / dict[params.user]['corrects'].length
            }else{
                dict[params.user]['score'] = dict[params.user]['score'] * (dict[params.user]['corrects'].length - 1) / dict[params.user]['corrects'].length
            }
		//Define the response to give the middle server
            res.json({
                'score': dict[params.user]['score'],
                'model_result': real_result,
                'user_result': params.result
            });
        })

        console.log("I'm not waiting")

    }else{
        res.json({
            'score': 'none',
            'model_result': 'none',
            'user_result': 'none'
        });
    }
   });

