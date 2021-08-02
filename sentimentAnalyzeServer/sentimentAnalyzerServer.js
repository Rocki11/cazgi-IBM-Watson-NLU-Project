const express = require('express');
const app = new express();

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    //console.log(process.env.API_KEY, process.env.API_URL)
    let api_key = process.env.API_KEY
    let api_url = process.env.API_URL

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-07-19',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding
}
NLU = getNLUInstance()

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    console.log("Analyze URL emotion: ", req.query.url)
    let analyzeParams = {
        'text': req.query.url,
        'features': {
            'entities': { 'emotion': true, 'sentiment': false}, 
            'keywords': { 'emotion': true, 'sentiment': false}
        }
    };
    NLU.analyze(analyzeParams).then(function (analyzeResult) {
        // console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analyzeResult.result.entities[0].emotion)
        return res.send({ emotions: analyzeResult.result.entities[0].emotion });
    }).catch(function(error){
        console.log(error)
        return res.send({"Error":error});
    });
});

app.get("/url/sentiment", (req,res) => {
    console.log("Analyzing sentiment for the URL: ", req.query.url)
    let analyzeParams = {
        'text': req.query.url,
        'features': {
            'entities': { 'emotion': false, 'sentiment': true}, 
            'keywords': { 'emotion': false, 'sentiment': true}
        }
    };
    NLU.analyze(analyzeParams).then(function (analyzeResult) {
        // console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analayzeResult.result.entities[0].sentiment.label)
        return res.send({ sentiments: analyzeResult.result.entities[0].sentiment.label });
    }).catch(function(error){
        console.log(error)
        return res.send({"Error":error});
    });
});

app.get("/text/emotion", (req,res) => {
    console.log("Analyzing emotion for the givent text ...")
    let analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': { 'emotion': true, 'sentiment': false}, 
            'keywords': { 'emotion': true, 'sentiment': false}
        }
    };
    NLU.analyze(analyzeParams).then(function (analyzeResult) {
        // console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analyzeResult.result.entities[0].emotion)
        return res.send({ emotions: analyzeResult.result.entities[0].emotion });
    }).catch(function(error){
        console.log(error)
        return res.send({"Error":error});
    });
});

app.get("/text/sentiment", (req,res) => {
    console.log("Analyzing sentiment for the givent text ...")
    let analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': { 'emotion': false, 'sentiment': true}, 
            'keywords': { 'emotion': false, 'sentiment': true}
        }
    };
    NLU.analyze(analyzeParams).then(function (nluResult) {
        // console.log(JSON.stringify(analysisResults, null, 2));
        console.log(analyzeResult.result.entities[0].sentiment.label)
        return res.send({ sentiments: nluResult.result.entities[0].sentiment.label });
    }).catch(function(error){
        console.log(error)
        return res.send({"Error":error});
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
