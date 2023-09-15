import React from 'react';
import { Canvas } from '@react-three/fiber';
import RADECGrid from './RADECGrid';
import Horizon from './Horizon';
import CameraControls from '../CameraControls';
import Sky from './Sky';

/*
En ce qui concerne les directions des axes dans Three.js:

L'axe X est dirigé vers la droite.
L'axe Y est dirigé vers le haut.
L'axe Z est dirigé en avant, hors de l'écran.
Donc, dans votre configuration:

L'axe X (rouge dans axesHelper) pointe vers la droite.
L'axe Y (vert dans axesHelper) pointe vers le haut.
L'axe Z (bleu dans axesHelper) pointe directement hors de l'écran vers vous.
Lorsque vous utilisez axesHelper, il affiche des lignes représentant ces axes dans ces couleurs. Le rouge est pour X, le vert pour Y, et le bleu pour Z.
*/
function SkyDome() {
    return (
        <Canvas style={{ background: '#001122' }} >
            <orthographicCamera position={[0, 0, 0]} left={-1500} right={1500} top={1500} bottom={-1500} near={0.1} far={1500} />
            
            {/* Afficher le ciel nocturne. */}
            <Sky />

            {/* Affiche l'horizon. */}
            <Horizon />

            {/* Affiche la grille RA/DEC. */}
            <RADECGrid />

            {/* Affiche les aides pour les axes. */}
            <axesHelper args={[1000]} />

            {/* Éclaire la scène avec une lumière ambiante. */}
            <ambientLight intensity={0.5} />

            {/* Ajoute une lumière directionnelle pointant vers la position spécifiée. */}
            <directionalLight position={[0, 0, 5]} intensity={1} />

            {/* Contrôles pour la caméra. */}
            <CameraControls />
        </Canvas>
    );
}

export default SkyDome;
