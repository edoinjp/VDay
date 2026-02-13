import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(5, 256, 256);
const loader = new THREE.TextureLoader();
const earthMap = loader.load(
  "https://unpkg.com/three-globe/example/img/earth-day.jpg",
);

const yesBtn = document.getElementById("connect-btn");
const noBtn = document.getElementById("no-btn");
const question = document.getElementById("question-text");
noBtn.addEventListener("mouseover", () => {
  noBtn.style.opacity = "0";
  noBtn.style.pointerEvents = "none";
  noBtn.style.transform = "translateX(150px) scale(0)";
  yesBtn.style.transform = "translateX(0) scale(1.2)";
  yesBtn.style.boxShadow = "0 0 50px rgba(255, 8, 68, 0.8)";
});
function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
  });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3),
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  return stars;
}
const starField = createStarfield();
scene.add(starField);
noBtn.addEventListener("mouseover", () => {
  const padding = 100;
  const newX =
    Math.random() * (window.innerWidth - padding * 2) -
    window.innerWidth / 2 +
    padding;
  const newY =
    Math.random() * (window.innerHeight - padding * 2) -
    window.innerHeight / 2 +
    padding;

  noBtn.style.transform = `translate(${newX}px, ${newY}px)`;
});

yesBtn.addEventListener("click", () => {
  question.innerText = "I knew you'd say Yes! ❤️";
  noBtn.style.display = "none";
  const heartCount = 5;
  for (let i = 0; i < heartCount; i++) {
    setTimeout(() => startHeartFlight(i), i * 1000);
  }
});
const material = new THREE.MeshStandardMaterial({
  map: earthMap,
  displacementMap: earthMap,
  displacementScale: 0.2,
  displacementBias: 0,
  metalness: 0.1,
  roughness: 2,
});

const globe = new THREE.Mesh(geometry, material);
globe.rotation.y = -Math.PI / 0.8;
globe.rotation.x = 0.5;
scene.add(globe);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const mainLight = new THREE.DirectionalLight(0xffffff, 2);
mainLight.position.set(0, 5, 5);
scene.add(mainLight);

camera.position.z = 12;
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// --- coordinates ---
const posJapan = latLongToVector3(36.2, 138.2, 5.2);
const posGeorgia = latLongToVector3(42.3, 43.3, 5.2);

// --- materials ---
const boyMat = new THREE.MeshStandardMaterial({
  color: 0x3399ff,
  metalness: 0.1,
  roughness: 0.3,
});
const girlMat = new THREE.MeshStandardMaterial({
  color: 0xff66cc,
  metalness: 0.1,
  roughness: 0.3,
});
const dogMat = new THREE.MeshStandardMaterial({
  color: 0xffcc88,
  metalness: 0.1,
  roughness: 0.5,
});

// --- char models ---
function createBoy() {
  const group = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), boyMat);
  head.position.y = 0.75;
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.18, 0.3, 10, 20),
    boyMat,
  );
  body.position.y = 0.35;
  const feet = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 0.2), boyMat);
  feet.position.y = 0.05;
  group.add(head, body, feet);
  return group;
}

function createGirl() {
  const group = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), girlMat);
  head.position.y = 0.75;
  const dress = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.3, 0.5, 20),
    girlMat,
  );
  dress.position.y = 0.35;
  const bunGeo = new THREE.SphereGeometry(0.09, 12, 12);
  const bunL = new THREE.Mesh(bunGeo, girlMat);
  const bunR = new THREE.Mesh(bunGeo, girlMat);
  bunL.position.set(-0.2, 0.85, 0);
  bunR.position.set(0.2, 0.85, 0);
  group.add(head, dress, bunL, bunR);
  return group;
}

function createDog() {
  const group = new THREE.Group();
  const torso = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.18, 0.45, 10, 20),
    dogMat,
  );
  body.rotation.z = Math.PI / -2.1;
  body.position.set(0.1, 0.35, 0);
  torso.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), dogMat);
  head.position.set(0.35, 0.65, 0);
  head.rotation.z = -0.5;
  torso.add(head);
  const legGeo = new THREE.CapsuleGeometry(0.05, 0.25, 4, 10);

  const frontL = new THREE.Mesh(legGeo, dogMat);
  const frontR = new THREE.Mesh(legGeo, dogMat);
  const backL = new THREE.Mesh(legGeo, dogMat);
  const backR = new THREE.Mesh(legGeo, dogMat);
  frontL.position.set(0.25, 0.12, 0.15);
  frontR.position.set(0.25, 0.12, -0.15);
  backL.position.set(-0.15, 0.12, 0.15);
  backR.position.set(-0.15, 0.12, -0.15);
  const tail = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.04, 0.2, 4, 8),
    dogMat,
  );
  tail.position.set(-0.25, 0.25, 0);
  tail.rotation.z = -Math.PI / 4;
  torso.add(tail);

  const earGeo = new THREE.CapsuleGeometry(0.05, 0.15, 4, 10);
  const earL = new THREE.Mesh(earGeo, dogMat);
  const earR = new THREE.Mesh(earGeo, dogMat);
  earL.position.set(0.4, 0.75, 0.15);
  earR.position.set(0.4, 0.75, -0.15);
  torso.add(earL, earR);

  group.add(torso, frontL, frontR, backL, backR);
  return group;
}

