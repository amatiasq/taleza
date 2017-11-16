import Vector3D from 'amq-tools/vector3d';
import World from '../world';
import Cell from './cell';

export { default as TaskManager } from './task-manager';
export { default as Human } from './human';
export { Cell };


export default class TalezaGame {

  private map: World<Cell>;


  constructor(canvas: HTMLCanvasElement) {}


  setMapSize(width: number, height: number, tileSize: number) {
    this.map = new World<Cell>(Vector3D.of(6, 11, 11), position => new Cell(position));
  }


  start() {

  }
}
