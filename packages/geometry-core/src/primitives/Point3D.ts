import { Vector3, EPSILON } from "./Vector3.ts";

/**
 * 3D Affine Point with label and mathematical operations.
 */
export class Point3D {
  public readonly id: string;
  public readonly label: string;
  public readonly position: Vector3;

  constructor(id: string, label: string, x: number, y: number, z: number) {
    this.id = id;
    this.label = label;
    this.position = new Vector3(x, y, z);
  }

  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  get z(): number {
    return this.position.z;
  }

  public distanceTo(other: Point3D): number {
    return this.position.distanceTo(other.position);
  }

  public vectorTo(other: Point3D): Vector3 {
    return other.position.subtract(this.position);
  }

  public midpoint(other: Point3D, id = `mid_${this.id}_${other.id}`, label = `M`): Point3D {
    const mid = this.position.add(other.position).multiply(0.5);
    return new Point3D(id, label, mid.x, mid.y, mid.z);
  }

  public equals(other: Point3D): boolean {
    return this.distanceTo(other) < EPSILON;
  }

  public toJSON() {
    return {
      id: this.id,
      label: this.label,
      coordinates: [this.x, this.y, this.z]
    };
  }
}
