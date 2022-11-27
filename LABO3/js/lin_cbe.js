

//        FONCTION LIGNE

// fonction qui retourne les points d'une ligne sur le plan Oxz
function ligne_Oxz(x0, z0, z1, echelle_div){
    let points = [];
  
    for(let k=0;k<=echelle_div;k++){
  
      let x = x0;
      let y = 0 ;
      let z = ( (z1 - z0)/echelle_div ) * k + z0 ;
      
      points[k] = vecteur(x, y, z);
    }
  
    return points;
  
}




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
    points[0] = p1;
  
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
    points.push(p4);

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










//fonction qui prends un y0 et dessine un guide pour 
//les menes en y0
function preparer_guides_menes(y0, c){

  trans = y0 - 5.1

  let guide_1 = face_elementaire(vecteur(-6, 5.1 + trans, 0), vecteur(-6, 5.1 + trans, 0.5), vecteur(30, 5.1 + trans, 0.5), vecteur(30, 5.1 + trans, 0), c);
  let guide_2 = face_elementaire(vecteur(-6, 5.1 + trans, 0.5), vecteur(30, 5.1 + trans, 0.5), vecteur(30, 5.6 + trans, 0.5), vecteur(-6, 5.6 + trans, 0.5), c);
  let guide_3 = face_elementaire(vecteur(-6, 5.6 + trans, 0.5), vecteur(30, 5.6 + trans, 0.5), vecteur(30, 5.6 + trans, 0), vecteur(-6, 5.6 + trans, 0), c);

  return [guide_1, guide_2, guide_3];
}












//fonction qui dessine ...
function dessiner_traj_rect(equipe){

  if(equipe == 1){
    pts_lin_g = [];
    effacer(lin_g);

    let pt2_y_g= (4.1-2*R-2*ep) * inclinaison_ratio_g - 5.1 + R + ep;

    let pt1_g = vecteur(23, -3.1, ep);
    let pt2_g = vecteur(-3, pt2_y_g, ep);

    lin_g = cuisine_courbe([pt1_g, pt2_g], equipe_1_c);
    ajouter(lin_g);

    //ici on prépare les pts de la ligne
    let a = ( (-3.1-pt2_y_g)/(26) );
    let b = - 3.1 - a * 23;
    for (let i = 0; i <= traj_rect_resolution; i++) {
      
      let x = 26 - 26*(i/traj_rect_resolution)-3;
      let y = a*x + b;
      pts_lin_g.push(vecteur(x, y, ep));
      
      if(x < 1/2 && x > - 3){
        for (let k = 1; k < 4; k++) {
    
          let x_ = 26 - 26*((i + k/4)/traj_rect_resolution)-3;
          let y_ = a*x_ + b;

          // console.log(vecteur(x_, y_, ep));
    
          pts_lin_g.push(vecteur(x_, y_, ep));
          
        }
      }

    }


  } else if(equipe == 2){
    effacer(lin_d);

    let pt2_y_d= (4.1-2*R-2*ep) * inclinaison_ratio_d + 1.1 + R + ep;

    let pt1_d = vecteur(23, 3.1, ep);
    let pt2_d = vecteur(-3, pt2_y_d, ep);

    lin_d = cuisine_courbe([pt1_d, pt2_d], equipe_2_c_bis);
    ajouter(lin_d);

    //ici on prépare les pts de la ligne
    let a = ( (3.1-pt2_y_d)/(26) );
    let b = 3.1 - a * 23;
    for (let i = 0; i <= traj_rect_resolution; i++) {
      
      let x = 26 - 26*(i/traj_rect_resolution)-3;
      let y = a*x + b;

      pts_lin_d[i] = vecteur(x, y, ep);

    }
  }

}








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




//face élementaire spéciale pour les murs
function face_elementaire_sp(A, B, C, D, c, sp, shin,){ 

  // creation de l'objet geometrique:
  let geometrie_quadrilaterale = new THREE.Geometry();

  // proprietes geometrique 
  geometrie_quadrilaterale.vertices = [A, B, C, D];
  geometrie_quadrilaterale.faces = [
    new THREE.Face3(0, 1, 2), 
    new THREE.Face3(0, 2, 3)
  ];

  // creation de l'objet material
  var material_quadrilateral = new THREE.MeshPhongMaterial({
    color: c,
    // emissive: 0x2aa777,
    // specular: 0x050515,
    specular : sp,
    flatShading: true,
    shininess : shin,
    side: THREE.DoubleSide,
  });


  // creation de l'objet à retourner:
  let quadrilateral = new THREE.Mesh(geometrie_quadrilaterale, material_quadrilateral);

  // retourne l'objet
  return quadrilateral;

}