import React,{useState,useEffect} from 'react';
import queryString from 'query-string'
import socket from "../socket.js";
import GameBoard from "../components/GameBoard"
import {Redirect} from 'react-router-dom'

import Button from 'react-bootstrap/Button';
import Tile from '../components/Tile'
import Card from 'react-bootstrap/Card';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import 'bootstrap/dist/css/bootstrap.min.css';

function Game({location}) {
    const [state_name, setName] = useState('');
    const [state_room, setRoom] = useState('');
    const [is_ready, setIsReady] = useState(false)
    const [board, setBoard] = useState([]);
    const [my_turn, setMyTurn] = useState(true);
    const [Error, setError] = useState(null);
    const [player_id, setPlayerId] = useState(null);
    const [users_in_room, setUsersInRoom] = useState([]);
    const [rerender_board, setRerenderBoard] = useState();
    useEffect(() => {
        const {name,room} = queryString.parse(location.search)

        setName(name)
        setRoom(room)
        socket.on('usersInRoom', (users)=>{
            console.log('usersinroom')
            if(users.length < 2){
                setError('error user left')
                return
            }
            
            const stringUsers = users.map(user => `${user.name}`)
            setUsersInRoom(stringUsers)
        })

        socket.on('updateGame', (game)=>{
            console.log('update')
            if(!game){
                setError('error game fail')
                return
            }
            setBoard(game.board)
            setMyTurn((game.turn) ? 0 : 1 )
            setRerenderBoard("supper-uniqe-key"+ new Date())
            
        })


        socket.emit('startedGame',{room,name} , (users,game,name)=>{
            console.log(users)
            console.log(game)
            if(!game){
                setError('error game not found')
                return
            }
            const user = users.find((user) => user.name === name)
            if(!user){
                setError('error user doesnt exists')
                return
            }
            setPlayerId(user['player_id'])
            setBoard(game.board)
            setMyTurn((game.turn) ? 0 : 1 )
            const stringUsers = users.map(user => `${user.name} `)
            setUsersInRoom(stringUsers)
        })

        
        
        return () => {
            socket.emit('disconnect',socket)
            socket.off()
        }
    }, []);

    useEffect(() => {
        socket.emit('usersInRoom', (users_in_room,() => {

        }))
    }, [users_in_room]);



    function makeMove(x_index,y_index,from_x,from_y) {
        socket.emit('move' , {room:state_room,x_index,y_index,from_x,from_y} , () => {
            
        })
    }


  return (
    <div style={{minHeight:'100%', border:'solid', display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Card style={{padding:40}}>
            <div style={{display:'flex' ,justifyContent:'center',margin:20}}>
                <h1 >
                    Rps online
                </h1>
            </div>
            <div style={{display:'flex' ,justifyContent:'space-between'}}>
                <Card style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <AccountCircleIcon/>
                    &nbsp;
                    <h5>
                        {(users_in_room && users_in_room.length > 0 ) ? `player 1: ${users_in_room[0]['name']}` : `waiting`}
                    </h5>
                        {(users_in_room && users_in_room[0] && users_in_room[0]['is_ready']) ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>}
                </Card>
                <Card style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <AccountCircleIcon/>
                    &nbsp;
                    <h5>
                        {(users_in_room && users_in_room.length > 1 ) ? `player 2: ${users_in_room[1]['name']}` : `waiting`}
                    </h5>
                        {(users_in_room && users_in_room[1] && users_in_room[1]['is_ready']) ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>}
                </Card>
                <Card style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <MeetingRoomIcon/>
                    &nbsp;
                    <h5>
                        room: {state_room}
                    </h5>
                </Card>
            </div>
            <div style={{flex:1,marginBottom:10 ,display:'flex', justifyContent:'center',alignItems:'stretch'}}>
                <Card style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <MeetingRoomIcon/>
                    &nbsp;
                    <h5>
                        turn: {my_turn}
                    </h5>
                </Card>
            </div>
            
            <GameBoard key={rerender_board} my_turn={my_turn} makeMove={makeMove} setMyTurn={setMyTurn} player_id={player_id} setBoardReady={setIsReady} board={board} setBoard={setBoard}/>
            {(Error) ? <Redirect to={`${process.env.PUBLIC_URL}/`}/> : null }
        </Card>
    </div>
  );
}

export default Game;
