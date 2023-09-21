import React, { useEffect,useContext } from 'react';
import Stars from './Stars';
import Constellations from './Constellations';
import * as THREE from 'three';
import { SkyContext } from '../contexts/Skycontext';
/**
 * 
 * @param {*} param0 
 * @returns 
 */
function Sky() {
    const { shownConstellations,representation,location } = useContext(SkyContext);

    useEffect(() => {
        console.log("Changement de Representation")      
    }, [representation, location]);

    useEffect(() => {
        console.log("Changement de Location")   
    }, [location]);

    return (
        <>
            {/* Affiche les étoiles. */}
            <Stars/>
            {/* Affiche les constellations. */}
            {shownConstellations==="Oui" && <Constellations/>}
        </>
    );
}

export default Sky;
