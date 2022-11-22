
//////////version aléatoire :
let p1x = 23;
let p1y = -3.1;

let p2_y = Math.random();
let p2y = -4.1 * p2_y - 1;


let p2x = -3;
// console.log(p2x, p2y);

cbe_aleatoire = cuisine_courbe([vecteur(p1x, 0, p1y), vecteur(p2x, 0, p2y)], 0x000000);
// console.log(cbe_aleatoire);
scene.add(cbe_aleatoire);



function cuisine_courbe(points, couleur){

    let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
    let ProprieteCbe = new THREE.LineBasicMaterial( {
    color: couleur,
    linewidth: 4
    } );
    let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
    return(courbePara);
  
}




function vecteur(x, y, z){
  return new THREE.Vector3(x, y, z);
}






/////////////versoin angle :





let O = new THREE.Vector2(1, 0);
let v1 = new THREE.Vector2(1, 1);
let v2 = new THREE.Vector2(-1, 1);


console.log(v2.angle() - v1.angle());