export default class Material {
  static grass = new Material(0x00FF00);
  static stone = new Material(0x888888);
  static dirt = new Material(0xAA4444);


  constructor(
    public color: number = getRandomColor()
  ) {}

  toString(): string {
    return this.color.toString(16);
  }
}


function getRandomColor(): number {
    return Math.round(Math.random() * 0xFFFFFF);
}
