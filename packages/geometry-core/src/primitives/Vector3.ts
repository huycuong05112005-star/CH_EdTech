/**
 * 3D Mathematical Vector with exact floating-point calculations and tolerance checks.
 */
export const EPSILON = 1e-9;

export class Vector3 {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  public add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  public subtract(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  public multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  public magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public magnitude(): number {
    return Math.sqrt(this.magnitudeSquared());
  }

  public normalize(): Vector3 {
    const mag = this.magnitude();
    if (mag < EPSILON) {
      throw new Error("Cannot normalize zero-length vector");
    }
    return new Vector3(this.x / mag, this.y / mag, this.z / mag);
  }

  public distanceTo(v: Vector3): number {
    return this.subtract(v).magnitude();
  }

  public isParallelTo(v: Vector3): boolean {
    const crossProd = this.cross(v);
    return crossProd.magnitude() < EPSILON;
  }

  public isPerpendicularTo(v: Vector3): boolean {
    return Math.abs(this.dot(v)) < EPSILON;
  }

  public angleWith(v: Vector3): number {
    const magProd = this.magnitude() * v.magnitude();
    if (magProd < EPSILON) {
      throw new Error("Cannot compute angle with zero-length vector");
    }
    const cosTheta = Math.max(-1, Math.min(1, this.dot(v) / magProd));
    return Math.acos(cosTheta); // Radians
  }

  public toJSON(): [number, number, number] {
    return [this.x, this.y, this.z];
  }
}
