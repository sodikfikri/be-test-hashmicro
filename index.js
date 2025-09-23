const express = require("express")
const bodyParser = require("body-parser")
const routes = require('./routes')
const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
)

app.use(
  bodyParser.json({
    inflate: true,
    limit: "50mb",
    type: () => true,
  })
)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
  res.header("Access-Control-Expose-Headers", "Content-Length")
  res.header("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, X-Requested-With, Range, x-api-key, x-forwarded-for")
  if (req.method === "OPTIONS") {
    return res.json(200)
  } else {
    return next()
  }
})

routes.routesConfig(app)
app.listen(3000, () => console.log('Server is running on port 3000'));
