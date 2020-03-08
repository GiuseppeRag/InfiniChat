//add the modules
const http = require('http')
const url = require('url')
let server;
const express = require('express')
//
const mongoose = require('mongoose')
let cors = require('cors')
let bodyParser = require('body-parser')
let database = require('./db')

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

  //socket disconnect event
  socket.on("disconnect", () => {
    console.log(`${socket.username} has Left InfiniChat`)
    io.sockets.emit('userLogout', {username: socket.username})
  })

  //socket message event. broadcasts to room
  socket.on("sendMessage", (data) => {
      io.to(socket.currentRoom).emit("sendMessageBroadcast", {id: socket.id, username: socket.username, message: data.message})
  })

  //emits to all sockets that a User has changed their username
  socket.on("changeUsername", (userData) => {
      console.log(`${socket.username} has change their name to ${userData.username}`)
      io.sockets.emit('changeUsernameBroadcast', {oldUsername: socket.username, newUsername: userData.username, id: socket.id})
      socket.username = userData.username
  })

  //user leaves their current room and joins a new one. All sockets in room are informed of join. All sockets in other room are informed of leaving
  socket.on("joinRoom", (roomObject) => {
    socket.leave(socket.currentRoom)
    io.to(socket.currentRoom).emit(`leaveRoomBroadcast`, {username: socket.username, id: socket.id})
    socket.join(roomObject.room)
    io.to(roomObject.room).emit(`joinRoomBroadcast`, {username: socket.username, room: roomObject.room, id: socket.id})
    socket.currentRoom = roomObject.room
    console.log(`${socket.username} has joined ${socket.currentRoom}`)
  })
})
