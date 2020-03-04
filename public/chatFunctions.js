$(() => {
    //var socket = io.connect('https://infinichat-application.herokuapp.com/')
    var socket = io.connect('http://localhost:3000/')

    var changeUsername = $("#btnChangeUsername")
    var username = $('#txtUsername')
    var message = $('#txtMessage')
    var sendMessage = $("#btnSendMessage")
    var chatroom = $('#chatroom')
    var roomOne = $('#roomOne')
    var roomTwo = $('#roomTwo')
    var roomThree = $('#roomThree')
    var roomFour = $('#roomFour')
    var roomMessage = $('#roomMessage')
    var newUserMessage = $('#newUserMessage')

    changeUsername.click(() => {
        socket.emit('changeUsername', {"username": username.val()})
    })

    sendMessage.click(() => {
        socket.emit('sendMessage', {"message": message.val()})
    })

    socket.on("sendMessage", (messageData) => {  
        console.log(`${messageData.username} has sent data: ${messageData.message}`)
        chatroom.append(`<p>${messageData.username}: ${messageData.message}</p>`)
    })

    socket.on('welcome', (user) => {
        displayMessage('Welcome to InfiniChat! You are currently logged in as ' + user.username)
        username.val(user.username)
    })

    socket.on('newUser', (user) => {
        userLog(user.username + ' has logged into InfiniChat')
    })

    socket.on('userLogout', (user) => {
        userLog(user.username + ' has logged out of InfiniChat')
    })

    socket.on('usernameChange', (user) => {
        userLog(user.oldUsername + ' has changed their name to ' + user.newUsername)
    })

    roomOne.click(() => {
        socket.emit('joinRoom', {"room": "Room One"})
        displayMessage('You are currently in Room One')
    })

    roomTwo.click(() => {
        socket.emit('joinRoom', {"room": "Room Two"})
        displayMessage('You are currently in Room Two')
    })

    roomThree.click(() => {
        socket.emit('joinRoom', {"room": "Room Three"})
        displayMessage('You are currently in Room Three')
    })

    roomFour.click(() => {
        socket.emit('joinRoom', {"room": "Room Four"})
        displayMessage('You are currently in Room Four')
    })

    const displayMessage = (message) => {
        roomMessage.stop()
        roomMessage.fadeIn(250)
        roomMessage.text(message).delay(3000)
        roomMessage.fadeOut(500)
    }

    const userLog = (message) => {
        newUserMessage.stop()
        newUserMessage.fadeIn(250)
        newUserMessage.text(message).delay(3000)
        newUserMessage.fadeOut(500)
    }
})