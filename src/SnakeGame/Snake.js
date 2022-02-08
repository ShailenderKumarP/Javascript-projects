import React from 'react';

const Snake = (props) => {
    return props.snakePosition.map((pos, i) => 
        <div className="snake" style= {{ top: `${pos[1]}%`, left: `${pos[0]}%` }} key={i} ></div>    
    )
}

export default Snake;