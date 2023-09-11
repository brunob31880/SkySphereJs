// SkyContext.js
import React, { useState, useEffect } from 'react';
import { hmsToRad, dmsToRad } from '../utils/unitUtils';

const SkyContext = React.createContext();

function SkyProvider({ children }) {
    const [representation, setRepresentation] = useState("Equatorial");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [starsData, setStarsData] = useState(null);
    const [hipToIndex, setHipToIndex] = useState({});

    const [maxShownMagnitude, setMaxShownMagnitude] = useState(6);
    const [constellationLines, setConstellationLines] = useState([]);
    const R = 1000; // Rayon de la sphère céleste
    const toggleRepresentation = () => {
        if (representation === 'Equatorial') {
            setRepresentation('Horizontal');
        } else {
            setRepresentation('Equatorial');
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
        }, 1000);  // Met à jour l'heure chaque seconde

        return () => clearInterval(interval);  // Nettoie l'intervalle lors du démontage du composant
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
        fetch('./datas/hip.tsv')
            .then(response => response.text())
            .then(data => {
                let minRA = Infinity;
                let maxRA = -Infinity;
                let minDEC = Infinity;
                let maxDEC = -Infinity;

                const lines = data.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');

                const coords = [];
                const newMagnitudes = [];

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

                    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                        coords.push(x, y, z);
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

                // Afficher un échantillon des étoiles
                // console.log("Sample stars:", lines.slice(0, 10));



                const starsData = {
                    vertices: coords,
                    magnitudes: newMagnitudes,
                    hipToIndex: hipToIndex
                };
                // Stockez les données dans le contexte
                setStarsData(starsData);
            });

        fetch('./datas/constellation_line_hip.csv') // Assurez-vous d'avoir le bon chemin vers le fichier
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
                const parsedLines = lines.map(line => {
                    // console.log("Line=", line)
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
            });
    }, []);


    return (
        <SkyContext.Provider value={{ maxShownMagnitude, setMaxShownMagnitude, starsData, setStarsData, representation, setRepresentation, currentTime, location, toggleRepresentation, constellationLines }}>
            {children}
        </SkyContext.Provider>
    );
}

export { SkyContext, SkyProvider };
