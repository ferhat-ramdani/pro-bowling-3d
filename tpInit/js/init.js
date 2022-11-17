let pos = 'center';
let btn_state = false;

function init(){
 var stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
 let scene = new THREE.Scene();   
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
  





//    FONCTION AJOUTER
  //fonction qui ajoute un objet à la scène
  function ajouter(obj){
    scene.add(obj);
  }




























  //        FONCTION DESSINER_QUILLE

  // fonction qui dessine une quille à la position (x, y)
  // et à la résolution 'resolution'
  function dessiner_quille(x, y, resolution, couleur){
    let faces = cuisiner_quille(x, y, resolution, couleur);
    for (let i = 0; i < faces.length; i++) {
      for (let j = 0; j < faces[i].length - 1; j++) {
        ajouter(faces[i][j]);
      }
    }
  }




















  //        FONCTIN DIS_QUILLES

  // fonction qui affiche 10 quilles bien alignés
  function dis_quilles(x0, y0, x_gap, y_gap, dim, couleur){

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < i + 1; j++) {
        dessiner_quille(x0 - x_gap*i, y0 - (y_gap/2)*i + y_gap*j, dim, couleur);
      }
    }

  }
























  dis_quilles(0, -3, .5, 1, 5, "#00AA00")
  dis_quilles(0, 3, .5, 1, 5, "#ff6000")





  // dessiner une plateforme
  let plateforme = face_elementaire(vecteur(-10, -15, 0), vecteur(-10, 15, 0), vecteur(25, 15, 0), vecteur(25, -15, 0), "#0000FF");
  ajouter(plateforme);






  // dessiner une ligne en x=1 de long = 5;
  let L1 = ajouter(ligne_aux(1, 30));
  let L2 = ajouter(ligne_aux(5.1, 30));
  let L3 = ajouter(ligne_aux(-1, 30));
  let L4 = ajouter(ligne_aux(-5.1, 30));

  ajouter(L1);
  ajouter(L2);
  ajouter(L3);
  ajouter(L4);





  // preparer les points d'une courbe de bezier a gauche
  let p1 = vecteur(30, -3.05, 0);
  let p2 = vecteur(20, 2, 0);
  let p3 = vecteur(5, -8, 0);
  let p4 = vecteur(-6, -3.05, 0);

  let pts_gauche = bezier(p1, p2, p3, p4, 36);

  let bezier_gauche = cuisine_courbe(pts_gauche, "#00AA00");



  
  // preparer les points d'une courbe de bezier
  let translation = 6.1;

  let p1_ = vecteur(30, -3.05 + translation, 0);
  let p2_ = vecteur(20, 2 + translation, 0);
  let p3_ = vecteur(5, -8 + translation, 0);
  let p4_ = vecteur(-6, -3.05 + translation, 0);

  let pts_droite = bezier(p1_, p2_, p3_, p4_, 36);

  let bezier_droite = cuisine_courbe(pts_droite, "#ff6000");




  //preparer les points d'une ligne grise a gauche
  let pts_ligne_gauche = ligne_plane(30, -4.1, -6, -2, 36)
  let ligne_gauche = cuisine_courbe(pts_ligne_gauche);


  //preparer les points d'une ligne grise a droite
  let pts_ligne_droite = ligne_plane(30, -4.1 + translation, -6, -2 + translation, 36);
  let ligne_droite = cuisine_courbe(pts_ligne_droite);



  
  //********************************************************
  //
  // F I N      P A R T I E     G E O M E T R I Q U E
  //
  //********************************************************















  //********************************************************
  //
  //  D E B U T     M E N U     G U I
  //
  //********************************************************


  // fonction qui supprime l'objet entré en paramètre :
  function effacer(obj){
    scene.remove(obj);
  }





















// fonction qui change la position de la camera
// et la direction
  var key = '';
  let old_state = false;
  setInterval(function(){
    if(pos == 'left' && old_state != btn_state){
      camera.position.x = 35;
      camera.position.y = -3;
      camera.position.z = 5;
      camera.lookAt(0, -5, 0);
    } else if(pos == 'right' && old_state != btn_state){
      camera.position.x = 35;
      camera.position.y = 3;
      camera.position.z = 5;
      camera.lookAt(0, 5, 0);
    }
    old_state = btn_state;
  }, 100);






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
 cam.add(menu, "xPos", -20, 20).onChange(function () {
  camera.position.x = menu.xPos;
 });
 cam.add(menu, "yPos", -20, 20).onChange(function () {
  camera.position.y = menu.yPos;
 });
 cam.add(menu, "zPos", -20, 20).onChange(function () {
  camera.position.z = menu.zPos;
 });
 cam.add(menu, "zoom", 0, 20).onChange(function () {
  camera.zoom = menu.zoom;
  camera.updateProjectionMatrix();
  });
 cam.add(menu, "xDir", -20, 20).onChange(function () {
  camera.lookAt(menu.xDir, menu.yDir, menu.zDir);
 });
 cam.add(menu, "yDir", -20, 20).onChange(function () {
  camera.lookAt(menu.xDir, menu.yDir, menu.zDir);
 });
 cam.add(menu, "zDir", -20, 20).onChange(function () {
  camera.lookAt(menu.xDir, menu.yDir, menu.zDir);
 });









_____
 let menu_courbe = new function(){
  this.type_trajectoire_droite = 1;
  this.type_trajectoire_gauche = 2;
 }

 let courbe = gui.addFolder("Courbe");


// _____________creatoin d'un sous-menu pour la trajectoire gauche______________

 courbe.add(menu_courbe, "type_trajectoire_gauche", [1, 2]).onChange(function (e) {


  if(menu_courbe.type_trajectoire_gauche == 1){

    effacer(bezier_gauche);
    ajouter(ligne_gauche);

  }
  else if(menu_courbe.type_trajectoire_gauche == 2){

    effacer(ligne_gauche);
    ajouter(bezier_gauche);

  }


 });


 // _____________creatoin d'un sous-menu pour la trajectoire gauche___________________

 courbe.add(menu_courbe, "type_trajectoire_droite", [1, 2]).onChange(function (e) {


  if(menu_courbe.type_trajectoire_droite == 1){

    effacer(bezier_droite);
    ajouter(ligne_droite);

  }
  else if(menu_courbe.type_trajectoire_droite == 2){

    effacer(ligne_droite);
    ajouter(bezier_droite);

  }











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
