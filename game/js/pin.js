function createVector(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

function createRealisticPinProfile() {
    let curve = new THREE.SplineCurve([
        new THREE.Vector2(0.150, 0.00),
        new THREE.Vector2(0.237, 0.30),
        new THREE.Vector2(0.317, 0.60),
        new THREE.Vector2(0.267, 0.86),
        new THREE.Vector2(0.167, 1.13),
        new THREE.Vector2(0.120, 1.33),
        new THREE.Vector2(0.130, 1.53),
        new THREE.Vector2(0.170, 1.80),
        new THREE.Vector2(0.100, 1.93),
        new THREE.Vector2(0.000, 2.00)
    ]);
    
    let points = curve.getPoints(50);
    points.unshift(new THREE.Vector2(0.000, 0.00));
    
    return points;
}

function createPinTexture() {
    let canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fdfdfd';
    ctx.fillRect(0, 0, 128, 512);
    
    ctx.fillStyle = '#e62222';
    ctx.fillRect(0, 512 * (1 - 0.65), 128, 512 * 0.03);
    ctx.fillRect(0, 512 * (1 - 0.72), 128, 512 * 0.03);

    let tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
}

const pinTex = createPinTexture();
const pinGeometry = new THREE.LatheGeometry(createRealisticPinProfile(), 64);
pinGeometry.rotateX(Math.PI / 2);
pinGeometry.computeBoundingBox();
pinGeometry.translate(0, 0, -1);
pinGeometry.computeBoundingBox();

const pinMaterial = new THREE.MeshStandardMaterial({
    map: pinTex,
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.05
});

const physPinMaterial = Physijs.createMaterial(pinMaterial, 0.4, 0.2);

function drawPin(x, y) {
    let pin = new Physijs.ConvexMesh(pinGeometry, physPinMaterial, 2.0);
    pin.position.set(x, y, 1.1); 
    pin.setDamping(0.1, 0.6);
    pin.castShadow = true;
    pin.receiveShadow = true;
    addMeshToScene(pin);
    return pin;
}

let allSpawnedPins1 = [];
let allSpawnedPins2 = [];

function resetLane(team) {
    let arr = team === 1 ? allSpawnedPins1 : allSpawnedPins2;
    let standingArr = [];
    let layouts = team === 1 ? initialPinLayouts[0] : initialPinLayouts[1];

    arr.length = 0;

    layouts.forEach(layout => {
        let pinMesh = layout.pin;
        let pos = layout.position;
        
        if (pinMesh.parent !== scene) {
            scene.add(pinMesh);
        }
        
        pinMesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        pinMesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        
        pinMesh.position.set(pos.posx, pos.posy, 1.1);
        pinMesh.rotation.set(0, 0, 0);
        
        pinMesh.__dirtyPosition = true;
        pinMesh.__dirtyRotation = true;
        
        arr.push(pinMesh);
        standingArr.push({
            pin: pinMesh,
            position: pos
        });
    });

    if (team === 1) standingPins1 = standingArr;
    else standingPins2 = standingArr;
}

function sweepFallenPins(team) {
    let standing = team === 1 ? standingPins1 : standingPins2;
    let all = team === 1 ? allSpawnedPins1 : allSpawnedPins2;
    
    let standingMeshes = standing.map(obj => obj.pin);
    
    all.forEach(mesh => {
        if (!standingMeshes.includes(mesh)) {
            mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            
            animators.push(() => {
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
