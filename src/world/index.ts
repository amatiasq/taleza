import Vector3D from 'amq-tools/vector3d';
import Area, { NodeCreator } from './area';
import { IEntity } from './entity';
import { INode } from './node';

export { Area, IEntity, INode };


export default class World<T extends INode> extends Area<T> {

  constructor(size: Vector3D, creator: NodeCreator<T>) {
    super(size, creator);
  }


  checkEntity(entity: IEntity<T>) {
    // TODO
  }
}
