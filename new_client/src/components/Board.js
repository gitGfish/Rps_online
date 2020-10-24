import React ,{useState,useEffect} from 'react';

import Tile  from './Tile';
function Board(props) {

    const [Board, setBoard] = useState((props.board) ? props.board : [[],[],[],[],[],[],[],[]]);
    const [available_tiles, setAvailableTiles] = useState([0,0,1,0,0,0]);
    
    const [rerender_board, setRerenderBoard] = useState();
    useEffect(() => {
        setBoard(Board.map((row,index) => {
            return ([0,0,0,0,0,0,0,0])
        }))
    }, []);

    function checkBoardReady(){
        for (let index = 1; index < available_tiles.length; index++) {
            const element = available_tiles[index];
            if(element >0 ){
                props.setBoardReady(false)
                return
            }
            
        }
        props.setBoard([...Board])
        props.setBoardReady(true)
    }

    function checkMoveLigal(x_index,y_index){
        if(x_index > Board.length || y_index > Board[0].length || x_index < 6 || y_index <0 )
        {
            console.log("something went wrong")
            return -1;
        }
        const value = Board[x_index][y_index]
        let newValue;
        
        for(newValue = (value +1)%6 ; newValue < 15 ; newValue = ((newValue + 1)%6)){
            if(available_tiles[newValue] > 0 ) {
                let tmp = [...available_tiles]
                tmp[value] = tmp[value] + 1
                tmp[newValue] = tmp[newValue] - 1
                setAvailableTiles([...tmp]);
                
                return newValue;
                
            }
        }
        return -1;

    }
    useEffect(() => {
        checkBoardReady();
    }, [Board]);

    function handleClick(x_index,y_index){
        const newValue = checkMoveLigal(x_index,y_index)
        if(newValue >= 0){
            let newBoard = [...Board]
            newBoard[x_index][y_index] = newValue
            setBoard([...newBoard])
            setRerenderBoard("supper-uniqe-key"+ new Date()+newValue)
        }
        
    }
  return (
    <div key={rerender_board} style={{display:'flex',flexDirection:'column'}}>
            {Board.map((row,x_index) => {
                return (
                    <div style={{display:'flex',flexDirection:'row'}}>
                        {row.map( (type,y_index) => {
                            // number={(x_index * Board[0].length + y_index) + ""}
                            return(<Tile handleClick={handleClick} key={y_index} x_index={x_index} y_index={y_index} ready_stage={true} available_tiles={available_tiles} setAvailableTiles={setAvailableTiles} type={type} />)})
                        }
                    </div>)
            })}
            <div style={{display:'flex' ,justifyContent:'space-between',marginTop:40}}>
                {available_tiles.map((count,index) => {
                    if(index === 0 ){
                        return(null)
                    }
                    return(<Tile disabled={true} number={count} type={index}/>)
                })}
            </div>
    </div>
  );
}

export default Board;
