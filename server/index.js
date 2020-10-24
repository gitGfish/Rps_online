const express = require('express')
const socletio = require('socket.io')
const http = require('http')

const {addUser,removeUser,getUser,makeMove,getGameBoard,addGame,setUserReady,getUsersInRoom,isAllReady} = require('./users.js')


const PORT = process.env.PORT || 4000;
const router = require('./router');
const app = express();
const server = http.createServer(app);
const io = socletio(server);


io.on('connection', (socket) => {
    console.log('new connection ')

    socket.on('join', ({name, room},callback) => {
        console.log(name,room)
        let {error,user} = addUser({socket_id:socket.id,name,room});

        if(error) return callback(error);
        socket.broadcast.to(user.room).emit('message', {user:'admin', text: `${user.name}, has joined`})
        socket.join(user.room);
        const users = getUsersInRoom(room)
        io.to(room).emit('usersInRoom', users )
        // if(error){
        //     callback({error:'error'})
        // }
        callback(users);
    })

    socket.on('roomData', ({room},callback) => {
        const users_in_room = getUsersInRoom(room)
        console.log("roomData", users_in_room)
        callback(users_in_room);
    })

    socket.on('startedGame', ({room,name},callback) => {
        console.log(name)
        const users_in_room = getUsersInRoom(room)
        const game = getGameBoard(room)
        callback(users_in_room,game,name);
    })

    socket.on('move', ({room,x_index,y_index,from_x,from_y},callback) => {
        const game = makeMove(room,x_index,y_index,from_x,from_y)
        console.log(game)
        // const game = getGameBoard(room)
        io.to(room).emit('updateGame' , game)
        // callback()
    })

    socket.on('playerReady', ({room,board},callback) => {
        console.log(board)
        const status = setUserReady(socket.id,board)
        const users = getUsersInRoom(room)
        console.log(users)
        
        if(isAllReady(room)){
            addGame(room)
            io.to(room).emit('allUsersReady') 
        }else{
            io.to(room).emit('usersInRoom', users)
        }
        callback(status);
    })


    socket.on('disconnect', () => {
        const room = removeUser(socket.id)
        io.to(room).emit('usersInRoom', (getUsersInRoom(room)))
        
        
    })
})



app.use(router);

server.listen(PORT,() => console.log(`server has started on port ${PORT}`));
