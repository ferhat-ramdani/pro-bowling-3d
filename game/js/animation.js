let animators = [];
let standingPins1 = [];
let standingPins2 = [];

// Wait for pins to be spawned
setTimeout(() => {
    standingPins1 = initialPinLayouts[0] ? [...initialPinLayouts[0]] : [];
    standingPins2 = initialPinLayouts[1] ? [...initialPinLayouts[1]] : [];
}, 1000);

// Unified render loop
function animateLoop() {
    requestAnimationFrame(animateLoop);

    // Smooth camera transition
    if (typeof camera !== 'undefined' && camera) {
        updateCameraTransition();
    }

    // Update ongoing ball animations
    for (let i = animators.length - 1; i >= 0; i--) {
        let isDone = animators[i]();
        if (isDone) animators.splice(i, 1);
    }
}
// Start loop once
requestAnimationFrame(animateLoop);

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function throwBall(team, vx, vy, hookSpin) {
    let obj = team === 1 ? cyanBall : redBall;
    let x0 = obj.position.x;
    let y0 = obj.position.y;

    // Real physics: push the ball!
    obj.setLinearVelocity(new THREE.Vector3(vx, vy, 0));
    obj.setAngularVelocity(new THREE.Vector3(0, -30, hookSpin));

    // We create an animator function that waits until the ball finishes rolling
    let animator = () => {
        // Apply hook/curve force dynamically while the ball is rolling
        if (obj.position.x > -2 && obj.position.z >= -1) {
            if (Math.abs(hookSpin) > 0.5) {
                // Apply a lateral force along the Y axis to simulate the Magnus effect / friction hook
                // A positive hookSpin means hooking right (+Y direction)
                // A negative hookSpin means hooking left (-Y direction)
                obj.applyCentralForce(new THREE.Vector3(0, hookSpin * 1.2, 0));
            }
        }

        // If ball passed the pins (x < -2) or fell off the edge (z < -1)
        if (obj.position.x < -2 || obj.position.z < -1) {

            // Dynamic Physics Wait: Wait for pins to completely stop moving
            let evaluateTimer = 0;
            let settleAnimator = () => {
                evaluateTimer++;
                let allPins = team === 1 ? allSpawnedPins1 : allSpawnedPins2;
                let isMoving = false;
                
                // Check if any pin is still moving significantly
                for (let i = 0; i < allPins.length; i++) {
                    let v = allPins[i].getLinearVelocity();
                    let a = allPins[i].getAngularVelocity();
                    if (v.lengthSq() > 0.1 || a.lengthSq() > 0.1) {
                        isMoving = true;
                        break;
                    }
                }

                // Force wait at least 30 frames (0.5s) to allow physics to start.
                // Wait until they stop moving, with a fallback timeout of 240 frames (4s).
                if ((isMoving && evaluateTimer < 240) || evaluateTimer < 30) {
                    return false; // keep checking next frame
                }

                // Evaluate fallen pins physically!
                let standingArr = team === 1 ? standingPins1 : standingPins2;
                let remainingStanding = [];

                for (let i = 0; i < standingArr.length; i++) {
                    let pinObj = standingArr[i];
                    let mesh = pinObj.pin;

                    // Robust Gimbal-lock-free check: Get the pin's actual UP vector
                    let upDir = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion);
                    
                    // A pin is fallen if it tipped over significantly (Z component < 0.8) or fell off the edge
                    let isFallen = upDir.z < 0.8 || mesh.position.z < 0;

                    if (!isFallen) {
                        remainingStanding.push(pinObj);
                    }
                }

                // Update the standing array
                if (team === 1) standingPins1 = remainingStanding;
                else standingPins2 = remainingStanding;

                // Reset ball position
                obj.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                obj.setAngularVelocity(new THREE.Vector3(0, 0, 0));
                obj.position.set(x0, y0, ballRadius);
                obj.__dirtyPosition = true;
                obj.__dirtyRotation = true;

                // Process throw using our Score.js logic
                let remainingPinsCount = remainingStanding.length;
                let result = typeof processThrow === 'function' ? processThrow(team, remainingPinsCount) : { action: 'none' };

                if (result.action === 'reset') {
                    setTimeout(() => resetLane(team), 800);
                } else if (result.action === 'sweep') {
                    setTimeout(() => sweepFallenPins(team), 300);
                }

                // Wait 1s for sweep/reset to finish before enabling throws again
                setTimeout(() => {
                    if (team === 1) isBallRolling1 = false;
                    else if (team === 2) isBallRolling2 = false;
                }, 1000);
                
                return true; // remove from animators
            };
            animators.push(settleAnimator);

            return true; // Done, remove from animators
        }
        return false; // Still rolling
    };
    animators.push(animator);
}

function addMeshToScene(obj) {
    scene.add(obj);
}

// ---------------------------------------------------------
// SWIPE INTERACTION & RAYCASTING
// ---------------------------------------------------------
let isBallRolling1 = false;
let isBallRolling2 = false;
let isSwiping = false;
let swipeStartPos = new THREE.Vector2();
let swipeEndPos = new THREE.Vector2();
let swipeStartTime = 0;
let swipeMidPos = new THREE.Vector2();
let activeTeam = null;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function getNormalizedCoords(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    return mouse;
}

