import { useThree, useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { SkyContext } from './contexts/Skycontext';
import { useContext } from 'react';

function CameraControls() {
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { isLoaded } = useContext(SkyContext);
  const { camera, gl, size } = useThree();

  useEffect(() => {
    function handleMouseMove(event) {
      if (!isMouseDown) return;

      const sensitivity = 0.005;

      const deltaX = (event.offsetX - previousMousePosition.x) * sensitivity;
      const deltaY = (event.offsetY - previousMousePosition.y) * sensitivity;

      // Vérifier quelle rotation (horizontale ou verticale) est la plus grande
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Rotation horizontale seulement
        console.log("Rotation horizontale")
        const horizontalRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX);
        camera.quaternion.multiply(horizontalRotation);
      } else {
        // Rotation verticale seulement
        console.log("Rotation verticale")
        const verticalRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY);
        camera.quaternion.multiply(verticalRotation);
      }

      setPreviousMousePosition({ x: event.offsetX, y: event.offsetY });
    }


    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement, camera, previousMousePosition, isMouseDown]);

  useEffect(() => {
    function handleWheel(event) {
      const zoomStep = 0.25;
      const zoomChange = - Math.sign(event.deltaY) * zoomStep;
      camera.zoom += zoomChange;
      camera.zoom = THREE.MathUtils.clamp(camera.zoom, 1, 10);
      camera.updateProjectionMatrix();
    }

    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [gl.domElement, camera]);



  useEffect(() => {

    camera.layers.enable(0);  // permet à la caméra de voir la couche 0
    camera.layers.enable(1);  // permet à la caméra de voir la couche 1

    function handleKeyDown(event) {
      const rotationAngle = 0.05;  // Ajustez cette valeur pour des rotations plus rapides ou plus lentes

      switch (event.code) {
        case 'ArrowUp':
          camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotationAngle);
          break;
        case 'ArrowDown':
          camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotationAngle);
          break;
        case 'ArrowLeft':
          camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationAngle);
          break;
        case 'ArrowRight':
          camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotationAngle);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [camera]);

  useEffect(() => {
    function handleMouseDown(event) {
      if (event.button === 0) {
        setIsMouseDown(true);
        setPreviousMousePosition({ x: event.offsetX, y: event.offsetY });
      }
    }

    function handleMouseUp() {
      setIsMouseDown(false);
    }

    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gl.domElement]);

  useEffect(() => {
    camera.position.set(0, 0, 0);
    camera.lookAt(new THREE.Vector3(1, 0, 0));
    camera.updateProjectionMatrix();
  }, []);

  return (
    <>
      <Html>
        <div style={{
          position: 'absolute',
          top: -200,
          left: -200,
          color: 'white',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          width: '600px'
        }}>
          <span>Zoom: {camera.zoom.toFixed(2)}</span>
          <span>Position: {camera.position.x.toFixed(2)}, {camera.position.y.toFixed(2)}, {camera.position.z.toFixed(2)}</span>
          <span>LookAt: {camera.getWorldDirection(new THREE.Vector3()).x.toFixed(2)}, {camera.getWorldDirection(new THREE.Vector3()).y.toFixed(2)}, {camera.getWorldDirection(new THREE.Vector3()).z.toFixed(2)}</span>
        </div>
      </Html>
    </>
  );
}

export default CameraControls;
