$(() => {
    //let socket = io.connect('https://infinichat-application.herokuapp.com/')
    let socket = io.connect('http://localhost:3000/')
    let socketId

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

    changeUsername.click(() => {
        socketUsername = username.val()
        socket.emit('changeUsername', {"username": username.val()})
    })

    sendMessage.click(() => {
        socket.emit('sendMessage', {"message": message.val()})
    })

    socket.on("sendMessageBroadcast", (messageData) => {
        if (socketId != messageData.id){  
            chatroom.append(`<p class="h5 p-2"><u>${messageData.username}</u>: ${messageData.message}</p>`)
        }
        else {
            chatroom.append(`<p class="h5 p-2 text-success"><u>${messageData.username}</u>: ${messageData.message}</p>`)
        }
    })

    socket.on('welcome', (user) => {
        socketId = user.id
        username.val(user.username)
        changeRoomButtonColors('green', 'white', 'white', 'white')
        makeToastMessage('InfiniChat', 'Welcome To InfiniChat!', 'text-success')
    })

    socket.on('userLogin', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.username, "has logged into InfiniChat", 'text-success')
        }
    })

    socket.on('userLogout', (user) => {
        makeToastMessage(user.username, 'has logged out of InfiniChat', 'text-danger')
    })

    socket.on('changeUsernameBroadcast', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.oldUsername, `has changed their name to ${user.newUsername}`)
        }
        else {
            makeToastMessage(user.newUsername, `You have changed your name to ${user.newUsername}`)
        }
    })

    socket.on('joinRoomBroadcast', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.username, "has joined the room", 'text-success')
        }
        else {
            makeToastMessage(user.username, `you are now in room ${user.room}`)
        }
    })

    socket.on('leaveRoomBroadcast', (user) => {
        if (user.id != socketId){
            makeToastMessage(user.username, "has left the room", 'text-warning')
        }
    })

    roomGeneral.click(() => {
        socket.emit('joinRoom', {"room": "General"})
        changeRoomButtonColors('green', 'white', 'white', 'white')
    })

    roomTechnology.click(() => {
        socket.emit('joinRoom', {"room": "Technology"})
        changeRoomButtonColors('white', 'green', 'white', 'white')
    })

    roomAcademics.click(() => {
        socket.emit('joinRoom', {"room": "Academics"})
        changeRoomButtonColors('white', 'white', 'green', 'white')
    })

    roomBadJokes.click(() => {
        socket.emit('joinRoom', {"room": "Bad Jokes"})
        changeRoomButtonColors('white', 'white', 'white', 'green')
    })

    const changeRoomButtonColors = (one, two, three, four) => {
        roomGeneral.css('background-color', one)
        roomTechnology.css('background-color', two)
        roomAcademics.css('background-color', three)
        roomBadJokes.css('background-color', four)
    }

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