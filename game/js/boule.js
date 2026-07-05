let R = 0.55;
let ep = 0.005;

// We use modern shiny materials for the balls instead of manual lissajous curves
function creer_sphere_avec_courbe(x0, y0, couleur_boule, decoration_couleur) {
    let sphereG = new THREE.SphereGeometry(R, 32, 32);
    
    let physMaterial = Physijs.createMaterial(
        new THREE.MeshStandardMaterial({
            color: couleur_boule,
            roughness: 0.1,
            metalness: 0.4
        }),
        0.6, // friction
        0.5  // restitution
    );

    let boule = new Physijs.SphereMesh(sphereG, physMaterial, 7.0); // 7.0 kg mass
    boule.castShadow = true;
    boule.receiveShadow = true;

    boule.position.set(x0, y0, R);
    return boule;
}

// Improved Team Colors
let equipe_1_c = 0x00e5ff; // Electric Cyan
let equipe_2_c = 0xff5500; // Deep Orange Red
let equipe_2_c_bis = 0xff5500;

// Expose them globally for init.js
let boule_verte = creer_sphere_avec_courbe(23, -3.05, equipe_1_c, 0xffffff);
let boule_orange = creer_sphere_avec_courbe(23, 3.05, equipe_2_c, 0xffffff);