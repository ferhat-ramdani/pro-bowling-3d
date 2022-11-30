//droite = verte = equipe 2
//gauche = orange = equipe 1


//    DECLARATIONS
let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
let pos = 'center';
let btn_state = false;
let dimenstion_quilles = 3;
let liste_dis_quilles = [];
let scene = new THREE.Scene(); 
let traj_gauche;
let traj_droite;
let score_1 = 0;
let score_2 = 0;
let type_traj_d;
let type_traj_g;
let equipe_1_c = 0x40d200;
let equipe_2_c = 0xff8800;
let equipe_2_c_bis = 0xff8800;
let r_quille = 0.4;
let inclinaison_ratio_g = 1/2;
let inclinaison_ratio_d = 1/2;
let lin_g;
let lin_d;
let pts_lin_g = [];
let pts_lin_d = [];
let traj_rect_resolution = 9;
let traj_non_rect_resolution = 9;
let quille_col = 0xeaeaea;
let mene_g = 0;
let mene_d = 0;
let n_lancers_g = 0;
let n_lancers_d = 0;
let mène_g = 0;
let mène_d = 0;
let fst_eq = 0;



//demander à l'utilisateur de faire entrer
//une resolution pour les quilles et les courbes/droites:

// let ok = false;
// while( ( dimenstion_quilles < 5 || dimenstion_quilles > 30 ) && !ok){
//   dimenstion_quilles = parseInt(prompt("choisissez une résolution entre 5 et 30 pour les quilles :"));
//   if (dimenstion_quilles == 0){
//     ok = true;
//     dimenstion_quilles = 15;
//   }
// }
// while( ( traj_rect_resolution < 10 || dimenstion_quilles > 50 ) &&!ok){
//   traj_rect_resolution = parseInt(prompt("choisissez une résolution entre 10 et 50 pour la trajectoire :"));
//   traj_non_rect_resolution = traj_rect_resolution;
// }

















