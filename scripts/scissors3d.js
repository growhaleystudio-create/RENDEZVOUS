/**
 * RENDEZVOUS BARBERSHOP — 3D BARBER TOOLS WEBGL ENGINE
 * Dual-Object Physics Engine: Renders 3D Scissors (gunting) & Barber Comb (sisir)
 * Choreographed tumbling & falling scroll animation across the entire luxury experience.
 */

(function () {
  let scene, camera, renderer;
  let scissorsMesh, scissorsPivot;
  let combMesh, combPivot;
  
  // Scissors Trajectory Targets
  let scTargetX = 0, scTargetY = 0, scTargetZ = 0;
  let scTargetRotX = 0, scTargetRotY = 0, scTargetRotZ = 0;

  // Comb Trajectory Targets
  let cbTargetX = 0, cbTargetY = 0, cbTargetZ = 0;
  let cbTargetRotX = 0, cbTargetRotY = 0, cbTargetRotZ = 0;

  let currentScroll = 0, targetScroll = 0, scrollVelocity = 0, lastScrollY = 0;
  let mouseX = 0, mouseY = 0;
  let isMobile = window.innerWidth < 768;

  // 1. Scissors Trajectory Milestones (Scroll 0 -> 1)
  const scissorsMilestones = [
    { p: 0.00, pos: [2.2, 0.3, 0.0], rot: [0.3, -0.4, 0.5] },          // Hero: top right
    { p: 0.12, pos: [-2.4, -0.2, -0.4], rot: [1.6, 2.2, -0.7] },       // The Experience: left
    { p: 0.22, pos: [2.85, 0.7, -0.7], rot: [2.4, 3.0, 0.8] },         // White Canvas Manifesto: outer far right
    { p: 0.35, pos: [2.4, 0.0, -0.9], rot: [3.4, 4.1, 1.5] },          // Services & Pricing: right (behind cards)
    { p: 0.50, pos: [-2.5, -0.1, -0.7], rot: [4.8, 5.5, -1.3] },       // 5 Havens: left (behind cards)
    { p: 0.68, pos: [2.3, 0.1, -0.6], rot: [6.4, 7.1, 2.1] },          // Master Barbers: right (behind cards)
    { p: 0.80, pos: [-2.85, 0.6, -0.7], rot: [7.8, 8.4, -0.9] },       // Dark Canvas "or via app": outer far left
    { p: 0.90, pos: [2.2, -0.1, -0.5], rot: [9.6, 10.0, 1.7] },        // RDV Paper & FAQ: right
    { p: 1.00, pos: [0.65, -0.4, 0.2], rot: [11.2, 11.5, 3.14] },      // Curtain Footer: crossed right
  ];

  // 2. Comb Trajectory Milestones (Choreographed Counterpoint Dance)
  const combMilestones = [
    { p: 0.00, pos: [-2.1, -0.4, 0.2], rot: [-0.4, 0.6, -0.8] },       // Hero: bottom left
    { p: 0.12, pos: [2.2, 0.3, -0.3], rot: [1.2, -1.8, 0.9] },         // The Experience: right
    { p: 0.22, pos: [-2.85, -0.7, -0.7], rot: [2.0, -2.6, -1.0] },      // White Canvas Manifesto: outer far left
    { p: 0.35, pos: [-2.4, -0.1, -0.9], rot: [3.0, -3.6, -1.3] },      // Services & Pricing: left (behind cards)
    { p: 0.50, pos: [2.5, 0.1, -0.7], rot: [4.4, -5.0, 1.6] },         // 5 Havens: right (behind cards)
    { p: 0.68, pos: [-2.3, -0.2, -0.6], rot: [6.0, -6.6, -1.8] },      // Master Barbers: left (behind cards)
    { p: 0.80, pos: [2.85, -0.6, -0.7], rot: [7.6, -8.1, 1.2] },       // Dark Canvas "or via app": outer far right
    { p: 0.90, pos: [-2.1, 0.1, -0.5], rot: [9.1, -9.5, -1.4] },       // RDV Paper & FAQ: left
    { p: 1.00, pos: [-0.65, -0.4, 0.2], rot: [10.8, -11.0, -2.8] },    // Curtain Footer: crossed left
  ];

  function init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded yet, retrying...');
      setTimeout(init, 100);
      return;
    }

    const container = document.getElementById('threeScissorsCanvas');
    if (!container) return;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 8.5 : 6.5);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting System (Chrome Reflections & Warm Amber/Orange Edge Lighting)
    setupLighting();

    // 5. Load Both 3D Models (Scissors & Comb)
    loadTools();

    // 6. Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    onScroll();
    animate();
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.25);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    // Front Warm Fill
    const frontLight = new THREE.DirectionalLight(0xFFF2E6, 1.8);
    frontLight.position.set(-5, 4, 6);
    scene.add(frontLight);

    // Back Cool Rim
    const backRimLight = new THREE.DirectionalLight(0xAACCFF, 1.5);
    backRimLight.position.set(0, -6, -4);
    scene.add(backRimLight);

    // Signature RendezVous Orange Rim Point Light
    const orangePointLight = new THREE.PointLight(0xFF5E1E, 6.5, 35);
    orangePointLight.position.set(-4, 3, 3);
    scene.add(orangePointLight);

    // Warm Gold Highlight
    const goldPointLight = new THREE.PointLight(0xE5A93C, 4.0, 30);
    goldPointLight.position.set(5, -3, 3);
    scene.add(goldPointLight);
  }

  async function loadTools() {
    // 1. Load Scissors (Gunting)
    try {
      const res = await fetch('./scissors.glb');
      const buf = await res.arrayBuffer();
      const glb = parseGLBBuffer(buf, {
        posAccIdx: 0,
        normAccIdx: 1,
        indexAccIdx: 3
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(glb.positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(glb.normals, 3));
      geometry.setIndex(new THREE.BufferAttribute(glb.indices, 1));
      geometry.computeVertexNormals();
      geometry.center();

      const scScale = isMobile ? 0.85 : 1.7;
      geometry.scale(scScale, scScale, scScale);

      // Polished Japanese Barber Steel Material
      const material = new THREE.MeshStandardMaterial({
        color: 0xF2F2F7,
        metalness: 0.95,
        roughness: 0.15,
        side: THREE.DoubleSide
      });

      scissorsMesh = new THREE.Mesh(geometry, material);
      scissorsMesh.castShadow = true;
      scissorsMesh.receiveShadow = true;

      scissorsPivot = new THREE.Group();
      scissorsPivot.add(scissorsMesh);
      scene.add(scissorsPivot);
      console.log('3D Scissors loaded successfully!');
    } catch (e) {
      console.error('Error loading scissors.glb:', e);
    }

    // 2. Load Barber Comb (Sisir)
    try {
      const res = await fetch('./lowpoly_sharp_comb.glb');
      const buf = await res.arrayBuffer();
      const glb = parseGLBBuffer(buf, {
        posAccIdx: 0,
        normAccIdx: 1,
        indexAccIdx: 2
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(glb.positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(glb.normals, 3));
      geometry.setIndex(new THREE.BufferAttribute(glb.indices, 1));
      geometry.computeVertexNormals();
      geometry.center();

      const cbScale = isMobile ? 0.38 : 0.75;
      geometry.scale(cbScale, cbScale, cbScale);

      // Luxury Carbon / Obsidian Matte Barber Comb Material
      const material = new THREE.MeshStandardMaterial({
        color: 0x1E1D1B,
        metalness: 0.4,
        roughness: 0.25,
        side: THREE.DoubleSide
      });

      combMesh = new THREE.Mesh(geometry, material);
      combMesh.castShadow = true;
      combMesh.receiveShadow = true;

      combPivot = new THREE.Group();
      combPivot.add(combMesh);
      scene.add(combPivot);
      console.log('3D Comb loaded successfully!');
    } catch (e) {
      console.error('Error loading lowpoly_sharp_comb.glb:', e);
    }

    updateTrajectories(targetScroll);
  }

  // Universal Direct Binary GLB Buffer Parser
  function parseGLBBuffer(arrayBuffer, { posAccIdx, normAccIdx, indexAccIdx }) {
    const dataView = new DataView(arrayBuffer);
    const magic = dataView.getUint32(0, true);
    if (magic !== 0x46546C67) throw new Error('Invalid GLB magic');

    const chunk0Length = dataView.getUint32(12, true);
    const jsonBytes = new Uint8Array(arrayBuffer, 20, chunk0Length);
    const jsonStr = new TextDecoder().decode(jsonBytes);
    const gltf = JSON.parse(jsonStr);

    const binChunkOffset = 20 + chunk0Length;
    const binChunkLength = dataView.getUint32(binChunkOffset, true);
    const binData = new Uint8Array(arrayBuffer, binChunkOffset + 8, binChunkLength);

    // Positions
    const posAcc = gltf.accessors[posAccIdx];
    const posBv = gltf.bufferViews[posAcc.bufferView];
    const posByteOffset = (posBv.byteOffset || 0) + (posAcc.byteOffset || 0);
    const positions = new Float32Array(binData.buffer, binData.byteOffset + posByteOffset, posAcc.count * 3);

    // Normals
    const normAcc = gltf.accessors[normAccIdx];
    const normBv = gltf.bufferViews[normAcc.bufferView];
    const normByteOffset = (normBv.byteOffset || 0) + (normAcc.byteOffset || 0);
    const normals = new Float32Array(binData.buffer, binData.byteOffset + normByteOffset, normAcc.count * 3);

    // Indices
    const indexAcc = gltf.accessors[indexAccIdx];
    const indexBv = gltf.bufferViews[indexAcc.bufferView];
    const indexByteOffset = (indexBv.byteOffset || 0) + (indexAcc.byteOffset || 0);
    const indices = new Uint32Array(binData.buffer, binData.byteOffset + indexByteOffset, indexAcc.count);

    return { positions, normals, indices };
  }

  function onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY;
    targetScroll = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    const delta = scrollY - lastScrollY;
    scrollVelocity = delta * 0.008;
    lastScrollY = scrollY;
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onWindowResize() {
    isMobile = window.innerWidth < 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = isMobile ? 8.5 : 6.5;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function interpolateMilestones(milestones, p, isComb = false) {
    let i = 0;
    for (; i < milestones.length - 1; i++) {
      if (p <= milestones[i + 1].p) break;
    }
    const k1 = milestones[i];
    const k2 = milestones[Math.min(i + 1, milestones.length - 1)];

    const segmentDuration = k2.p - k1.p || 0.0001;
    const localT = (p - k1.p) / segmentDuration;
    const easedT = localT * localT * (3 - 2 * localT);

    const xFactor = isMobile ? 1.0 : 1.0;
    const mobileHeroYOffset = isMobile && p < 0.12 ? (isComb ? -0.7 : 0.7) : 0;
    return {
      x: (k1.pos[0] + (k2.pos[0] - k1.pos[0]) * easedT) * xFactor,
      y: (k1.pos[1] + (k2.pos[1] - k1.pos[1]) * easedT) + mobileHeroYOffset,
      z: k1.pos[2] + (k2.pos[2] - k1.pos[2]) * easedT,
      rotX: k1.rot[0] + (k2.rot[0] - k1.rot[0]) * easedT,
      rotY: k1.rot[1] + (k2.rot[1] - k1.rot[1]) * easedT,
      rotZ: k1.rot[2] + (k2.rot[2] - k1.rot[2]) * easedT
    };
  }

  function updateTrajectories(p) {
    const sc = interpolateMilestones(scissorsMilestones, p, false);
    scTargetX = sc.x; scTargetY = sc.y; scTargetZ = sc.z;
    scTargetRotX = sc.rotX; scTargetRotY = sc.rotY; scTargetRotZ = sc.rotZ;

    const cb = interpolateMilestones(combMilestones, p, true);
    cbTargetX = cb.x; cbTargetY = cb.y; cbTargetZ = cb.z;
    cbTargetRotX = cb.rotX; cbTargetRotY = cb.rotY; cbTargetRotZ = cb.rotZ;
  }

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);

    time += 0.016;

    currentScroll += (targetScroll - currentScroll) * 0.09;
    updateTrajectories(currentScroll);

    scrollVelocity *= 0.92;

    // 1. Animate 3D Scissors (Gunting)
    if (scissorsPivot) {
      const floatY = Math.sin(time * 2.2) * 0.08;
      const floatX = Math.cos(time * 1.6) * 0.05;
      const velocityOffset = -scrollVelocity * 1.5;

      scissorsPivot.position.x += (scTargetX + floatX + mouseX * 0.25 - scissorsPivot.position.x) * 0.08;
      scissorsPivot.position.y += (scTargetY + floatY + velocityOffset - mouseY * 0.25 - scissorsPivot.position.y) * 0.08;
      scissorsPivot.position.z += (scTargetZ - scissorsPivot.position.z) * 0.08;

      const dynamicTumbleX = scTargetRotX + scrollVelocity * 4.5 + Math.sin(time * 1.5) * 0.1;
      const dynamicTumbleY = scTargetRotY + (targetScroll * Math.PI * 4.5) + Math.cos(time * 1.8) * 0.12;
      const dynamicTumbleZ = scTargetRotZ + scrollVelocity * 3.0 + mouseX * 0.3;

      scissorsPivot.rotation.x += (dynamicTumbleX - scissorsPivot.rotation.x) * 0.07;
      scissorsPivot.rotation.y += (dynamicTumbleY - scissorsPivot.rotation.y) * 0.07;
      scissorsPivot.rotation.z += (dynamicTumbleZ - scissorsPivot.rotation.z) * 0.07;
    }

    // 2. Animate 3D Barber Comb (Sisir)
    if (combPivot) {
      const floatY = Math.cos(time * 2.0) * 0.08;
      const floatX = Math.sin(time * 1.4) * 0.05;
      const velocityOffset = -scrollVelocity * 1.3;

      combPivot.position.x += (cbTargetX + floatX + mouseX * 0.2 - combPivot.position.x) * 0.08;
      combPivot.position.y += (cbTargetY + floatY + velocityOffset - mouseY * 0.2 - combPivot.position.y) * 0.08;
      combPivot.position.z += (cbTargetZ - combPivot.position.z) * 0.08;

      const dynamicTumbleX = cbTargetRotX - scrollVelocity * 4.0 + Math.cos(time * 1.4) * 0.1;
      const dynamicTumbleY = cbTargetRotY - (targetScroll * Math.PI * 4.0) + Math.sin(time * 1.7) * 0.12;
      const dynamicTumbleZ = cbTargetRotZ - scrollVelocity * 2.8 - mouseX * 0.25;

      combPivot.rotation.x += (dynamicTumbleX - combPivot.rotation.x) * 0.07;
      combPivot.rotation.y += (dynamicTumbleY - combPivot.rotation.y) * 0.07;
      combPivot.rotation.z += (dynamicTumbleZ - combPivot.rotation.z) * 0.07;
    }

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
