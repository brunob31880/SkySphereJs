import { useEffect, useRef, useContext, useState } from 'react';
import { radToDeg } from 'three/src/math/MathUtils';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';
/**
 * 
 */
function Stars() {
    const { scene, camera, gl } = useThree();
    const { shownConstellations, representation, maxShownMagnitude, starsData } = useContext(SkyContext);

    const [isDebugEnabled, setIsDebugEnabled] = useState(false);

    const highlightedTextSpriteRef = useRef(null);

    const starGroupRef = useRef(new THREE.Group());
    const highlightedStarRef = useRef(null);
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(0);
    raycaster.linePrecision = 100;
    const mouse = new THREE.Vector2();
    const rayHelperRef = useRef(null);




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
    /**
     * 
     * @param {*} text 
     * @returns 
     */
    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        ctx.font = '58px Arial'; // Modifiez selon vos préférences
        ctx.fillStyle = "blue";
        ctx.fillText(text, 0, 58);
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    /**
     * 
     * @param {*} texture 
     * @returns 
     */
    function createTextSprite(texture) {
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, color: 0x0000ff });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(200, 100, 1); // Ajustez la taille selon vos préférences
        return sprite;
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

        console.log(hipNumber+" "+starName + " Ra=" + radToDeg(ra) + " Dec=" + radToDeg(dec));
        console.log(hipNumber+" "+starName + " Azimut=" + azimuth + " Altitude=" + altitude);
        console.log("Magnitude="+starsData.magnitudes[star.index])
        if (starName) {
            const textTexture = createTextTexture(starName);
            const textSprite = createTextSprite(textTexture);

            // Positionnez le sprite à côté du cercle
            textSprite.position.copy(vertex);
            textSprite.position.x -= 70;
            textSprite.position.y -= 70;
            // Ajoutez le sprite au groupe d'étoiles
            starGroupRef.current.add(textSprite);

            // Si un sprite précédent a été mis en évidence, retirez-le
            if (highlightedTextSpriteRef.current) {
                starGroupRef.current.remove(highlightedTextSpriteRef.current);
            }
            highlightedTextSpriteRef.current = textSprite;
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


    }, [representation, starsData, scene, maxShownMagnitude]);


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

    function getIntersectionWithSphere(rayOrigin, rayDirection, sphereCenter, sphereRadius) {
        // Calcul des coefficients a, b et c pour l'équation quadratique
        const oc = new THREE.Vector3().subVectors(rayOrigin, sphereCenter);

        const a = rayDirection.dot(rayDirection);
        const b = 2.0 * oc.dot(rayDirection);
        const c = oc.dot(oc) - sphereRadius * sphereRadius;

        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return null; // Pas d'intersection
        } else {
            // On utilise t1 comme point d'intersection car c'est le point le plus proche
            const t1 = (-b - Math.sqrt(discriminant)) / (2.0 * a);
            const t2 = (-b + Math.sqrt(discriminant)) / (2.0 * a);

            // Si t1 est négatif, alors le début du rayon est à l'intérieur de la sphère
            const t = t1 > 0 ? t1 : t2;

            return new THREE.Vector3(
                rayOrigin.x + t * rayDirection.x,
                rayOrigin.y + t * rayDirection.y,
                rayOrigin.z + t * rayDirection.z
            );
        }
    }




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
