$(() => {
    let socket = io.connect('https://infinichat-application.herokuapp.com/')
    //let socket = io.connect('http://localhost:3000/')
    let socketId

    //get JQuery elements
    let changeUsername = $("#btnChangeUsername")
    let username = $('#txtUsername')
    let message = $('#txtMessage')
    let sendMessage = $("#btnSendMessage")
    let chatroom = $('#chatroom')
    let roomGeneral = $('#roomGeneral')
    let roomTechnology = $('#roomTechnology')
    let roomAcademics = $('#roomAcademics')
    let roomBadJokes = $('#roomBadJokes')
    let toastArea = $('#toastArea')

    //Change Username Button
    changeUsername.click(() => {
        socketUsername = username.val()
        socket.emit('changeUsername', {"username": username.val()})
    })

    //Send Message Button
    sendMessage.click(() => {
        socket.emit('sendMessage', {"message": message.val()})
    })

    //Fills Chat upon entering new room
    socket.on('fillChat', (data) => {
        console.log(data)
        chatroom.empty()
        data.messages.map(message => {chatroom.append(`<p class="h5 p-2"><u>${message.user}</u>: ${message.message}</p>`)})
    })

    //All sockets in room are informed to append data
    socket.on("sendMessageBroadcast", (messageData) => {
        if (socketId != messageData.id){  
            chatroom.append(`<p class="h5 p-2"><u>${messageData.username}</u>: ${messageData.message}</p>`)
        }
        else {
            chatroom.append(`<p class="h5 p-2 text-success"><u>${messageData.username}</u>: ${messageData.message}</p>`)
        }
    })

    //new socket is welcomed
    socket.on('welcome', (user) => {
        socketId = user.id
        username.val(user.username)
        changeRoomButtonColors('green', 'white', 'white', 'white')
        makeToastMessage('InfiniChat', 'Welcome To InfiniChat!', 'text-success')
    })

    //broadcast to all sockets except new socket that new user joined
    socket.on('userLogin', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.username, "has logged into InfiniChat", 'text-success')
        }
    })

    //informs all sockets that a user disconnected
    socket.on('userLogout', (user) => {
        makeToastMessage(user.username, 'has logged out of InfiniChat', 'text-danger')
    })

    //informs all sockets except the executing socket that its username was changed
    socket.on('changeUsernameBroadcast', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.oldUsername, `has changed their name to ${user.newUsername}`)
        }
        else {
            makeToastMessage(user.newUsername, `You have changed your name to ${user.newUsername}`)
        }
    })

    //informs all sockets in room that a new user joined
    socket.on('joinRoomBroadcast', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.username, "has joined the room", 'text-success')
        }
        else {
            makeToastMessage(user.username, `you are now in room ${user.room}`)
        }
    })

    //informs all sockets in room that user left room
    socket.on('leaveRoomBroadcast', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.username, "has left the room", 'text-warning')
        }
    })

    //General Button
    roomGeneral.click(() => {
        socket.emit('joinRoom', {"room": "General"})
        changeRoomButtonColors('green', 'white', 'white', 'white')
    })

    //Technology Button
    roomTechnology.click(() => {
        socket.emit('joinRoom', {"room": "Technology"})
        changeRoomButtonColors('white', 'green', 'white', 'white')
    })

    //Academics Button
    roomAcademics.click(() => {
        socket.emit('joinRoom', {"room": "Academics"})
        changeRoomButtonColors('white', 'white', 'green', 'white')
    })

    //Bad Jokes Button
    roomBadJokes.click(() => {
        socket.emit('joinRoom', {"room": "Bad Jokes"})
        changeRoomButtonColors('white', 'white', 'white', 'green')
    })

    //Changes button colors when changing rooms
    const changeRoomButtonColors = (one, two, three, four) => {
        roomGeneral.css('background-color', one)
        roomTechnology.css('background-color', two)
        roomAcademics.css('background-color', three)
        roomBadJokes.css('background-color', four)
    }

    //creates the toast messages
    const makeToastMessage = (actor, message, color='') => {
        toastArea.append(`
            <div class="toast" style="width: 300px;" data-delay=2500>
                <div class="toast-header">
                    <Strong class="mr-auto ${color}" style="width: 260px;">${actor}</Strong>
                    <button type="button" class="close mr-auto" data-dismiss="toast" style="float: right;">&times;</button>
                </div>
                <div class="toast-body ${color}">
                    ${message}
                </div>
            </div>
        `)
        toastArea.children("div:last-child").toast('show')
    }
})