const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;



console.log(__dirname + '/../public');
console.log(publicPath);

var app=express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'));


    socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

    socket.on('createMessage',(message,callback) => {
         console.log('createMessage', message);
                
        io.emit('newMessage', generateMessage(message.from,message.text));
        callback();
    });

    socket.on('disconnect', () => {
        console.log('user diconnected');
    });

    socket.on('createLocationMessage', (coords)=> {
        io.emit('newLocationMessage', generateLocationMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
    });
});




server.listen(port, () => {
    console.log(`server is up on ${port}`);
});