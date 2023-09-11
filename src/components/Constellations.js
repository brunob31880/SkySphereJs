import { useEffect, useRef, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';

function Constellations() {
    const { scene } = useThree();
    const { starsData, constellationLines } = useContext(SkyContext);

    // Créez une référence pour le groupe
    const constellationGroupRef = useRef(new THREE.Group());

    useEffect(() => {
        if (!starsData || !constellationLines) return;

        const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });  // Une ligne blanche pour les constellations

        constellationLines.forEach(line => {

            const startStarIndex = starsData.hipToIndex[line.startStar] * 3;
            const endStarIndex = starsData.hipToIndex[line.endStar] * 3;
            
             console.log("Start="+line.startStar+" "+starsData.vertices[startStarIndex]+","+starsData.vertices[startStarIndex + 1]+","+starsData.vertices[startStarIndex + 2]);
             console.log("End="+line.endStar+" "+starsData.vertices[endStarIndex]+","+starsData.vertices[endStarIndex + 1]+","+starsData.vertices[endStarIndex + 2]);
           
            if (starsData.vertices[startStarIndex] !== undefined && starsData.vertices[endStarIndex] !== undefined) {
                const startStarCoords = new THREE.Vector3(
                    starsData.vertices[startStarIndex],
                    starsData.vertices[startStarIndex + 1],
                    starsData.vertices[startStarIndex + 2]
                );

                const endStarCoords = new THREE.Vector3(
                    starsData.vertices[endStarIndex],
                    starsData.vertices[endStarIndex + 1],
                    starsData.vertices[endStarIndex + 2]
                );

                const geometry = new THREE.BufferGeometry().setFromPoints([startStarCoords, endStarCoords]);
                const line = new THREE.Line(geometry, material);
                constellationGroupRef.current.add(line);
            }
        });
        
        // Ajoutez le groupe contenant les lignes à la scène
        scene.add(constellationGroupRef.current);

        return () => {
            scene.remove(constellationGroupRef.current);
        };

    }, [starsData, scene, constellationLines]);

    return null;
}

export default Constellations;
