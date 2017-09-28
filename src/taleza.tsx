import * as React from 'react';
import TalezaGame from './game';


export default class Taleza extends React.PureComponent<ITalezaProps> {

  constructor(props: ITalezaProps) {
    super(props);

    this.setCanvas = this.setCanvas.bind(this);
  }


  render() {
    return (
      <div className="main-taleza">
        <canvas ref={this.setCanvas} />
      </div>
    );
  }


  private setCanvas(canvas: HTMLCanvasElement) {
    const game = new TalezaGame(canvas);

    game.setMapSize(100, 100, 10);
    game.start();

    this.setState({game});
  }
}


interface ITalezaProps {

}