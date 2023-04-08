
let quilles1;
let quilles2;

setTimeout(() => {
    quilles1 = deep_copy(liste_dis_quilles[0]);
    quilles2 = deep_copy(liste_dis_quilles[1]);
}, 1000);

//fonction qui prends une liste de points (vecteurs) et 
//bouge un objet (mesh) suivant ces points.s
//equipe vaut soit 1 (pour l'équipe gauche) soit
// 2 pour l'équipe droite.
function bouger(obj, points, equipe){
    let quilles;
    if(equipe == 1){
        n_lancers_g++;
        quilles = quilles1;
    }else {
        n_lancers_d++;
        quilles = quilles2;
    }

    j = 0;

    x0 = obj.position.x;
    y0 = obj.position.y;
    let pass = true;
    

    let interval = setInterval(() => {
        

        if(j < points.length){

            posx = points[j].x;
            posy = points[j].y;

            obj.position.x = posx;
            obj.position.y = posy;

            if(j>0 && j< points.length-1){

                let d = distance(points[j-1], points[j]);
                if(d > 0){
                    let rot_angle = d / R;
                    let vect_dir_1 = new THREE.Vector2(points[j].x - points[j-1].x, points[j].y - points[j-1].y);
                    vect_dir_1.normalize();
                    let vect_dir_2 = new THREE.Vector2(points[j+1].x - points[j].x, points[j+1].y - points[j].y);
                    vect_dir_2.normalize();
                    let O = new THREE.Vector2(0, 0);
                    let rot_axis_2d = vect_dir_1.rotateAround(O, Math.PI/2);
                    let rot_axis_3d = new THREE.Vector3(rot_axis_2d.x, rot_axis_2d.y, 0);
                    let z_axis = new THREE.Vector3(0, 0, 1);

                    let rot_z = vect_dir_2.angle() - vect_dir_1.angle();

                    obj.rotateOnAxis(z_axis, rot_z);
                    obj.rotateOnAxis(rot_axis_3d, - rot_angle);
                }
            }
            
            // variable qui va stoquer les pts du cercle fait 
            //par l'ombre de la boule.
            let bordures = bordures_ombre(posx, posy, R, 15);

            if(posx <= R + 0.33){
                for (let i = 0; i < quilles.length; i++) {
                    const quille = quilles[i];
                    pass = true;
                    
                    for (let pts = 0; pts < bordures.length; pts++) {

                        
                        //si la quille courante n'est pas déja reduite en parallélepidpède
                        if(pass){

                            const pt = bordures[pts];
                            
                            if(check_disque(pt[0], pt[1], quille.position.posx, quille.position.posy, r_quille)){
                                remplace_quille_para(equipe, quille, i, quilles);
                                pass = false
                            }

                        }

                    }

                }

            }


            j++;
        } else {
            obj.position.x = x0;
            obj.position.y = y0;
            gerer_bts();

            if(equipe == 2){
                if(type_traj_d == 'non rect' && quilles2.length > 0){
                    courbe_aleratoire_d = generer_courbe(equipe_2_c_bis);
                    pts_bezier_d = courbe_aleratoire_d[0];
                    traj_droite = pts_bezier_d;
                    effacer(bezier_d);
                    bezier_d = courbe_aleratoire_d[1];
                    ajouter(bezier_d);
                }
                if(quilles.length == 0){
                    win("2", "orange");
                }
            } else if(equipe == 1){
                if(type_traj_g == 'non rect' && quilles1.length > 0){
                    courbe_aleratoire_g = generer_courbe(equipe_1_c);
                    pts_bezier_g = courbe_aleratoire_g[0];
                    traj_gauche = pts_bezier_g;
                    effacer(bezier_g);
                    bezier_g = courbe_aleratoire_g[1];
                    translater_pts(pts_bezier_g, bezier_g, - 6.1);
                    ajouter(bezier_g);
                }
                if(quilles.length == 0){
                    win("1", "verte");
                }
            }

            clearInterval(interval);
        }
    }, 100);

}







// fonction qui calcule la distance entre deux pts
function distance(p1, p2){
    return Math.sqrt( Math.pow(p1.x - p2.x, 2) +  Math.pow(p1.y - p2.y, 2) +  Math.pow(p1.z - p2.z, 2) );
}












//fonction qui calcule et retourne une liste de pts
//de l'ombre (disque) d'un objet, le disque a un rayon R à la position (x0, y0)
function bordures_ombre(x0, y0, R, echelle){
    pts_bordure_boule = []
    for (let phi = 0; phi < echelle; phi++) {

        x = R*Math.cos(phi) + x0
        y = R*Math.sin(phi) + y0

        pts_bordure_boule.push([x, y]);
        
    }
    return pts_bordure_boule;
}













// fonction qui prends un point : (x, y) 
//(sur le plan OXY) et vérifie si il se trouve 
//à l'intérieur d'un disque de rayon R et centre (x0, y0)
function check_disque(x, y, x0, y0, R){
    let dist_R = Math.sqrt( Math.pow( x-x0 , 2) + Math.pow( y-y0, 2) );

    if(dist_R <= R){

        return true;
    } else {
        return false;
    }
}

















//fonction qui prends l'equipe à laquelle appartient 
//une quille ainsi que son indice dans la liste : liste_dis_quille[equipe - 1],
// supprime la quille en question de la scene, la remplace par
// un parallélepipède de coté 0.01
function remplace_quille_para(equipe, quille_obj, indice, tab_quilles){

    scene.remove(quille_obj.quille);
    x = quille_obj.position.posx;
    y = quille_obj.position.posy;
    dessiner_parallelo(x, y, 0.1, "gauche");
    tab_quilles.splice(indice, 1);


    if(equipe == 1){
        if( n_lancers_g == 1 && tab_quilles.length == 0 ){
            score_1 = 30;
        } else if ( n_lancers_g == 2 && tab_quilles == 0){
            score_1 = 15;
        } else {
            score_1++;
        }
        document.getElementById("verte_score").innerHTML = score_1;
    } else if(equipe == 2){
        if( n_lancers_d == 1 && tab_quilles.length == 0 ){
            score_2 = 30;
        } else if ( n_lancers_d == 2 && tab_quilles == 0){
            score_2 = 15;
        } else {
            score_2++;
        }
        document.getElementById("orange_score").innerHTML = score_2;
    }

    
}
























//    FONCTION AJOUTER
//fonction qui ajoute un objet à la scene
function ajouter(obj){
    scene.add(obj);
}













// fonction qui copie en profendeur une liste
function deep_copy(list){
    let copied_list = [];
    for (let i = 0; i < list.length; i++) {
        const l = list[i];
        copied_list[i] = l;
    }

    return copied_list;
}










// fonction qui change la position de la camera
// et la direction
let old_state = false;
setInterval(function(){
  if(pos == 1 && old_state != btn_state){
    camera.position.y = -3.05;
    bouger(boule_verte, traj_gauche, 1);
    document.getElementById("gauche").disabled = true;
    document.getElementById("droite").disabled = true;
  } else if(pos == 2 && old_state != btn_state){
    camera.position.y = 3.05;
    bouger(boule_orange, traj_droite, 2);
    document.getElementById("gauche").disabled = true;
    document.getElementById("droite").disabled = true;
  }

  old_state = btn_state;

}, 100);



//fonction qui change btn_state lors d'un lancer
function change_pos(pos_input){

    if(fst_eq == 0){
        fst_eq = pos_input;
    }

    pos = pos_input;
    btn_state = !btn_state;

}