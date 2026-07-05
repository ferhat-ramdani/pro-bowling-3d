let R = 0.55;
let ep = 0.005;

let sharedBowlingBallGeometry = null;

let thumbPos, thumbRot;
let finger1Pos, finger1Rot;
let finger2Pos, finger2Rot;

function getBowlingBallGeometry() {
    if (sharedBowlingBallGeometry) return sharedBowlingBallGeometry;

    // Use 32x32 to avoid ThreeBSP stack overflow, smooth shading will make it look round
    let sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 32, 32));
    let sphereBSP = new ThreeBSP(sphereMesh);

    // Thumb hole (Bigger)
    let thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.4, 16));
    thumb.position.set(0, -0.15, R - 0.1);
    thumb.rotation.x = Math.PI / 2 + Math.asin(0.15 / R);
    
    thumbPos = thumb.position.clone();
    thumbRot = thumb.rotation.clone();
    
    // Finger 1 (Bigger)
    let finger1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.4, 16));
    finger1.position.set(-0.12, 0.15, R - 0.1);
    finger1.rotation.x = Math.PI / 2 - Math.asin(0.15 / R);
    finger1.rotation.y = Math.asin(-0.12 / R);
    
    finger1Pos = finger1.position.clone();
    finger1Rot = finger1.rotation.clone();
    
    // Finger 2 (Bigger)
    let finger2 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.4, 16));
    finger2.position.set(0.12, 0.15, R - 0.1);
    finger2.rotation.x = Math.PI / 2 - Math.asin(0.15 / R);
    finger2.rotation.y = Math.asin(0.12 / R);
    
    finger2Pos = finger2.position.clone();
    finger2Rot = finger2.rotation.clone();

    // Subtract holes from sphere
    let resultBSP = sphereBSP
        .subtract(new ThreeBSP(thumb))
        .subtract(new ThreeBSP(finger1))
        .subtract(new ThreeBSP(finger2));

    let finalMesh = resultBSP.toMesh();
    finalMesh.geometry.computeVertexNormals();
    
    sharedBowlingBallGeometry = finalMesh.geometry;
    return sharedBowlingBallGeometry;
}

// We use modern shiny materials for the balls, now with realistic finger holes!
function creer_sphere_avec_courbe(x0, y0, couleur_boule, decoration_couleur) {
    let visualGeom = getBowlingBallGeometry();
    
    // Smooth physical sphere wrapper so collision isn't bumpy
    let physMaterial = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({ visible: false }), 
        0.6, // friction
        0.5  // restitution
    );

    let sphereG = new THREE.SphereGeometry(R, 32, 32);
    let boule = new Physijs.SphereMesh(sphereG, physMaterial, 7.0); // 7.0 kg mass
    
    // The visual mesh with holes (smoother and shinier)
    let visualMat = new THREE.MeshPhysicalMaterial({
        color: couleur_boule,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 1.0, // High-end realistic clearcoat gloss
        clearcoatRoughness: 0.05
    });
    
    let visualMesh = new THREE.Mesh(visualGeom, visualMat);
    visualMesh.castShadow = true;
    visualMesh.receiveShadow = true;
    
    // Create dark inside walls for the holes using BackSide cylinders
    // Sunk into the holes so they don't protrude!
    let darkMat = new THREE.MeshStandardMaterial({
        color: 0x010101,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.BackSide
    });
    
    let innerThumb = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.058, 0.24, 16), darkMat);
    innerThumb.position.copy(thumbPos);
    innerThumb.rotation.copy(thumbRot);
    innerThumb.translateY(-0.08); // Sink it deep into the hole!
    visualMesh.add(innerThumb);
    
    let innerFinger1 = new THREE.Mesh(new THREE.CylinderGeometry(0.053, 0.038, 0.24, 16), darkMat);
    innerFinger1.position.copy(finger1Pos);
    innerFinger1.rotation.copy(finger1Rot);
    innerFinger1.translateY(-0.08);
    visualMesh.add(innerFinger1);
    
    let innerFinger2 = new THREE.Mesh(new THREE.CylinderGeometry(0.053, 0.038, 0.24, 16), darkMat);
    innerFinger2.position.copy(finger2Pos);
    innerFinger2.rotation.copy(finger2Rot);
    innerFinger2.translateY(-0.08);
    visualMesh.add(innerFinger2);

    // Create rounded bevels at the rim of the holes using TorusGeometry
    let rimThumb = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.008, 16, 32), visualMat);
    rimThumb.position.copy(thumbPos);
    rimThumb.rotation.copy(thumbRot);
    rimThumb.rotateX(Math.PI / 2); // Align torus Z-axis with cylinder Y-axis
    rimThumb.translateZ(0.08); // Push outward to surface
    visualMesh.add(rimThumb);

    let rimFinger1 = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 16, 32), visualMat);
    rimFinger1.position.copy(finger1Pos);
    rimFinger1.rotation.copy(finger1Rot);
    rimFinger1.rotateX(Math.PI / 2);
    rimFinger1.translateZ(0.065); // Push outward to surface
    visualMesh.add(rimFinger1);

    let rimFinger2 = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.008, 16, 32), visualMat);
    rimFinger2.position.copy(finger2Pos);
    rimFinger2.rotation.copy(finger2Rot);
    rimFinger2.rotateX(Math.PI / 2);
    rimFinger2.translateZ(0.065); // Push outward to surface
    visualMesh.add(rimFinger2);
    
    // Rotate visual mesh so holes face the camera (+X axis) instead of up (+Z)
    visualMesh.rotation.y = Math.PI / 2;
    
    boule.add(visualMesh);
    boule.position.set(x0, y0, R);
    
    return boule;
}

// Improved Team Colors
let equipe_1_c = 0x00e5ff; // Electric Cyan
let equipe_2_c = 0xff0022; // Vibrant Professional Red
let equipe_2_c_bis = 0xff0022;

// Expose them globally for init.js
let boule_verte = creer_sphere_avec_courbe(45, -6, equipe_1_c, 0xffffff);
let boule_orange = creer_sphere_avec_courbe(45, 6, equipe_2_c, 0xffffff);