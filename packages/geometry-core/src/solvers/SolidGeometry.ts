import { Point3D } from "../primitives/Point3D.ts";
import { Plane3D } from "../primitives/Plane3D.ts";

/**
 * Solid 3D Mathematical Entities (Pyramid, Prism, Cuboid, Sphere, Cylinder, Cone)
 */
export class RegularPyramid {
  public readonly id: string;
  public readonly label: string;
  public readonly apex: Point3D;
  public readonly baseVertices: Point3D[];

  constructor(id: string, label: string, apex: Point3D, baseVertices: Point3D[]) {
    this.id = id;
    this.label = label;
    this.apex = apex;
    this.baseVertices = baseVertices;

    if (baseVertices.length < 3) {
      throw new Error("Pyramid base must have at least 3 vertices");
    }
  }

  public getBasePlane(): Plane3D {
    return Plane3D.fromThreePoints(
      this.baseVertices[0],
      this.baseVertices[1],
      this.baseVertices[2],
      `plane_${this.id}_base`,
      `(Base)`
    );
  }

  public getHeight(): number {
    return this.getBasePlane().distanceToPoint(this.apex);
  }

  public getBaseArea(): number {
    // Triangular base area using cross product
    if (this.baseVertices.length === 3) {
      const v1 = this.baseVertices[0].vectorTo(this.baseVertices[1]);
      const v2 = this.baseVertices[0].vectorTo(this.baseVertices[2]);
      return 0.5 * v1.cross(v2).magnitude();
    }
    // Quadrilateral base area (sum of 2 triangles)
    if (this.baseVertices.length === 4) {
      const v1 = this.baseVertices[0].vectorTo(this.baseVertices[1]);
      const v2 = this.baseVertices[0].vectorTo(this.baseVertices[2]);
      const a1 = 0.5 * v1.cross(v2).magnitude();

      const v3 = this.baseVertices[0].vectorTo(this.baseVertices[2]);
      const v4 = this.baseVertices[0].vectorTo(this.baseVertices[3]);
      const a2 = 0.5 * v3.cross(v4).magnitude();
      return a1 + a2;
    }
    throw new Error("Base area calculation supported for triangle and quadrilateral bases");
  }

  public getVolume(): number {
    return (1 / 3) * this.getBaseArea() * this.getHeight();
  }
}

export class Cuboid {
  public readonly id: string;
  public readonly label: string;
  public readonly origin: Point3D;
  public readonly width: number;
  public readonly length: number;
  public readonly height: number;

  constructor(
    id: string,
    label: string,
    origin: Point3D,
    width: number,
    length: number,
    height: number
  ) {
    this.id = id;
    this.label = label;
    this.origin = origin;
    this.width = width;
    this.length = length;
    this.height = height;
  }

  public getVolume(): number {
    return this.width * this.length * this.height;
  }

  public getTotalSurfaceArea(): number {
    return 2 * (this.width * this.length + this.width * this.height + this.length * this.height);
  }
}
