import { useThree, useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { SkyContext } from './contexts/Skycontext';
import { useContext } from 'react';
import { getIntersectionWithSphere } from './utils/astroUtils';
import Hammer from 'hammerjs';

/**
 * 
 * @returns 
 */
function CameraControls() {
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { isDebugEnabled,isLoaded } = useContext(SkyContext);
  const { camera, gl, size } = useThree();

  useEffect(() => {
    function handleInteraction(event) {
      event.preventDefault();
      
      if (event.type !== 'touchmove' && !isMouseDown) return;
      const sensitivity = 0.005;
      const { offsetX, offsetY, touches } = event;
      const x = touches ? touches[0].clientX : offsetX;
      const y = touches ? touches[0].clientY : offsetY;
      
      const deltaX = (x - previousMousePosition.x) * sensitivity;
      const deltaY = (y - previousMousePosition.y) * sensitivity;

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

      setPreviousMousePosition({x,y });
    }
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleInteraction);
    canvas.addEventListener('touchmove', handleInteraction);
    canvas.addEventListener('mousedown', (event) =>{
      if (event.button === 0) {
        setIsMouseDown(true);
        setPreviousMousePosition({ x: event.offsetX, y: event.offsetY });
      }
    });
    canvas.addEventListener('touchstart', (event) => {
      setIsMouseDown(true);
      setPreviousMousePosition({ x: event.touches[0].clientX, y: event.touches[0].clientY });
    });
    canvas.addEventListener('mouseup', () => setIsMouseDown(false));
    canvas.addEventListener('touchend', () => setIsMouseDown(false));

    return () => {
      canvas.removeEventListener('mousemove', handleInteraction);
      canvas.removeEventListener('touchmove', handleInteraction);
      canvas.removeEventListener('mousedown', (event) =>{
        if (event.button === 0) {
          setIsMouseDown(true);
          setPreviousMousePosition({ x: event.offsetX, y: event.offsetY });
        }
      });
      canvas.removeEventListener('touchstart', (event) => {
        setIsMouseDown(true);
        setPreviousMousePosition({ x: event.touches[0].clientX, y: event.touches[0].clientY });
      });
      canvas.removeEventListener('mouseup', () => setIsMouseDown(false));
      canvas.removeEventListener('touchend', () => setIsMouseDown(false));
    };
  }, [gl.domElement, camera, previousMousePosition, isMouseDown]);

  useEffect(() => {
   console.log("Mouse down="+isMouseDown);
}, [isMouseDown]);

  useEffect(() => {
    const hammer = new Hammer(gl.domElement);
    hammer.get('pinch').set({ enable: true });

    hammer.on('pinch', (event) => {
        const zoomChange = event.scale - 1;
        camera.zoom -= zoomChange * 0.1;  // Ajustez la valeur 0.1 selon la sensibilité souhaitée
        camera.zoom = THREE.MathUtils.clamp(camera.zoom, 1, 10);
        camera.updateProjectionMatrix();
    });

    return () => {
        hammer.off('pinch');
    };
}, [gl.domElement, camera]);

  
  useEffect(() => {
    function handleWheel(event) {
      const zoomStep = 0.25;
      const zoomChange = - Math.sign(event.deltaY) * zoomStep;
  
      const mouse = new THREE.Vector2(
          (event.offsetX / gl.domElement.clientWidth) * 2 - 1,
          -(event.offsetY / gl.domElement.clientHeight) * 2 + 1
      );
  
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
  
      const sphereCenter = new THREE.Vector3(0, 0, 0); 
      const sphereRadius = 1000;
  
      const intersectionPoint = getIntersectionWithSphere(camera.position, raycaster.ray.direction.normalize(), sphereCenter, sphereRadius);
  
      if (intersectionPoint) {
          // Faites que la caméra regarde vers le point d'intersection
          camera.lookAt(intersectionPoint);
      }
  
      // Modifiez le zoom de la caméra comme auparavant
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
    camera.position.set(0, 0, 0);
    camera.lookAt(new THREE.Vector3(1, 0, 0));
    camera.updateProjectionMatrix();
  }, []);

  const viewDirection = new THREE.Vector3();
  camera.getWorldDirection(viewDirection);

  const distance = 0.5;  // ajustez cette valeur en fonction de la taille de votre scène
  const offset = viewDirection.multiplyScalar(distance);

  const htmlPosition = new THREE.Vector3().addVectors(camera.position, offset);


  return (
    <>
      {isDebugEnabled && (
        <Html position={htmlPosition.toArray()}>
          <div style={{
            position: 'absolute',
            top: -200,
            left: -200,
            color: 'red',
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            width: '600px'
          }}>
            <span>Zoom: {camera.zoom.toFixed(2)}</span>
            <span>Position: {camera.position.x.toFixed(2)}, {camera.position.y.toFixed(2)}, {camera.position.z.toFixed(2)}</span>
            <span>View Direction: {viewDirection.x.toFixed(2)}, {viewDirection.y.toFixed(2)}, {viewDirection.z.toFixed(2)}</span>
          </div>
        </Html>
      )}
    </>
  );
  
}

export default CameraControls;
