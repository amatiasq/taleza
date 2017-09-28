import Human from '../game/Human';

export default class HumanView extends Sprite {

  constructor(
    public game: Game,
    protected human: Human,
    public radius: number,
    public color: number | string,
  ) {
    super(game, 0, 0, getCircle(game, radius, color));
  }

  update() {
    this.x = this.human.location.view.x;
    this.y = this.human.location.view.y;
  }
}


function getCircle(game: Game, radius: number, color: number | string) {
  const circle = game.add.bitmapData(radius * 2, radius * 2);
  circle.ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  circle.ctx.fillStyle = typeof color == 'number' ? color.toString(16) : color;
  circle.ctx.fill();
  return circle;
}
