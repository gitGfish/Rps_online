import React ,{useState,useEffect} from 'react';
import Tile  from './Tile';
function GameBoard(props) {

    const [Board, setBoard] = useState([[],[],[],[],[],[],[],[]]);
    const [selected_tile, setSelectedTile] = useState(null);
    const [rerender_board, setRerenderBoard] = useState();
    useEffect(() => {
        setBoard(props.board)
    }, [props.board]);

    
    function freeTiles (x_index,y_index){
        if(x_index >= Board.length || y_index >= Board[0].length || x_index < 0 || y_index <0 )
            {
                console.log("something went wrong")
                    return false;
            }
        if(Board[x_index][y_index]['player_id'] === props.my_turn ){
            return false;
        }
        return true
    }


    function checkSelsectTile(x_index,y_index){
        
        if(x_index > Board.length || y_index > Board[0].length || x_index < 0 || y_index <0 )
            {
                console.log("something went wrong")
                return false;
            }
        if(Board[x_index][y_index]['tile'] === 4 || Board[x_index][y_index]['tile'] === 5){
            return false;
        }
        if(Board[x_index][y_index]['player_id'] !== props.my_turn ){
                console.log("not your player select difrent tile",Board[x_index][y_index]['player_id'] )
                return false;
            }

        if(freeTiles(x_index + 1,y_index) || freeTiles(x_index - 1,y_index) 
                || freeTiles(x_index ,y_index + 1 ) || freeTiles(x_index,y_index - 1))
            {
                return true
            }
        
        return false
    }

    function isLegal(x1,y1,x2,y2){
        if(x1 + 1 === x2 && y1 === y2){
            return true
        }
        if(x1 - 1 === x2 && y1 === y2){
            return true
        }
        if(x1 === x2 && y1 + 1 === y2){
            return true
        }
        if(x1 === x2 && y1 - 1 === y2){
            return true
        }
        return false  
    }

    function handleClick(x_index,y_index){
        if(props.player_id === props.my_turn){
            if(selected_tile){
                if(selected_tile['from_x'] === x_index && selected_tile['from_y'] === y_index){
                    setSelectedTile(null)
                    return
                }
                console.log(x_index,y_index)
                if(Board[x_index][y_index]['player_id'] !== props.player_id && (isLegal(x_index,y_index,selected_tile['from_x'],selected_tile['from_y']))){
                    props.makeMove(x_index,y_index,selected_tile['from_x'],selected_tile['from_y'])
                    setSelectedTile(null)
                }
                
                // props.setMyTurn((props.my_turn + 1)%2)
            }else{
                
                if(checkSelsectTile(x_index,y_index)){
                    setSelectedTile({from_x:x_index,from_y:y_index })
                }else{
                    setSelectedTile(null)
                }
            }
            
        }
        
        
    }

    function isSelected(x_index,y_index){
        if(!selected_tile)
            return false
        if(selected_tile['from_x'] === x_index && selected_tile['from_y'] === y_index){
            return true
        }
        return false
    }
    
  return (
    <div  style={{display:'flex',flexDirection:'column'}}>
        {(props.player_id === 1) ? (
            Board.map((row,x_index) => {
                return (
                    <div style={{display:'flex',flexDirection:'row'}}>
                        {row.map( (type,y_index) => {
                            // number={(x_index * Board[0].length + y_index) + ""}
                            return(<Tile is_enemy={(type.player_id === 0)} selected_tile={isSelected(x_index,y_index)} handleClick={handleClick} key={y_index} x_index={x_index} y_index={y_index} type={type.tile} />)})
                        }
                    </div>)
            })) : (
                Board.slice(0).reverse().map((row,x_index) => {
                return (
                    <div style={{display:'flex',flexDirection:'row'}}>
                        {row.map( (type,y_index) => {
                            // number={(x_index * Board[0].length + y_index) + ""}
                            return(<Tile is_enemy={(type.player_id === 1)} selected_tile={isSelected(7-x_index,y_index)} handleClick={handleClick}  key={y_index} x_index={7-x_index} y_index={y_index} type={type.tile} />)})
                        }
                    </div>)
            })
        )}

    </div>
  );
}

export default GameBoard;
