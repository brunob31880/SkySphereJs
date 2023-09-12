import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect } from 'react';
import * as THREE from 'three';

function CameraControls() {
  const { camera, gl } = useThree();
  const [lookAt, setLookAt] = useState(new THREE.Vector3(0, 0, -1));

  useEffect(() => {
    function handleMouseMove(event) {
      // Mettez à jour le point lookAt en fonction du mouvement de la souris
      setLookAt(new THREE.Vector3(event.clientX, event.clientY, 0));
    }

    // Ajoutez l'eventListener au canvas
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);

    // Assurez-vous de nettoyer l'eventListener lorsque le composant est démonté
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement]);

  useEffect(() => {
    camera.lookAt(lookAt);
  }, [lookAt, camera]);

  return <OrbitControls enableZoom={true} />;
}

export default CameraControls;

