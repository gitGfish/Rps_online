import React ,{useEffect,useState} from 'react';
import { TiScissorsOutline } from 'react-icons/ti';
import { GiRock,GiBoxTrap } from 'react-icons/gi';
import { FaToiletPaper,FaFlag } from 'react-icons/fa';

const colors = ["#f4f4f4","#4fc1e8","#a0d568","#ffce54","#ac92eb","#ed5564"]
function Tile(props) {

    const [type, setType] = useState(props.type);
    

    function handleClick(){

        if(!props.disabled){
            props.handleClick(props.x_index,props.y_index )
        
        }

    }
    function iconTile(num) {
        switch (num) {
            case 0:
                return (null)
            case 1:
                return (<GiRock color={(props.selected_tile) ? "blue" : "black"} size={'3em'}/>)
            case 2:
                return (<FaToiletPaper color={(props.selected_tile) ? "blue" : "black"} size={'3em'}/>)
            case 3:
                return (<TiScissorsOutline size={'3em'}/>)
            case 4:
                return (<GiBoxTrap size={'3em'}/>)
            case 5:
                return (<FaFlag size={'3em'}/>)
        
            default:
                return (null)
        }
    }

  return (
    <div style={{flex:1 ,display:'flex', flexDirection:'column' , justifyContent:'center' ,alignItems:'center'}}>
        <button onClick={handleClick} style={{background:colors[type] , height:70,width:70}}> {iconTile(type)}  </button>
        {(props.disabled) ? (
            <h5 style={{marginTop:10}}>
                {props.number}
            </h5>
            ) : null }
    </div>
  );
}

export default Tile;
