$(() => {
    var socket = io.connect('http://localhost:3000')

    var changeUsername = $("#btnChangeUsername")
    var username = $('#txtUsername')
    var message = $('#txtMessage')
    var sendMessage = $("#btnSendMessage")
    var chatroom = $('#chatroom')
    var roomOne = $('#roomOne')
    var roomTwo = $('#roomTwo')
    var roomThree = $('#roomThree')
    var roomFour = $('#roomFour')

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

    roomOne.click(() => {
        socket.emit('joinRoom', {"room": "Room One"})
    })

    roomTwo.click(() => {
        socket.emit('joinRoom', {"room": "Room Two"})
    })

    roomThree.click(() => {
        socket.emit('joinRoom', {"room": "Room Three"})
    })

    roomFour.click(() => {
        socket.emit('joinRoom', {"room": "Room Four"})
    })
})