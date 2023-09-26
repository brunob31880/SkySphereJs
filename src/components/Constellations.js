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

    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        context.font = '24px Arial';
        const textWidth = context.measureText(text).width;
        const textHeight = 24; // Approximation basée sur la taille de la fonte
    
        canvas.width = textWidth + 10; // Ajoutez une petite marge
        canvas.height = textHeight + 10; // Ajoutez une petite marge
    
        // Remplissez le canvas avec une couleur transparente
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        // Configurations pour le texte
        context.fillStyle = '#FFFFFF';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '24px Arial';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
    
        return new THREE.CanvasTexture(canvas);
    }
    



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

            const textTexture = createTextTexture(fullName);
            const spriteMaterial = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
            const sprite = new THREE.Sprite(spriteMaterial);
            // Normalisez la position pour obtenir un vecteur directionnel.
            const directionVector = position.clone().normalize();
            // Multipliez le vecteur directionnel par une distance souhaitée.
            const offset = directionVector.multiplyScalar(0.5); // Ajustez le scalaire selon la distance souhaitée
            // Ajoutez ce déplacement à la position d'origine du sprite.
            sprite.position.copy(position).add(offset);

            sprite.scale.set(200, 100, 1); // Ajustez la taille selon vos besoins
            constellationGroupRef.current.add(sprite);
        }

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
