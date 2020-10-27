import React,{useState,useEffect} from 'react';
import Tile from './Tile'
import Modal from 'react-bootstrap/Modal'
import socket from "../socket.js";
import Button from 'react-bootstrap/Button'
import logo from '../assets/giphy.gif'
  function TieModal(props) {
    
    const [show_loading_animation, setShowLoadingAnimation] = useState();

    function tieBreak(tie_response){
        setShowLoadingAnimation(true)
        socket.emit('tieBreak' , {tie_response,room:props.room} , () => {})
            
    }
    
    useEffect(() => {
        socket.on('tieEnd', (result)=>{
            if(result === true){
                setShowLoadingAnimation(false)
                
                
            }else{
                setShowLoadingAnimation(false)
                props.setModalShow(false)
                props.setRerenderBoard(new Date() + "")
            }
            
        })
    }, []);

    return (
        <Modal
        show={props.modalShow}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Its A tie, choose your weapon
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {(show_loading_animation) ? 'loading...' : (
                <div style={{display:'flex',flexDirection:'row'}}>
                    <Tile handleClick={(a,b) => tieBreak(1)}  type={1} />
                    <Tile handleClick={(a,b) => tieBreak(2)}  type={2} />
                    <Tile handleClick={(a,b) => tieBreak(3)}  type={3} />
                </div>
            )}
            <img src={logo} />
        </Modal.Body>
      </Modal>
  
    );
  }
export default TieModal;