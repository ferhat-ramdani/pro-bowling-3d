
let R = 0.55;
let ep = 0.005;



// fonction qui prépare les points de la courbe Tenis.
function Tenis(divisions, translationX, translationY){

  let points = new Array(divisions+1);
  
  for(let k=0;k<=divisions;k++){
      let a = (3/4)*(R + ep);
      let b = (R + ep) - a;
      let t2=(k*2*Math.PI)/divisions
      let x0 = a*Math.cos(t2) + b*Math.cos(3*t2) + translationX;
      let y0 = a*Math.sin(t2) - b*Math.sin(3*t2)  + translationY;
      let z0 = 2*Math.sqrt(a*b)*Math.sin(2*t2);
      points[k] = new THREE.Vector3(x0,y0,z0);
  }

  return points;
}









  
// fonction qui prends des poins cuisinés et retourne une courbe préparée :
function cuisiner_courbe_tennis(points, couleur) {

  let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
  let ProprieteCbe = new THREE.LineBasicMaterial( {
    color: couleur, 
    linewidth: 1
  });
  let Courbe_tenis = new THREE.Line( PtsTab, ProprieteCbe );
  return Courbe_tenis;
}
  
  
  
  





  








//fait tout
function creer_sphere_avec_courbe(x0, y0, couleur_boule, couleur_tennis){

  let sphereG = new THREE.SphereGeometry (R, 30, 20 );
  let material = new THREE.MeshPhongMaterial({ 
      color: couleur_boule, 
      opacity: 1,
      transparent: true, 
      wireframe: false,
      emissive : {r:2, g:2, b:2},
      specular : {r:0, g:255, b:255},
      shininess : 45,
  } );

  let sphere = new THREE.Mesh( sphereG, material );

  // sphere.position.x = x0;
  // sphere.position.y = y0;
  // sphere.position.z = R;

  let division = 50;

  let points_tennis = Tenis(division, 0, 0);
  let courbe_tennis = cuisiner_courbe_tennis(points_tennis, couleur_tennis);
  // courbe_tennis.position.z += R + ep;

  let boule = new THREE.Group();
  // scene.add(courbe_tennis);
  boule.add(sphere, courbe_tennis);
  boule.position.x = x0;
  boule.position.y = y0;
  boule.position.z = R;

  // return [sphere, courbe_tennis];
  console.log(boule);
  return boule;

}


let boule_verte = creer_sphere_avec_courbe(23, -3.05, 0x2CFA48, 0xFAA22C);
let boule_orange = creer_sphere_avec_courbe(23, 3.05, 0xFAA22C, 0x2CFA48);