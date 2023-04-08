
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
    specular : 0xffffff,
    flatShading: true,
    shininess:100,
    side: THREE.DoubleSide,
  });


  // creation de l'objet à retourner:
  let quadrilateral = new THREE.Mesh(geometrie_quadrilaterale, material_quadrilateral);

  // retourne l'objet
  return quadrilateral;

}





























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

// fonction qui prends en paramètre une position (x, y) du plan Oxy
// et un pourcentage (entre 1 et 100), et dessine une quille à cette position
// avec cette resolution
function cuisiner_quille(x, y, resolution, couleur){

  let surfaces_scene = []

  if(resolution > 100 || resolution <1){

    resolution = 50;

  }

  
  let echelle_1 = parseInt((resolution / 100) * 200);
  let echelle_1_ = parseInt((resolution / 100) * (500));
  let echelle_2 = parseInt((resolution / 100) * 100);
  let echelle_2_ = parseInt((resolution / 100) * (500));
  let echelle_3 = parseInt((resolution / 100) * 90);
  let echelle_3_ = parseInt((resolution / 100) * (250));
  let echelle_4 = parseInt((resolution / 100) * 90);
  let echelle_4_ = parseInt((resolution / 100) * (250));

  let p1 = vecteur(0, .2, 0);
  let p2 = vecteur(0, .35, .36);
  let p3 = vecteur(0, .4, .6);
  let p4 = vecteur(0, .2, 1);

  let pts_bez_1 = bezier(p1, p2, p3, p4, echelle_1);
  let pts_surf_1 = revolution(pts_bez_1, x, y, echelle_1_);
  surfaces_scene = surfaces_scene.concat( cuisiner_surf_rev(pts_surf_1, quille_col) );

  let p_1 = vecteur(0, .2, 1);
  let p_2 = vecteur(0, .17, 1.06);
  let p_3 = vecteur(0, .1, 1.1);
  let p_4 = vecteur(0, .1, 1.2);
  let pts_bez_2 = bezier(p_1, p_2, p_3, p_4, echelle_2);
  let pts_surf_2 = revolution(pts_bez_2, x, y, echelle_2_);
  surfaces_scene = surfaces_scene.concat(cuisiner_surf_rev(pts_surf_2, couleur));


  let pts_ligne = ligne_Oxz(.1, 1.2, 1.3, echelle_3);
  let pts_surf_3 = revolution(pts_ligne, x, y, echelle_3_);
  surfaces_scene = surfaces_scene.concat(cuisiner_surf_rev(pts_surf_3, quille_col));

  let p__1 = vecteur(0, .1, 1.3);
  let p__2 = vecteur(0, .1, 1.60);//vecteur(0, .1, 1.46)
  let p__3 = vecteur(0, .01, 1.5);
  let p__4 = vecteur(0, 0, 1.5);
  let pts_bez_3 = bezier(p__1, p__2, p__3, p__4, echelle_4);
  let pts_surf_4 = revolution(pts_bez_3, x, y, echelle_4_);
  surfaces_scene = surfaces_scene.concat(cuisiner_surf_rev(pts_surf_4, quille_col));


  return surfaces_scene;


}











  //        FONCTION DESSINER_QUILLE

  // fonction qui dessine une quille à la position (x, y)
  // et à la résolution 'resolution', elle sauvegarde 
  // les quille dans une liste pour etre utilisé
  // dans l'animation.

function dessiner_quille(x, y, resolution, couleur){
  let faces = cuisiner_quille(x, y, resolution, couleur);
  for (let i = 0; i < faces.length; i++) {
    for (let j = 0; j < faces[i].length - 1; j++) {
      ajouter(faces[i][j]);
    }
  }
}





function dessiner_quille_bis(x, y, resolution, couleur){
  let faces = cuisiner_quille(x, y, resolution, couleur);
  const quille = new THREE.Group();
  for (let i = 0; i < faces.length; i++) {
    for (let j = 0; j < faces[i].length - 1; j++) {
      quille.add(faces[i][j]);
    }
  }
  ajouter(quille);
  return quille;
}










  //        FONCTIN DIS_QUILLES

  // fonction qui affiche 10 quilles bien alignés, ensuite
  // stoque la carcasse de chaque quille dans une liste, et 
  // rajoute cette liste (de 10 quilles) à la liste liste_dis_quille
  // donc liste_dis_quille est une liste dont les élements est un lot de 
  // dis quilles.

function dis_quilles(x0, y0, x_gap, y_gap, resolution, couleur){
  let liste_quille_pos = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < i + 1; j++) {
      x = x0 - x_gap*i;
      y =  y0 - (y_gap/2)*i + y_gap*j;
      liste_quille_pos.push( { quille: dessiner_quille_bis(x, y, resolution, couleur) ,position : {posx: x, posy: y} } );
    }
  }

  liste_dis_quilles.push(liste_quille_pos);

}