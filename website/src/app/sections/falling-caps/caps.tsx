import * as Scrollytelling from "@bsmnt/scrollytelling";
import React, { useMemo } from "react";
import { Float, useTexture } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { getTimeline } from "../../../lib/utils";

const capProps: { position: Vector3; rotation: Euler; progress: number }[] = [
  {
    position: new Vector3(-0.08, -0.1, 0.1),
    rotation: new Euler(0.4, -0.6, 0.4, "XZY"),
    progress: 0,
  },
  {
    position: new Vector3(-0.5, -0.1, 0.55),
    rotation: new Euler(0, -0.3, -0.5, "ZYX"),
    progress: 0,
  },
  {
    position: new Vector3(0.22, 0.15, 0.4),
    rotation: new Euler(0.55, -0.6, 0.8, "XZY"),
    progress: 0,
  },
  {
    position: new Vector3(-0.05, 0.12, 1.1),
    rotation: new Euler(0.1, -0.6, -0.4, "XZY"),
    progress: 0,
  },
  {
    position: new Vector3(0.3, -0.13, 1.1),
    rotation: new Euler(0.1, -0.7, 0.5, "XZY"),
    progress: 0,
  },
  {
    position: new Vector3(0.48, 0.22, 0.8),
    rotation: new Euler(0.5, 0, 0.5, "XZY"),
    progress: 0,
  },
  {
    position: new Vector3(-0.48, 0.26, 0.8),
    rotation: new Euler(0.5, 0.9, 0.5, "XZY"),
    progress: 0,
  },
  {
    position: new Vector3(-0.12, -0.26, 1),
    rotation: new Euler(0.2, 0.65, 0.5, "XZY"),
    progress: 0,
  },
];

export const CapsModel = () => {
  const innerRef = React.useRef<THREE.Group>(null);
  const { width } = useThree((state) => state.viewport);

  // Load texture for the floating images
  const texture = useTexture("/images/parallax/smile.png");

  // Create materials for each instance
  const clonedMaterials = useMemo(() => {
    return capProps.map((_, idx) => {
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        alphaTest: 0.1,
      });
      mat.userData.idx = idx;
      return mat;
    });
  }, [texture]);

  const responsiveVPWidth = Math.max(width, 4);
  const halfViewportWidth = responsiveVPWidth / 2;
  const fadeInYoffset = 0.1;

  const handleUpdate = React.useCallback(
    (idx: number) => {
      const material = clonedMaterials[idx];
      if (!material) return;

      const currCapProps = capProps[idx];
      const currObj = innerRef.current?.children[idx] as THREE.Object3D;

      if (!currObj || !currCapProps) return;

      const isEven = idx % 2 === 0;
      const currObjPosition = currCapProps.position
        .clone()
        .multiplyScalar(halfViewportWidth);
      const invProgress = 1 - currCapProps.progress;

      // Update opacity
      material.opacity = currCapProps.progress;

      currObj.rotation.y =
        currCapProps.rotation.y +
        (isEven ? 1 : -1) * (currCapProps.progress * Math.PI * 2);
      currObj.position.y = currObjPosition.y - invProgress * fadeInYoffset;
    },
    [clonedMaterials, halfViewportWidth]
  );

  return (
    <>
      <Scrollytelling.Stagger
        overlap={0.65}
        tween={
          {
            start: 48,
            end: 100,
            target: capProps,
            to: {
              progress: 1,
              ease: "power2.inOut",
              /* We pass current target idx by params */
              onUpdate: (idx: number) => {
                handleUpdate(idx);
              },
            },
          }
        }
      />

      {/* clean this up when the scrollytelling leaves, as when scrolling really fast,
          GSAP is not being able to do so */}
      <Scrollytelling.Waypoint
        // at the very start of the scrollTrigger
        at={0}
        // when user scrolls back to the top
        onReverseCall={() => {
          // reset all caps
          capProps.forEach((capProp, idx) => {
            capProp.progress = 0;
            handleUpdate(idx);
          });
        }}
      />

      <group ref={innerRef}>
        {capProps.map(({ position, rotation }, idx) => {
          return (
            <group
              scale={responsiveVPWidth / 9}
              position={position.clone().multiplyScalar(halfViewportWidth)}
              rotation={rotation.clone()}
              key={idx}
            >
              <Float>
                <mesh material={clonedMaterials[idx]}>
                  <planeGeometry args={[1, 1]} />
                </mesh>
              </Float>
            </group>
          );
        })}
      </group>
    </>
  );
};
