//add the modules
let server;
const express = require('express')
const nodeFetch = require('node-fetch')
const fs = require('fs')

//
const mongoose = require('mongoose')
let cors = require('cors')
let bodyParser = require('body-parser')
let database = require('./db')

//endpoint
//const endpoint = 'http://localhost:3000'
const endpoint = 'https://infinichat-application.herokuapp.com'

//setup the app
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

//
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: false
}));
//

app.get('/', (req, res) => {
    res.render('index', {title: "InfiniChat"})
})
server = app.listen(process.env.PORT || 3000)

//import the routes
const historyRoutes = require('./routes/history.routes')
const eventLogRoutes = require('./routes/eventLog.routes')
const History = require('./models/history');
const EventLog = require('./models/eventLog');

//app error handling
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

//specifies app routes
app.use('', historyRoutes);
app.use('', eventLogRoutes);

//Connect mongoose to database
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {useNewUrlParser: true}).then(
    () => console.log('Database connected successfully')
).catch(error => console.log(`Could not connect to Database: ${error}`))

//connect the socket
var io = require('socket.io')(server);

//set up the connection event and add all required listeners
io.on("connection", (socket) => {
  //Default socket settings: connects User to Room One and randomly assigns a username. Triggers welcome event for user and userLogin for the other sockets
  socket.username = `User${Math.floor(Math.random() * 10000)}` 
  socket.currentRoom = "General"
  socket.join(socket.currentRoom)
  console.log(`${socket.username} has Joined InfiniChat`)
  socket.emit('welcome', {username: socket.username, room: socket.currentRoom, id: socket.id})
  io.sockets.emit('userLogin', {username: socket.username, id: socket.id})
  io.to(socket.currentRoom).emit(`joinRoomBroadcast`, {username: socket.username, room: socket.currentRoom, id: socket.id})
  addEventLog("USER_JOINED", `${socket.username} has joined room: ${socket.currentRoom}`, socket.username, "200");
  nodeFetch(`${endpoint}/api/roomhistory/General`)
  .then(res => res.json())
  .then(json => {socket.emit('fillChat', {messages : json, id: socket.id})})

  //socket disconnect event
  socket.on("disconnect", () => {
    console.log(`${socket.username} has Left InfiniChat`)
    io.sockets.emit('userLogout', {username: socket.username})
    addEventLog("USER_DISCONNECT", `${socket.username} has disconnected`, socket.username, "204")

    //clears log file
    fs.writeFile(`./eventLogs.txt`, "", (err, data) => {
      if (err){
        console.log("An error occured clearing the file")
      }
    })

    //refills log file with new logs
    nodeFetch(`${endpoint}/api/eventlog`)
    .then(res => res.json())
    .then(json => json.map(event => fs.appendFile('./eventLogs.txt', `${event.eventName} | ${event.description} | ${event.user} | ${event.statusCode} | ${event.timestamp}\n`, (err, data) => {
      if (err){
        console.log(`Could not write to file: ${err}`)
      }
    })))
  });

  //socket message event. broadcasts to room
  socket.on("sendMessage", (data) => {
      io.to(socket.currentRoom).emit("sendMessageBroadcast", {id: socket.id, username: socket.username, message: data.message})
      addHistoryObject(socket.username, data.message, socket.currentRoom);
      addEventLog("SEND_MESSAGE", `${socket.username} sent a message to ${socket.currentRoom}`,
          socket.username, "201");
      });

  //emits to all sockets that a User has changed their username
  socket.on("changeUsername", (userData) => {
      console.log(`${socket.username} has change their name to ${userData.username}`)
      io.sockets.emit('changeUsernameBroadcast', {oldUsername: socket.username, newUsername: userData.username, id: socket.id})
      addEventLog("CHANGE_USERNAME", `${socket.username} changed name to ${userData.username}`, userData.username, "202");
      socket.username = userData.username
  })

  //user leaves their current room and joins a new one. All sockets in room are informed of join. All sockets in other room are informed of leaving
  socket.on("joinRoom", (roomObject) => {
    socket.leave(socket.currentRoom)
    io.to(socket.currentRoom).emit(`leaveRoomBroadcast`, {username: socket.username, id: socket.id})
    socket.join(roomObject.room)
    io.to(roomObject.room).emit(`joinRoomBroadcast`, {username: socket.username, room: roomObject.room, id: socket.id})
    socket.currentRoom = roomObject.room
    nodeFetch(`${endpoint}/api/roomhistory/${roomObject.room}`)
    .then(res => res.json())
    .then(json => {socket.emit('fillChat', {messages : json, id: socket.id})})
    console.log(`${socket.username} has joined ${socket.currentRoom}`)
    addEventLog("JOIN", `${socket.username} has joined the ${socket.currentRoom} room`, socket.username, "203");
  })
})

//adds a new History Object
const addHistoryObject = (user, message, room) => {
    let now = Date.now()

    let historyModel = new History({
        user: user,
        message: message,
        room: room,
        timestamp: now
    });

    historyModel.save()
};

//adds a new event Object
const addEventLog = (name, desc, user, code) => {
  let now = Date.now()

  let eventLogModel = new EventLog({
    eventName: name,
    description: desc,
    user: user,
    statusCode: code,
    timestamp: now
  })

  eventLogModel.save()
}
