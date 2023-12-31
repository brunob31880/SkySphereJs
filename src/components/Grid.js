import React, { useRef, useEffect,useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
/**
 * 
 * @returns 
 */
function Grid() {
    const group = useRef();
    const { camera, gl, size } = useThree();
    const [font, setFont] = useState(null);

    const clearGroup = () => {
        for (let i = group.current.children.length - 1; i >= 0; i--) {
            const child = group.current.children[i];
            group.current.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        }
    };
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
        if (!font) return;  // Assurez-vous que la police est chargée
        clearGroup();
        const segments = 64;
        const numDivisions = 36;  // Par exemple, pour 36 divisions
        const increment = 360 / numDivisions;

        const dashMaterialRA = new THREE.LineDashedMaterial({
            color: 0x684f4f,
            dashSize: 10,
            gapSize: 5
        });

        const dashMaterialDEC = new THREE.LineDashedMaterial({
            color: 0x684f4f,
            dashSize: 10,
            gapSize: 5
        });

        const createCircleGeometry = (radius) => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array((segments + 1) * 3);

            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                positions[i * 3] = radius * Math.cos(theta);
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = radius * Math.sin(theta);
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            return geometry;
        };
      
     //   const fontLoader = new THREE.FontLoader();

      //  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            for (let ra = 0; ra < 360; ra += increment) {
                const circGeom = createCircleGeometry(1000);

                // Tourner le cercle de 90 degrés autour de l'axe Z pour le positionner dans le plan YZ.
                circGeom.rotateZ(THREE.MathUtils.degToRad(90));

                // Ensuite, tourner la géométrie autour de l'axe Y par ra degrés.
                circGeom.rotateY(THREE.MathUtils.degToRad(ra));

                const circ = new THREE.Line(circGeom, dashMaterialRA);
                circ.computeLineDistances();
                // Pour le raycasting
                circ.layers.set(1);
                group.current.add(circ);
                // Étape 2: Créez une TextGeometry pour chaque valeur de 'ra'
                const baseSize = 30;
                const adjustedSize = baseSize / camera.zoom;

                const textGeom = new THREE.TextGeometry(String(ra), {
                    font: font,
                    size: adjustedSize,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: false,
                });


                // Étape 3: Positionnez le texte sur la sphère
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0x684f4f });  // Couleur du texte, ajustez selon vos besoins
                const textMesh = new THREE.Mesh(textGeom, textMaterial);

                const radius = 1000;
                textMesh.position.x = radius * Math.cos(THREE.MathUtils.degToRad(ra));
                textMesh.position.z = radius * Math.sin(THREE.MathUtils.degToRad(ra));
                textMesh.position.y = 0;

                textMesh.lookAt(0, 0, 0);  // Faites en sorte que le texte regarde vers le centre de la sphère
                group.current.add(textMesh);
            }


            for (let dec = -90; dec < 90; dec += increment) {
                const circGeom = createCircleGeometry(1000 * Math.cos(THREE.MathUtils.degToRad(dec)));
                const circ = new THREE.Line(circGeom, dashMaterialDEC);
                circ.translateY(1000 * Math.sin(THREE.MathUtils.degToRad(dec)));
                circ.computeLineDistances();
                // Pour le raycasting
                circ.layers.set(1);
                group.current.add(circ);
                // Étape 2: Créez une TextGeometry pour chaque valeur de 'dec'
                const baseSize = 30;
                const adjustedSize = baseSize / camera.zoom;

                const textGeom = new THREE.TextGeometry(String(dec), {
                    font: font,
                    size: adjustedSize,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: false,
                });


                // Étape 3: Positionnez le texte sur la sphère
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0x684f4f });  // Couleur du texte, ajustez selon vos besoins
                const textMesh = new THREE.Mesh(textGeom, textMaterial);

                const radius = 1000;
                textMesh.position.x = radius * Math.cos(THREE.MathUtils.degToRad(dec));
                textMesh.position.y = radius * Math.sin(THREE.MathUtils.degToRad(dec));
                textMesh.position.z = 0

                textMesh.lookAt(0, 0, 0);  // Faites en sorte que le texte regarde vers le centre de la sphère
                group.current.add(textMesh);
            }

    //    })
    }, [camera.zoom,font]);

    return <group ref={group} />;
}

export default Grid;
