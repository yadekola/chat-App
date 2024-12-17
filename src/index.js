// 
// Goal: Create an Express web server
// 
// 1. Initialize npm and install Express
// 2. Setup a new Express server
//    - Server up public directory
//    - Listen on port 8080
// 3. Create index.html and render "Chat App" to the screen
// 4. Test your work! Start the server and view the page in the browser

const path = require('path');
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 8080
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// let count = 0

// server (emit) -> client (receive) - countUpdated
// client (email) -> server (receive) - increment





io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // socket.emit('countUpdated', count)

        // 
        // Goal: send a welcome massage is new users
        // 
        // 1. Have server emit "message" when new client connects
        //    - Send "message" as the event data
        // 2. Have client listen for "message" event data
        // 3. Test your work!

        socket.on('join', (options, callback) => {
            const { error, user } = addUser({ id: socket.id, ...options })

            if (error) {
                return callback(error)
            }

            socket.join(user.room)

            socket.emit('message', generateMessage('Admin', 'Welcome!'))
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            
            callback()
    
            // socket.emit, io.emit, socket.broadcast.emit
            // io.to.emit, socket.broadcast.to.emit
        })



    // socket.on('increment', () => {
    //     count++
    //     io.emit('countUpdated', count)
    // })


        // 
        // Goal: Allow client to send messages
        // 
        // 1. Create a form with an input and button
        //    - Similar to weather form
        // 2. Setup event listener for form submissions
        //    - Emit "sendMessage" with input string as message data
        // 3. Have server listen for "sendMessage"
        //    - Send message to all connected clients
        // 4. Test your work!


        socket.on('sendMessage', (message, callback) => {
            const user = getUser(socket.id)
            const filter = new Filter()
    
            if (filter.isProfane(message)) {
                return callback('Profanity is not allowed!')
            }
    
            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        })

        socket.on('sendLocation', (coords, callback) => {
            const user = getUser(socket.id)
            io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
            callback()
        })

        socket.on('disconnect', () => {
            const user = removeUser(socket.id)
    
            if (user) {
                io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: getUsersInRoom(user.room)
                })
            }
        })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

// 
// Goal: Setup scripts in package.json
// 
// 1. Create a "start" script to start the app using node 
// 2. Install nodemon and s development dependency
// 3. Create a "dev" script to start the app using nodemon
// 4. Run both scripts to test your  work