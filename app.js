const http = require('http')
const url = require('url')
const fs = require('fs') 
let server;
const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

server = app.listen(process.env.PORT || 3000)

var io = require('socket.io')(server);

io.on("connection", (socket) => {
<<<<<<< HEAD
  socket.username = `User${Math.floor(Math.random() * 10000)}` 
=======
  socket.username = "New User"
>>>>>>> d0d87ec756ebfb0e3b0d2bbb45e4b15ef419a1a5
  socket.currentRoom = "Room One"
  socket.join(socket.currentRoom)
  console.log(`${socket.username} has Joined InfiniChat`)
  socket.emit('welcome', {username: socket.username})
  io.sockets.emit('userLogin', {username: socket.username})

  socket.on("disconnect", () => {
    console.log(`${socket.username} has Left InfiniChat`)
    io.sockets.emit('userLogout', {username: socket.username})
  })

  socket.on("sendMessage", (data) => {
      io.to(socket.currentRoom).emit("sendMessage", {"username": socket.username, "message": data.message})
  })

  socket.on("changeUsername", (userData) => {
      console.log(`${socket.username} has change their name to ${userData.username}`)
      io.sockets.emit('changeUsernameBroadcast', {oldUsername: socket.username, newUsername: userData.username})
      socket.username = userData.username
  })

  socket.on("joinRoom", (roomObject) => {
    socket.leave(socket.currentRoom)
    io.to(socket.currentRoom).emit(`leaveRoomBroadcast`, {username: socket.username})
    socket.join(roomObject.room)
    io.to(roomObject.room).emit(`joinRoomBroadcast`, {username: socket.username})
    socket.currentRoom = roomObject.room
    console.log(`${socket.username} has joined ${socket.currentRoom}`)
  })
})
