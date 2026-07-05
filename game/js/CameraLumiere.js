// Lighting and Camera Setup
let targetCamPos = new THREE.Vector3(35, 0, 4);
let targetCamLook = new THREE.Vector3(0, 0, 0);
let currentCamLook = new THREE.Vector3(0, 0, 0);

function cameraLumiere(scene, camera) {
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(targetCamPos.x, targetCamPos.y, targetCamPos.z);
    camera.lookAt(targetCamLook.x, targetCamLook.y, targetCamLook.z);
    camera.updateProjectionMatrix();
}

function updateCameraTransition() {
    // Smooth camera lerp called in render loop
    camera.position.lerp(targetCamPos, 0.05);
    currentCamLook.lerp(targetCamLook, 0.05);
    camera.lookAt(currentCamLook);
}

function lumiere(scene) {
    // Ambient Light to boost overall visibility across the whole room
    let ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    // Main Central Light (Ceiling Light)
    let centralLight = new THREE.PointLight(0xffffff, 0.6, 100);
    centralLight.position.set(10, 0, 15);
    centralLight.castShadow = true;
    centralLight.shadow.mapSize.width = 2048;
    centralLight.shadow.mapSize.height = 2048;
    scene.add(centralLight);

    // Directional light from the front to light the pins clearly
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(-10, 0, 10);
    scene.add(dirLight);
}

function camera_n(i) {
    switch (i) {
        case 1:
            targetCamPos.set(35, 0, 4);
            targetCamLook.set(0, 0, 0);
            camera.zoom = 1;
            break;
        case 2:
            targetCamPos.set(50, 0, 20);
            targetCamLook.set(0, 0, -1.6);
            camera.zoom = 1;
            break;
        case 3:
            targetCamPos.set(11, 0, 50);
            targetCamLook.set(11, 0, 0);
            camera.zoom = 1;
            break;
        case 4:
            targetCamPos.set(-8, 0, 3);
            targetCamLook.set(2, 0, 0);
            camera.zoom = 0.5;
            break;
    }
    camera.updateProjectionMatrix();
}