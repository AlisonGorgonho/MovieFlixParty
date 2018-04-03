const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
})

let messages = [];
let pausadoServidor = true;

io.on('connection', socket => {

    console.log(`socket conectado ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data)
    });

    socket.on('pauseClicado', data =>{
        console.log("Servidor informa que o pause foi clicado.");
        pausadoServidor = data;
        socket.broadcast.emit("estadoDoPlayer", pausadoServidor);
    })
    socket.on("playClicado", data => {
        pausadoServidor = data;
        console.log("O servidor informa que o play foi clicado.");
        socket.broadcast.emit("estadoDoPlayer", pausadoServidor)
    })

});

server.listen(process.env.PORT || 3000);
