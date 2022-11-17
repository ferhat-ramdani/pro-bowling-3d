
let R = 0.5;


let sphereG = new THREE.SphereGeometry (R, 100, 60 );
let material = new THREE.MeshPhongMaterial({ 
    color: "#0DAD87", 
    opacity: 1,
    transparent: true, 
    wireframe: true,
    emissive : {r:2, g:2, b:2},
    specular : {r:0, g:255, b:255},
    shininess : 45,
} );
let sphere = new THREE.Mesh( sphereG, material );






// Creer une courbe vide avec 0 points : 
  let geo =  new THREE.BufferGeometry().setFromPoints([]);
  let mat =  new THREE.LineBasicMaterial();
  let Courbe_vide = new THREE.Line(geo, mat);


 

 // fonction qui prends des poins cuisinés et les dessine sur Courbe_vide :
function dessiner(points, couleur) {
  let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
  let ProprieteCbe = new THREE.LineBasicMaterial( {
    color: couleur, 
    linewidth: 100
  } );
  Courbe_vide = new THREE.Line( PtsTab, ProprieteCbe );
  scene.add(Courbe_vide);
}



 // fonction qui prends des poins cuisinés et retourne une courbe préparée :
 function dessiner(points, couleur) {


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
        let a = (3/4)*R;
        let b = R - a;
        let t2=(k*2*Math.PI)/divisions
        let x0 = a*coss(t2) + b*coss(3*t2) + translationX;
        let y0 = a*sinn(t2) - b*sinn(3*t2)  + translationY;
        let z0 = 2*Math.sqrt(a*b)*sinn(2*t2) + R;
        points[k] = new THREE.Vector3(x0,y0,z0);
    }

    return points;
}


function creer_sphere_avec_courbe(x0, y0, translation){

    let sphereG = new THREE.SphereGeometry (R, 100, 60 );
    let material = new THREE.MeshPhongMaterial({ 
        color: "#0DAD87", 
        opacity: 1,
        transparent: true, 
        wireframe: true,
        emissive : {r:2, g:2, b:2},
        specular : {r:0, g:255, b:255},
        shininess : 45,
    } );

    sphere.position.x = x0;
    sphere.position.y = y0;
    sphere.position.z = R;


    let sphere = new THREE.Mesh( sphereG, material );

}