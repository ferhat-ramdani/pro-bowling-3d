
let R = 0.55;
let ep = 0.005;



// fonction qui prépare les points de la courbe Tenis.
function Tenis(divisions){

  let points = new Array(divisions+1);
  //new
  let div = 1000;
  let m1 = 10;
  let m2 = 20;
  let alpha = 0;
  //end new
  
  for(let k=0;k<=div;k++){
    
    //new
    t = k/divisions;
    x = (R) * ( Math.sin(m2*t) * Math.cos(m1*t-alpha*Math.PI) ) ;
    y = (R) * ( Math.sin(m2*t) * Math.sin(m1*t-alpha*Math.PI) ) ;
    z = (R) * ( Math.cos(m2*t) ) ;
    //end new


    points[k] = new THREE.Vector3(x,y,z);
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
    specular : {r:255, g:255, b:255},
    shininess : 100,
  } );

  let sphere = new THREE.Mesh( sphereG, material );
  let division = 50;
  let points_tennis = Tenis(division, 0, 0);
  let courbe_tennis = cuisiner_courbe_tennis(points_tennis, couleur_tennis);
  let boule = new THREE.Group();
  boule.add(sphere, courbe_tennis);
  boule.position.x = x0;
  boule.position.y = y0;
  boule.position.z = R;
  return boule;

}


let boule_verte = creer_sphere_avec_courbe(23, -3.05, equipe_1_c, equipe_2_c);
let boule_orange = creer_sphere_avec_courbe(23, 3.05, equipe_2_c, equipe_1_c);