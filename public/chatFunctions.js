$(() => {
    var socket = io.connect('http://localhost:3000')

    var changeUsername = $("#btnChangeUsername")
    var username = $('#txtUsername')
    var message = $('#txtMessage')
    var sendMessage = $("#btnSendMessage")
    var chatroom = $('#chatroom')

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
})