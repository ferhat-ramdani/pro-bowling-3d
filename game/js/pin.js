function createVector(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

// Generate a mathematically perfect, ultra-smooth USBC standard bowling pin profile
function createRealisticPinProfile() {
    // Exact USBC scaled proportions
    let curve = new THREE.SplineCurve([
        new THREE.Vector2(0.150, 0.00),  // Base
        new THREE.Vector2(0.237, 0.30),  // Bottom curve
        new THREE.Vector2(0.317, 0.60),  // Belly max
        new THREE.Vector2(0.267, 0.86),  // Upper belly
        new THREE.Vector2(0.167, 1.13),  // Neck start
        new THREE.Vector2(0.120, 1.33),  // Neck thinnest
        new THREE.Vector2(0.130, 1.53),  // Neck upper
        new THREE.Vector2(0.170, 1.80),  // Head max
        new THREE.Vector2(0.100, 1.93),  // Head top
        new THREE.Vector2(0.000, 2.00)   // Tip
    ]);
    
    // 50 vertical segments for absolutely flawless, non-jagged smoothness
    let points = curve.getPoints(50);
    
    // Cap the bottom hole by adding a point exactly at the center of the base
    points.unshift(new THREE.Vector2(0.000, 0.00));
    
    return points;
}

// Create a high-resolution canvas texture for the red stripes on the neck
function createPinTexture() {
    let canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    let ctx = canvas.getContext('2d');

    // Premium slightly off-white body color
    ctx.fillStyle = '#fdfdfd';
    ctx.fillRect(0, 0, 128, 512);

    // In Three.js, V=0 is the base (first point), V=1 is the top (last point).
    // On the canvas, y=0 is the top, y=512 is the bottom.
    // So canvas_y = height * (1 - V)
    
    ctx.fillStyle = '#e62222'; // Vibrant red
    
    // Lower stripe: approx V=0.62 to 0.65
    ctx.fillRect(0, 512 * (1 - 0.65), 128, 512 * 0.03);
    
    // Upper stripe: approx V=0.69 to 0.72
    ctx.fillRect(0, 512 * (1 - 0.72), 128, 512 * 0.03);

    let tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16; // High quality texture filtering
    return tex;
}

const pinTex = createPinTexture();
// 64 radial segments for a perfectly round, premium look
const pinGeometry = new THREE.LatheGeometry(createRealisticPinProfile(), 64);
pinGeometry.rotateX(Math.PI / 2);
pinGeometry.computeBoundingBox();
pinGeometry.translate(0, 0, -1); // Center the geometry so physics cylinder aligns perfectly
pinGeometry.computeBoundingBox();

const pinMaterial = new THREE.MeshStandardMaterial({
    map: pinTex,
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.05
});

const physPinMaterial = Physijs.createMaterial(pinMaterial, 0.4, 0.2); // friction 0.4, restitution 0.2 (low bounce to prevent endless wobbling)

function drawPin(x, y) {
    let pin = new Physijs.ConvexMesh(pinGeometry, physPinMaterial, 2.0); // ConvexMesh perfectly matches the Z-up geometry! Decreased mass to 2.0
    // The geometry is centered at Z=0. Since half height is 1, placing it at Z=1.1 means base is at Z=0.1
    pin.position.set(x, y, 1.1); 
    pin.setDamping(0.1, 0.6); // High angular damping forces it to settle and stop wobbling immediately
    pin.castShadow = true;
    pin.receiveShadow = true;
    addMeshToScene(pin);
    return pin;
}

let allSpawnedPins1 = [];
let allSpawnedPins2 = [];

function clearPins(team) {
    let arr = team === 1 ? allSpawnedPins1 : allSpawnedPins2;
    arr.forEach(mesh => scene.remove(mesh));
    arr.length = 0;
}

function resetLane(team) {
    clearPins(team);
    let x0 = 0;
    let y0 = team === 1 ? -6 : 6;
    let xGap = 1.0;
    let yGap = 1.15;
    
    let arr = team === 1 ? allSpawnedPins1 : allSpawnedPins2;
    let standingArr = [];
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < i + 1; j++) {
            let x = x0 - xGap * i;
            let y = y0 - (yGap / 2) * i + yGap * j;
            let pinMesh = drawPin(x, y);
            arr.push(pinMesh);
            standingArr.push({
                pin: pinMesh,
                position: { posx: x, posy: y }
            });
        }
    }
    
    if (team === 1) standingPins1 = standingArr;
    else standingPins2 = standingArr;
}

function sweepFallenPins(team) {
    let standing = team === 1 ? standingPins1 : standingPins2;
    let all = team === 1 ? allSpawnedPins1 : allSpawnedPins2;
    
    let standingMeshes = standing.map(obj => obj.pin);
    
    all.forEach(mesh => {
        if (!standingMeshes.includes(mesh)) {
            // Kill any physical momentum before sweeping
            mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            
            animators.push(() => {
                // Sweep the pins backwards off the lane instead of sinking them into the floor!
                mesh.position.x -= 0.3;
                mesh.__dirtyPosition = true;
                if (mesh.position.x < -12) {
                    scene.remove(mesh);
                    return true;
                }
                return false;
            });
        }
    });
    
    if (team === 1) allSpawnedPins1 = standingMeshes.slice();
    else allSpawnedPins2 = standingMeshes.slice();
}

function placePins(x0, y0, xGap, yGap) {
    let team = y0 < 0 ? 1 : 2;
    let pinLayouts = [];
    let arr = team === 1 ? allSpawnedPins1 : allSpawnedPins2;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < i + 1; j++) {
            let x = x0 - xGap * i;
            let y = y0 - (yGap / 2) * i + yGap * j;
            let pinMesh = drawPin(x, y);
            arr.push(pinMesh);
            pinLayouts.push({
                pin: pinMesh,
                position: { posx: x, posy: y }
            });
        }
    }
    initialPinLayouts.push(pinLayouts);
}
