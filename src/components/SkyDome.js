import React, { useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import Grid from './Grid';
import Horizon from './Horizon';
import CameraControls from '../CameraControls';
import Sky from './Sky';
import { SkyContext } from '../contexts/Skycontext';
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
    const { isLoaded } = useContext(SkyContext);
    // Spinner CSS
    const Spinner = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
        }}>
            {/* Règles d'animation pour le spinner */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={{
                border: '16px solid #f3f3f3',
                borderRadius: '50%',
                borderTop: '16px solid #3498db',
                width: '120px',
                height: '120px',
                animation: 'spin 2s linear infinite',
            }}></div>
        </div>
    );


    return (
        !isLoaded ? <Spinner /> :
            <Canvas style={{ background: '#001122' }} >
                <orthographicCamera position={[0, 0, 0]} left={-1500} right={1500} top={1500} bottom={-1500} near={0.1} far={1500} />

                {/* Afficher le ciel nocturne. */}
                <Sky />

                {/* Affiche l'horizon. */}
                <Horizon />

                {/* Affiche la grille. */}
                <Grid />

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
