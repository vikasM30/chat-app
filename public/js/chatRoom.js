let socket = io()

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild
    messages.scrollIntoView()
}

socket.on('connect', () => {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
  
    socket.emit('join', params, function(err) {
      if(err){
        alert(err);
        window.location.href = '/';
      }else {
        console.log('No Error');
      }
    })
});

socket.on('disconnect', () => {
console.log('Disconnected from server');
});

socket.on('updateUsersList', function (users) {
    let ol = document.createElement('ol');
  
    users.forEach(function (user) {
      let li = document.createElement('li');
      li.innerHTML = user;
      ol.appendChild(li);
    });
  
    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ol);
  })

socket.on('newMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT')
    // console.log('newMessage', message)
    // let li = document.createElement('li')
    // li.innerText = `${message.from} ${formattedTime}: ${message.text}`
    // document.querySelector('body').appendChild(li)
    const template = document.querySelector('#message-template').innerHTML
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    })

    const div = document.createElement('div')
    div.innerHTML = html
    document.querySelector('#messages').appendChild(div)
    scrollToBottom()
})

socket.on('newLocationMessage', (message) => {
    const formattedTime = moment(message.createdAt).format('LT')
    const template = document.querySelector('#location-message-template').innerHTML
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    })

    const div = document.createElement('div')
    div.innerHTML = html
    document.querySelector('#messages').appendChild(div)
    // console.log('newLocationMessage', message)
    // let li = document.createElement('li')
    // let a = document.createElement('a')
    // li.innerText = `${message.from} ${formattedTime}: `
    // a.setAttribute('target', '_blank')
    // a.setAttribute('href', message.url)
    // a.innerText = 'My current location'
    // li.appendChild(a)
    // document.querySelector('body').appendChild(li)
    scrollToBottom()
})

// socket.emit('createMessage', {
//     from: 'john',
//     text: 'Hey'
// } , (message) => {
//     console.log('Got it.', message)
// })

document.querySelector('#submit-btn').addEventListener('click', (e) => {
    e.preventDefault()

    socket.emit('createMessage', {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, () => {
        document.querySelector('input[name="message"]').value = ''
    })
})

document.querySelector('#send-location').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geo location is not supported by the browser.')
    }
    navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit('createLocationMessage', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        })
    }, () => {
        alert('Unable to fetch location.')
    })
})