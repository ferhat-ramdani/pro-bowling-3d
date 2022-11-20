//droite = verte
//gauche = orange


let pos = 'center';
let btn_state = false;
let dimenstion_quilles = 5;
let liste_dis_quilles = [];
let scene = new THREE.Scene(); 
let traj_gauche;
let traj_droite;
let score_1 = 0;
let score_2 = 0;

function init(){
 var stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
   
 let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
 rendu.shadowMap.enabled = true;
 rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);
 //repere(scene);
 
    var axes = new THREE.AxesHelper(1);    
    // scene.add(axes);
    //repere(scene)



 //********************************************************
 //
 //  P A R T I E     G E O M E T R I Q U E
 //
 //********************************************************
  




  //ajouter une boulle de bowling pour chaque équipe
  ajouter(boule_verte);
  ajouter(boule_orange);








// dessiner dis quilles à droite et dis à gauche
  dis_quilles(0, -3, .5, 1, dimenstion_quilles, 0x169509) //gauche
  dis_quilles(0, 3, .5, 1, dimenstion_quilles, 0xEA5E1B) //droite






  // dessiner Les murs
  let plateforme = face_elementaire(vecteur(-10, -15, 0), vecteur(-10, 15, 0), vecteur(25, 15, 0), vecteur(25, -15, 0), 0x0037b8);
  let frontwall = face_elementaire(vecteur(-10, -15, 0), vecteur(-10, 15, 0), vecteur(-10, 15, 15), vecteur(-10, -15, 15), 0x051520);
  let leftwall = face_elementaire(vecteur(-10, -15, 0), vecteur(25, -15, 0), vecteur(25, -15, 15), vecteur(-10, -15, 15), 0x051520);
  let rightwall = face_elementaire(vecteur(-10, 15, 0), vecteur(25, 15, 0), vecteur(25, 15, 15), vecteur(-10, 15, 15), 0x051520);
  ajouter(plateforme);
  ajouter(frontwall);
  ajouter(leftwall);
  ajouter(rightwall);


  


  //dessiner les guides de sortie en x0 = 5.1
  ajouter(preparer_guides_menes(5.1)[0]);
  ajouter(preparer_guides_menes(5.1)[1]);
  ajouter(preparer_guides_menes(5.1)[2]);


  //dessiner les guides de sortie en x0 = 0.5
  ajouter(preparer_guides_menes(0.5)[0]);
  ajouter(preparer_guides_menes(0.5)[1]);
  ajouter(preparer_guides_menes(0.5)[2]);

  //dessiner les guides de sortie en x0 = -1
  ajouter(preparer_guides_menes(-1)[0]);
  ajouter(preparer_guides_menes(-1)[1]);
  ajouter(preparer_guides_menes(-1)[2]);

  //dessiner les guides de sortie en x0 = -5.6
  ajouter(preparer_guides_menes(-5.6)[0]);
  ajouter(preparer_guides_menes(-5.6)[1]);
  ajouter(preparer_guides_menes(-5.6)[2]);






//fonction qui dessine un cube à la position (x,y)
//de coté a
function dessiner_parallelo(x, y, a, equipe){
  ajouter(parallelo(x, y, a, equipe)[0]);
  ajouter(parallelo(x, y, a, equipe)[1]);
  ajouter(parallelo(x, y, a, equipe)[2]);
  ajouter(parallelo(x, y, a, equipe)[3]);
  ajouter(parallelo(x, y, a, equipe)[4]);
  ajouter(parallelo(x, y, a, equipe)[5]);
}
















  //dessiner une trajectoire rectiligne pour chaque équipe
  ajouter(ligne_droite);
  ajouter(ligne_gauche);



  //définir la trajectoire de chaque équipe
  // traj_droite = pts_ligne_droite;
  // traj_gauche = pts_ligne_gauche;


















  
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













// fonction qui change la position de la camera
// et la direction

  let old_state = false;
  setInterval(function(){
    if(pos == 'left' && old_state != btn_state){
      camera.position.x = 35;
      camera.position.y = -3.05;
      camera.position.z = 5;
      camera.lookAt(-0.75, -3.05, 0);
      camera.zoom = 1;
      camera.updateProjectionMatrix();

      bouger(boule_verte, traj_gauche, 1);

      
    } else if(pos == 'right' && old_state != btn_state){
      camera.position.x = 35;
      camera.position.y = 3;
      camera.position.z = 5;
      camera.lookAt(0, 5, 0);
      camera.zoom = 1;
      camera.updateProjectionMatrix();


      bouger(boule_orange, traj_droite, 2);
    }

    old_state = btn_state;

  }, 100);
















//__________________________DEBUT DU MENU CAMERA___________________
 camera.position.x = 35;
 camera.position.y = 0;
 camera.position.z = 5;
 camera.lookAt(0, 0, 0);

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
 cam.add(menu, "xPos", -40, 40).onChange(function () {
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
  this.traj_droite = 'rect';
  this.traj_gauche = 'rect';
 }

 let courbe = gui.addFolder("Courbe");














 

// _____________creatoin d'un sous-menu pour la trajectoire gauche______________

 courbe.add(menu_courbe, "traj_gauche", ['rect', 'non rect']).onChange(function (e) {


  if(menu_courbe.traj_gauche == 'rect'){

    effacer(bezier_gauche);
    ajouter(ligne_gauche);
    traj_gauche = pts_ligne_gauche;

  }
  else if(menu_courbe.traj_gauche == 'non rect'){

    effacer(ligne_gauche);
    ajouter(bezier_gauche);
    traj_gauche = pts_gauche;

  }


 });


















 // _____________creatoin d'un sous-menu pour la trajectoire gauche___________________

 courbe.add(menu_courbe, "traj_droite", ['rect', 'non rect']).onChange(function (e) {


  if(menu_courbe.traj_droite == 'rect'){

    effacer(bezier_droite);
    ajouter(ligne_droite);
    traj_droite = pts_ligne_droite;

  }
  else if(menu_courbe.traj_droite == 'non rect'){

    effacer(ligne_droite);
    ajouter(bezier_droite);
    traj_droite = pts_droite;
    console.log(pts_droite);
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



function change_pos(pos_input){

  pos = pos_input;
  btn_state = !btn_state;

}
