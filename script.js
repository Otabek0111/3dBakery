const loading = document.querySelector('.loader');
const canvas = document.querySelector('.canvas');
const scene = new THREE.Scene(); // Create a new scene 
const textureLoader = new THREE.TextureLoader();
const sezes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Base cam 
const camera = new THREE.PerspectiveCamera(10, sezes.width / sezes.height, 0.1, 1000);
camera.position.z = 30;
camera.position.y = 7;
camera.position.x = 28;
scene.add(camera);

//Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.minDistance = 30;
controls.maxDistance = 80;
controls.minPolarAngle = Math.PI / 5;
controls.maxPolarAngle = Math.PI / 2;

// Renderer
const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

renderer.setSize(sezes.width, sezes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

//Materials
const bakedTexture = textureLoader.load('assets/baked-01.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const bakedTexture2 = textureLoader.load('assets/baked-02.jpg');
bakedTexture2.flipY = false;
bakedTexture2.encoding = THREE.sRGBEncoding;

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });
const bakedMaterial2 = new THREE.MeshBasicMaterial({ map: bakedTexture2 });

// Load the model
const loader = new THREE.GLTFLoader();
loader.load('https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room10/a58985d7d47b6e294f1e7c54c654b0b0636df69c/dist/model-01.glb',
 (gltf) => {
    const model = gltf.scene
    model.traverse( child =>  child.material = bakedMaterial ) 
    scene.add(model);
 },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }
);

// Load the model
loader.load('https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room10/a58985d7d47b6e294f1e7c54c654b0b0636df69c/dist/model-02.glb',
 (gltf) => {
    const model = gltf.scene
    model.traverse( child =>  child.material = bakedMaterial2 ) 
    scene.add(model);
    loading.style.display = 'none';
 },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }
);

window.addEventListener('resize', () => {
    sezes.width = window.innerWidth;
    sezes.height = window.innerHeight;
    renderer.setSize(sezes.width, sezes.height);
    camera.aspect = sezes.width / sezes.height;
    camera.updateProjectionMatrix();
});

// Animation

const minPan = new THREE.Vector3(-2, -1, -2);
const maxPan = new THREE.Vector3(2, 1, 2);

const tick = () => {
    controls.update();
    controls.target.clamp(minPan, maxPan);
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();