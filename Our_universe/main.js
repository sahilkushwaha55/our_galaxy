import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

//canvas
const canvas = document.querySelector('.webgl');

//scene
const scene = new THREE.Scene();

//texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/earth_uv2.jpg');

//screen size
const size = {
  x: window.innerWidth,
  y: window.innerHeight
}

//camera
const cameraGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera(35, size.x / size.y);
camera.position.z = 3;
cameraGroup.add(camera);
scene.add(cameraGroup);


/*
 * Earth
 */

const earthMaterial = new THREE.MeshBasicMaterial({ map: texture });
const earth = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), earthMaterial);
scene.add(earth);

/**
 * Saturn
 */

const saturnGroup = new THREE.Group();
const saturnMaterial = new THREE.MeshBasicMaterial({ color: '#C7AF59' });
const saturn = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), saturnMaterial);
saturnGroup.add(saturn);

//Dust
const creatRing = (num, startPoint, ringLength, color) => {
  const dustGeometry = new THREE.BufferGeometry();
  const dustPosition = new Float32Array(num);

  for (let i = 0; i < 4000; i++) {
    const i3 = i * 3;
    const radius = Math.random() * ringLength + startPoint;
    const angle = Math.PI * 2 * Math.random();
    dustPosition[i3 + 0] = Math.sin(angle) * radius;
    dustPosition[i3 + 1] = 0;
    dustPosition[i3 + 2] = Math.cos(angle) * radius;
  }

  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPosition, 3));
  const dustMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color
  });
  const innerDust = new THREE.Points(dustGeometry, dustMaterial);
  saturnGroup.add(innerDust);
}
creatRing(12000, 0.7, 0.1, '#0f0f0e');
creatRing(12000, 0.9, 0.2, '#C7AF59');
creatRing(12000, 1.2, 0.25, '#B19428');

saturnGroup.rotation.x = 0.2;
saturnGroup.rotation.z = 0.15;
scene.add(saturnGroup);


/**
 * Solar system
 */


const planet = (color, size) => {
  const planetMaterial = new THREE.MeshBasicMaterial({ color });
  const newPPlanet = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), planetMaterial);
  return newPPlanet;
}

const planetCircle = (color, size, circleLenght = 0.0015) => {
  const circleMaterial = new THREE.MeshBasicMaterial({ color });
  const circle = new THREE.Mesh(new THREE.TorusGeometry(size, circleLenght), circleMaterial);
  circle.rotation.x = Math.PI / 2;
  return circle;
}

const solarSystem = new THREE.Group();


//Planet

const sun = planet('#ffff00', 0.1);
const mercury = planet('#e5e5e5', 0.01);
const mercuryCircle = planetCircle('#e5e5e5', 0.2);
const venus = planet('#8B7D82', 0.015);
const venusCircle = planetCircle('#8B7D82', 0.26);
const solarEarth = planet('#4b70dd', 0.018);
const earthCircle = planetCircle('#4b70dd', 0.32);
const mars = planet('#ad6242', 0.016);
const marsCircle = planetCircle('#ad6242', 0.4);
const jupiter = planet('#c99039', 0.036);
const jupiterCircle = planetCircle('#c99039', 0.5);

const solarSaturnGroup = new THREE.Group();
const solarSaturn = planet('#C7AF59', 0.03);
const satrunRingOne = planetCircle('#B19428', 0.05, 0.005);
const satrunRingTwo = planetCircle('#C7AF59', 0.065, 0.006);
solarSaturnGroup.add(solarSaturn, satrunRingOne, satrunRingTwo);
solarSaturnGroup.rotation.z = 0.4;

const satrunCircle = planetCircle('#C7AF59', 0.62, 0.002);

const uranusGroup = new THREE.Group();
const uranus = planet('#ace5ee', 0.028);
const uranusRing = planetCircle('#00000', 0.04, 0.004);
uranusGroup.add(uranus, uranusRing);
uranusGroup.rotation.z = 0.7;
const uranusCircle = planetCircle('#ace5ee', 0.78, 0.0025);

const neptune = planet('#4f4cb0', 0.027);
const neptuneCircle = planetCircle('#4f4cb0', 0.88, 0.0028);


solarSystem.add(sun, mercury, mercuryCircle, venus, venusCircle, solarEarth, earthCircle, mars, marsCircle,
  jupiter, jupiterCircle, solarSaturnGroup, satrunCircle, uranusGroup, uranusCircle, neptune, neptuneCircle);
