import React ,{useEffect,useState} from 'react';
import { TiScissorsOutline } from 'react-icons/ti';
import { GiRock,GiBoxTrap } from 'react-icons/gi';
import { FaToiletPaper,FaFlag } from 'react-icons/fa';
import { SiPostwoman } from 'react-icons/si';

const colors = ["#f4f4f4","#4fc1e8","#a0d568","#ffce54","#ac92eb","#ed5564"]
function Tile(props) {

    const [type, setType] = useState(props.type);
    const [rerender, setRerender] = useState(new Date() +'');

    function handleClick(){
        
        if(!props.disabled){
            props.handleClick(props.x_index,props.y_index )
            setRerender(new Date() +'')
            return
        }

    }
    function iconTile(num) {
        if(props.is_enemy){
            num = 6
        }
        switch (num) {
            case 0:
                return (null)
            case 1:
                return (<GiRock color={(props.selected_tile) ? "blue" : "black"} size={'2em'}/>)
            case 2:
                return (<FaToiletPaper color={(props.selected_tile) ? "blue" : "black"} size={'2em'}/>)
            case 3:
                return (<TiScissorsOutline color={(props.selected_tile) ? "blue" : "black"} size={'2em'}/>)
            case 4:
                return (<GiBoxTrap color={(props.selected_tile) ? "blue" : "black"} size={'2em'}/>)
            case 5:
                return (<FaFlag color={(props.selected_tile) ? "blue" : "black"} size={'2em'}/>)
            case 6:
                return (<SiPostwoman size={'2em'}/>)
        
            default:
                return (null)
        }
    }

  return (
    <div kew={rerender} style={{flex:1 ,display:'flex', flexDirection:'column' , justifyContent:'center' ,alignItems:'center'}}>
        {(props.is_enemy) ? 
        (
                <button style={{cursor:'pointer'}} onClick={handleClick} style={{background:'#ed5564' , height:'3em',width:'3em'}}>
                    {<SiPostwoman size={'2em'}/>}  
                </button>
        ) : (
            <button style={{cursor:'pointer'}} onClick={handleClick} style={{background:colors[type] , height:'3em',width:'3em'}}> {iconTile(type)}  </button>
        )} 
        
        {(props.disabled) ? (
            <h5 style={{marginTop:10}}>
                {props.number}
            </h5>
            ) : null }
    </div>
  );
}

export default Tile;
