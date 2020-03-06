$(() => {
    let socket = io.connect('https://infinichat-application.herokuapp.com/')
    //let socket = io.connect('http://localhost:3000/')
    let socketUsername

    let changeUsername = $("#btnChangeUsername")
    let username = $('#txtUsername')
    let message = $('#txtMessage')
    let sendMessage = $("#btnSendMessage")
    let chatroom = $('#chatroom')
    let roomOne = $('#roomOne')
    let roomTwo = $('#roomTwo')
    let roomThree = $('#roomThree')
    let roomFour = $('#roomFour')
    let toastArea = $('#toastArea')

    changeUsername.click(() => {
        socketUsername = username.val()
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
        socketUsername = user.username
        username.val(user.username)
        changeRoomButtonColors('green', 'white', 'white', 'white')
        makeToastMessage('InfiniChat', 'Welcome To InfiniChat!', 'text-success')
    })

    socket.on('userLogin', (user) => {
        if (user.username != socketUsername){
            makeToastMessage(user.username, "has logged into InfiniChat", 'text-success')
        }
    })

    socket.on('userLogout', (user) => {
        makeToastMessage(user.username, 'has logged out of InfiniChat', 'text-danger')
    })

    socket.on('changeUsernameBroadcast', (user) => {
        if (user.newUsername != socketUsername){
            makeToastMessage(user.oldUsername, `has changed their name to ${user.newUsername}`)
        }
    })

    socket.on('joinRoomBroadcast', (user) => {
        if (user.username != socketUsername){
            makeToastMessage(user.username, "has joined the room", 'text-success')
        }
    })

    socket.on('leaveRoomBroadcast', (user) => {
        if (user.username != socketUsername){
            makeToastMessage(user.username, "has left the room", 'text-warning')
        }
    })

    roomOne.click(() => {
        socket.emit('joinRoom', {"room": "Room One"})
        changeRoomButtonColors('green', 'white', 'white', 'white')
    })

    roomTwo.click(() => {
        socket.emit('joinRoom', {"room": "Room Two"})
        changeRoomButtonColors('white', 'green', 'white', 'white')
    })

    roomThree.click(() => {
        socket.emit('joinRoom', {"room": "Room Three"})
        changeRoomButtonColors('white', 'white', 'green', 'white')
    })

    roomFour.click(() => {
        socket.emit('joinRoom', {"room": "Room Four"})
        changeRoomButtonColors('white', 'white', 'white', 'green')
    })

    const changeRoomButtonColors = (one, two, three, four) => {
        roomOne.css('background-color', one)
        roomTwo.css('background-color', two)
        roomThree.css('background-color', three)
        roomFour.css('background-color', four)
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