function placeOnGlobe(object, lat, lon, nudgeLon = 0) {
  const pos = latLongToVector3(lat, lon + nudgeLon, 5.2);
  object.position.copy(pos);
  const upVector = pos.clone().normalize();
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), upVector);

  globe.add(object);
}

const boyFig = createBoy();
const girlFig = createGirl();
const dogFig = createDog();

dogFig.scale.set(0.5, 0.5, 0.5);
boyFig.scale.set(0.7, 0.7, 0.7);
girlFig.scale.set(0.7, 0.7, 0.7);

placeOnGlobe(girlFig, 36.2, 138.2, 0); // Japan
placeOnGlobe(boyFig, 42.3, 43.3, -1.5); // Georgia

const dogPos = latLongToVector3(40, 51, 5.2);
dogFig.position.copy(dogPos);

const surfaceNormal = dogPos.clone().normalize();
dogFig.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfaceNormal);

dogFig.rotateY(Math.PI + 0.5);

globe.add(dogFig);

girlFig.children.forEach((part) => {
  part.position.y -= 0.1;
});
// --- Hearts ---

function createHeartMesh() {
  const x = 0,
    y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x + 0.25, y + 0.25);
  heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
  heartShape.bezierCurveTo(
    x - 0.3,
    y + 0.55,
    x - 0.1,
    y + 0.77,
    x + 0.25,
    y + 0.95,
  );
  heartShape.bezierCurveTo(
    x + 0.6,
    y + 0.77,
    x + 0.8,
    y + 0.55,
    x + 0.8,
    y + 0.35,
  );
  heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
  heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  };
  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  geometry.center();
  const material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(0.4, 0.4, 0.4);
  return mesh;
}

document.getElementById("connect-btn").addEventListener("click", () => {
  const heartCount = 3;
  const timeBetweenHearts = 1500;

  for (let i = 0; i < heartCount; i++) {
    setTimeout(() => {
      startHeartFlight(i);
    }, i * timeBetweenHearts);
  }
});

function startHeartFlight(index) {
  const midPoint = new THREE.Vector3()
    .addVectors(posJapan, posGeorgia)
    .multiplyScalar(0.5)
    .normalize();
  const height = index === 0 ? 7 : 8 + Math.random() * 2;
  const offsetIntensity = index === 0 ? 0 : (Math.random() - 0.5) * 5;

  const sideOffset = new THREE.Vector3()
    .crossVectors(posJapan, posGeorgia)
    .normalize()
    .multiplyScalar(offsetIntensity);

  const control1 = posJapan
    .clone()
    .lerp(midPoint, 0.5)
    .add(sideOffset)
    .normalize()
    .multiplyScalar(height);
  const control2 = posGeorgia
    .clone()
    .lerp(midPoint, 0.5)
    .add(sideOffset)
    .normalize()
    .multiplyScalar(height);

  const heartDip = midPoint
    .clone()
    .add(sideOffset)
    .normalize()
    .multiplyScalar(index === 0 ? 6.5 : height * 0.8);

  const curveForward = new THREE.CubicBezierCurve3(
    posJapan,
    control1,
    heartDip,
    posGeorgia,
  );
  const curveBackward = new THREE.CubicBezierCurve3(
    posGeorgia,
    control2,
    heartDip,
    posJapan,
  );

  const flyingHeart = createHeartMesh();
  globe.add(flyingHeart);

  const trailGeometry = new THREE.BufferGeometry();
  const trailMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.8,
  });
  const trail = new THREE.Line(trailGeometry, trailMaterial);
  globe.add(trail);

  let progress = 0;
  let isReturning = false;
  const speed = 0.006;

  function animate() {
    progress += speed;
    const currentCurve = isReturning ? curveBackward : curveForward;

    if (progress <= 1) {
      const point = currentCurve.getPoint(progress);
      flyingHeart.position.copy(point);

      const lookAtPoint = currentCurve.getPoint(Math.min(progress + 0.01, 1));
      flyingHeart.lookAt(lookAtPoint);
      flyingHeart.rotation.x += Math.PI / 2;

      const rawPoints = currentCurve.getPoints(Math.floor(progress * 100));

      const safePoints = rawPoints.map((p) => {
        const distance = p.length();
        if (distance < 5.2) {
          return p.clone().normalize().multiplyScalar(5.2);
        }
        return p;
      });

      trailGeometry.setFromPoints(safePoints);

      requestAnimationFrame(animate);
    } else if (!isReturning) {
      progress = 0;
      isReturning = true;
      requestAnimationFrame(animate);
    } else {
      flyingHeart.scale.set(0, 0, 0);
      globe.remove(flyingHeart);

      let fade = 0.8;
      function fadeTrail() {
        fade -= 0.01;
        trailMaterial.opacity = fade;
        if (fade > 0) requestAnimationFrame(fadeTrail);
        else {
          globe.remove(trail);
          trailGeometry.dispose();
        }
      }
      fadeTrail();
    }
  }
  animate();
}
function adjustCameraForPhone() {
  if (window.innerWidth < 768) {
    camera.position.z = 18;
  } else {
    camera.position.z = 12;
  }
}
function animateLoop() {
  requestAnimationFrame(animateLoop);
  globe.rotation.y += 0.001;

  renderer.render(scene, camera);
}

adjustCameraForPhone();
animateLoop();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  adjustCameraForPhone();
});

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
