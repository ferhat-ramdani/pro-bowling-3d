
//        FONCTION VECTEUR

// fonction qui retourne un vecteur à partir
// de ses composantes
function vecteur(x, y, z){
  return new THREE.Vector3(x, y, z);
}






















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
  
  console.log(points);

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






















//        FONCTION FACE_ELEMENTAIRE

// fonction qui prends 4 points et dessine un une face
function face_elementaire(A, B, C, D, c){

  // creation de l'objet geometrique:
  let quadrilateral_geometry = new THREE.Geometry();

  // proprietes geometrique 
  quadrilateral_geometry.vertices = [A, B, C, D];
  quadrilateral_geometry.faces = [
    new THREE.Face3(0, 1, 2), 
    new THREE.Face3(0, 2, 3)
  ];

  // creation de l'objet material
  var basicMaterial = new THREE.MeshPhongMaterial({
    color: "#999900", // couleur de l’objet
    opacity: 1,
    transparent: true,
    emissive: c, //couleur emissive
    //specular:"#00FFFF", //couleur speculaire
    flatShading: true,
    //shininess:150,//brillance
    side: THREE.DoubleSide,
  });


  // creation de l'objet à retourner:
  let quadrilateral = new THREE.Mesh(quadrilateral_geometry, basicMaterial);

  // retourne l'objet
  return quadrilateral;

}

face_elementaire(vecteur(0, 0, 0), vecteur(0, 3, 0), vecteur(0, 3, 3), vecteur(0, 0, 3), "#FF0000");





























//        FONCTIN cuisiner_CONTOUR

// fonction qui prends une liste de sommets en haut et une autre des sommets
// en bas et dessine un contour:
function cuisiner_contour(pts_contour_bas, pts_contour_haut, c){

  let face_elementaires_scene = []
  
  for (let i = 0; i < pts_contour_bas.length; i++) {
    face_elementaires_scene[i] = face_elementaire(pts_contour_bas[i], pts_contour_bas[i+1],  pts_contour_haut[i+1], pts_contour_haut[i], c);
  }

  return face_elementaires_scene;
}

























//        FONCTION CUISINER_SURF_REV

// fonction qui dessine une surface de révolution à partir de tout 
//les pts constituant la surface (liste de points de contour);
function cuisiner_surf_rev(liste_contours, c){

  let contours_scene = []

  for (let i = 0; i < liste_contours.length - 1; i++) {
    let contour_bas = liste_contours[i];
    let contour_haut = liste_contours[i+1];

    
    
    contours_scene[i] = cuisiner_contour(contour_bas, contour_haut, c);

  }
  
  return contours_scene;

}




















//        FONCTION cuisiner_QUILLE

// fonction qui prends prends en paramètre une position (x, y) du plan Oxy
// et un pourcentage (entre 1 et 100), et dessine une quille à cette position
// avec cette resolution
function cuisiner_quille(x, y, resolution, couleur){

  let surfaces_scene = []

  if(resolution > 100 || resolution <1){

    resolution = 50;

  }

  
  let echelle_1 = parseInt((resolution / 100) * 200);
  let echelle_1_ = parseInt((resolution / 100) * 100);
  let echelle_2 = parseInt((resolution / 100) * 100);
  let echelle_2_ = parseInt((resolution / 100) * 100);
  let echelle_3 = parseInt((resolution / 100) * 50);
  let echelle_3_ = parseInt((resolution / 100) * 90);
  let echelle_4 = parseInt((resolution / 100) * 50);
  let echelle_4_ = parseInt((resolution / 100) * 70);

  let p1 = vecteur(0, .2, 0);
  let p2 = vecteur(0, .35, .36);
  let p3 = vecteur(0, .4, .6);
  let p4 = vecteur(0, .2, 1);
  let pts_bez_1 = bezier(p1, p2, p3, p4, echelle_1);
  let pts_surf_1 = revolution(pts_bez_1, x, y, echelle_1_);
  surfaces_scene = surfaces_scene.concat( cuisiner_surf_rev(pts_surf_1, "#AAAAAA") );

  let p_1 = vecteur(0, .2, 1);
  let p_2 = vecteur(0, .17, 1.06);
  let p_3 = vecteur(0, .1, 1.1);
  let p_4 = vecteur(0, .1, 1.2);
  let pts_bez_2 = bezier(p_1, p_2, p_3, p_4, echelle_2);
  let pts_surf_2 = revolution(pts_bez_2, x, y, echelle_2_);
  surfaces_scene = surfaces_scene.concat(cuisiner_surf_rev(pts_surf_2, couleur));


  let pts_ligne = ligne(.1, 1.2, 1.4, echelle_3);
  let pts_surf_3 = revolution(pts_ligne, x, y, echelle_3_);
  surfaces_scene = surfaces_scene.concat(cuisiner_surf_rev(pts_surf_3, "#AAAAAA"));

  let p__1 = vecteur(0, .1, 1.4);
  let p__2 = vecteur(0, .1, 1.46);
  let p__3 = vecteur(0, .08, 1.5);
  let p__4 = vecteur(0, 0, 1.5);
  let pts_bez_3 = bezier(p__1, p__2, p__3, p__4, echelle_4);
  let pts_surf_4 = revolution(pts_bez_3, x, y, echelle_4_);
  surfaces_scene = surfaces_scene.concat(cuisiner_surf_rev(pts_surf_4, "#AAAAAA"));


  return surfaces_scene;


}









