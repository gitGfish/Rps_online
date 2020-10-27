import React,{useState,useEffect} from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
  function WonModal(props) {
    
    
    

    return (
        <Modal
        show={props.player_won !== -1}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
            <h1>player {props.player_won + 1} won the game! </h1>
            
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => props.setResetGame(true)}>Play Again</Button>
        </Modal.Footer>
      </Modal>
  
    );
  }
export default WonModal;