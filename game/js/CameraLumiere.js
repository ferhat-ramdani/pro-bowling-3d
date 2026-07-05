// Lighting and Camera Setup
let targetCamPos = new THREE.Vector3(70, 0, 7);
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
    // Ambient Light
    let ambient = new THREE.AmbientLight(0xffffff, 0.8); // Restored contrast by reducing from 2.0 to 0.8
    scene.add(ambient);

    // Main Central Light (Ceiling Light)
    let centralLight = new THREE.PointLight(0xffffff, 1.5, 100); // Brighter central light
    centralLight.position.set(10, 0, 15);
    centralLight.castShadow = true;
    centralLight.shadow.mapSize.width = 2048;
    centralLight.shadow.mapSize.height = 2048;
    scene.add(centralLight);

    // Directional light from the front to light the pins clearly
    let dirLight = new THREE.DirectionalLight(0xffffff, 1.2); // Brighter directional light
    dirLight.position.set(-10, 0, 10);
    scene.add(dirLight);

    // Dramatic Spotlight for Left Lane Pins
    let spotLeft = new THREE.SpotLight(0xffffff, 7.0); // Bright intensity
    spotLeft.position.set(10, -6, 15);
    spotLeft.target.position.set(0, -6, 0);
    spotLeft.angle = Math.PI / 6; // Narrow beam
    spotLeft.penumbra = 0.5; // Soft edges
    spotLeft.castShadow = true;
    scene.add(spotLeft);
    scene.add(spotLeft.target);

    // Dramatic Spotlight for Right Lane Pins
    let spotRight = new THREE.SpotLight(0xffffff, 7.0); // Bright intensity
    spotRight.position.set(10, 6, 15);
    spotRight.target.position.set(0, 6, 0);
    spotRight.angle = Math.PI / 6;
    spotRight.penumbra = 0.5;
    spotRight.castShadow = true;
    scene.add(spotRight);
    scene.add(spotRight.target);
}

function camera_n(i) {
    // The user requested ONE static camera position, so we disable all dynamic camera shifting.
    // The camera will remain locked at the position defined above.
}