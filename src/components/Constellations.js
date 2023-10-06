import { useEffect, useRef, useContext, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';

/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Constellations() {
    const { camera, scene } = useThree();
    const { representation, starsData, constellationLines } = useContext(SkyContext);

    // Créez une référence pour le groupe
    const constellationGroupRef = useRef(new THREE.Group());
    const [font, setFont] = useState(null);




    // Charger la police une seule fois
    useEffect(() => {
        // Étape 1: Chargez une police
        const fontLoader = new THREE.FontLoader();
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', loadedFont => {
            console.log("Police chargée");
            setFont(loadedFont);
        });
    }, []);


    useEffect(() => {
        if (!starsData || !constellationLines) return;
        if (!font) return;  // Assurez-vous que la police est chargée
        // Nettoyer le groupe avant de l'ajouter à nouveau
        constellationGroupRef.current.children.forEach(child => {
            console.log("Suppression de ", child);
            constellationGroupRef.current.remove(child);
        });
        scene.remove(constellationGroupRef.current);
        const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

        // Définir la variable positions en fonction de la représentation
        const positions = representation === 'Horizontal' && starsData.horizontalCoords ? starsData.horizontalCoords : starsData.vertices;

        const barycenters = {};

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
            // Calcul du barycentre
            if (!barycenters[line.fullName]) {
                barycenters[line.fullName] = {
                    sum: new THREE.Vector3(0, 0, 0),
                    count: 0
                };
            }

            const barycenter = barycenters[line.fullName];
            barycenter.sum.add(startStarCoords);
            barycenter.sum.add(endStarCoords);
            barycenter.count += 2;
        });
        // Création des labels pour chaque barycentre

        for (const fullName in barycenters) {
            const barycenter = barycenters[fullName];
            const position = barycenter.sum.divideScalar(barycenter.count);
            const baseSize = 40;
            const adjustedSize = baseSize / camera.zoom;
            // Créer une TextGeometry avec le nom complet de la constellation
            const textGeom = new THREE.TextGeometry(fullName, {
                font: font,
                size: adjustedSize,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false
            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeom, textMaterial);

            // Positionnez et ajoutez le texte à votre groupe
            textMesh.position.copy(position);

            // Ajustez la position, l'orientation et l'échelle si nécessaire
            // par exemple, vous voudrez peut-être que le texte regarde vers le centre de la scène :
            textMesh.lookAt(new THREE.Vector3(0, 0, 0));

            constellationGroupRef.current.add(textMesh);

        }

        scene.add(constellationGroupRef.current);

        return () => {
            // Supprimer tous les enfants du groupe
            while (constellationGroupRef.current.children.length > 0) {
                constellationGroupRef.current.remove(constellationGroupRef.current.children[0]);
            } // Supprimer le groupe de la scène
            scene.remove(constellationGroupRef.current);
        };

    }, [camera.zoom, starsData, scene, constellationLines, representation, font]);


    return null;
}

export default Constellations;