solarSystem.rotation.z = -0.15;
solarSystem.rotation.x = 0.35;
scene.add(solarSystem);

/**
 * Galaxy
 */

const galaxy = new THREE.Group();
const parameters = {}
parameters.count = 10000;
parameters.size = 0.005;
parameters.radius = 0.8;
parameters.branches = 5;
parameters.spin = 5;
parameters.randomness = 0.03;
parameters.randomnessPower = 7;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

const geometry = new THREE.BufferGeometry();
const position = new Float32Array(parameters.count * 3);
const colors = new Float32Array(parameters.count * 3);

const colorOutside = new THREE.Color(parameters.outsideColor);
const colorInside = new THREE.Color(parameters.insideColor);

for (let i = 0; i < parameters.count; i++) {
  const i3 = i * 3;

  // Position
  const radius = (Math.random() * parameters.radius);
  const spin = radius * parameters.spin;
  const angle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

  const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 0.2 : -0.2);
  const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 0.2 : -0.2);
  const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 0.2 : -0.2);

  position[i3 + 0] = Math.sin(angle + spin) * radius + randomX;
  position[i3 + 1] = randomY;
  position[i3 + 2] = Math.cos(angle + spin) * radius + randomZ;

  // Color
  const mixColor = colorInside.clone();
  mixColor.lerp(colorOutside, radius / parameters.radius);

  colors[i3 + 0] = mixColor.r;
  colors[i3 + 1] = mixColor.g;
  colors[i3 + 2] = mixColor.b;
}

geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// Material 
const material = new THREE.PointsMaterial({
  size: parameters.size,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
});

// Points
const points = new THREE.Points(geometry, material);
galaxy.add(points);

galaxy.rotation.z = 0.15;
galaxy.rotation.x = Math.PI / 4;

scene.add(galaxy);

const sectionMeshes = [earth, solarSystem, galaxy, saturnGroup];

/**
 * Stars
 */

const starGeometry = new THREE.BufferGeometry();
const starsPosition = new Float32Array(600);

for(let i = 0;i<200;i++){
  starsPosition[i * 3] = (Math.random() - 0.5) * 5;
  starsPosition[i * 3 + 1] = 1 - Math.random() * 10;
  starsPosition[i * 3 + 2] = (Math.random() - 0.5) * 5;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starsPosition, 3));

const starMaterial = new THREE.PointsMaterial({size : 0.015});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

/**
 * Object position
 */

const objectPosition = 2;
solarSystem.position.y = - objectPosition;
galaxy.position.y = -objectPosition * 2;
saturnGroup.position.y = -objectPosition * 3;

earth.position.x = 1;
solarSystem.position.x = -0.8;
galaxy.position.x = 0.8;

/**
 * Scroll
 */

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  let newSection = Math.round(scrollY / size.y);

  if(currentSection != newSection){
    currentSection = newSection;

    gsap.to(
      sectionMeshes[currentSection].rotation,
      {
        duration : 1,
        y : '+=2'
      }
    )
  }
})

/**
 * Parallax effect
 */

const cursor = {
  x: 0,
  y : 0
}

window.addEventListener('mousemove', (event) =>{
  cursor.x = event.clientX / size.x - 0.5;
  cursor.y = event.clientY/ size.y - 0.5;
})


//rendrere
const rendrere = new THREE.WebGLRenderer({ canvas });
rendrere.setSize(size.x, size.y);

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //Solar system rotation
  const rotated = (planet, speed, radius) => {
    planet.position.x = Math.sin(elapsedTime * speed) * radius;
    planet.position.z = Math.cos(elapsedTime * speed) * radius;
  }
  rotated(mercury, 2, 0.2);
  rotated(venus, 1.6, 0.26);
  rotated(solarEarth, 1, 0.32);
  rotated(mars, 0.9, 0.4)
  rotated(jupiter, 0.75, 0.5);
  rotated(solarSaturnGroup, 0.67, 0.62);
  rotated(uranusGroup, 0.62, 0.78);
  rotated(neptune, 0.55, 0.88);

  //Earth rotation
  earth.rotation.y += 0.005;

  //Saturn rotation
  saturnGroup.rotation.y += 0.003;

  //Galaxy rotation
  galaxy.rotation.y += 0.0025;

  //Scroll
  camera.position.y = -scrollY / size.y * objectPosition;

  //Parallax effect
  const parallaxX = cursor.x;
  const parallaxY = - cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime;

  rendrere.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();