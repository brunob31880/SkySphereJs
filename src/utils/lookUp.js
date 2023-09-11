const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const hmsToDeg = (hours, minutes, seconds) => {
    return 15 * (hours + minutes / 60 + seconds / 3600);
}

const dmsToDeg = (degrees, minutes, seconds) => {
    return degrees + minutes / 60 + seconds / 3600;
}

const degToRad = (degrees) => {
    return degrees * (Math.PI / 180);
}
// Vos fonctions utilitaires
const hmsToRad = (h, m, s) => {
    return degToRad(hmsToDeg(h, m, s));
};

const dmsToRad = (d, m, s) => {
    return degToRad(dmsToDeg(d, m, s));
};

rl.question('Entrez l\'ID HIP de l\'étoile : ', (input) => {
    const hip = String(input);
    fs.readFile('../../public/datas/hip.tsv', 'utf-8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier:", err);
            rl.close();
            return;
        }

        const lines = data.split(/\r?\n/).filter(line => !line.startsWith('#') && line.trim() !== '');

        console.log("Searching for HIP:", hip);

        const starLine = lines.find(line => {
            const trimmedLine = line.trim();
            const matches = trimmedLine.startsWith(hip + "|");
            /*  if (matches) {
                  console.log("Match found for:", trimmedLine);
              }*/
            return matches;
        });



        if (!starLine) {
            console.log("Étoile non trouvée");
            rl.close();
            return;
        }

        const parts = starLine.split('|');
        const raParts = parts[1].split(/\s+/).map(parseFloat);
        const decParts = parts[2].split(/\s+/).map(parseFloat);
        const mag = parseFloat(parts[3]);

        const ra = hmsToRad(...raParts);
        const dec = dmsToRad(...decParts);

        const R = 1000;
        const x = R * Math.cos(dec) * Math.cos(ra);
        const z = R * Math.cos(dec) * Math.sin(ra);
        const y = R * Math.sin(dec);

        console.log(`HIP: ${hip} | RA: ${ra} | DEC: ${dec} | Magnitude: ${mag} | x: ${x} | y: ${y} | z: ${z}`);

        rl.close();
    });
});
