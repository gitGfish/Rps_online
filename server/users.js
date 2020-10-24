const users = [];
const games = [];


const addUser = ({socket_id,name,room}) => {
    if(!name || !room ) return {error: 'please fill all inputs'}
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const existingUser = users.find((user) => user.room === room && user.name === name)
    if(existingUser){
        return {error: 'Username is already taken'}
    }
    let existingUsers = users.filter((user) => user.room == room )
    if(!existingUsers){
        existingUsers = [];
    } 
    const user = {socket_id,name,room,is_ready:false,board:[],player_id:existingUsers.length};
    users.push(user)
    return {user}
}

const removeUser = (socket_id) => {
    const index = users.findIndex((user) => user.socket_id === socket_id)
    
    const user = users[index]
    const game_index = games.findIndex((game) => user.room === game.room )
    if(index !== -1){
        users.splice(index,1)[0];
        if(game_index !== -1){
            games.splice(game_index,1)[0];
        }
        
        return user.room
    }
}
const getUser = (socket_id) => {
    return users.find((user) => user.socket_id === socket_id)
}
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}
const setUserReady = (socket_id,board) => {
    const index = users.findIndex((user) => user.socket_id === socket_id)
    if(index < 0 || index > users.length) return false
    users[index].is_ready = !users[index].is_ready
    users[index].board = [...board]
    return users[index].is_ready
}

const isAllReady = (room) => {
    const ready = users.filter((user) => user.room === room  && user.is_ready === true )
    if(ready  && ready.length === 2 ){
        return true
    }

    return false
}

const getGameBoard = (room) => {
    return games.find((game) => game.room === room)
}

const addGame = (room) => {
    console.log('addGame - ' + room)
    if(!room ) return {error: 'please fill all inputs'}

    const existingUsers = users.filter((user) => user.room === room)
    console.log("usersss " , existingUsers)
    if(!existingUsers || existingUsers.length !== 2){
        return {error: 'Username is already taken'}
    }
    let first_player_board = existingUsers[0]['board'].slice(-2)
    first_player_board = first_player_board.map((column) => {
        return (
            column.map((tile) => {
                return({player_id:(tile === 0 )? -1 : 0 , tile})
        }))
    })
    console.log(first_player_board)
    let second_player_board = existingUsers[1]['board'].slice(-2)
    second_player_board = second_player_board.map((column) => {
        return (
            column.map((tile) => {
                return({player_id:(tile === 0 )? -1 : 1  , tile})
        }))
    })
    let middle_of_board = existingUsers[0]['board'].slice(2,-2)
    middle_of_board = middle_of_board.map((column) => {
        return (
            column.map((tile) => {
                return({player_id:-1 , tile})
        }))
    })
    const board = first_player_board.concat(middle_of_board).concat(second_player_board)
    console.log("merrgedBoard", board)
    const game = {room,board,turn:true};
    games.push(game)
    return game
}

const removeGame = (room) => {
    const index = users.findIndex((user) => user.socket_id === socket_id)
    const user = users[index]
    if(index !== -1){
        users.splice(index,1)[0];
        return user.room
    }
}

function wins(tile_1,tile_2){
    console.log('tiles ' ,tile_1,tile_2 )
    if((tile_1 === 1 && tile_2 === 3) || (tile_1 === 2 && tile_2 === 1) || (tile_1 === 3 && tile_2 === 2)){
        return 1
    }
    if(tile_1 === tile_2){
        return 2
    }
    else{
        if(tile_2 === 4){
            return 3
            // trap
        }if(tile_2 === 5){
            //flag 
            return 4
        }
    }
    return 0
}

const makeMove = (room,x_index,y_index,from_x,from_y) => {
    const game_index = games.findIndex((game) => game.room === room)
    const turn = games[game_index]['turn']
    const board = games[game_index]['board']
    // tile free
    if(board[x_index][y_index]['player_id'] === -1 ){
        games[game_index].board[x_index][y_index] =
         {player_id:(turn) ? 0 : 1, tile:board[from_x][from_y]['tile']}

         
    }else{
        const is_win = wins( board[from_x][from_y]['tile'] ,board[x_index][y_index]['tile'])
        console.log('won?  ', is_win)
        //tile with enemy 
        switch (is_win) {
            case 0:
                {
                    console.log("won " , 0)
                    // lost
                    games[game_index].board[x_index][y_index] =
                    {player_id:(turn) ? 1 : 0, tile:board[x_index][y_index]['tile']}
                }
                break;
            case 1:
                {
                    //won
                    console.log("won " , 1)
                    games[game_index].board[x_index][y_index] =
                    {player_id:(turn) ? 0 : 1, tile:board[from_x][from_y]['tile']} 
                }
            break;
            case 2:
                    console.log("tie " , 2)
                //won
                    games[game_index].board[x_index][y_index] =
                    {player_id:(turn) ? 0 : 1, tile:board[from_x][from_y]['tile']} 
            break;
            case 4:
                // mehabel
            break;
            case 5:
                // flag
            break;
        
            default:
                break;
        }
        
        
    }
    // remove from prev tile
    games[game_index].board[from_x][from_y] =
         {player_id:-1, tile:0}
    

    
    games[game_index].turn = !turn
    return games[game_index]
}

module.exports = {addUser,makeMove,removeUser,getUser,getUsersInRoom,getGameBoard,addGame,isAllReady,setUserReady}