function init(){
 var stats = initStats();
  // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
   
 rendu.shadowMap.enabled = true;
//  rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);
 //repere(scene);
 
  var axes = new THREE.AxesHelper(1);



 //********************************************************
 //
 //  P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************
  




  //ajouter une boulle de bowling pour chaque équipe
  ajouter(boule_verte);
  ajouter(boule_orange);








// dessiner dis quilles à droite et dis à gauche
  dis_quilles(0, -3, .5, 1, dimenstion_quilles, equipe_1_c) //gauche
  dis_quilles(0, 3, .5, 1, dimenstion_quilles, equipe_2_c) //droite






  // dessiner Les murs
  let plateforme = face_elementaire_sp(vecteur(-10, -15, 0), vecteur(-10, 15, 0), vecteur(25, 15, 0), vecteur(25, -15, 0), 0x007f8c, 0xffffff, 0);
  let frontwall = face_elementaire_sp(vecteur(-10, -15, 0), vecteur(-10, 15, 0), vecteur(-10, 15, 15), vecteur(-10, -15, 15), 0x007f8c, 0xffffff, 0);
  let leftwall = face_elementaire_sp(vecteur(-10, -15, 0), vecteur(25, -15, 0), vecteur(25, -15, 15), vecteur(-10, -15, 15), 0x007f8c, 0xffffff, 0);
  let rightwall = face_elementaire_sp(vecteur(-10, 15, 0), vecteur(25, 15, 0), vecteur(25, 15, 15), vecteur(-10, 15, 15), 0x007f8c, 0xffffff, 0);
  let piste_gauche = face_elementaire_sp(vecteur(-6, 5.1, ep), vecteur(-6, 1, ep), vecteur(30, 1, ep), vecteur(30, 5.1, ep), 0x000000, 0xffffff, 0);
  let piste_droite = face_elementaire_sp(vecteur(-6, 5.1 - 6.1, ep), vecteur(-6, 1 - 6.1, ep), vecteur(30, 1 - 6.1, ep), vecteur(30, 5.1 - 6.1, ep), 0x000000, 0xffffff, 0);
  ajouter(plateforme);
  ajouter(frontwall);
  ajouter(leftwall);
  ajouter(rightwall);
  ajouter(piste_gauche);
  ajouter(piste_droite);


  

  //dessiner les guides de sortie en x0 = 5.1
  ajouter(preparer_guides_menes(5.1, equipe_2_c)[0]);
  ajouter(preparer_guides_menes(5.1, equipe_2_c)[1]);
  ajouter(preparer_guides_menes(5.1, equipe_2_c)[2]);

  //dessiner les guides de sortie en x0 = 0.5
  ajouter(preparer_guides_menes(0.5, equipe_2_c)[0]);
  ajouter(preparer_guides_menes(0.5, equipe_2_c)[1]);
  ajouter(preparer_guides_menes(0.5, equipe_2_c)[2]);


  //dessiner les guides de sortie en x0 = -1
  ajouter(preparer_guides_menes(-1, equipe_1_c)[0]);
  ajouter(preparer_guides_menes(-1, equipe_1_c)[1]);
  ajouter(preparer_guides_menes(-1, equipe_1_c)[2]);

  //dessiner les guides de sortie en x0 = -5.6
  ajouter(preparer_guides_menes(-5.6, equipe_1_c)[0]);
  ajouter(preparer_guides_menes(-5.6, equipe_1_c)[1]);
  ajouter(preparer_guides_menes(-5.6, equipe_1_c)[2]);





  
  //*****************************************************************************************************************
  //
  // F I N      P A R T I E     G E O M E T R I Q U E
  //
  //*****************************************************************************************************************


  //*****************************************************************************************************************
  //
  //  D E B U T     M E N U     G U I
  //
  //*****************************************************************************************************************














//__________________________DEBUT DU MENU CAMERA___________________
 camera.position.x = 40;
 camera.position.y = 0;
 camera.position.z = 10;
 camera.lookAt(5, 0, 0);

 let dir = new THREE.Vector3(0, 0, 0);
 camera.getWorldDirection(dir);

 let gui = new dat.GUI();
 let menu = new function() {
  this.xPos = camera.position.x;
  this.yPos = camera.position.y;
  this.zPos = camera.position.z;
  this.zoom = camera.zoom;
  this.xDir = dir.x;
  this.yDir = dir.y;
  this.zDir = dir.z;
 }

 let cam = gui.addFolder("Camera");
 cam.add(menu, "xPos", -50, 50).onChange(function () {
  camera.position.x = menu.xPos;
 });
 cam.add(menu, "yPos", -40, 40).onChange(function () {
  camera.position.y = menu.yPos;
 });
 cam.add(menu, "zPos", -40, 40).onChange(function () {
  camera.position.z = menu.zPos;
 });
 cam.add(menu, "zoom", 0, 40).onChange(function () {
  camera.zoom = menu.zoom;
  camera.updateProjectionMatrix();
  });
 cam.add(menu, "xDir", -40, 40).onChange(function () {
  camera.lookAt(menu.xDir, menu.yDir, menu.zDir);
 });
 cam.add(menu, "yDir", -40, 40).onChange(function () {
  camera.lookAt(menu.xDir, menu.yDir, menu.zDir);
 });
 cam.add(menu, "zDir", -40, 40).onChange(function () {
  camera.lookAt(menu.xDir, menu.yDir, menu.zDir);
 });


 //______________________________FIN DE MENU CAMERA__________________

 



















 let menu_courbe = new function(){
  this.traj_droite = 'non rect';
  this.traj_gauche = 'non rect';
  this.eq_gauche = 1/2;
  this.eq_droite = 1/2;
  this.rot = 0;
 }

 let courbe = gui.addFolder("Courbe");







 

// _____________creatoin d'un sous-menu pour la trajectoire gauche______________

 courbe.add(menu_courbe, "traj_gauche", ['rect', 'non rect']).onChange(function (e) {


  if(menu_courbe.traj_gauche == 'rect'){

    effacer(bezier_g);
    dessiner_traj_rect(1, 20);
    traj_gauche = pts_lin_g;
    type_traj_g = 'rect'

  }
  else if(menu_courbe.traj_gauche == 'non rect'){

    effacer(lin_g);
    ajouter(bezier_g);
    traj_gauche = pts_bezier_g;
    type_traj_g = 'non rect';

  }

  camera.position.y = -3.05;

 });












 // _____________creatoin d'un sous-menu pour la trajectoire gauche___________________

 courbe.add(menu_courbe, "traj_droite", ['rect', 'non rect']).onChange(function (e) {


  if(menu_courbe.traj_droite == 'rect'){

    effacer(bezier_d);
    dessiner_traj_rect(2, 20);
    traj_droite = pts_lin_d;
    type_traj_d = 'rect';

  }
  else if(menu_courbe.traj_droite == 'non rect'){

    effacer(lin_d);
    ajouter(bezier_d);
    traj_droite = pts_bezier_d;
    type_traj_d = 'non rect';
  }

  camera.position.y = +3.05;

 });






//__________________SOUS MENU GUI TRAJ RECTILIGNE__________________
courbe.add(menu_courbe, "eq_gauche", 0, 1).onChange(function () {
  inclinaison_ratio_g = menu_courbe.eq_gauche;
  if(type_traj_g == 'rect'){
    dessiner_traj_rect(1, 20);
    traj_gauche = pts_lin_g;
    camera.position.y = -3.05;
  }
});






courbe.add(menu_courbe, "eq_droite", 0, 1).onChange(function () {
  inclinaison_ratio_d = menu_courbe.eq_droite;
  if(type_traj_d == 'rect'){
    dessiner_traj_rect(2, 20);
    traj_droite = pts_lin_d;
    camera.position.y = +3.05;
  }
});


 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************







 renduAnim();
 
 
  // ajoute le rendu dans l'element HTML
 document.getElementById("webgl").appendChild(rendu.domElement);
   
  // affichage de la scene
 rendu.render(scene, camera);
  
 
 function reAffichage() {
  setTimeout(function () { 
 
  }, 200);// fin setTimeout(function ()
    // render avec requestAnimationFrame
  rendu.render(scene, camera);
 }// fin fonction reAffichage()
 
 
  function renduAnim() {
    stats.update();
    // render avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }
 
} // fin fonction init()









