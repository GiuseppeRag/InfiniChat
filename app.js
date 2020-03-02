const http = require('http')
const url = require('url')
const fs = require('fs') 
let server;
const express = require('express')
const mongoose = require('mongoose')

const app = express()

/*
server = http.createServer(function(req, res){

  var path = url.parse(req.url).pathname;
  switch (path){
    case '/':
      fs.readFile(__dirname + '/index.html', function(err, data){
          if (err) return send404(res);
          res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
          res.write(data, 'utf8');
          res.end();
      });
      break;

    default: send404(res);
  }
})

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};
*/

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

server = app.listen(process.env.PORT || 3000)

var io = require('socket.io')(server);

io.on("connection", (socket) => {
  socket.username = "New User"  
  socket.currentRoom = "Room One"
  socket.join(socket.currentRoom)
  console.log(`${socket.username} has Joined InfiniChat`)

  socket.on("disconnect", () => {
    console.log(`${socket.username} has Left InfiniChat`)
  })

  socket.on("sendMessage", (data) => {
      io.to(socket.currentRoom).emit("sendMessage", {"username": socket.username, "message": data.message})
  })

  socket.on("changeUsername", (userData) => {
      console.log(`${socket.username} has change their name to ${userData.username}`)
      socket.username = userData.username
  })

  socket.on("joinRoom", (roomObject) => {
    socket.leave(socket.currentRoom)
    socket.join(roomObject.room)
    socket.currentRoom = roomObject.room
    console.log(`${socket.username} has joined ${socket.currentRoom}`)
  })
})