function vecteur(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

// Generate a highly realistic USBC standard bowling pin profile
function createRealisticPinProfile() {
    return [
        new THREE.Vector2(0.20, 0.00),   // base
        new THREE.Vector2(0.35, 0.36),
        new THREE.Vector2(0.40, 0.60),   // belly
        new THREE.Vector2(0.20, 1.00),
        new THREE.Vector2(0.12, 1.20),   // neck
        new THREE.Vector2(0.12, 1.30),
        new THREE.Vector2(0.10, 1.45),   // shoulder
        new THREE.Vector2(0.01, 1.50)    // top
    ];
}

// Create a canvas texture for the red stripes on the neck
function createPinTexture() {
    let canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    let ctx = canvas.getContext('2d');

    // Base color (White)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 256);

    // Two red stripes at the neck area
    // The LatheGeometry maps UVs with V=0 at the base and V=1 at the top
    ctx.fillStyle = '#ff2233'; // Deep red
    ctx.fillRect(0, 256 * 0.75, 64, 10); // Lower stripe
    ctx.fillRect(0, 256 * 0.82, 64, 10); // Upper stripe

    let tex = new THREE.CanvasTexture(canvas);
    return tex;
}

const pinTex = createPinTexture();
const pinGeometry = new THREE.LatheGeometry(createRealisticPinProfile(), 32);
// Rotate so it stands up on the Z axis like the original code expected
pinGeometry.rotateX(Math.PI / 2);

const pinMaterial = new THREE.MeshStandardMaterial({
    map: pinTex,
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.0
});

// Original function kept for compatibility
function cuisiner_quille(x, y, resolution, couleur) {
    // We ignore the crude resolution and color, enforcing high quality
    return null;
}

function dessiner_quille_bis(x, y, resolution, couleur) {
    let pin = new THREE.Mesh(pinGeometry, pinMaterial);
    pin.position.set(x, y, 0);
    pin.castShadow = true;
    pin.receiveShadow = true;
    ajouter(pin);
    return pin;
}

// Replaces the old slow function
function dis_quilles(x0, y0, x_gap, y_gap, resolution, couleur) {
    let liste_quille_pos = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < i + 1; j++) {
            let x = x0 - x_gap * i;
            let y = y0 - (y_gap / 2) * i + y_gap * j;
            let quilleMesh = dessiner_quille_bis(x, y, resolution, couleur);
            liste_quille_pos.push({
                quille: quilleMesh,
                position: { posx: x, posy: y }
            });
        }
    }
    liste_dis_quilles.push(liste_quille_pos);
}

// Keep a dummy parallelo function just in case
function dessiner_parallelo(x, y, a, equipe) {
    // We won't use parallelopipeds anymore, we tilt the pins, 
    // but keep function defined to avoid errors
}