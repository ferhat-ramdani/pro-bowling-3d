

//        FONCTION LIGNE

// fonction qui retourne les points d'une ligne sur le plan Oxz
function ligne_Oxz(x0, z0, z1, echelle_div){
    let points = [];
  
    for(let k=0;k<=echelle_div;k++){
  
      // k varie entre 0 et echelle_div, t varie entre ph0 et phi 1
      let x = x0;
      let y = 0 ;
      let z = ( (z1 - z0)/echelle_div ) * k + z0 ;
      
      points[k] = vecteur(x, y, z);
    }
  
    return points;
  
}
  
  
  
//ligne ==> ligne_Oxz



//fonction qui efface un objet de la scene
function effacer(obj){
  scene.remove(obj);
}











  //        FONCTION LIGNE_Oxy

// fonction qui retourne les points d'une ligne sur le plan Oxy
function ligne_Oxy(x0, y0, x1, y1, echelle_div){

    let points = [];
  
    for(let k=0;k<=echelle_div;k++){
  
      let t = ( (x1 - x0)/echelle_div ) * k + x0
  
      let x = t;
      let y = ( (y1 - y0)/(x1 - x0) ) * (t - x0) + y0 ;
      let z = 0 ;
      
      points[k] = vecteur(x, y, z);
    }
    
  
    return points;
  
  }

  
  //ligne_plane ==> ligne_Oxy















  
//        FONCTION CUISINE_COURBE

//elle cuisine une courbe a partir de pts
function cuisine_courbe(points, couleur){

    let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
    let ProprieteCbe = new THREE.LineBasicMaterial( {
    color: couleur,
    linewidth: 4
    } );
    let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
    return(courbePara);
  
}
  
  
  

  


















//        FONCTION LIGNE AUXILIARE
//fonction qui dessine une ligne sur le plan Oxy
function ligne_aux(y0, long){

  points = [vecteur(-6, y0, .1), vecteur(-6 + long, y0, .1)];


  return cuisine_courbe(points, 0xFF0000);
  
}
  
  























  //        FONCTION BEZIER

// fonction qui prends 4 poits et une échelle de division et retourne
// les points de la courbe de bézier correspondante.
function bezier(p1, p2, p3, p4, echelle_div){

    let points = [];
  
    for (let i = 0; i <= echelle_div; i++) {
  
      let t = (i / echelle_div);
  
      let b1 = Math.pow((1 - t), 3);
      let b2 = 3 * t * Math.pow((1 - t), 2);
      let b3 = 3 * Math.pow(t, 2) * (1 - t);
      let b4 = Math.pow(t, 3);
  
      let x = b1 * p1.x + b2 * p2.x + b3 * p3.x + b4 * p4.x;
      let y = b1 * p1.y + b2 * p2.y + b3 * p3.y + b4 * p4.y;
      let z = b1 * p1.z + b2 * p2.z + b3 * p3.z + b4 * p4.z;
  
      points[i] = vecteur(x, y, z);
  
    }
  
    return points;
  
}
  
  
















  

//          FONCTION REVOLUTION

// fonction qui prends en paramètre des points du plan Oyz (points du profil)
// et retourne la translation de vecteur (x0, y0) des pts générés par la rotation
// de ces pts autour de l'axe des z

function revolution(points_profil, x0, y0, echelle_div){
    pts_rotate_profil = [];
  
    //generer des pts a travers la rotation autour de z
    for (let i = 0; i < points_profil.length; i++) {
      let rotate_pt = [];
      r0 = Math.sqrt( Math.pow(points_profil[i].x, 2) + Math.pow(points_profil[i].y, 2) );
      z = points_profil[i].z;
      for (let j = 0; j <= echelle_div; j++) {
        // k varie entre 0 et echelle_div, t varie entre 0 et 2 PI
        let phi = ( j / echelle_div ) * ( 2 * Math.PI );
        let x = r0*Math.cos(phi) ;
        let y = r0*Math.sin(phi) ;
  
        rotate_pt[j] = vecteur(x, y, z);
      }
      pts_rotate_profil[i] = rotate_pt;
    }

  //translater ces pts
  for (let i = 0; i < pts_rotate_profil.length; i++) {
    for (let j = 0; j < pts_rotate_profil[i].length; j++){
      pts_rotate_profil[i][j].x = pts_rotate_profil[i][j].x + x0;
      pts_rotate_profil[i][j].y = pts_rotate_profil[i][j].y + y0;
    }
  }


  return pts_rotate_profil;
}














