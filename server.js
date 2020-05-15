const express = require('express')
const path = require('path')

const app = express()
const port = 3000
const server = require('http').createServer(app)
const io = require('socket.io')(server)

/// HTML
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

// ROUTERS
app.get('/', (req, res) => 
    res.render('index.html')
)

let messages = [];

/// SOCKET IO, CONNECT
io.on('connection', socket => {
    console.log(`Socket connectado: ${socket.id}`)
    // recuperar chats
    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data => {
       // console.log(data)
       messages.push(data)

       socket.broadcast.emit('receivedMessage', data)

    })
})

/// SERVE E NÃO APP
server.listen(port)
