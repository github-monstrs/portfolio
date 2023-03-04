import * as THREE from 'three';
import {ObjectControls} from 'ObjectControls';
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/node_modules/three/examples/jsm/loaders/DRACOLoader.js';

var car, controls;

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.autoClearColor = false;

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.01;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;
  //const controls = new OrbitControls( camera, renderer.domElement );
  // var rotate_point = new THREE.Vector3(1.5, 1, 0.75);
  // controls.target = rotate_point;

  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper( 1 );
  //scene.add( axesHelper );

  {
    const color = 0xffffff;
    const intensity1 = 2;
    const intensity2 = 0.5;

    const ambient = new THREE.AmbientLight(color, intensity1/2);

    const tr_light = new THREE.DirectionalLight(color, intensity1);
    const bl_light = new THREE.DirectionalLight(color, intensity2);
    tr_light.position.set(2, 2, 2);
    bl_light.position.set(-2, -2, -2);

    scene.add(tr_light);
    scene.add(bl_light);
    scene.add(ambient);
  }


  //-------------------------------------------------------------
  const loader = new GLTFLoader();

  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( '/node_modules/three/examples/jsm/libs/draco/draco_decoder.js' );
  loader.setDRACOLoader( dracoLoader );

  // Load a glTF resource
  loader.load('/resources/Fairlady-Model/scene.gltf',

    function ( gltf ) {
      scene.add( gltf.scene );
      gltf.antialias = true;

      car = scene.children[ 3 ];
      car.rotation.x = 0.35;
      car.rotation.y = 0.5;

      controls = new ObjectControls(camera, renderer.domElement, car);
      controls.enableVerticalRotation();
      controls.disableZoom();
      controls.setMaxVerticalRotationAngle(Math.PI / 7, Math.PI / 7);
      controls.setRotationSpeed(0.04);

      render();

    },

    function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },

    function ( error ) {

      console.log( 'An error happened' );

    }
  );
  //-------------------------------------------------------------

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (!controls.isUserInteractionActive()) {
      car.rotation.y += 0.001;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();