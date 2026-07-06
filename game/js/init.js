Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
let scene = new Physijs.Scene({ fixedTimeStep: 1 / 60 });
scene.setGravity(new THREE.Vector3( 0, 0, -50.0 ));
let initialPinLayouts = [];

function init() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.background = new THREE.Color(0x0a0e1a);
    scene.fog = new THREE.FogExp2(0x0a0e1a, 0.02);

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    setupCamera(scene, camera);
    setupLighting(scene);

    addMeshToScene(cyanBall);
    addMeshToScene(redBall);

    placePins(0, -6, 1.0, 1.15);
    placePins(0, 6, 1.0, 1.15);

    let wallMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x2a3b4c, roughness: 0.7 }), 0.8, 0.4);
    let floorMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.3, metalness: 0.1 }), 0.8, 0.4);
    let bumperMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }), 0.8, 0.4);

    let platform = new Physijs.BoxMesh(new THREE.BoxGeometry(80, 40, 20), wallMat, 0);
    platform.position.set(25, 0, -10);
    platform.receiveShadow = true;
    addMeshToScene(platform);

    let frontWall = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 40, 15), wallMat, 0);
    frontWall.position.set(-15.5, 0, 7.5);
    addMeshToScene(frontWall);

    let leftWall = new Physijs.BoxMesh(new THREE.BoxGeometry(80, 1, 15), wallMat, 0);
    leftWall.position.set(25, -20.5, 7.5);
    addMeshToScene(leftWall);

    let rightWall = new Physijs.BoxMesh(new THREE.BoxGeometry(80, 1, 15), wallMat, 0);
    rightWall.position.set(25, 20.5, 7.5);
    addMeshToScene(rightWall);

    let leftLane = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 6.0, 2.0), floorMat, 0);
    leftLane.position.set(24, -6, -0.9);
    leftLane.receiveShadow = true;
    addMeshToScene(leftLane);

    let rightLane = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 6.0, 2.0), floorMat, 0);
    rightLane.position.set(24, 6, -0.9);
    rightLane.receiveShadow = true;
    addMeshToScene(rightLane);

    let glLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    glLeft.position.set(24, -9.25, 0.35);
    addMeshToScene(glLeft);
    
    let glRight = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    glRight.position.set(24, -2.75, 0.35);
    addMeshToScene(glRight);

    let grLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    grLeft.position.set(24, 2.75, 0.35);
    addMeshToScene(grLeft);
    
    let grRight = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 0.5, 0.5), bumperMat, 0);
    grRight.position.set(24, 9.25, 0.35);
    addMeshToScene(grRight);

    let gui = new dat.GUI();

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

    document.getElementById("webgl").appendChild(renderer.domElement);
    
    function renderAnim() {
        stats.update();
        scene.simulate();
        renderer.render(scene, camera);
        requestAnimationFrame(renderAnim);
    }
    renderAnim();
}
