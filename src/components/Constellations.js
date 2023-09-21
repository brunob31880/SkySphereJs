import { useEffect, useRef, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';
/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Constellations() {
    const { scene } = useThree();
    const { representation, starsData, constellationLines } = useContext(SkyContext);

    // Créez une référence pour le groupe
    const constellationGroupRef = useRef(new THREE.Group());
    useEffect(() => {
        if (!starsData || !constellationLines) return;

        // Nettoyer le groupe avant de l'ajouter à nouveau
        constellationGroupRef.current.children.forEach(child => {
            console.log("Suppression de ", child);
            constellationGroupRef.current.remove(child);
        });
        scene.remove(constellationGroupRef.current);
        const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

        // Définir la variable positions en fonction de la représentation
        const positions = representation === 'Horizontal' && starsData.horizontalCoords ? starsData.horizontalCoords : starsData.vertices;

        constellationLines.forEach(line => {
            const startStarIndex = starsData.hipToIndex[line.startStar] * 3;
            const endStarIndex = starsData.hipToIndex[line.endStar] * 3;

            const startStarCoords = new THREE.Vector3(
                positions[startStarIndex],
                positions[startStarIndex + 1],
                positions[startStarIndex + 2]
            );

            const endStarCoords = new THREE.Vector3(
                positions[endStarIndex],
                positions[endStarIndex + 1],
                positions[endStarIndex + 2]
            );

            const geometry = new THREE.BufferGeometry().setFromPoints([startStarCoords, endStarCoords]);
            const lineObj = new THREE.Line(geometry, material);
            constellationGroupRef.current.add(lineObj);
        });

        scene.add(constellationGroupRef.current);

        return () => {
            // Supprimer tous les enfants du groupe
            while (constellationGroupRef.current.children.length > 0) {
                constellationGroupRef.current.remove(constellationGroupRef.current.children[0]);
            } // Supprimer le groupe de la scène
            scene.remove(constellationGroupRef.current);
        };

    }, [starsData, scene, constellationLines, representation]);


    return null;
}

export default Constellations;
