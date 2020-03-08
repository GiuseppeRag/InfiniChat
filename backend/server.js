let express = require('express')
let path = require('path')
let mongoose = require('mongoose')
let cors = require('cors')
let bodyParser = require('body-parser')
let database = require('../db')

mongoose.Promise = global.Promise;
mongoose.connect(database.db, {useNewUrlParser: true}).then(
    () => console.log('Database connected successfully')
).catch(error => console.log(`Could not connect to Database: ${error}`))

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(express.static(path.join(__dirname, 'public/Infinichat')));
app.use('/', express.static(path.join(__dirname, 'public/Infinichat')));
const port = process.env.port || 3001

const server = app.listen(port, () => {
    console.log(`Hooked to port ${port}`)
})

const historyRoutes = require('../routes/history.routes')
const eventLogRoutes = require('../routes/eventLog.routes')
app.use('/api', historyRoutes)
app.use('/api', eventLogRoutes)
app.use((req, res, next) => {
    next()
})

app.use((err, req, res, next) => {
    console.error(err.message);
    if (!err.statusCode){
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
});
