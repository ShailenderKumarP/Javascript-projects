import React, { Component } from 'react';
import Snake from './Snake';

const generateRandomCoordinates = () => {
  let max = 100, min = 1;
  let x = Math.floor( Math.random() * (max-min)/2) * 2;
  let y = Math.floor( Math.random() * (max-min)/2) * 2;
  return [x, y];
}

const initialState = {
  snakePosition:[
    [0, 0],
    [2, 0],
  ],
  direction: "RIGHT",
  dotPos: generateRandomCoordinates(),
  speed: 200,
}
let interval;
class SnakeGame extends Component {
    state = initialState;
    componentDidMount(){
      interval = setInterval(this.snakeMovement, this.state.speed);
      document.onkeydown = this.keyEvent
    }

    componentDidUpdate(){
      this.checkBorders();
      this.isDotEaten();
    }

    keyEvent = (e) => {
      switch (e.keyCode) {
        case 38:
          this.setState({direction: 'UP'});
        break;
        case 40:
          this.setState({direction: 'DOWN'});
        break;
        case 37:
          this.setState({direction: 'LEFT'});
        break;
        case 39:
          this.setState({direction: 'RIGHT'});
        break;
        default:
        break;
      }
    }

    snakeMovement = () => {
      let dots = [...this.state.snakePosition];
      let head = dots[dots.length - 1];
  
      switch (this.state.direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;
        default: 
        break;
      }
      dots.push(head);
      dots.shift();
      this.setState({
        snakePosition: dots
      })
    }

    checkBorders = () => {
      const dots = [...this.state.snakePosition];
      const head = dots[dots.length - 1];
      if ( head[0] >= 100 || head[0] < 0 || head[1] >=100 || head[1] < 0) {
        alert(`Game Over, Your Score is ${this.state.snakePosition.length}. Retry again`);
        this.setState(initialState);
        this.alterSpeed();
      }
    }

    isDotEaten = () => {
      const snakepos = [ ...this.state.snakePosition];
      const head = snakepos[snakepos.length -1];
      if (head[0] === this.state.dotPos[0] && head[1] === this.state.dotPos[1] ){
        this.setState ({ dotPos: generateRandomCoordinates() });
        snakepos.unshift([]);
        this.setState({ snakePosition: snakepos , speed: this.state.speed - 20});
        this.alterSpeed();
      }
    }

    alterSpeed = () => {
      clearInterval(interval);
      interval = setInterval(this.snakeMovement, this.state.speed);
    }

    render(){ 
      return <div className="snake-overlay">
            <Snake snakePosition={this.state.snakePosition} />
            <Dot pos={this.state.dotPos} />
        </div>
    }
}

const Dot = (props) => (
  <div className = "snake-dot" style={{ top: `${props.pos[1]}%`, left: `${props.pos[0]}%`, position: 'absolute', backgroundColor: "blue", width: '2%', height: '2%' }}/>
)

export default SnakeGame;