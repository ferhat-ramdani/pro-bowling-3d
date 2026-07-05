let courbe_aleratoire_d;
let pts_bezier_d = [];
let bezier_d;

let courbe_aleratoire_g;
let pts_bezier_g = [];
let bezier_g;

// Instead of crazy extreme math, we use THREE.CubicBezierCurve3 to generate smooth, natural curves
function generer_courbe(couleur, team) {
    let startX = 45;
    let startY = team === 1 ? -6 : 6;
    
    let remainingPins = team === 1 ? quilles1 : quilles2;
    let targetPinY = team === 1 ? -6 : 6;
    if (remainingPins && remainingPins.length > 0) {
        let randomPin = remainingPins[Math.floor(Math.random() * remainingPins.length)];
        targetPinY = randomPin.position.posy;
    }
    
    // Target far behind the pins
    let endX = -6; 
    let endY = targetPinY + (Math.random() - 0.5) * 0.1; // Highly accurate to guarantee hit

    // Control points
    let p0 = new THREE.Vector3(startX, startY, 0.1);
    let p3 = new THREE.Vector3(endX, endY, 0.1);
    
    // Guide the hook
    let hookDir = Math.random() > 0.5 ? 1 : -1;
    let p1 = new THREE.Vector3(startX - 8, startY + hookDir * 1.5, 0.1);
    let p2 = new THREE.Vector3(2, targetPinY + hookDir * 0.5, 0.1);

    let curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
    let pts = curve.getPoints(traj_non_rect_resolution);
    
    let bezierMesh = cuisine_courbe(pts, couleur);
    
    return [pts, bezierMesh];
}

function translater_pts(pts, mesh, trans) {
    // Legacy support, our new function generates correctly placed points
}

setTimeout(() => {
    // Generate initial curves
    let dData = generer_courbe(equipe_2_c_bis, 2);
    pts_bezier_d = dData[0];
    bezier_d = dData[1];

    let gData = generer_courbe(equipe_1_c, 1);
    pts_bezier_g = gData[0];
    bezier_g = gData[1];

    // scene.add(bezier_d);
    traj_droite = pts_bezier_d;
    type_traj_d = 'non rect';

    // scene.add(bezier_g);
    traj_gauche = pts_bezier_g;
    type_traj_g = 'non rect';
}, 1000);
