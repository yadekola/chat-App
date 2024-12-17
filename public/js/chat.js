const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count)
// })

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
                                                                                                                                                                                            
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// 
// Goal: Create a separate event for location sharing messages
// 
// 1. Have server emit "locationMessage" with the URL 
// 2. Have the client listen for "locationMessage" and print the URL to the console
// 3. Test ypour work by sharing a location!




socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


// 
// Goal: Render new template for location messages
// 
// 1. Duplicate the message template
//    - Change the id to something else
// 2. Add a link inside the paragraph with the link text "My current location"
//    - URL for link should be the maps URL (dynamic)
// 3. Select the template from JavaScript
// 4. Render the template with the URL and append to massages list
// 5. Test your work!

// 
// Goal: Add timestamps for location message
// 
// 1. Create generateLocationMasssage and export
//    - { url: '', createdAt: 0 }
// 2. Use genereatedLocationMessage when server emits locationMessage 
// 3. Update template to render time before the url
// 4. Compile the template with the URL and the formatted time
// 5. Test your work!

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        // 
        // Goal: Share coordinates with other users
        // 
        // 1. Have client emit "sendLocation" with an object as the data
        //    -  Object Should contain and longitude properties
        // 2. Server should listen for "sendLocation"
        //    -  When fired send a "message" to alll connected clients "Location: Latitude, longitude"
        // 3. Test your work


        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })

        // console.log(position)
    })
})

// 
// Goal: Setup acknowledgment
// 
// 1. Setup the client acknowledgment function 
// 2. Setup the server to send back the acknowledgment
// 3. Have the client print "Location Shared!" when acknowleged
// 4. Test your work!

// 
// Goal: Disable the send location button whiole location being sent
// 
// 1. Set up a selector at the top of the file
// 2. Disable the button just before getting the current position
// 3. Enable the button in the acknowledgment callback
// 4.Test your work!

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})