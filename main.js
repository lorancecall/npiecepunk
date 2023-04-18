import "./style.css";
import * as THREE from "three";
import { gsap } from "gsap/dist/gsap";

window.onload = function () {
  // required three components (scene, camera, and renderer)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // vew frustum
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
  });

  // set canvas's pixelratio based on the device and full screen
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener("resize", function (event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  camera.position.set(0, 0, 0);
  renderer.render(scene, camera);

  // Light;
  const pointLight = new THREE.PointLight(0xffffff); // light bulp like point light
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  // randomly generated stars.
  function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(500));

    star.position.set(x, y, z);
    scene.add(star);
  }

  Array(500).fill().forEach(addStar);

  var punks = [];
  function addPunk(i) {
    const idx = String(i).padStart(4, "0");
    const imgPath = `imgs/${idx}.PNG`;
    const punkTexture = new THREE.TextureLoader().load(imgPath);
    const punk = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 0.1),
      new THREE.MeshBasicMaterial({
        map: punkTexture,
        transparent: true,
        opacity: 1,
      })
    );
    const x = (-1) ** i * 10;
    const y = i * 0 + 2;
    const z = i * 4;

    punk.position.set(x, y, z);
    scene.add(punk);
    punks.push(punk);
  }

  for (let i = 1; i < 15; i++) {
    addPunk(i);
  }

  function moveCameraTo(targetPosition, duration) {
    gsap.to(camera.position, duration, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    punks.forEach((punk, id) => {
      punk.rotation.y += 0.02;
      let distance = camera.position.z - punk.position.z;
      if (distance > 20) {
        if (punk.material.opacity > 0) {
          console.log(punk.material.opacity);
          punk.material.opacity -= 0.01;
        }
      }
    });

    renderer.render(scene, camera);
  }
  setTimeout(() => {
    animate();
    moveCameraTo({ x: 0, y: 0, z: 80 }, 12.5);
  }, 5000);
};
