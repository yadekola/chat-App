// 
// Goal: Deploy the chat application 
// 
// 1. Setup Git and commit files
//    - Ignore node_modeules folder
// 2. Setup a GitHub repository and push code up
// 3. Setup a Heroku app and push code up
// 4. Open the live app and test your work

const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

addUser({
    id: 22,
    username: 'Yakub  ',
    room: '  South Philly'
})

addUser({
    id: 42,
    username: 'Mike  ',
    room: '  South Philly'
})

addUser({
    id: 22,
    username: 'Yakub  ',
    room: '  Center City'
})



const user = getUser(42)
console.log(user)

// const userList = getUsersInRoom('south philly')
const userList = getUsersInRoom('Center City')
console.log(userList)

// const res = addUser({
//     id: 33,
//     username: 'Yakub ',
//     room: '  South Philly'
// })

// console.log(res)


// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)

// 
// Goal: Create two new functions for users
// 
// 1. Create getUsers
//    - Accept id and return user object (or underfined)
// 2. Create getUsersInRoom
//    - Accept room name and return array of users (or empty array)
// 3. Test your work by calling the functions!

// 
// Goal: Send message to correct room
// 
// 1. Use getUser inside "sendMessage" event handter to get user data
// 2. Emit the messsage to their current room
// 3. Test your work!
// 4. Repeat for "sendMessage"

// 
// Goal: Render username for text message 
// 
// 1. Setup the server to send username to client
// 2. Edit every call to "generateMessage" to include username
//    - Use "Admin" for sts messages like connect/welcome/disconnect
// 3. Update client to render username in template
// 4. Test your work!