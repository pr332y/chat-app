const socket=io()
//Elements
const $messageForm=document.getElementById('message-form')
const $messageFormInput=$messageForm.getElementsByTagName('input')[0]
const $messageFormButton=$messageForm.getElementsByTagName('button')[0]
const $sendLocation=document.getElementById('send-location')
const $messages=document.getElementById('messages')

//Templates
const messageTemplate=document.getElementById('message-template').innerHTML
const locationMessageTemplate=document.getElementById('location-message-template').innerHTML
const sidebarTemplate=document.getElementById('sidebar-template').innerHTML

//Options
const {username,room}=qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    //New msg element
    const $newMessage=$messages.lastElementChild
    //Get height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    //Visible height
    const visibleHeight=$messages.offsetHeight
    //Height of messages container
    const containerHeight=$messages.scrollHeight
    //How far have I scrolled
    const scrollOffset=$messages.scrollTop
    if (containerHeight-newMessageHeight<=scrollOffset) {
        $messages.scrollTop=$messages.scrollHeight
    }
}

socket.on('message',msg=>{
    const html=Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',msg=>{
    const html=Mustache.render(locationMessageTemplate,{
        username:msg.username,
        url:msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.getElementById('sidebar').innerHTML=html
})
$messageForm.addEventListener('submit',e=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value
    socket.emit('sendMessage',message,error=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message Delivered')
    })
})
$sendLocation.addEventListener('click',()=>{
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition(position=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocation.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})

socket.emit('join',{username,room},error=>{
    if (error) {
        alert(error)
        location.href='/'
    }
})