






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
function generer_pts_control(){

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
function filtrer_courbe(pts){
  let ok = true;
  pts.forEach(pt => {
    if( pt.y <= 1 + R + eps || pt.y >= 5.1 - R - eps ){
      ok = false;
    }
  });

  return ok;
}













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
    // console.log(x, y, z);

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











// let pt1 = vecteur( p1X, p1Y, 0);
// let pt2 = vecteur( p2X, p2Y, 0);
// let pt3 = vecteur( p3X, p3Y, 0);
// let pt4 = vecteur( p4X, p4Y, 0);

// let pt5 = vecteur( p4X, p4Y, 0);
// let pt6 = vecteur( p5X, p5Y, 0);
// let pt7 = vecteur( p6X, p6Y, 0);
// let pt8 = vecteur( p7X, p7Y, 0);

// let pts_droite_1 = bezier(pt8, pt7, pt6, pt5, 50);
// let pts_droite_2 = bezier(pt4, pt3, pt2, pt1, 50);
// let pts_droite = pts_droite_1.concat(pts_droite_2);
// let bezier_droite_1 = cuisine_courbe(pts_droite_1, 0xffffff);
// let bezier_droite_2 = cuisine_courbe(pts_droite_2, 0xffffff);
// let bezier_droite = new THREE.Group();
// bezier_droite.add(bezier_droite_1, bezier_droite_2);





// scene.add(bezier_droite);



// let bor1 = cuisine_courbe([vecteur(-6, 1, 0), vecteur(23, 1)], 0xaa0909);
// let bor2 = cuisine_courbe([vecteur(-6, 5.1, 0), vecteur(23, 5.1)], 0xaa0909);
// scene.add(bor1);
// scene.add(bor2);












// fonction qui genere une courbe, vérifie si elle 
// est bonne, si oui, la dessine.
function generer_courbe(){

  let cont = true;
  let pts_droite;

  while(cont){
    generer_pts_control();

    let pt1 = vecteur( p1X, p1Y, 0);
    let pt2 = vecteur( p2X, p2Y, 0);
    let pt3 = vecteur( p3X, p3Y, 0);
    let pt4 = vecteur( p4X, p4Y, 0);

    let pt5 = vecteur( p4X, p4Y, 0);
    let pt6 = vecteur( p5X, p5Y, 0);
    let pt7 = vecteur( p6X, p6Y, 0);
    let pt8 = vecteur( p7X, p7Y, 0);

    let pts_droite_1 = bezier(pt8, pt7, pt6, pt5, 15);
    let pts_droite_2 = bezier(pt4, pt3, pt2, pt1, 15);
    pts_droite = pts_droite_1.concat(pts_droite_2);

    if(filtrer_courbe(pts_droite)){


    //   dessiner_point(p1X, p1Y);
    //   dessiner_point(p2X, p2Y);
    //   dessiner_point(p3X, p3Y);
    //   dessiner_point(p4X, p4Y);
    //   dessiner_point(p5X, p5Y);
    //   dessiner_point(p6X, p6Y);
    //   dessiner_point(p7X, p7Y);

    //   scene.add(cuisine_courbe([pt3, pt6], 0xff1010));
    //   scene.add(cuisine_courbe([pt1, pt2], 0xff1010));
    //   scene.add(cuisine_courbe([pt8, pt7], 0xff1010));


      let bezier_droite_1 = cuisine_courbe(pts_droite_1, 0x000000);
      let bezier_droite_2 = cuisine_courbe(pts_droite_2, 0x000000);
      let bezier_droite = new THREE.Group();
      bezier_droite.add(bezier_droite_1, bezier_droite_2);
      scene.add(bezier_droite);
      cont = false;
    }

  }

  return pts_droite;
}


traj_droite = generer_courbe();
