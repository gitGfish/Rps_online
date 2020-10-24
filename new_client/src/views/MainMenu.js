import React ,{useState} from 'react';
import {Link} from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
function MainMenu() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <div style={{minHeight:'100%', border:'solid', display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Card style={{padding:100}}>
          <div style={{marginBottom:80}}>
            <h1> Rps online</h1>
          </div>
          <div style={{marginBottom:80}}>
            <div style={{marginBottom:20}}>
              <input placeholder="name" type="text" onChange={(e) => setName(e.target.value)}/>
            </div>
            <div style={{marginBottom:20}}>
              <input placeholder="room" type="text" onChange={(e) => setRoom(e.target.value)}/>
            </div>
          </div>
          <div style={{display:'flex' ,justifyContent:'center'}}>
            <Link  onClick={e => (!name || !room) ? e.preventDefault() : null} to={(!name || !room) ? '/' : `/Lobby?name=${name}&room=${room}`}>
                <Button variant="primary"> Join Room </Button>
            </Link>
          </div>
      </Card>
    </div>
  );
}

export default MainMenu;
