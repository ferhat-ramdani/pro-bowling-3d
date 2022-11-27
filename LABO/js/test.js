const geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
  color: 0xfffff,
  wireframe: false,
});
var cube = new THREE.Mesh(geometry, material);

const loader = new THREE.TextureLoader();

cube.material.map = loader.load('https://th.bing.com/th/id/OIP.Vh0YOTAI_31KQuNUumcUbQHaHa?pid=ImgDet&rs=1');

scene.add(cube);






