






let pi = Math.PI;
let eps = 0.05
// let R =  0.55;

let p1_x;
let p1_y;
let p1X;
let p1Y;

let p2_x;
let p2_y;
let p2X;
let p2Y;

let p3_x;
let p3_y;
let p3X;
let p3Y;

let p4_x;
let p4_y;
let p4X;
let p4Y;

let p5_x;
let p5_y;
let p5X;
let p5Y;

let p6_x;
let p6_y;
let p6X;
let p6Y;

let p7_x;
let p7_y;
let p7X;
let p7Y;

let p8_x;
let p8_y;
let p8X;
let p8Y;


let phi_4;
let phi4;

let phi_1;
let phi1;

let phi_7;
let phi7;



let j=0;








//fonction qui génère 7 pts de controle
function generer_ptscontrol(){

  //entre 1 + R et 5.1 - R
  p4_y = Math.random();
  p4Y = (4.1 - 2 * R) * p4_y + 1 + R;

  //entre 5 et 20
  p4_x = Math.random();
  p4X = 15 * p4_x + 5;


  //entre -pi/4 et pi/4
  phi_4 = Math.random();
  phi4 = (pi/2) * phi_4 - pi/4;

  //entre 0 et p4X - 3/2
  p3_x = Math.random();
  p3X = (p4X - 3/2) * p3_x;


  //entre p4X + 3/2 et 
  p5_x = Math.random();
  p5X = (21 - p4X - 3/2) * p5_x + p4X + 3/2;


  let a4 = Math.tan(phi4);
  let b4 = p4Y - a4 * p4X;

  p3Y = a4*p3X + b4;
  p5Y = a4*p5X + b4;



  p1X = -3;
  // pour la valeur du y du point initiale
  p1_y = Math.random();
  p1Y = (4.1 - 2 * R) * p1_y + 1 + R;



  p7X = 23;
  p7Y = 3.1;


  phi_1 = Math.random();
  phi1 = (pi/2) * phi_1 - pi/4;

  p2_x = Math.random();
  p2X = (p4X + 2) - 5/2;

  let a1 = Math.tan(phi1);
  let b1 = p1Y - a1 * p1X;

  p2Y = a1*p2X + b1;




  phi_7 = Math.random();
  phi7 = (pi/2) * phi_7 - pi/4;

  p6_x = Math.random();
  p6X = (45/2 - p4X - 1/2) * p6_x + (p4X + 1/2);

  let a7 = Math.tan(phi7);
  let b7 = p7Y - a7 * p7X;

  p6Y = a7*p6X + b7;

}











//        FONCTION VECTEUR

// fonction qui retourne un vecteur à partir
// de ses composantes
function vecteur(x, y, z){
  return new THREE.Vector3(x, y, z);
}





// dessiner un pt à (x, z)
function dessiner_point(x, z){
  let sphereG = new THREE.SphereGeometry (0.10, 10, 10 );
  let material = new THREE.MeshPhongMaterial({ 
      color: 0x0505ff, 
      opacity: 1,
      transparent: true, 
      wireframe: false,
      emissive : {r:2, g:2, b:2},
      specular : {r:0, g:255, b:255},
      shininess : 45,
  } );
  let sphere = new THREE.Mesh( sphereG, material );

  sphere.position.x = x;
  sphere.position.z = z;

  scene.add(sphere);
}



// retourne si la courbe est bonne ou à jeter

let dis_to_q_ok = false;

function filtrer_courbe(pts, couleur){

  let pos_ok = true;
  let dis_to_q_ok = false;
  let ok = true;
  pts.forEach(pt => {
    if( pt.y <= 1 + R + eps || pt.y >= 5.1 - R - eps ){
      pos_ok = false;
    }
  });


  if(pos_ok){

    pts.forEach(pt => {
      if (valider_cbe(pt, couleur)){
        // console.log("je suis la", pt, couleur);
        dis_to_q_ok = true;
        // console.log("dis : ", dis_to_q_ok, " pos_ok", pos_ok);
      }
    });

  }

  // if(pos_ok){console.log(dis_to_q_ok)};

  return (pos_ok && dis_to_q_ok);
}










//fonction qui determine si la courbe va faire tomber des quilles
//ou pas
function valider_cbe(pt, couleur){

  let b = false;

  if(couleur == equipe_2_c_bis){

    
    quilles2.forEach(quille => {
      d = Math.sqrt( Math.pow(pt.x - quille.position.posx, 2) + Math.pow(pt.y - quille.position.posy, 2) );
      // console.log(d, pt.x, pt.y);
      if(d < R+r_quille - ep){
        // console.log("ca rentre");
        b = true;
      }
    });


  } else if(couleur == equipe_1_c){

    // console.log("equipe 1");

    quilles1.forEach(quille => {
      d = Math.sqrt( Math.pow(pt.x - quille.position.posx, 2) + Math.pow(pt.y - 6.1 - quille.position.posy, 2) );
      if(d < R+r_quille - ep){
        // console.log("i am equipe 2 and it is true");
        b = true;
      }
    });

  }

  return b;
}











