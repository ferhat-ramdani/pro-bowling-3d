function cuisine_courbe(points, couleur){

  let PtsTab = new THREE.BufferGeometry().setFromPoints(points);
  let ProprieteCbe = new THREE.LineBasicMaterial( {
  color: couleur,
  linewidth: 4
  } );
  let courbePara = new THREE.Line( PtsTab, ProprieteCbe );
  return(courbePara);

}

const pi = Math.PI;


function sin_(x){
    return Math.sin(x);
}
function cos_(x){
    return Math.cos(x);
}


function vecteur(x, y, z){
  return new THREE.Vector3(x, y, z);
}


function cuisine_jassou(div, m1, m2, alpha){

    L_curve = [];

    for (let k = 0; k <= div; k++) {
        t = k/div;

        // x = sin_(m2*t) * cos_(m1*t-alpha*pi) - 1/2;
        // y = sin_(m2*t) * sin_(m1*t-alpha*pi) - 1/2;
        // z = cos_(m2*t) - 1/2;

        x = sin_(m2*t) * cos_(m1*t-alpha*pi) - 0;
        y = sin_(m2*t) * sin_(m1*t-alpha*pi) - 0;
        z = cos_(m2*t) - 0;

        L_curve.push(vecteur(x, y, z));

    }

    return L_curve;

}




let m1 = 10;
let m2 = 20;
// let m1 = 90;
// let m2 = 100;

// let m1 = 80;
// let m2 = 88;


let div = 1000;

// let m1 = 20;
// let m2 = 30;

let alpha = 0;





Lissajous = cuisine_jassou(div, m1, m2, alpha);
L_curve = cuisine_courbe(Lissajous, 0xff0000);


let R = 1 - 0.01;


let sphereG = new THREE.SphereGeometry (R, 90, 90 );
let material = new THREE.MeshPhongMaterial({ 
  color: 0x0000ff, 
  opacity: 1,
  transparent: true, 
  wireframe: false,
  emissive : {r:2, g:2, b:2},
  specular : {r:0, g:255, b:255},
  shininess : 45,
} );

let sphere = new THREE.Mesh( sphereG, material );
let g = new THREE.Group();
g.add(sphere, L_curve);
scene.add(g);



let z_axis = new THREE.Vector3(0, 1, 0);
let phi = - Math.PI/8;
setInterval(() => {
    console.log("hello");
    g.rotateOnAxis(z_axis, phi);
}, 100);