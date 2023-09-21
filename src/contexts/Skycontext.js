// SkyContext.js
import React, { useState, useEffect } from 'react';
import { radToDeg,hmsToRad, dmsToRad } from '../utils/unitUtils';
import { getSiderealTime, equatorialToHorizontal, calculateHourAngle } from '../utils/astroUtils'
const SkyContext = React.createContext();

function SkyProvider({ children }) {
    const [representation, setRepresentation] = useState("Equatorial");
    const [shownConstellations, setShownConstellations] = useState("Oui");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [starsData, setStarsData] = useState(null);
    const [horizontalCoords, setHorizontalCoords] = useState(null);
    const [hipToIndex, setHipToIndex] = useState({});
    const [maxShownMagnitude, setMaxShownMagnitude] = useState(6);
    const [constellationLines, setConstellationLines] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const R = 1000; // Rayon de la sphère céleste

    const toggleRepresentation = () => {
        if (representation === 'Equatorial') {
            setRepresentation('Horizontal');
        } else {
            setRepresentation('Equatorial');
        }
    };

    const toggleShownConstellations = () => {
        if (shownConstellations === "Oui") {
            setShownConstellations("Non");
        } else {
            setShownConstellations("Oui");
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, error => {
                console.error("Erreur de géolocalisation:", error);
            });
        } else {
            console.error("Géolocalisation non supportée par ce navigateur.");
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const parseDMS = (dms) => {
        const parts = dms.split(/\s+/);
        return parts.map(part => parseFloat(part));
    };

    const parseHMS = (hms) => {
        const parts = hms.split(/\s+/);
        return parts.map(part => parseFloat(part));
    };

    useEffect(() => {
        if (starsData && location.latitude && location.longitude) {
            console.log("Calcul des coordonnées horizontales");

            // Démarrer le chronomètre
            console.time("Calcul des coordonnées horizontales");
            let minAzimuth = Infinity;
            let maxAzimuth = -Infinity;
            let minAltitude = Infinity;
            let maxAltitude = -Infinity;


            const newAltAzArray = [];
            const newHorizontalCoords = [];

            starsData.raDec.forEach((raDec) => {
                const { ra, dec } = raDec;
                const LST = getSiderealTime(location.longitude);
                const raInDegrees = radToDeg(ra);
                const decInDegrees = radToDeg(dec);

                const hourAngle = calculateHourAngle(LST, raInDegrees);
                const { azimuth, altitude } = equatorialToHorizontal(decInDegrees, hourAngle, location.latitude);



                // Mettre à jour les valeurs minimales et maximales
                if (azimuth < minAzimuth) minAzimuth = azimuth;
                if (azimuth > maxAzimuth) maxAzimuth = azimuth;
                if (altitude < minAltitude) minAltitude = altitude;
                if (altitude > maxAltitude) maxAltitude = altitude;

                newAltAzArray.push({ azimuth, altitude }); // Stocker les valeurs d'azimuth et d'altitude

                const x = R * Math.cos(altitude) * Math.cos(azimuth);
                const z = R * Math.cos(altitude) * Math.sin(azimuth);
                const y = R * Math.sin(altitude);

                newHorizontalCoords.push(x, y, z);  // Ajouter les coordonnées en séquence
            });

            // Afficher les valeurs minimales et maximales pour le débogage
            console.log("Azimuth Range:", minAzimuth, "-", maxAzimuth);
            console.log("Altitude Range:", minAltitude, "-", maxAltitude);

            // Arrêter le chronomètre et afficher le temps écoulé
            console.timeEnd("Calcul des coordonnées horizontales");

            setHorizontalCoords(newHorizontalCoords);
            setStarsData({
                ...starsData,
                horizontalCoords: newHorizontalCoords,
                altAzArray: newAltAzArray  // Ajouter le nouveau tableau altAzArray au contexte
            });
        }
    }, [isLoaded, location]);






    useEffect(() => {
        Promise.all([
            fetch(`${process.env.PUBLIC_URL}/datas/hip.tsv`).then(response => response.text()),
            fetch(`${process.env.PUBLIC_URL}/datas/constellation_line_hip.csv`).then(response => response.text()),
            fetch(`${process.env.PUBLIC_URL}/datas/ident4.csv`).then(response => response.text())
        ]).then(([starsDataText, constellationLinesText, idents]) => {
            // Logique pour traiter starsDataText et constellationLinesText
            // Traitement de starsDataText
            let minRA = Infinity;
            let maxRA = -Infinity;
            let minDEC = Infinity;
            let maxDEC = -Infinity;

            const lines = starsDataText.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');

            const coords = [];
            const hipparcosIds = [];
            const newMagnitudes = [];
            const raDecArray = [];

            const RA_INDEX = 1;
            const DEC_INDEX = 2;
            const MAG_INDEX = 3;


            // Créez une liste de tous les numéros HIP présents dans le fichier
            const presentHips = lines.map(line => parseInt(line.split('|')[0])).sort((a, b) => a - b);

            // Créez une liste complète de 1 à 118322
            const allHips = Array.from({ length: 118322 }, (_, i) => i + 1);

            // Trouvez les numéros HIP manquants
            const missingHips = allHips.filter(hip => !presentHips.includes(hip));

            console.log("Missing HIP numbers:", missingHips);

            lines.forEach((line, index) => {
                const parts = line.split('|');
                const hipNumber = parseInt(parts[0], 10);
                hipToIndex[hipNumber] = index;
                const raParts = parseHMS(parts[RA_INDEX]);
                const decParts = parseDMS(parts[DEC_INDEX]);

                const ra = hmsToRad(...raParts);
                const dec = dmsToRad(...decParts);
                const mag = parseFloat(parts[MAG_INDEX]);

                if (ra < minRA) minRA = ra;
                if (ra > maxRA) maxRA = ra;
                if (dec < minDEC) minDEC = dec;
                if (dec > maxDEC) maxDEC = dec;

                if (!isNaN(mag)) {
                    newMagnitudes.push(mag);
                } else {
                    console.error("Invalid magnitude value:", parts[MAG_INDEX]);
                }

                const x = R * Math.cos(dec) * Math.cos(ra);
                const z = R * Math.cos(dec) * Math.sin(ra);
                const y = R * Math.sin(dec);

                // pour deboggage affichage de la position de la polaire

                if (hipNumber === 11767) console.log('Etoile polaire: X=' + x + " Y=" + y + " Z=" + z + " ");
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                    coords.push(x, y, z);
                    hipparcosIds.push(hipNumber)
                    raDecArray.push({ ra, dec });
                } else {
                    console.error("Problem with HIP=" + parts[0]);
                }

                // Vérifier la taille des tableaux de données
                if ((coords.length / 3) !== newMagnitudes.length) {
                    console.error("Mismatch detected at line index:", index);
                    console.error("Line content:", line);
                    throw new Error("Mismatch in data arrays"); // This will stop further processing
                }
            });


            console.log("Nb étoiles:" + newMagnitudes.length);
            console.log("RA Range:", minRA, "-", maxRA);
            console.log("DEC Range:", minDEC, "-", maxDEC);

            // Vérifier la gamme de magnitudes
            const validMagnitudes = newMagnitudes.filter(mag => !isNaN(mag));

            const minMagnitude = Math.min(...validMagnitudes);
            const maxMagnitude = Math.max(...validMagnitudes);
            console.log("Magnitude Range:", minMagnitude, "-", maxMagnitude);

            const identStars = {};

            // console.log(idents.split('\n'))
            const identLines = idents.split('\n').filter(line => line.trim() !== '');
            identLines.forEach(line => {
                const parts = line.split('|');
                let starName = parts[0].trim();
                // Retire les guillemets en trop
                if (starName.startsWith('"')) {
                    starName = starName.substring(1);
                }
                if (starName.endsWith('"')) {
                    starName = starName.substring(0, starName.length - 1);
                }

                const hipNumber = parseInt(parts[1].trim(), 10);

                if (!isNaN(hipNumber)) {
                    identStars[hipNumber] = starName;
                }
            });
            console.log("Premières valeurs de raDecArray:", raDecArray.slice(0, 10));

            const starsData = {
                vertices: coords,
                magnitudes: newMagnitudes,
                hipToIndex: hipToIndex,
                hipparcosIds,
                identStars,
                raDec: raDecArray
            };

            // Stockez les données dans le contexte
            setStarsData(starsData);
            // Traitement de constellationLinesText
            const constellationLines = constellationLinesText.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
            const parsedLines = constellationLines.map(line => {
                const parts = line.split(',');
                return {
                    abbreviation: parts[0],
                    group: parts[1],
                    abbreviationGroup: parts[2],
                    startStar: parseInt(parts[3]),
                    endStar: parseInt(parts[4])
                };
            });

            setConstellationLines(parsedLines);
            setIsLoaded(true);  // Mettre à jour isLoaded à true une fois que tout est chargé
        });
    }, []);

    return (
        <SkyContext.Provider value={{ isLoaded, shownConstellations, toggleShownConstellations, maxShownMagnitude, setMaxShownMagnitude, starsData, setStarsData, representation, setRepresentation, currentTime, location, toggleRepresentation, constellationLines, isLoaded, horizontalCoords, setHorizontalCoords }}>
            {children}
        </SkyContext.Provider>
    );
}

export { SkyContext, SkyProvider };
