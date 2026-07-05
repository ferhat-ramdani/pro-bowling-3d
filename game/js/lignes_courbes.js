let ecart_z = 0.11;
let lin_g, lin_d;
let pts_lin_g = [], pts_lin_d = [];
let traj_rect_resolution = 120;
let traj_non_rect_resolution = 120;

function vecteur(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

function effacer(obj) {
    if (obj) scene.remove(obj);
}

function cuisine_courbe(points, couleur) {
    let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
    // Glowing line effect using Basic Material but bright color
    let ProprieteCbe = new THREE.LineBasicMaterial({
        color: couleur,
        linewidth: 4
    });
    return new THREE.Line(PtsTab, ProprieteCbe);
}

function dessiner_traj_rect(equipe) {
    let startX = 23;
    let startY = equipe === 1 ? -3.1 : 3.1;
    let remainingPins = equipe === 1 ? quilles1 : quilles2;
    let ratio = equipe === 1 ? inclinaison_ratio_g : inclinaison_ratio_d;
    
    let targetPinY = equipe === 1 ? -3 : 3;
    if (remainingPins && remainingPins.length > 0) {
        // Use the slider ratio to pick a pin deterministically
        let index = Math.floor(ratio * (remainingPins.length - 1));
        targetPinY = remainingPins[index].position.posy;
    }

    let endX = -6;
    let endY = targetPinY;

    let p0 = new THREE.Vector3(startX, startY, ep);
    let p3 = new THREE.Vector3(endX, endY, ep);
    
    // Create a slight, gentle bend instead of a perfectly straight line
    let midY = (startY + endY) / 2;
    let bendOffset = equipe === 1 ? 0.4 : -0.4; // Gentle bend
    
    let p1 = new THREE.Vector3(startX - 8, midY + bendOffset, ep);
    let p2 = new THREE.Vector3(endX + 8, midY + bendOffset, ep);

    let curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
    let pts = curve.getPoints(traj_rect_resolution);

    if (equipe == 1) {
        pts_lin_g = pts;
        effacer(lin_g);
        lin_g = cuisine_courbe(pts_lin_g, equipe_1_c);
        // scene.add(lin_g);
    } else if (equipe == 2) {
        pts_lin_d = pts;
        effacer(lin_d);
        lin_d = cuisine_courbe(pts_lin_d, equipe_2_c_bis);
        // scene.add(lin_d);
    }
}

// Ensure guide faces for the gutters are made properly
function face_elementaire(A, B, C, D, c) {
    let geom = new THREE.BufferGeometry();
    let vertices = new Float32Array([
        A.x, A.y, A.z,  B.x, B.y, B.z,  C.x, C.y, C.z,
        A.x, A.y, A.z,  C.x, C.y, C.z,  D.x, D.y, D.z
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();

    let mat = new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.8,
        side: THREE.DoubleSide
    });
    return new THREE.Mesh(geom, mat);
}

function preparer_rigoles(y0, c) {
    let guide_1 = face_elementaire(vecteur(-6, y0, 0), vecteur(-6, y0, 0.5), vecteur(30, y0, 0.5), vecteur(30, y0, 0), c);
    let guide_2 = face_elementaire(vecteur(-6, y0, 0.5), vecteur(30, y0, 0.5), vecteur(30, y0 + 1 / 2, 0.5), vecteur(-6, y0 + 1 / 2, 0.5), c);
    let guide_3 = face_elementaire(vecteur(-6, y0 + 1 / 2, 0.5), vecteur(30, y0 + 1 / 2, 0.5), vecteur(30, y0 + 1 / 2, 0), vecteur(-6, y0 + 1 / 2, 0), c);
    return [guide_1, guide_2, guide_3];
}