import { useEffect, useRef, useContext, useState } from 'react';
import { radToDeg } from 'three/src/math/MathUtils';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';
import { getIntersectionWithSphere } from '../utils/astroUtils';
/**
 * 
 */
function Stars() {
    const { scene, camera, gl } = useThree();
    const { isDebugEnabled, setIsDebugEnabled, shownConstellations, representation, maxShownMagnitude, starsData } = useContext(SkyContext);
    const highlightedTextSpriteRef = useRef(null);
    const starGroupRef = useRef(new THREE.Group());
    const highlightedStarRef = useRef(null);
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(0);
    raycaster.linePrecision = 100;
    const mouse = new THREE.Vector2();
    const rayHelperRef = useRef(null);
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
        console.log("Debug=" + isDebugEnabled)
    }, [isDebugEnabled]);

    function addDebugRay() {
        if (!rayHelperRef.current) {
            console.log("Recréation du rayHelper");
            rayHelperRef.current = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 1050, 0xff0000);
            scene.add(rayHelperRef.current);
        }
        else {
            console.log("Mise à jour de la direction du RayHelper");
            rayHelperRef.current.setDirection(raycaster.ray.direction);
            rayHelperRef.current.position.copy(raycaster.ray.origin);
        }
    }

    function removeDebugRay() {
        if (rayHelperRef.current) {
            scene.remove(rayHelperRef.current);
            rayHelperRef.current = null;
        }
    }

    useEffect(() => {
        if (highlightedStarRef.current) {
            console.log("Removing previously highlighted star.");
            starGroupRef.current.remove(highlightedStarRef.current);
        }
        if (highlightedTextSpriteRef.current) {
            starGroupRef.current.remove(highlightedTextSpriteRef.current);
        }
    }, [shownConstellations]);
    /**
     * 
     * @param {*} star 
     */
    function highlightStar(star) {
        if (!font) return;
        if (!star) {
            console.log("Star is undefined");
            return;
        }

        if (!starsData || !starsData.altAzArray) {
            console.log("starsData or starsData.altAzArray is undefined");
            return;
        }

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

        // Récupérez le numéro Hipparcos de l'étoile
        const hipNumber = starsData.hipparcosIds[star.index];
        const starName = starsData.identStars[hipNumber];


        const { azimuth, altitude } = starsData.altAzArray[star.index]
        const { ra, dec } = starsData.raDec[star.index]

        console.log(hipNumber + " " + starName + " Ra=" + radToDeg(ra) + " Dec=" + radToDeg(dec));
        console.log(hipNumber + " " + starName + " Azimut=" + azimuth + " Altitude=" + altitude);
        console.log("Magnitude=" + starsData.magnitudes[star.index])
        const baseSize = 40;
        const adjustedSize = baseSize / camera.zoom;
        if (starName) {
            const textGeom = new THREE.TextGeometry(starName.replace("_", " "), {
                font: font,
                size: adjustedSize,  
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: false
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
            const textMesh = new THREE.Mesh(textGeom, textMaterial);

            // Positionnez et ajoutez le texte à votre groupe
            textMesh.position.copy(vertex);
            textMesh.position.x -= 70;
            textMesh.position.y -= 70;

            // Utilisez la méthode lookAt pour orienter le texte vers la caméra
            textMesh.lookAt(camera.position);

            starGroupRef.current.add(textMesh)

            // Si un texte précédent a été mis en évidence, retirez-le
            if (highlightedTextSpriteRef.current) {
                starGroupRef.current.remove(highlightedTextSpriteRef.current);
            }
            highlightedTextSpriteRef.current = textMesh;
        }
        else console.log("Can't find starname of " + hipNumber);
        console.log("Star has been highlighted!");
    }


    useEffect(() => {
        if (!starsData) return;

        // Vider le groupe d'étoiles
        while (starGroupRef.current.children.length > 0) {
            starGroupRef.current.remove(starGroupRef.current.children[0]);
        }

        // Supprimer l'étoile mise en évidence si elle existe
        if (highlightedStarRef.current) {
            starGroupRef.current.remove(highlightedStarRef.current);
            highlightedStarRef.current = null;
        }

        const geometry = new THREE.BufferGeometry();
        let positions; // Ce tableau contiendra les coordonnées des étoiles

        if (representation === 'Horizontal' && starsData.horizontalCoords) {
            positions = starsData.horizontalCoords;
        } else {
            positions = starsData.vertices;
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
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




        scene.add(starGroupRef.current);

        return () => {
            scene.remove(starGroupRef.current);
        };


    }, [camera.zoom, representation, starsData, scene, maxShownMagnitude]);


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
            console.log("Clic event ", event)
            mouse.x = (event.offsetX / gl.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.offsetY / gl.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            let closestStarIndex = null;
            let minDistance = Infinity;
            const rayOrigin = new THREE.Vector3(0, 0, 0);    // Exemple d'origine  
            const sphereCenter = new THREE.Vector3(0, 0, 0); // Exemple de centre
            const sphereRadius = 1000;


            const intersectionPoint = getIntersectionWithSphere(rayOrigin, raycaster.ray.direction.normalize(), sphereCenter, sphereRadius);
            if (isDebugEnabled) addDebugRay();
            else removeDebugRay();

            if (intersectionPoint) {

                console.log(`Intersection point: ${intersectionPoint.x}, ${intersectionPoint.y}, ${intersectionPoint.z}`);
                let starPositions;
                if (representation === 'Horizontal' && starsData.horizontalCoords) {
                    starPositions = starsData.horizontalCoords;
                } else {
                    starPositions = starsData.vertices;
                }
                // Parcourir les étoiles visibles
                for (let i = 0; i < starPositions.length / 3; i++) {
                    if (starsData.magnitudes[i] <= maxShownMagnitude) {
                        const starPosition = new THREE.Vector3(
                            starPositions[i * 3],
                            starPositions[i * 3 + 1],
                            starPositions[i * 3 + 2]
                        );
                        const distance = starPosition.distanceTo(intersectionPoint);

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestStarIndex = i;
                        }
                    }
                }

                if (closestStarIndex !== null) {
                    const hipparcosId = starsData.hipparcosIds[closestStarIndex];
                    console.log("Etoile la plus proche Hipparcos ID:", hipparcosId);

                    // Mettez en surbrillance cette étoile
                    const star = {
                        object: {
                            geometry: {
                                attributes: {
                                    position: new THREE.BufferAttribute(new Float32Array(starPositions), 3),
                                    hipparcosId: new THREE.BufferAttribute(new Float32Array(starsData.hipparcosIds), 1)
                                }
                            }
                        },
                        index: closestStarIndex
                    };
                    highlightStar(star);
                }

            } else {
                console.log("No intersection");
            }


        }

        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('click', onClick);
            removeDebugRay();
        };
    }, [representation, starsData, camera, gl, isDebugEnabled]);

    return null;
}

export default Stars;
