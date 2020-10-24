import React,{useState,useEffect} from 'react';
import queryString from 'query-string'
import {Redirect} from 'react-router-dom'
import socket from "../socket.js";
import Board from '../components/Board';

import Button from 'react-bootstrap/Button';
import Tile from '../components/Tile'
import Card from 'react-bootstrap/Card';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import 'bootstrap/dist/css/bootstrap.min.css';
function Lobby({location}) {
    const [state_name, setName] = useState('');
    const [state_room, setRoom] = useState('');
    const [is_ready, setIsReady] = useState(false)
    const [is_all_ready, setIsAllReady] = useState(false)
    const [users_in_room, setUsersInRoom] = useState([]);
    const [board_ready, setBoardReady] = useState();
    const [board, setBoard] = useState([]);
    useEffect(() => {
        const {name,room} = queryString.parse(location.search)

        setName(name)
        setRoom(room)
        socket.on('usersInRoom', (users)=>{
            console.log('usersinroom')
            // const stringUsers = users.map(user => `${user.name} ready - ${user.is_ready} `)
            setUsersInRoom(users)
        })

        socket.on('allUsersReady', ()=>{
            setIsAllReady(true)
        })
        
        socket.emit('join', {name,room} ,({users,error}) =>{
        } )
        
        return () => {
            if(!is_all_ready){
                socket.emit('disconnect',socket)
                socket.off()
            }
            
        }
    }, []);

    // useEffect(() => {
    //     socket.emit('usersInRoom', (users_in_room,() => {

    //     }))
    // }, [users_in_room]);

    function readyClicked() {
        socket.emit('playerReady' , {room:state_room , board} , (status) => {
            console.log(board)
            setIsReady(status)
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
                    {(board_ready) ? (is_ready) ? 
                        <Button onClick={readyClicked}>
                            not ready
                        </Button> 
                        : 
                        <Button onClick={readyClicked}>
                            ready
                        </Button> 
                        : 
                        <Button variant="secondary" disabled>
                            ready
                        </Button>}
                </div>
            
            <Board setBoardReady={setBoardReady} setBoard={setBoard}/>
            {(is_all_ready ? <Redirect  to={(!state_name || !state_room) ? (`${process.env.PUBLIC_URL}/`) : `${process.env.PUBLIC_URL}/Game?name=${state_name}&room=${state_room}`} /> : null)}
        </Card>
    </div>
  );
}

export default Lobby;
