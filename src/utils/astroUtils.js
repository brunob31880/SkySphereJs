import { degToRad,radToDeg } from "three/src/math/MathUtils";
/**
 * Calcule le temps sidéral local (LST) pour une longitude donnée.
 * 
 * @param {number} longitude - La longitude en degrés pour laquelle le temps sidéral sera calculé.
 * @return {number} Le temps sidéral local (LST) en degrés.
 */
export function getSiderealTime(longitude) {
    // Obtener la date et l'heure actuelles
    const now = new Date();

    // Calculer le nombre de jours écoulés depuis le début du J2000.0
    const centuryStart = new Date(Date.UTC(2000, 0, 1, 12)); // 1er janvier 2000, 12h UT
    const daysSinceJ2000 = (now - centuryStart) / (1000 * 60 * 60 * 24);

    // Calculez le temps sidéral vert (GST) en utilisant une formule simplifiée
    let GST = 280.16 + 360.9856235 * daysSinceJ2000;
    GST = GST % 360; // Ramenez-le à l'intervalle [0, 360°]

    // Convertir le GST en temps sidéral local (LST) en ajoutant la longitude
    let LST = GST + longitude;
    while (LST < 0) LST += 360;
    while (LST > 360) LST -= 360;

    return LST;
}

/**
 * Calcule l'heure angulaire d'un astre en fonction du temps sidéral local et de son ascension droite.
 * 
 * @param {number} lst - Le temps sidéral local en degrés.
 * @param {number} ra - L'ascension droite de l'astre en degrés.
 * @return {number} L'heure angulaire en degrés.
 */
function calculateHourAngle(lst, ra) {
    let H = lst - ra;

    // Ajustement pour s'assurer que H est dans l'intervalle [0, 360°] ou [0, -360°].
    while (H >= 360) {
        H -= 360;
    }
    while (H < 0) {
        H += 360;
    }

    return H;
}

/**
 * Convertit des coordonnées équatoriales à horizontales.
 * 
 * @param {number} dec - La déclinaison de l'astre en degrés.
 * @param {number} H - L'heure angulaire en degrés.
 * @param {number} latitude - La latitude de l'observateur en degrés.
 * @return {object} Un objet contenant les coordonnées horizontales : azimut (en degrés) et altitude (en degrés).
 */
function equatorialToHorizontal(dec, H, latitude) {
    // Calculer l'altitude de l'astre
    const sinAlt = Math.sin(degToRad(dec)) * Math.sin(degToRad(latitude)) + 
                   Math.cos(degToRad(dec)) * Math.cos(degToRad(latitude)) * Math.cos(degToRad(H));
    const alt = radToDeg(Math.asin(sinAlt));
    
    // Calculer l'azimut de l'astre
    const cosA = (Math.sin(degToRad(dec)) - Math.sin(degToRad(alt)) * Math.sin(degToRad(latitude))) / 
                 (Math.cos(degToRad(alt)) * Math.cos(degToRad(latitude)));
    const az = radToDeg(Math.acos(cosA));
    
    return { azimuth: az, altitude: alt };
}
