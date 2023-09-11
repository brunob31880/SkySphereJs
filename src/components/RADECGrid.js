import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function RADECGrid() {
    const group = useRef();

    useEffect(() => {
        const segments = 64;
        const numDivisions = 36;  // Par exemple, pour 36 divisions
        const increment = 360 / numDivisions;

        const dashMaterialRA = new THREE.LineDashedMaterial({
            color: 0x00ff00,
            dashSize: 10,
            gapSize: 5
        });

        const dashMaterialDEC = new THREE.LineDashedMaterial({
            color: 0x0000ff,
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

        for (let ra = 0; ra < 360; ra += increment) {
            const circGeom = createCircleGeometry(1000);
            
            // Tourner le cercle de 90 degrés autour de l'axe Z pour le positionner dans le plan YX.
            circGeom.rotateZ(THREE.MathUtils.degToRad(90));
            
            // Ensuite, tourner la géométrie autour de l'axe Y par ra degrés.
            circGeom.rotateY(THREE.MathUtils.degToRad(ra));
        
            const circ = new THREE.Line(circGeom, dashMaterialRA);
            circ.computeLineDistances();
            group.current.add(circ);
        }
        

        for (let dec = -90; dec < 90; dec += increment) {
            const circGeom = createCircleGeometry(1000*Math.cos(THREE.MathUtils.degToRad(dec) ));
            const circ = new THREE.Line(circGeom, dashMaterialDEC);
            circ.translateY(1000*Math.sin(THREE.MathUtils.degToRad(dec)));
            circ.computeLineDistances();
            group.current.add(circ);
        }

    }, []);

    return <group ref={group} />;
}

export default RADECGrid;
