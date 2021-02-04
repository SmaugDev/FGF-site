require('babel-register');
const express = require('express');
const app = express();
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./assets/swagger.json');
//const expressOasGenerator = require('express-oas-generator');
//expressOasGenerator.init(app, {}); // to overwrite generated specification's values use second argument.
const  morgan = require('morgan')('dev');
const bodyParser = require('body-parser');
const config = require('./config.js');

const {checkAndChange} = require('./util/functions');

const apiRouterV1Members = require('./routes/member')
const apiRouterV1Articles = require('./routes/articles')

    app.use(morgan)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : true}))

    //ROUTES
    app.use("/api/v1/members", apiRouterV1Members);
    app.use("/api/v1/articles", apiRouterV1Articles);

    app.all('*', (req, res)=>{
        res.status(404)
        res.json(checkAndChange(new Error("404 not found")))
    })
  

app.listen(config.port, () => console.log('Started on port '+ config.port));
    

