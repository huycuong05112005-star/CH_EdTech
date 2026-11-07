import { Point3D } from "./Point3D.ts";
import { Vector3, EPSILON } from "./Vector3.ts";

/**
 * 3D Infinite Line represented by a point and a direction vector.
 */
export class Line3D {
  public readonly id: string;
  public readonly label: string;
  public readonly point: Point3D;
  public readonly direction: Vector3;

  constructor(id: string, label: string, point: Point3D, direction: Vector3) {
    this.id = id;
    this.label = label;
    this.point = point;
    this.direction = direction.normalize();
  }

  public static fromPoints(p1: Point3D, p2: Point3D, id: string, label: string): Line3D {
    const dir = p1.vectorTo(p2);
    if (dir.magnitude() < EPSILON) {
      throw new Error(`Cannot define line between identical points: ${p1.label} and ${p2.label}`);
    }
    return new Line3D(id, label, p1, dir);
  }

  public containsPoint(p: Point3D): boolean {
    const toPoint = this.point.vectorTo(p);
    if (toPoint.magnitude() < EPSILON) return true;
    return this.direction.isParallelTo(toPoint);
  }

  public isParallelTo(other: Line3D): boolean {
    return this.direction.isParallelTo(other.direction);
  }

  public isPerpendicularTo(other: Line3D): boolean {
    return this.direction.isPerpendicularTo(other.direction);
  }

  public distanceToPoint(p: Point3D): number {
    const toPoint = this.point.vectorTo(p);
    return toPoint.cross(this.direction).magnitude();
  }

  public projectPoint(p: Point3D, id = `proj_${p.id}_${this.id}`, label = `H`): Point3D {
    const toPoint = this.point.vectorTo(p);
    const projectionLength = toPoint.dot(this.direction);
    const projPos = this.point.position.add(this.direction.multiply(projectionLength));
    return new Point3D(id, label, projPos.x, projPos.y, projPos.z);
  }

  public toJSON() {
    return {
      id: this.id,
      label: this.label,
      point: this.point.toJSON(),
      direction: this.direction.toJSON()
    };
  }
}
