import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Vector3 } from "../src/primitives/Vector3.ts";
import { Point3D } from "../src/primitives/Point3D.ts";
import { Line3D } from "../src/primitives/Line3D.ts";
import { Plane3D } from "../src/primitives/Plane3D.ts";
import { RegularPyramid, Cuboid } from "../src/solvers/SolidGeometry.ts";

describe("Geometry Engine Core Tests", () => {
  test("Vector arithmetic and perpendicularity", () => {
    const v1 = new Vector3(1, 0, 0);
    const v2 = new Vector3(0, 1, 0);
    const cross = v1.cross(v2);

    assert.equal(cross.x, 0);
    assert.equal(cross.y, 0);
    assert.equal(cross.z, 1);
    assert.equal(v1.isPerpendicularTo(v2), true);
  });

  test("Plane from three points and distance to point", () => {
    const A = new Point3D("A", "A", 0, 0, 0);
    const B = new Point3D("B", "B", 4, 0, 0);
    const C = new Point3D("C", "C", 0, 4, 0);
    const plane = Plane3D.fromThreePoints(A, B, C, "P1", "(Oxy)");

    const S = new Point3D("S", "S", 2, 2, 6);
    const dist = plane.distanceToPoint(S);
    assert.equal(Math.round(dist), 6);

    const proj = plane.projectPoint(S);
    assert.equal(proj.x, 2);
    assert.equal(proj.y, 2);
    assert.equal(proj.z, 0);
  });

  test("Pyramid Volume calculation S.ABC", () => {
    const A = new Point3D("A", "A", 0, 0, 0);
    const B = new Point3D("B", "B", 3, 0, 0);
    const C = new Point3D("C", "C", 0, 4, 0);
    const S = new Point3D("S", "S", 0, 0, 5);

    const pyramid = new RegularPyramid("pyr1", "S.ABC", S, [A, B, C]);
    // Base area = 1/2 * 3 * 4 = 6. Height = 5.
    // Volume = 1/3 * 6 * 5 = 10.
    const volume = pyramid.getVolume();
    assert.equal(Math.round(volume * 100) / 100, 10);
  });

  test("Cuboid volume and surface area", () => {
    const origin = new Point3D("O", "O", 0, 0, 0);
    const box = new Cuboid("box1", "ABCD.A'B'C'D'", origin, 3, 4, 5);
    assert.equal(box.getVolume(), 60);
    assert.equal(box.getTotalSurfaceArea(), 94);
  });
});
