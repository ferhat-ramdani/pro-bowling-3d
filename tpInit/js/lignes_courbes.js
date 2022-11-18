

//        FONCTION LIGNE

// fonction qui retourne les points d'une ligne sur le plan Oxz
function ligne(x0, z0, z1, echelle_div){
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
  
  
  














  //        FONCTION LIGNE_PLANE

// fonction qui retourne les points d'une ligne sur le plan Oxz
function ligne_plane(x0, y0, x1, y1, echelle_div){

    let points = [];
  
    for(let k=0;k<=echelle_div;k++){
  
      let t = ( (x1 - x0)/echelle_div ) * k + x0
  
      // k varie entre 0 et echelle_div, t varie entre ph0 et phi 1
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
    color: couleur, // couleur
    linewidth: 4
    } );
    let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
    return(courbePara);
  
}
  
  
  

  


















//        FONCTION LIGNE AUXILIARE
//fonction qui dessine une ligne sur le plan Oxy
function ligne_aux(y0, long){

    points = [vecteur(-6, y0, .1), vecteur(-6 + long, y0, .1)];


    return cuisine_courbe(points, "#FF0000");
  
}
  
  























  //        FONCTION BEZIER

// fonction qui prends 4 poits et un échelle de division et retourne
//les points de la courbe de bézier correspondant.
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

function revolution(points, x0, y0, echelle_div){
    pts_surf = [];
  
    //generer des pts a travers la rotation autour de z
    for (let i = 0; i < points.length; i++) {
      let point_rev = [];
      r0 = Math.sqrt( Math.pow(points[i].x, 2) + Math.pow(points[i].y, 2) );
      z = points[i].z;
      for (let j = 0; j <= echelle_div; j++) {
        // k varie entre 0 et echelle_div, t varie entre 0 et 2 PI
        let t = ( j / echelle_div ) * ( 2 * Math.PI );
        let x = r0*Math.cos(t) ;
        let y = r0*Math.sin(t) ;
  
        point_rev[j] = vecteur(x, y, z);
      }
      pts_surf[i] = point_rev;
    }

  //translater ces pts
  for (let i = 0; i < pts_surf.length; i++) {
    for (let j = 0; j < pts_surf[i].length; j++){
      pts_surf[i][j].x = pts_surf[i][j].x + x0;
      pts_surf[i][j].y = pts_surf[i][j].y + y0;
    }
  }


  return pts_surf;
}