//fonction qui prends un y0 et dessine un guide pour les menes en 
//y0
function preparer_guides_menes(y0, c){

  trans = y0 - 5.1 //trans = 0

  let guide_1 = face_elementaire(vecteur(-6, 5.1 + trans, 0), vecteur(-6, 5.1 + trans, 0.5), vecteur(30, 5.1 + trans, 0.5), vecteur(30, 5.1 + trans, 0), c);
  let guide_2 = face_elementaire(vecteur(-6, 5.1 + trans, 0.5), vecteur(30, 5.1 + trans, 0.5), vecteur(30, 5.6 + trans, 0.5), vecteur(-6, 5.6 + trans, 0.5), c);
  let guide_3 = face_elementaire(vecteur(-6, 5.6 + trans, 0.5), vecteur(30, 5.6 + trans, 0.5), vecteur(30, 5.6 + trans, 0), vecteur(-6, 5.6 + trans, 0), c);

  //c = 0x006666

  return [guide_1, guide_2, guide_3];
}












  //preparer les points d'une meilleur courbe de bezier à droite : 
  //(remarquer que j'ai inversé x et y par rapport aux captures d'écrans)
  // let pt1 = vecteur( -1.7,2.4, 0);
  // let pt2 = vecteur( 2.6,7.2, 0);
  // let pt3 = vecteur( 1.5,2.5, 0);
  // let pt4 = vecteur( 7,2.5, 0);

  // let pt5 = vecteur( 7,2.5, 0);
  // let pt6 = vecteur( 20,2.5, 0);
  // let pt7 = vecteur( 7.3,5.8, 0);
  // let pt8 = vecteur( 23,3.1, 0);
  
  // let pts_droite_1 = bezier(pt8, pt7, pt6, pt5, 10);
  // let pts_droite_2 = bezier(pt4, pt3, pt2, pt1, 10);
  // let pts_droite = pts_droite_1.concat(pts_droite_2);
  // let bezier_droite_1 = cuisine_courbe(pts_droite_1, 0xfa865c);
  // let bezier_droite_2 = cuisine_courbe(pts_droite_2, 0xfa865c);
  // let bezier_droite = new THREE.Group();
  // bezier_droite.add(bezier_droite_1, bezier_droite_2);




  // let trans = 6.1
  // //preparer les points d'une meilleur courbe de bezier à gauche :
  // let pt1_ = vecteur( -1.7,1.4 - trans, 0); 
  // let pt2_ = vecteur( 3,9.4 - trans, 0);
  // let pt3_ = vecteur( 2.26,-2.4 - trans, 0);
  // let pt4_ = vecteur( 5.9,3.3 - trans, 0);

  // let pt5_ = vecteur( 5.9,3.3 - trans, 0);
  // let pt6_ = vecteur( 7.3,5.5 - trans, 0);
  // let pt7_ = vecteur( 21,5.16 - trans, 0);
  // let pt8_ = vecteur( 23,3.1 - trans, 0);

  // let pts_gauche_1 = bezier(pt8_, pt7_, pt6_, pt5_, 10);
  // let pts_gauche_2 = bezier(pt4_, pt3_, pt2_, pt1_, 10);
  // let pts_gauche = pts_gauche_1.concat(pts_gauche_2);
  // let bezier_gauche_1 = cuisine_courbe(pts_gauche_1, 0x1afc3f);
  // let bezier_gauche_2 = cuisine_courbe(pts_gauche_2, 0x1afc3f);
  // let bezier_gauche = new THREE.Group();
  // bezier_gauche.add(bezier_gauche_1, bezier_gauche_2);
  



  




  // let translation = 6.1;


  //preparer les points d'une trajectoire rectiligne à gauche
  // let pts_ligne_gauche = ligne_Oxy(23, -3.1, -6, -2, 50);
  //preparer la trajectoire rectiligne à gauche
  // let ligne_gauche = cuisine_courbe(pts_ligne_gauche, 0x1afc3f);


  //preparer les points d'une trajectoire rectiligne à droite
  // let pts_ligne_droite = ligne_Oxy(23, -3.1 + translation, -6, -2 + translation, 15);
  //preparer la trajectoire rectiligne à droite
  // let ligne_droite = cuisine_courbe(pts_ligne_droite, 0xfa865c);













//fonction qui dessine ...
  function dessiner_traj_rect(equipe){

    if(equipe == 1){

      effacer(lin_g);

      let pt2_y_g= (4.1-2*R-2*ep) * inclinaison_ratio_g - 5.1 + R + ep;

      let pt1_g = vecteur(23, -3.1, ep);
      let pt2_g = vecteur(-3, pt2_y_g, ep);
      // console.log(pt1_g);
      // console.log(pt2_y_g);

      lin_g = cuisine_courbe([pt1_g, pt2_g], equipe_1_c);
      ajouter(lin_g);

      //ici on prépare les pts de la ligne
      let a = ( (-3.1-pt2_y_g)/(26) );
      let b = - 3.1 - a * 23;
      // console.log("pt2_y_g : ", pt2_y_g);
      // console.log(a, ".x +", b);
      for (let i = 0; i <= traj_rect_resolution; i++) {
        
        let x = 26 - 26*(i/traj_rect_resolution)-3;
        let y = a*x + b;

        pts_lin_g[i] = vecteur(x, y, ep);

      }


    } else if(equipe == 2){
      effacer(lin_d);

      let pt2_y_d= (4.1-2*R-2*ep) * inclinaison_ratio_d + 1.1 + R + ep;

      let pt1_d = vecteur(23, 3.1, ep);
      let pt2_d = vecteur(-3, pt2_y_d, ep);
      // console.log(pt1_d);
      // console.log(pt2_y_d);
      // console.log(pt2_y_d);

      lin_d = cuisine_courbe([pt1_d, pt2_d], equipe_2_c_bis);
      ajouter(lin_d);

      //ici on prépare les pts de la ligne
      let a = ( (3.1-pt2_y_d)/(26) );
      let b = 3.1 - a * 23;
      // console.log("pt2_y_d : ", pt2_y_d);
      // console.log(a, ".x +", b);
      for (let i = 0; i <= traj_rect_resolution; i++) {
        
        let x = 26 - 26*(i/traj_rect_resolution)-3;
        let y = a*x + b;

        pts_lin_d[i] = vecteur(x, y, ep);

      }
    }

  }


  // dessiner_traj_rect(1, 20);
  // dessiner_traj_rect(2, 20);











  // fonction qui calcule le a et b dans l'equa : y=ax+b
  function calc_equa_dr(pt1, pt2){
    let a = (pt1.y-pt2.y)/(pt1.x-pt2.x);
    let b = pt1.y - a * pt1.x;

    return [a, b];
  }

  function calcu_perp_dr(a, b, pt){
    let a_ = Math.tan( (Math.atan(a) + Math.PI/2) );
    let b_ = pt.y - a_ * pt.x;

    return [a_, b_];
  }
