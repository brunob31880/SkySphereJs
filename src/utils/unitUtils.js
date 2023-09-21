const degToRad = (degrees) => {
    return degrees * (Math.PI / 180);
}

const hmsToDeg = (hours, minutes, seconds) => {
    return 15 * (hours + minutes / 60 + seconds / 3600);
}

const dmsToDeg = (degrees, minutes, seconds) => {
    return degrees + minutes / 60 + seconds / 3600;
}

const hmsToRad = (hours, minutes, seconds) => {
    return degToRad(hmsToDeg(hours, minutes, seconds));
}

const dmsToRad = (degrees, minutes, seconds) => {
    return degToRad(dmsToDeg(degrees, minutes, seconds));
}
function radToDeg(angleInRadians) {
    return angleInRadians * (180 / Math.PI);
}

export { radToDeg,degToRad, hmsToDeg, dmsToDeg, hmsToRad, dmsToRad };
