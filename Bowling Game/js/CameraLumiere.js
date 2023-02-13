 var xDir=0;
 var yDir=0;
 var zDir=0.25;
  
 function cameraLumiere(scene,camera){   // creation de la camera 
  camera.up = new THREE.Vector3( 0, 0, 1 );
  let xPos=3;
  let yPos=3;
  let zPos=3;
  camera.position.set(xPos, yPos, zPos);
  camera.lookAt(xDir, yDir, zDir);
  camera.updateProjectionMatrix();
} // fin fonction cameraLumiere

 
//*************************************************************
//* 
//        F I N     C A M E R A
//
//*************************************************************

 function lumiere(scene){
    let lumPt = new THREE.PointLight(0xffffff);
    lumPt.position.set(-3,0,1);
    lumPt.intensity = .5;
    lumPt.shadow.camera.far=1;
    lumPt.shadow.camera.near=1;
    scene.add(lumPt);
    let lumPt1 = new THREE.PointLight(0xffffff);
    lumPt1.castShadow = true;
    lumPt1.shadow.camera.far=1;
    lumPt1.shadow.camera.near=1;
    lumPt1.position.set(30,0,10);
    lumPt1.intensity = 1.5;
    scene.add(lumPt1);

  // let am = new THREE.AmbientLight(0xffffff, 0.2);
  // scene.add(am);

}// fin fonction lumiere










function camera_n(i){
  switch (i) {
    case 1:
      
      camera.position.x = 35;
      camera.position.y = 0;
      camera.position.z = 4;
      camera.lookAt(0, 0, 0);
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      
      break;
      
      case 2:
        
        camera.position.x = 50;
        camera.position.y = 0;
        camera.position.z = 20;
        camera.lookAt(0, 0,-1.6);
        camera.zoom = 1;
        camera.updateProjectionMatrix();

      break;


    case 3:
  
      camera.position.x = 11;
      camera.position.y = 0;
      camera.position.z = 50;
      camera.lookAt(11, 0, 0);
      camera.zoom = 1;
      camera.updateProjectionMatrix();

      break;
      
    case 4:
    
      camera.position.x = -8;
      camera.position.y = 0;
      camera.position.z = 3;
      camera.lookAt(2, 0, 0);
      camera.zoom = 0.5;
      camera.updateProjectionMatrix();

      break;
  
    default:
      break;
  }
}