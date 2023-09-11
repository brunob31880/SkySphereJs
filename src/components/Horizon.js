import React,{useRef,useEffect} from 'react';
import * as THREE from 'three';

function Horizon() {
    const meshRef = useRef();

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.renderOrder = 1; // Assurez-vous que c'est un numéro plus élevé que les autres objets de votre scène
        }
    }, []);
    const radius=1000;
    const segments =64;
    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringBufferGeometry attach="geometry" args={[0, radius, segments]} />
            <meshBasicMaterial 
                attach="material" 
                color={0xffffff} 
                side={THREE.DoubleSide} 
                transparent={true} 
                opacity={0.1}
                depthWrite={false} // Ajout de cette ligne
            />
        </mesh>
    );
}

export default Horizon;
