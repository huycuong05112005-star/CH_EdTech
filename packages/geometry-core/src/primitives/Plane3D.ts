import { Point3D } from "./Point3D.ts";
import { Vector3, EPSILON } from "./Vector3.ts";
import { Line3D } from "./Line3D.ts";

/**
 * 3D Plane represented in standard Cartesian form: Ax + By + Cz + D = 0
 * with unit normal vector N = (A, B, C)
 */
export class Plane3D {
  public readonly id: string;
  public readonly label: string;
  public readonly point: Point3D;
  public readonly normal: Vector3;
  public readonly d: number;

  constructor(id: string, label: string, point: Point3D, normal: Vector3) {
    this.id = id;
    this.label = label;
    this.point = point;
    this.normal = normal.normalize();
    this.d = -this.normal.dot(this.point.position);
  }

  public static fromThreePoints(
    p1: Point3D,
    p2: Point3D,
    p3: Point3D,
    id: string,
    label: string
  ): Plane3D {
    const v1 = p1.vectorTo(p2);
    const v2 = p1.vectorTo(p3);
    const normal = v1.cross(v2);
    if (normal.magnitude() < EPSILON) {
      throw new Error(`Collinear points cannot define a unique plane: ${p1.label}, ${p2.label}, ${p3.label}`);
    }
    return new Plane3D(id, label, p1, normal);
  }

  public distanceToPoint(p: Point3D): number {
    return Math.abs(this.normal.dot(p.position) + this.d);
  }

  public containsPoint(p: Point3D): boolean {
    return this.distanceToPoint(p) < EPSILON;
  }

  public projectPoint(p: Point3D, id = `proj_${p.id}_${this.id}`, label = `H`): Point3D {
    const dist = this.normal.dot(p.position) + this.d;
    const projPos = p.position.subtract(this.normal.multiply(dist));
    return new Point3D(id, label, projPos.x, projPos.y, projPos.z);
  }

  public isParallelTo(other: Plane3D): boolean {
    return this.normal.isParallelTo(other.normal);
  }

  public isPerpendicularTo(other: Plane3D): boolean {
    return this.normal.isPerpendicularTo(other.normal);
  }

  public angleWithPlane(other: Plane3D): number {
    const cosTheta = Math.abs(this.normal.dot(other.normal));
    return Math.acos(Math.min(1, cosTheta)); // Radians [0, PI/2]
  }

  public angleWithLine(line: Line3D): number {
    const sinAlpha = Math.abs(this.normal.dot(line.direction));
    return Math.asin(Math.min(1, sinAlpha)); // Radians [0, PI/2]
  }

  public intersectLine(line: Line3D, id = `int_${this.id}_${line.id}`, label = `I`): Point3D | null {
    const denom = this.normal.dot(line.direction);
    if (Math.abs(denom) < EPSILON) {
      // Line is parallel to or lies in the plane
      return null;
    }
    const t = -(this.normal.dot(line.point.position) + this.d) / denom;
    const intPos = line.point.position.add(line.direction.multiply(t));
    return new Point3D(id, label, intPos.x, intPos.y, intPos.z);
  }

  public toJSON() {
    return {
      id: this.id,
      label: this.label,
      normal: this.normal.toJSON(),
      d: this.d,
      point: this.point.toJSON()
    };
  }
}
