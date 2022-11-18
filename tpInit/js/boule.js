
let R = 0.5;
let ep = 0.005;


 // fonction qui prends des poins cuisinés et retourne une courbe préparée :
 function cuisiner_courbe_tennis(points, couleur) {

    // Creer une courbe vide avec 0 points : 
    let geo =  new THREE.BufferGeometry().setFromPoints([]);
    let mat =  new THREE.LineBasicMaterial();
    let Courbe_vide = new THREE.Line(geo, mat);


    let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
    let ProprieteCbe = new THREE.LineBasicMaterial( {
      color: couleur, 
      linewidth: 100
    } );
    Courbe_vide = new THREE.Line( PtsTab, ProprieteCbe );
    return Courbe_vide;
  }















// fonction qui prépare les points de la courbe Tenis.
function Tenis(divisions, translationX, translationY){

    let points = new Array(divisions+1);

    for(let k=0;k<=divisions;k++){
        let a = (3/4)*(R + ep);
        let b = (R + ep) - a;
        let t2=(k*2*Math.PI)/divisions
        let x0 = a*Math.cos(t2) + b*Math.cos(3*t2) + translationX;
        let y0 = a*Math.sin(t2) - b*Math.sin(3*t2)  + translationY;
        let z0 = 2*Math.sqrt(a*b)*Math.sin(2*t2) + (R + ep);
        points[k] = new THREE.Vector3(x0,y0,z0);
    }

    return points;
}


















//fait tout
function creer_sphere_avec_courbe(x0, y0, couleur_boule, couleur_tennis){

  let sphereG = new THREE.SphereGeometry (R, 300, 60 );
  let material = new THREE.MeshPhongMaterial({ 
      color: couleur_boule, 
      opacity: 1,
      transparent: true, 
      wireframe: true,
      emissive : {r:2, g:2, b:2},
      specular : {r:0, g:255, b:255},
      shininess : 45,
  } );

  let sphere = new THREE.Mesh( sphereG, material );

  sphere.position.x = x0;
  sphere.position.y = y0;
  sphere.position.z = R;


  let division = 2000;

  let points_tennis = Tenis(division, x0, y0);
  let courbe_tennis = cuisiner_courbe_tennis(points_tennis, couleur_tennis);

  return [sphere, courbe_tennis];

}