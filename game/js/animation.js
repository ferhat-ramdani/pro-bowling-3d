let quilles1 = [];
let quilles2 = [];
let animators = [];

let pos = 0;
let fst_eq = 0;
let old_state = false;
let btn_state = false;
let n_lancers_g = 0;
let n_lancers_d = 0;

setTimeout(() => {
    quilles1 = liste_dis_quilles[0] ? [...liste_dis_quilles[0]] : [];
    quilles2 = liste_dis_quilles[1] ? [...liste_dis_quilles[1]] : [];
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

function bouger(obj, points, equipe) {
    if (equipe == 1) n_lancers_g++;
    else n_lancers_d++;

    let x0 = obj.position.x;
    let y0 = obj.position.y;

    // Calculate initial trajectory and spin based on the generated points
    let finalPoint = points[points.length - 1];
    let yDiff = finalPoint.y - y0;

    // Real physics: push the ball!
    // We give it a strong forward velocity (X is negative towards pins)
    let vx = -25;
    let vy = (yDiff / 45) * 25; // proportional to reach the target Y across 45 units

    obj.setLinearVelocity(new THREE.Vector3(vx, vy, 0));

    // Add realistic spin! 
    // Forward roll is around the Y axis. Hook/curve is around the Z axis.
    let type_traj = equipe === 1 ? type_traj_g : type_traj_d;
    let hookSpin = 0;
    if (type_traj === 'non rect') {
        // Apply hook spin depending on the team/side
        hookSpin = equipe === 1 ? -15 : 15;
    }

    obj.setAngularVelocity(new THREE.Vector3(0, -30, hookSpin));

    // We create an animator function that waits until the ball finishes rolling
    let animator = () => {
        // If ball passed the pins (x < -2) or fell off the edge (z < -1)
        if (obj.position.x < -2 || obj.position.z < -1) {

            // Dynamic Physics Wait: Wait for pins to completely stop moving
            let evaluateTimer = 0;
            let settleAnimator = () => {
                evaluateTimer++;
                let allPins = equipe === 1 ? allSpawnedPins1 : allSpawnedPins2;
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
                let standingArr = equipe === 1 ? quilles1 : quilles2;
                let remainingStanding = [];

                for (let i = 0; i < standingArr.length; i++) {
                    let pinObj = standingArr[i];
                    let mesh = pinObj.quille;

                    // Robust Gimbal-lock-free check: Get the pin's actual UP vector
                    let upDir = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion);
                    
                    // A pin is fallen if it tipped over significantly (Z component < 0.8) or fell off the edge
                    let isFallen = upDir.z < 0.8 || mesh.position.z < 0;

                    if (!isFallen) {
                        remainingStanding.push(pinObj);
                    }
                }

                // Update the standing array
                if (equipe === 1) quilles1 = remainingStanding;
                else quilles2 = remainingStanding;

                // Reset ball position
                obj.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                obj.setAngularVelocity(new THREE.Vector3(0, 0, 0));
                obj.position.set(x0, y0, R);
                obj.__dirtyPosition = true;
                obj.__dirtyRotation = true;

                // Process throw using our Score.js logic
                let remainingPinsCount = remainingStanding.length;
                let result = typeof processThrow === 'function' ? processThrow(equipe, remainingPinsCount) : { action: 'none' };

                if (result.action === 'reset') {
                    setTimeout(() => resetLane(equipe), 800);
                } else if (result.action === 'sweep') {
                    setTimeout(() => sweepFallenPins(equipe), 300);
                }

                // Wait 1s for sweep/reset to finish before computing new paths and re-enabling
                setTimeout(() => {
                    let currentQuilles = equipe === 1 ? quilles1 : quilles2;
                    if (equipe == 2 && currentQuilles.length > 0) {
                        if (type_traj_d == 'non rect') {
                            let dData = generer_courbe(equipe_2_c_bis, 2);
                            effacer(bezier_d);
                            pts_bezier_d = dData[0];
                            bezier_d = dData[1];
                            traj_droite = pts_bezier_d;
                            // scene.add(bezier_d);
                        } else {
                            dessiner_traj_rect(2);
                            traj_droite = pts_lin_d;
                        }
                    } else if (equipe == 1 && currentQuilles.length > 0) {
                        if (type_traj_g == 'non rect') {
                            let gData = generer_courbe(equipe_1_c, 1);
                            effacer(bezier_g);
                            pts_bezier_g = gData[0];
                            bezier_g = gData[1];
                            traj_gauche = pts_bezier_g;
                            // scene.add(bezier_g);
                        } else {
                            dessiner_traj_rect(1);
                            traj_gauche = pts_lin_g;
                        }
                    }

                    // Re-enable throw buttons once everything is set
                    document.getElementById("gauche").disabled = false;
                    document.getElementById("droite").disabled = false;
                    pos = 0;
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

function ajouter(obj) {
    scene.add(obj);
}


setInterval(function () {
    if (pos == 1 && old_state != btn_state) {
        camera_n(1); // Set camera to follow
        bouger(boule_verte, traj_gauche, 1);
        document.getElementById("gauche").disabled = true;
        document.getElementById("droite").disabled = true;
    } else if (pos == 2 && old_state != btn_state) {
        camera_n(1);
        bouger(boule_orange, traj_droite, 2);
        document.getElementById("gauche").disabled = true;
        document.getElementById("droite").disabled = true;
    }
    old_state = btn_state;
}, 100);

function change_pos(pos_input) {
    if (fst_eq == 0) fst_eq = pos_input;
    pos = pos_input;
    btn_state = !btn_state;
}