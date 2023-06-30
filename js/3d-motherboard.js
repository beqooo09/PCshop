const motherBoardScene = document.querySelector('#scene'); 

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 30, motherBoardScene.clientWidth / motherBoardScene.clientHeight, 1, 10000 );
camera.position.set( 150, 150, 100);

var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
scene.add(hemiLight);

var light = new THREE.SpotLight(0xffa95c,4);
light.position.set(-50,100,150);
light.castShadow = true; 
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add( light );

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(motherBoardScene.clientWidth, motherBoardScene.clientHeight);
renderer.shadowMap.enabled = true;
motherBoardScene.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

let model;
var loader = new THREE.GLTFLoader();
loader.load('/3D-model/motherboard_v2/scene.gltf', function( gltf ) {
    model = gltf.scene.children[0];
    scene.add( gltf.scene );
    animate();
});

function animate() {
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate)
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}