function bezier_sp(p1, p2, p3, p4, echelle_div){

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

    points.push(vecteur(x, y, z));
    // console.log(x);
    if(x < 1/2 && x > - 3){
      for (let k = 1; k < 4; k++) {
        
        let t = ((i + k/4) / echelle_div);
  
        let b1 = Math.pow((1 - t), 3);
        let b2 = 3 * t * Math.pow((1 - t), 2);
        let b3 = 3 * Math.pow(t, 2) * (1 - t);
        let b4 = Math.pow(t, 3);
    
        let x = b1 * p1.x + b2 * p2.x + b3 * p3.x + b4 * p4.x;
        let y = b1 * p1.y + b2 * p2.y + b3 * p3.y + b4 * p4.y;
        let z = b1 * p1.z + b2 * p2.z + b3 * p3.z + b4 * p4.z;
        
  
        // console.log("yes!", vecteur(x, y, z));
  
        points.push(vecteur(x, y, z));
        
      }
    }

    // console.log(x, y, z);

  }

  return points;

}

















  
//        FONCTION CUISINE_COURBE

//elle cuisine une courbe a partir de pts
function cuisine_courbe(points, couleur){

  let bezier;
  let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
  let ProprieteCbe = new THREE.LineBasicMaterial( {
  color: couleur,
  linewidth: 4
  } );
  let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
  return(courbePara);

}











// let pt1 = vecteur( p1X, p1Y, 0);
// let pt2 = vecteur( p2X, p2Y, 0);
// let pt3 = vecteur( p3X, p3Y, 0);
// let pt4 = vecteur( p4X, p4Y, 0);

// let pt5 = vecteur( p4X, p4Y, 0);
// let pt6 = vecteur( p5X, p5Y, 0);
// let pt7 = vecteur( p6X, p6Y, 0);
// let pt8 = vecteur( p7X, p7Y, 0);

// let pts1 = bezier(pt8, pt7, pt6, pt5, 50);
// let pts2 = bezier(pt4, pt3, pt2, pt1, 50);
// let pts = pts1.concat(pts2);
// let bezier1 = cuisine_courbe(pts1, 0xffffff);
// let bezier2 = cuisine_courbe(pts2, 0xffffff);
// let bezier = new THREE.Group();
// bezier.add(bezier1, bezier2);





// scene.add(bezier);



// let bor1 = cuisine_courbe([vecteur(-6, 1, 0), vecteur(23, 1)], 0xaa0909);
// let bor2 = cuisine_courbe([vecteur(-6, 5.1, 0), vecteur(23, 5.1)], 0xaa0909);
// scene.add(bor1);
// scene.add(bor2);












// fonction qui genere une courbe, vérifie si elle 
// est bonne, si oui, la dessine.
function generer_courbe(couleur){

  let cont = true;
  let pts;
  let bezier_ = new THREE.Group();

  while(cont){
    generer_ptscontrol();

    let pt1 = vecteur( p1X, p1Y, 0);
    let pt2 = vecteur( p2X, p2Y, 0);
    let pt3 = vecteur( p3X, p3Y, 0);
    let pt4 = vecteur( p4X, p4Y, 0);

    let pt5 = vecteur( p4X, p4Y, 0);
    let pt6 = vecteur( p5X, p5Y, 0);
    let pt7 = vecteur( p6X, p6Y, 0);
    let pt8 = vecteur( p7X, p7Y, 0);

    let pts1 = bezier_sp(pt8, pt7, pt6, pt5, traj_non_rect_resolution);
    let pts2 = bezier_sp(pt4, pt3, pt2, pt1, traj_non_rect_resolution);
    pts = pts1.concat(pts2);

    if(filtrer_courbe(pts, couleur)){

      let bezier1 = cuisine_courbe(pts1, couleur);
      let bezier2 = cuisine_courbe(pts2, couleur);
      bezier_.add(bezier1, bezier2);
      bezier_.position.z = 0.01;
      // scene.add(bezier);
      cont = false;
    }

  }

  return [pts, bezier_];
}








let courbe_aleratoire_d;
let pts_bezier_d;
let bezier_d;

let courbe_aleratoire_g;
let pts_bezier_g;
let bezier_g;



//fonction qui translate la composantes y de tout 
//les points d'un tableau de pts, et fait la meme chose
//un obj (mesh);
function translater_pts(pts, mesh, trans){
  // console.log(pts[pts.length - 1]);
  pts.forEach(pt => {
    pt.y = pt.y + trans;
  });
  mesh.position.y = trans;
}






// afin d'éviter certains problèmes
setTimeout(() => {
  
  courbe_aleratoire_d = generer_courbe(equipe_2_c_bis);
  pts_bezier_d = courbe_aleratoire_d[0];
  bezier_d = courbe_aleratoire_d[1];

  courbe_aleratoire_g = generer_courbe(equipe_1_c);
  pts_bezier_g = courbe_aleratoire_g[0];
  bezier_g = courbe_aleratoire_g[1];

  
  // bezier_g.position.y = 4;

  // console.log("g",  bezier_g);
  // console.log("d",  bezier_d);

  // bezier_d.position.y = 100;
  
  
  translater_pts(pts_bezier_g, bezier_g, - 6.1);


  // bezier_g.position.y = bezier_g.position.y - 6.1;
  
  
  
  ajouter(bezier_d);
  traj_droite = pts_bezier_d;
  type_traj_d = 'non rect';
  
  // console.log("bezier_g", pts_bezier_g);
  
  
  ajouter(bezier_g);
  traj_gauche = pts_bezier_g;
  type_traj_g = 'non rect';

}, 3000);

