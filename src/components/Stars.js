import { useEffect, useRef, useContext, useState } from 'react';

import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';
/**
 * 
 */
function Stars({ rotation }) {
    const { scene, camera, gl } = useThree();
    const { maxShownMagnitude, starsData } = useContext(SkyContext);

    const [isDebugEnabled, setIsDebugEnabled] = useState(true);
    const hitboxes = useRef([]);

    const starGroupRef = useRef(new THREE.Group());
    const highlightedStarRef = useRef(null);
    const raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 100;
    const mouse = new THREE.Vector2();
    const rayHelperRef = useRef(null);

    useEffect(() => {
        starGroupRef.current.rotation.y = rotation.y;
        starGroupRef.current.rotation.x = rotation.x;
    }, [rotation]);

    useEffect(() => {
        console.log("Debug=" + isDebugEnabled)
    }, [isDebugEnabled]);

    function addDebugRay() {
        if (!rayHelperRef.current) {
            rayHelperRef.current = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 1050, 0xff0000);
            scene.add(rayHelperRef.current);
        }
    }

    function removeDebugRay() {
        if (rayHelperRef.current) {
            scene.remove(rayHelperRef.current);
            rayHelperRef.current = null;
        }
    }


    function highlightStar(star) {
        console.log("Highlight Star Function Called");

        if (highlightedStarRef.current) {
            console.log("Removing previously highlighted star.");
            starGroupRef.current.remove(highlightedStarRef.current);
        }

        const circleGeometry = new THREE.RingGeometry(14, 24, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);

        // Get the star's (vertex) position from the Points geometry
        const starPosition = star.object.geometry.attributes.position;
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(starPosition, star.index);
        circle.position.copy(vertex);

        console.log("Star Position:", vertex);

        // Calculate the direction from the camera to the star
        const direction = new THREE.Vector3().subVectors(vertex, camera.position).normalize();

        // Use the lookAt method to orient the circle towards the camera
        circle.lookAt(camera.position);

        starGroupRef.current.add(circle);
        highlightedStarRef.current = circle;

        console.log("Star has been highlighted!");
    }


    useEffect(() => {
        if (!starsData) return;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(starsData.vertices, 3));
        geometry.setAttribute('magnitude', new THREE.Float32BufferAttribute(starsData.magnitudes, 1));
        geometry.setAttribute('hipparcosId', new THREE.Float32BufferAttribute(starsData.hipparcosIds, 1));

        function createStarTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

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

        while (starGroupRef.current.children.length > 0) {
            starGroupRef.current.remove(starGroupRef.current.children[0]);
        }

        const points = new THREE.Points(geometry, shaderMaterial);
        starGroupRef.current.add(points);

        const visibleStarPositions = [];

        for (let i = 0; i < starsData.magnitudes.length; i++) {
            if (starsData.magnitudes[i] <= maxShownMagnitude) {
                visibleStarPositions.push(starsData.vertices[i * 3], starsData.vertices[i * 3 + 1], starsData.vertices[i * 3 + 2]);
            }
        }

        if (visibleStarPositions.length > 0) {
            const hitboxMaterial = new THREE.PointsMaterial({ size: 60, transparent: true, opacity: 0 });
            /*
            const hitboxMaterial = new THREE.PointsMaterial({
                size: 60,
                transparent: true,
                opacity: 0.5,  // Opacité ajustée pour voir la hitbox
                color: 0xff0000  // couleur en rouge pour différencier la hitbox
            });
            */
            const hitboxGeometry = new THREE.BufferGeometry();
            hitboxGeometry.setAttribute('position', new THREE.Float32BufferAttribute(visibleStarPositions, 3));
            const hitboxes = new THREE.Points(hitboxGeometry, hitboxMaterial);
            starGroupRef.current.add(hitboxes);
        }


        scene.add(starGroupRef.current);

        return () => {
            scene.remove(starGroupRef.current);
        };


    }, [starsData, scene, maxShownMagnitude]);


    useEffect(() => {
        function handleKeyDown(event) {
            // Par exemple, vérifiez si la touche 'D' est pressée :
            if (event.key === 'd' || event.key === 'D') {
                setIsDebugEnabled(prev => !prev);  // bascule le mode debug
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);



    useEffect(() => {
        function onClick(event) {
            mouse.x = (event.offsetX / gl.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.offsetY / gl.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            raycaster.far = 1100;

            if (isDebugEnabled) {
                addDebugRay();
            } else {
                removeDebugRay();
            }

            // Filtrer les objets pour ne pas inclure le cercle bleu mis en évidence lors de l'interception
            const objectsToIntersect = starGroupRef.current.children.filter(obj => obj !== highlightedStarRef.current);

            const intersects = raycaster.intersectObjects(objectsToIntersect, true);

            if (intersects.length > 0) {
                console.log("Intersect=", intersects[0])
                const star = intersects[0];
                const hipparcosIdAttribute = star.object.geometry.attributes.hipparcosId;
                const hipparcosId = hipparcosIdAttribute.getX(star.index);   
                console.log("Intercepted Star Hipparcos ID:", hipparcosId);
                highlightStar(star);
            }
        }


        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('click', onClick);
            removeDebugRay();
        };
    }, [camera, gl, isDebugEnabled]);

    return null;
}

export default Stars;