function handleSwipeStart(clientX, clientY) {
    let coords = getNormalizedCoords(clientX, clientY);
    raycaster.setFromCamera(coords, camera);

    // Only interact with the visual meshes of the balls
    let ballMeshes = [cyanBall.children[0], redBall.children[0]]; 
    
    let intersects = raycaster.intersectObjects(ballMeshes, false);
    
    if (intersects.length > 0) {
        let hitObj = intersects[0].object.parent; // Get the Physijs sphere parent
        if (hitObj === cyanBall) {
            if (isBallRolling1) return; // This ball is already rolling
            activeTeam = 1;
        } else if (hitObj === redBall) {
            if (isBallRolling2) return; // This ball is already rolling
            activeTeam = 2;
        }
        
        isSwiping = true;
        swipeStartPos.set(clientX, clientY);
        swipeStartTime = performance.now();
        swipeMidPos.set(clientX, clientY);
    }
}

function handleSwipeMove(clientX, clientY) {
    if (!isSwiping) return;
    
    // Periodically capture a midpoint to measure curve/hook
    let timeElapsed = performance.now() - swipeStartTime;
    // Capture mid position when roughly halfway through a typical swipe (100-150ms)
    // Keep updating it so if they pause, we get the real curve
    if (timeElapsed > 50) {
        swipeMidPos.set(clientX, clientY);
    }
}

function handleSwipeEnd(clientX, clientY) {
    if (!isSwiping) return;
    isSwiping = false;

    swipeEndPos.set(clientX, clientY);
    let timeDelta = performance.now() - swipeStartTime;

    if (timeDelta < 50 || timeDelta > 3000) {
        // Swipe too fast or too slow (probably just a click)
        activeTeam = null;
        return;
    }

    // Calculate 2D screen distance to determine force
    let dx = swipeEndPos.x - swipeStartPos.x;
    let dy = swipeEndPos.y - swipeStartPos.y; 
    let dist2D = Math.sqrt(dx * dx + dy * dy);
    
    if (dist2D < 50) {
        // Swipe too short
        activeTeam = null;
        return;
    }

    // Force based on swipe speed in 2D
    let speedMult = dist2D / timeDelta; 
    let speedMagnitude = 20 * speedMult; 
    
    // Limit max/min velocity magnitude
    if (speedMagnitude > 50) speedMagnitude = 50;
    if (speedMagnitude < 10) speedMagnitude = 10;

    // --- ACCURATE 3D DIRECTION UNPROJECTION ---
    // We unproject the 2D screen coordinates into the 3D world to get the EXACT 
    // direction the user swiped on the floor, accounting for camera perspective.
    
    // Unproject Start Point
    let startCoords = getNormalizedCoords(swipeStartPos.x, swipeStartPos.y);
    let rayStart = new THREE.Raycaster();
    rayStart.setFromCamera(startCoords, camera);
    let groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -ballRadius);
    let worldStart = new THREE.Vector3();
    rayStart.ray.intersectPlane(groundPlane, worldStart);

    // Unproject End Point
    let endCoords = getNormalizedCoords(swipeEndPos.x, swipeEndPos.y);
    let rayEnd = new THREE.Raycaster();
    rayEnd.setFromCamera(endCoords, camera);
    let worldEnd = new THREE.Vector3();
    rayEnd.ray.intersectPlane(groundPlane, worldEnd);

    // Calculate true 3D direction vector
    let dir3D = new THREE.Vector3().subVectors(worldEnd, worldStart);
    
    // If they swiped backwards (away from pins), ignore
    if (dir3D.x > 0) {
        activeTeam = null;
        return;
    }

    // Normalize and scale by our chosen speed
    dir3D.normalize();
    let vx = dir3D.x * speedMagnitude;
    let vy = dir3D.y * speedMagnitude;

    // Calculate curve (Rotation) using 2D screen deviation
    // Line formula: A*x + B*y + C = 0
    let A = -dy;
    let B = dx;
    let C = (swipeStartPos.x * swipeEndPos.y) - (swipeEndPos.x * swipeStartPos.y);
    
    let deviation = (A * swipeMidPos.x + B * swipeMidPos.y + C) / Math.sqrt(A*A + B*B);
    
    // A positive deviation means they curved right on screen, negative means left.
    let hookSpin = deviation * -0.5; // Scale it down
    
    // Limit spin
    if (hookSpin > 30) hookSpin = 30;
    if (hookSpin < -30) hookSpin = -30;

    if (activeTeam === 1) isBallRolling1 = true;
    else if (activeTeam === 2) isBallRolling2 = true;

    throwBall(activeTeam, vx, vy, hookSpin);
    activeTeam = null;
}

// Mouse Events
window.addEventListener('mousedown', (e) => handleSwipeStart(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => handleSwipeMove(e.clientX, e.clientY));
window.addEventListener('mouseup', (e) => handleSwipeEnd(e.clientX, e.clientY));

// Touch Events
window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) handleSwipeStart(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) handleSwipeMove(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) handleSwipeEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
});