let quilles1 = [];
let quilles2 = [];
let animators = [];

setTimeout(() => {
    quilles1 = liste_dis_quilles[0] ? [...liste_dis_quilles[0]] : [];
    quilles2 = liste_dis_quilles[1] ? [...liste_dis_quilles[1]] : [];
}, 1000);

// Unified render loop
function animateLoop() {
    requestAnimationFrame(animateLoop);
    
    // Smooth camera transition
    updateCameraTransition();

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
    let quilles = equipe == 1 ? quilles1 : quilles2;
    if (equipe == 1) n_lancers_g++;
    else n_lancers_d++;

    let j = 0;
    let x0 = obj.position.x;
    let y0 = obj.position.y;
    
    // We create a specific animator function that runs every frame
    let animator = () => {
        if (j < points.length) {
            let posx = points[j].x;
            let posy = points[j].y;

            // Move ball
            obj.position.x = posx;
            obj.position.y = posy;

            // Rotate ball
            if (j > 0) {
                let dist = distance(points[j - 1], points[j]);
                let angle = dist / R;
                let dir = new THREE.Vector3(points[j].x - points[j-1].x, points[j].y - points[j-1].y, 0).normalize();
                let axis = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
                obj.rotateOnWorldAxis(axis, angle);
            }

            // Collision check
            if (posx <= R + 0.33) {
                for (let i = quilles.length - 1; i >= 0; i--) {
                    let quilleObj = quilles[i];
                    let distToQuille = Math.sqrt(Math.pow(posx - quilleObj.position.posx, 2) + Math.pow(posy - quilleObj.position.posy, 2));
                    
                    if (distToQuille < R + 0.4) {
                        // Hit! Smoothly knock it down
                        remplace_quille_para(equipe, quilleObj, i, quilles);
                    }
                }
            }
            j++;
            return false; // Not done
        } else {
            // Finished trajectory
            obj.position.x = x0;
            obj.position.y = y0;
            gerer_bts();

            // Refresh curve for next throw
            if (equipe == 2 && quilles2.length > 0) {
                if (type_traj_d == 'non rect') {
                    let dData = generer_courbe(equipe_2_c_bis, 2);
                    effacer(bezier_d);
                    pts_bezier_d = dData[0];
                    bezier_d = dData[1];
                    traj_droite = pts_bezier_d;
                    scene.add(bezier_d);
                } else {
                    dessiner_traj_rect(2);
                    traj_droite = pts_lin_d;
                }
            } else if (equipe == 1 && quilles1.length > 0) {
                if (type_traj_g == 'non rect') {
                    let gData = generer_courbe(equipe_1_c, 1);
                    effacer(bezier_g);
                    pts_bezier_g = gData[0];
                    bezier_g = gData[1];
                    traj_gauche = pts_bezier_g;
                    scene.add(bezier_g);
                } else {
                    dessiner_traj_rect(1);
                    traj_gauche = pts_lin_g;
                }
            }

            if (quilles.length == 0) {
                win(equipe, equipe == 1 ? "Cyan" : "Orange");
            }
            return true; // Done, remove from animators
        }
    };

    animators.push(animator);
}

function remplace_quille_para(equipe, quille_obj, indice, tab_quilles) {
    // Instead of replacing with a box, tilt the pin
    let mesh = quille_obj.quille;
    // Animate falling back
    animators.push(() => {
        if (mesh.rotation.y > -Math.PI / 2) {
            mesh.rotation.y -= 0.1;
            mesh.position.x -= 0.05;
            return false;
        }
        return true; // Done tilting
    });

    tab_quilles.splice(indice, 1);

    if (equipe == 1) {
        if (n_lancers_g == 1 && tab_quilles.length == 0) score_1 = 30;
        else if (n_lancers_g == 2 && tab_quilles.length == 0) score_1 = 15;
        else score_1++;
    } else {
        if (n_lancers_d == 1 && tab_quilles.length == 0) score_2 = 30;
        else if (n_lancers_d == 2 && tab_quilles.length == 0) score_2 = 15;
        else score_2++;
    }
    updateScoreboard();
}

function ajouter(obj) {
    scene.add(obj);
}

let old_state = false;
let pos = 'center';
let btn_state = false;

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