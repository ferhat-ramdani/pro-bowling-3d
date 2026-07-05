Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
let scene = new Physijs.Scene({ fixedTimeStep: 1 / 60 });
scene.setGravity(new THREE.Vector3( 0, 0, -9.8 ));
let traj_gauche;
let traj_droite;
let type_traj_d;
let type_traj_g;
let inclinaison_ratio_g = 1/2;
let inclinaison_ratio_d = 1/2;
let liste_dis_quilles = [];
let dimenstion_quilles = 7;

function init() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    let rendu = new THREE.WebGLRenderer({ antialias: true });
    rendu.shadowMap.enabled = true;
    rendu.shadowMap.type = THREE.PCFSoftShadowMap;
    rendu.setSize(window.innerWidth, window.innerHeight);
    scene.background = new THREE.Color(0x0a0e1a); // Dark navy room
    scene.fog = new THREE.FogExp2(0x0a0e1a, 0.02);

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rendu.setSize(window.innerWidth, window.innerHeight);
    }, false);

    cameraLumiere(scene, camera);
    lumiere(scene);

    // ********************************************************
    // P A R T I E   G E O M E T R I Q U E
    // ********************************************************

    ajouter(boule_verte);
    ajouter(boule_orange);

    // Professional pin spacing (equilateral triangle, ~12 inches between pins)
    dis_quilles(0, -6, 1.0, 1.15, dimenstion_quilles, 0xffffff); // gauche
    dis_quilles(0, 6, 1.0, 1.15, dimenstion_quilles, 0xffffff); // droite

    // Murs et Pistes (Using modern Box/Plane Geometries)
    let wallMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x2a3b4c, roughness: 0.7 }), 0.8, 0.4);
    let floorMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.3, metalness: 0.1 }), 0.8, 0.4);
    let bumperMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }), 0.8, 0.4);

    let plateforme = new Physijs.BoxMesh(new THREE.BoxGeometry(80, 40, 20), wallMat, 0); // mass 0 = static
    plateforme.position.set(25, 0, -10);
    plateforme.receiveShadow = true;
    ajouter(plateforme);

    let frontwall = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 40, 15), wallMat, 0);
    frontwall.position.set(-15.5, 0, 7.5);
    ajouter(frontwall);

    let leftwall = new Physijs.BoxMesh(new THREE.BoxGeometry(80, 1, 15), wallMat, 0);
    leftwall.position.set(25, -20.5, 7.5);
    ajouter(leftwall);

    let rightwall = new Physijs.BoxMesh(new THREE.BoxGeometry(80, 1, 15), wallMat, 0);
    rightwall.position.set(25, 20.5, 7.5);
    ajouter(rightwall);

    // Expanded professional lanes
    let piste_gauche = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 6.0, 2.0), floorMat, 0);
    piste_gauche.position.set(24, -6, -0.9);
    piste_gauche.receiveShadow = true;
    ajouter(piste_gauche);

    let piste_droite = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 6.0, 2.0), floorMat, 0);
    piste_droite.position.set(24, 6, -0.9);
    piste_droite.receiveShadow = true;
    ajouter(piste_droite);

    // Guardrails (Bumpers) for left lane
    let gl_left = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    gl_left.position.set(24, -9.25, 0.35);
    ajouter(gl_left);
    let gl_right = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    gl_right.position.set(24, -2.75, 0.35);
    ajouter(gl_right);

    // Guardrails (Bumpers) for right lane
    let gr_left = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    gr_left.position.set(24, 2.75, 0.35);
    ajouter(gr_left);
    let gr_right = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    gr_right.position.set(24, 9.25, 0.35);
    ajouter(gr_right);

    // ********************************************************
    // M E N U   G U I
    // ********************************************************

    let gui = new dat.GUI();

    // Camera Menu
    let menu = new function() {
        this.xPos = targetCamPos.x;
        this.yPos = targetCamPos.y;
        this.zPos = targetCamPos.z;
        this.zoom = camera.zoom;
        this.xDir = targetCamLook.x;
        this.yDir = targetCamLook.y;
        this.zDir = targetCamLook.z;
    }

    let cam = gui.addFolder("Camera");
    cam.add(menu, "xPos", -50, 50).onChange(function () { targetCamPos.x = menu.xPos; });
    cam.add(menu, "yPos", -40, 40).onChange(function () { targetCamPos.y = menu.yPos; });
    cam.add(menu, "zPos", -40, 40).onChange(function () { targetCamPos.z = menu.zPos; });
    cam.add(menu, "zoom", 0, 40).onChange(function () {
        camera.zoom = menu.zoom;
        camera.updateProjectionMatrix();
    });
    cam.add(menu, "xDir", -40, 40).onChange(function () { targetCamLook.x = menu.xDir; });
    cam.add(menu, "yDir", -40, 40).onChange(function () { targetCamLook.y = menu.yDir; });
    cam.add(menu, "zDir", -40, 40).onChange(function () { targetCamLook.z = menu.zDir; });

    // Courbe Menu
    let menu_courbe = new function(){
        this.traj_droite = 'non rect';
        this.traj_gauche = 'non rect';
        this.eq_gauche = 1/2;
        this.eq_droite = 1/2;
    }

    let courbe = gui.addFolder("Courbe");

    courbe.add(menu_courbe, "traj_gauche", ['rect', 'non rect']).onChange(function (e) {
        if(menu_courbe.traj_gauche == 'rect'){
            effacer(bezier_g);
            dessiner_traj_rect(1);
            traj_gauche = pts_lin_g;
            type_traj_g = 'rect';
        } else if(menu_courbe.traj_gauche == 'non rect'){
            effacer(lin_g);
            // scene.add(bezier_g);
            traj_gauche = pts_bezier_g;
            type_traj_g = 'non rect';
        }
    });

    courbe.add(menu_courbe, "traj_droite", ['rect', 'non rect']).onChange(function (e) {
        if(menu_courbe.traj_droite == 'rect'){
            effacer(bezier_d);
            dessiner_traj_rect(2);
            traj_droite = pts_lin_d;
            type_traj_d = 'rect';
        } else if(menu_courbe.traj_droite == 'non rect'){
            effacer(lin_d);
            // scene.add(bezier_d);
            traj_droite = pts_bezier_d;
            type_traj_d = 'non rect';
        }
    });

    courbe.add(menu_courbe, "eq_gauche", 0, 1).onChange(function () {
        inclinaison_ratio_g = menu_courbe.eq_gauche;
        if(type_traj_g == 'rect'){
            dessiner_traj_rect(1);
            traj_gauche = pts_lin_g;
        }
    });

    courbe.add(menu_courbe, "eq_droite", 0, 1).onChange(function () {
        inclinaison_ratio_d = menu_courbe.eq_droite;
        if(type_traj_d == 'rect'){
            dessiner_traj_rect(2);
            traj_droite = pts_lin_d;
        }
    });

    // ********************************************************
    // F I N   M E N U   G U I
    // ********************************************************

    document.getElementById("webgl").appendChild(rendu.domElement);
    
    function renduAnim() {
        stats.update();
        scene.simulate();
        rendu.render(scene, camera);
        requestAnimationFrame(renduAnim);
    }
    renduAnim();
}
