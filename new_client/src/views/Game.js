import React,{useState,useEffect} from 'react';
import queryString from 'query-string'
import socket from "../socket.js";
import GameBoard from "../components/GameBoard"
import {Redirect} from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { RiArrowLeftRightLine } from 'react-icons/ri';
import TieModal from '../components/TieModal'
import WonModal from '../components/WonModal'
import 'bootstrap/dist/css/bootstrap.min.css';

function Game({location}) {
    const [state_room, setRoom] = useState('');
    const [state_name, setName] = useState('');
    const [board, setBoard] = useState([]);
    const [my_turn, setMyTurn] = useState(true);
    const [Error, setError] = useState(null);
    const [player_id, setPlayerId] = useState(null);
    const [users_in_room, setUsersInRoom] = useState([]);
    const [rerender_board, setRerenderBoard] = useState();
    const [modal_show, setModalShow] = React.useState(false);
    const [player_won, setPlayerWon] = React.useState(-1);
    const [reset_game, setResetGame] = React.useState(false);

    
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
            
            setUsersInRoom(users)
        })

        socket.on('tie', ()=>{
            console.log('tie')
            setModalShow(true)
        })

        socket.on('updateGame', (game)=>{
            console.log('update')
            if(!game){
                setError('error game fail')
                return
            }
            setBoard(game.board)
            setMyTurn((game.turn) ? 0 : 1  )
            setRerenderBoard("supper-uniqe-key"+ new Date())
            
        })

        socket.on('player_won', (player_won)=>{
            console.log(player_won)
            setPlayerWon(player_won ? 0 : 1 )
            
            
        })


        socket.emit('startedGame',{room,name} , (users,game,name)=>{
            console.log(users,users_in_room)
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
            setUsersInRoom(users)
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
                    <h6>
                        {(users_in_room && users_in_room.length > 0 ) ? `player 1: ${users_in_room[0]['name']}` : `waiting`}
                    </h6>
                        
                </Card>
                <Card style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <AccountCircleIcon/>
                    &nbsp;
                    <h6>
                        {(users_in_room && users_in_room.length > 1 ) ? `player 2: ${users_in_room[1]['name']}` : `waiting`}
                    </h6>
                        
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
                    <RiArrowLeftRightLine/>
                    &nbsp;
                    <h5>
                        turn: {(users_in_room && users_in_room[my_turn] ) ? users_in_room[my_turn]['name'] : null}
                    </h5>
                </Card>
            </div>
            
            <GameBoard key={rerender_board} my_turn={my_turn} makeMove={makeMove} setMyTurn={setMyTurn} player_id={player_id} board={board} setBoard={setBoard}/>
            {(Error) ? <Redirect to={`${process.env.PUBLIC_URL}/`}/> : null }
        </Card>
        <TieModal room={state_room} setRerenderBoard={setRerenderBoard} modalShow={modal_show} setModalShow={setModalShow}/>
        <WonModal player_won={player_won} setResetGame={setResetGame}/>
    </div>
  );
}

export default Game;
