
//        FONCTION VECTEUR

// fonction qui retourne un vecteur à partir
// de ses composantes
function vecteur(x, y, z){
  return new THREE.Vector3(x, y, z);
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
    specular:"#050505", //couleur speculaire
    flatShading: true,
    shininess:30,//brillance
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









