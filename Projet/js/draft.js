
// // just testing
// function test(points){
//     for (let j = 1; j < points.length - 1; j++) {
        
//         let vect_dir_1 = new THREE.Vector2(points[j].x - points[j-1].x, points[j].y - points[j-1].y);
//         vect_dir_1.normalize();
//         let vect_dir_2 = new THREE.Vector2(points[j+1].x - points[j].x, points[j+1].y - points[j].y);
//         vect_dir_2.normalize();
//         let O = new THREE.Vector2(0, 0);

//         let rot_z = vect_dir_2.angle() - vect_dir_1.angle();
        

//         // console.log(vect_dir_1, vect_dir_2);
//         // console.log(rot_z);
        
//     }

// }

// setTimeout(() => {
//     test(pts_bezier_d);
// }, 4000);







// const geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({
//   color: 0xfffff,
//   wireframe: false,
// });
// var cube = new THREE.Mesh(geometry, material);

// const loader = new THREE.TextureLoader();

// cube.material.map = loader.load('https://th.bing.com/th/id/OIP.Vh0YOTAI_31KQuNUumcUbQHaHa?pid=ImgDet&rs=1');

// scene.add(cube);




// function print(text){
//     console.log(text);
// }