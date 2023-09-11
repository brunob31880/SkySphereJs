import { useEffect, useRef, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';
import { getSiderealTime } from '../utils/astroUtils';

function Stars() {
    const { scene } = useThree();
    const { maxShownMagnitude, representation, location, starsData } = useContext(SkyContext);

    // Créez une référence pour le groupe
    const starGroupRef = useRef(new THREE.Group());

    useEffect(() => {
        if (representation === 'Equatorial') {
            starGroupRef.current.rotation.y = 0;
            starGroupRef.current.rotation.x = 0;
        } else if (representation === 'Horizontal') {
            if (!starGroupRef.current) return;
            const longitude = location.longitude;
            const latitude = location.latitude;
            const LST = getSiderealTime(longitude);
            const LSTinRadians = THREE.MathUtils.degToRad(LST);
            starGroupRef.current.rotation.y = LSTinRadians;
            const inclination = THREE.MathUtils.degToRad(90 - latitude);
            starGroupRef.current.rotation.x = inclination;
        }
    }, [representation, location]);

    useEffect(() => {
        if (!starsData) return;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.vertices, 3));
        geometry.setAttribute('magnitude', new THREE.Float32BufferAttribute(starsData.magnitudes, 1));

        function createStarTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 64;  // Doubler la résolution pour un dégradé plus doux
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

            // Créer un gradient radial
            const gradient = ctx.createRadialGradient(32, 32, 8, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');  // Transparent aux bords

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        }

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                starTexture: { value: createStarTexture() },
                maxMagnitude: { value: maxShownMagnitude }
            },
            vertexShader: `
                attribute float magnitude;
                varying float vMagnitude;
                void main() {
                    vMagnitude = magnitude;
                    gl_PointSize = 10.0 / (vMagnitude + 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
    uniform sampler2D starTexture;
    uniform float maxMagnitude;
    varying float vMagnitude;
    void main() {
        if (vMagnitude > maxMagnitude) {
            discard; // Ne pas afficher les étoiles dont la magnitude est supérieure à maxMagnitude
        }
        float alpha = pow(4.0, -0.00001 * vMagnitude)+0.3;  // Utilisation d'une fonction exponentielle
        gl_FragColor = texture2D(starTexture, gl_PointCoord) * vec4(1.0, 1.0, 1.0, alpha);
    }
`,

            transparent: true,
            depthTest: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });


        const points = new THREE.Points(geometry, shaderMaterial);
        starGroupRef.current.add(points);
        // Ajoutez le groupe contenant les étoiles  à la scène
        scene.add(starGroupRef.current);

        return () => {
            scene.remove(starGroupRef.current);
        };

    }, [starsData, scene, maxShownMagnitude]);

    return null;
}

export default Stars;
