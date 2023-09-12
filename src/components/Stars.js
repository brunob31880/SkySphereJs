import { useEffect, useRef, useContext } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';


function Stars({rotation}) {
    const { scene } = useThree();
    const { maxShownMagnitude,  starsData } = useContext(SkyContext);

    // Créez une référence pour le groupe
    const starGroupRef = useRef(new THREE.Group());

    useEffect(() => {
        starGroupRef.current.rotation.y = rotation.y;
        starGroupRef.current.rotation.x = rotation.x;
    }, [rotation]);

    useEffect(() => {
        if (!starsData) return;
        console.log("Mise à jour maxShownMagnitude= " + maxShownMagnitude);
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
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

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
                uniform float maxMagnitude;
                varying float vMagnitude;
                void main() {
                    vMagnitude = magnitude;
                    gl_PointSize = 1.0 + 19.0 * (1.0 - vMagnitude / maxMagnitude);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D starTexture;
                uniform float maxMagnitude;
                varying float vMagnitude;
                void main() {
                    if (vMagnitude > maxMagnitude) {
                        discard;
                    }
                    gl_FragColor = texture2D(starTexture, gl_PointCoord);
                }
            `,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        // Supprimez tous les enfants existants de starGroupRef.current
        while (starGroupRef.current.children.length > 0) {
            starGroupRef.current.remove(starGroupRef.current.children[0]);
        }
        const points = new THREE.Points(geometry, shaderMaterial);
        starGroupRef.current.add(points);
        scene.add(starGroupRef.current);

        return () => {
            scene.remove(starGroupRef.current);
        };

    }, [starsData, scene, maxShownMagnitude]);

    return null;
}

export default Stars;
