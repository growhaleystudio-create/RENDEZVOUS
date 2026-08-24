'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ScissorsCanvas3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    let scene, camera, renderer;
    let scissorsPivot;
    let combPivot;

    let scTargetX = 0, scTargetY = 0, scTargetZ = 0;
    let scTargetRotX = 0, scTargetRotY = 0, scTargetRotZ = 0;

    let cbTargetX = 0, cbTargetY = 0, cbTargetZ = 0;
    let cbTargetRotX = 0, cbTargetRotY = 0, cbTargetRotZ = 0;

    let currentScroll = 0, targetScroll = 0, scrollVelocity = 0, lastScrollY = 0;
    let mouseX = 0, mouseY = 0;
    let isMobile = window.innerWidth < 768;

    // 1. Scissors Trajectory Milestones: STRICTLY ON THE RIGHT FLANK (x > 2.5)
    const scissorsMilestones = [
      { p: 0.00, pos: [2.6, 0.3, 0.0], rot: [0.3, -0.4, 0.5] },    // Hero
      { p: 0.12, pos: [2.7, -0.2, -0.1], rot: [1.6, 2.2, -0.7] },  // Philosophy
      { p: 0.22, pos: [2.6, 0.4, -0.2], rot: [2.4, 3.0, 0.8] },   // Statement
      { p: 0.35, pos: [2.7, -0.2, -0.3], rot: [3.4, 4.1, 1.5] },  // Services
      { p: 0.50, pos: [2.6, 0.2, -0.3], rot: [4.8, 5.5, -1.3] },  // Locations
      { p: 0.68, pos: [2.7, -0.3, -0.3], rot: [6.4, 7.1, 2.1] },  // Team
      { p: 0.80, pos: [2.6, 0.2, -0.2], rot: [7.8, 8.4, -0.9] },  // Reviews & Giftcards
      { p: 0.90, pos: [2.7, 0.0, 0.0], rot: [9.6, 10.0, 1.7] },   // FAQ
      { p: 1.00, pos: [2.5, -0.3, 0.1], rot: [11.2, 11.5, 3.14] }, // Footer
    ];

    // 2. Comb Trajectory Milestones: STRICTLY ON THE LEFT FLANK (x < -2.5)
    const combMilestones = [
      { p: 0.00, pos: [-2.6, -0.3, 0.0], rot: [-0.2, 0.4, -0.4] },  // Hero
      { p: 0.12, pos: [-2.7, 0.2, -0.1], rot: [1.2, -1.8, 0.6] },   // Philosophy
      { p: 0.22, pos: [-2.6, -0.3, -0.2], rot: [2.0, -2.6, -0.7] }, // Statement
      { p: 0.35, pos: [-2.7, 0.2, -0.3], rot: [3.0, -3.6, -0.9] },  // Services
      { p: 0.50, pos: [-2.6, -0.2, -0.3], rot: [4.4, -5.0, 1.2] },  // Locations
      { p: 0.68, pos: [-2.7, 0.3, -0.3], rot: [6.0, -6.6, -1.3] },  // Team
      { p: 0.80, pos: [-2.6, -0.2, -0.2], rot: [7.6, -8.1, 0.9] },  // Reviews & Giftcards
      { p: 0.90, pos: [-2.7, 0.0, 0.0], rot: [9.1, -9.5, -1.1] },   // FAQ
      { p: 1.00, pos: [-2.5, -0.3, 0.1], rot: [10.8, -11.0, -2.8] },// Footer
    ];

    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 5.2 : 5.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const frontLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    frontLight.position.set(-5, 4, 6);
    scene.add(frontLight);

    const backRimLight = new THREE.DirectionalLight(0xaaccff, 1.8);
    backRimLight.position.set(0, -6, -4);
    scene.add(backRimLight);

    // Signature RendezVous Orange Rim Point Light
    const orangePointLight = new THREE.PointLight(0xff5e1e, 8.0, 45);
    orangePointLight.position.set(-4, 3, 3);
    scene.add(orangePointLight);

    // Warm Gold Highlight
    const goldPointLight = new THREE.PointLight(0xf5b74c, 5.5, 40);
    goldPointLight.position.set(5, -3, 3);
    scene.add(goldPointLight);

    const loader = new GLTFLoader();

    // 1. Load Scissors GLB
    loader.load(
      '/models/scissors.glb',
      (gltf) => {
        const root = gltf.scene;
        const scScale = isMobile ? 4.6 : 5.4;
        root.scale.set(scScale, scScale, scScale);

        const scissorsMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.98,
          roughness: 0.1,
          side: THREE.DoubleSide,
        });

        root.traverse((child) => {
          if (child.isMesh) {
            child.material = scissorsMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scissorsPivot = new THREE.Group();
        scissorsPivot.add(root);
        scene.add(scissorsPivot);
      },
      undefined,
      (err) => console.error('Error loading scissors:', err)
    );

    // 2. Load Comb GLB
    loader.load(
      '/models/lowpoly_sharp_comb.glb',
      (gltf) => {
        const root = gltf.scene;
        const cbScale = isMobile ? 0.54 : 0.62;
        root.scale.set(cbScale, cbScale, cbScale);

        const combMaterial = new THREE.MeshStandardMaterial({
          color: 0xe5a93c,
          metalness: 0.85,
          roughness: 0.16,
          side: THREE.DoubleSide,
        });

        root.traverse((child) => {
          if (child.isMesh) {
            child.material = combMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        combPivot = new THREE.Group();
        combPivot.add(root);
        scene.add(combPivot);
      },
      undefined,
      (err) => console.error('Error loading comb:', err)
    );

    const interpolateMilestones = (milestones, p, isComb = false) => {
      let i = 0;
      for (; i < milestones.length - 1; i++) {
        if (p <= milestones[i + 1].p) break;
      }
      const k1 = milestones[i];
      const k2 = milestones[Math.min(i + 1, milestones.length - 1)];

      const segmentDuration = k2.p - k1.p || 0.0001;
      const localT = (p - k1.p) / segmentDuration;
      const easedT = localT * localT * (3 - 2 * localT);

      const xFactor = isMobile ? 0.46 : 1.0;
      const mobileHeroYOffset = isMobile && p < 0.12 ? (isComb ? -0.35 : 0.35) : 0;
      return {
        x: (k1.pos[0] + (k2.pos[0] - k1.pos[0]) * easedT) * xFactor,
        y: k1.pos[1] + (k2.pos[1] - k1.pos[1]) * easedT + mobileHeroYOffset,
        z: k1.pos[2] + (k2.pos[2] - k1.pos[2]) * easedT,
        rotX: k1.rot[0] + (k2.rot[0] - k1.rot[0]) * easedT,
        rotY: k1.rot[1] + (k2.rot[1] - k1.rot[1]) * easedT,
        rotZ: k1.rot[2] + (k2.rot[2] - k1.rot[2]) * easedT,
      };
    };

    const updateTrajectories = (p) => {
      const sc = interpolateMilestones(scissorsMilestones, p, false);
      scTargetX = sc.x;
      scTargetY = sc.y;
      scTargetZ = sc.z;
      scTargetRotX = sc.rotX;
      scTargetRotY = sc.rotY;
      scTargetRotZ = sc.rotZ;

      const cb = interpolateMilestones(combMilestones, p, true);
      cbTargetX = cb.x;
      cbTargetY = cb.y;
      cbTargetZ = cb.z;
      cbTargetRotX = cb.rotX;
      cbTargetRotY = cb.rotY;
      cbTargetRotZ = cb.rotZ;
    };

    // No dynamic z-index needed — CSS handles stacking:
    // Canvas z-index: 2 (always), section content z-index: 3, cards z-index: 5

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      targetScroll = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

      const delta = scrollY - lastScrollY;
      scrollVelocity = delta * 0.008;
      lastScrollY = scrollY;

    };

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      isMobile = window.innerWidth < 768;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = isMobile ? 5.2 : 5.5;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    let animationId;
    let time = 0;

    const animate = () => {
      time += 0.016;
      currentScroll += (targetScroll - currentScroll) * 0.09;
      updateTrajectories(currentScroll);
      scrollVelocity *= 0.92;

      // 1. Animate 3D Scissors (Gunting)
      if (scissorsPivot) {
        const floatY = Math.sin(time * 2.2) * 0.12;
        const floatX = Math.cos(time * 1.6) * 0.08;
        const velocityOffset = -scrollVelocity * 1.5;

        scissorsPivot.position.x += (scTargetX + floatX + mouseX * 0.25 - scissorsPivot.position.x) * 0.08;
        scissorsPivot.position.y += (scTargetY + floatY + velocityOffset - mouseY * 0.25 - scissorsPivot.position.y) * 0.08;
        scissorsPivot.position.z += (scTargetZ - scissorsPivot.position.z) * 0.08;

        const dynamicTumbleX = scTargetRotX + scrollVelocity * 4.5 + Math.sin(time * 1.5) * 0.1;
        const dynamicTumbleY = scTargetRotY + targetScroll * Math.PI * 4.5 + Math.cos(time * 1.8) * 0.12;
        const dynamicTumbleZ = scTargetRotZ + scrollVelocity * 3.0 + mouseX * 0.3;

        scissorsPivot.rotation.x += (dynamicTumbleX - scissorsPivot.rotation.x) * 0.07;
        scissorsPivot.rotation.y += (dynamicTumbleY - scissorsPivot.rotation.y) * 0.07;
        scissorsPivot.rotation.z += (dynamicTumbleZ - scissorsPivot.rotation.z) * 0.07;
      }

      // 2. Animate 3D Barber Comb (Sisir)
      if (combPivot) {
        const floatY = Math.cos(time * 2.0) * 0.12;
        const floatX = Math.sin(time * 1.4) * 0.08;
        const velocityOffset = -scrollVelocity * 1.3;

        combPivot.position.x += (cbTargetX + floatX + mouseX * 0.2 - combPivot.position.x) * 0.08;
        combPivot.position.y += (cbTargetY + floatY + velocityOffset - mouseY * 0.2 - combPivot.position.y) * 0.08;
        combPivot.position.z += (cbTargetZ - combPivot.position.z) * 0.08;

        const dynamicTumbleX = cbTargetRotX - scrollVelocity * 4.0 + Math.cos(time * 1.4) * 0.1;
        const dynamicTumbleY = cbTargetRotY - targetScroll * Math.PI * 4.0 + Math.sin(time * 1.7) * 0.12;
        const dynamicTumbleZ = cbTargetRotZ - scrollVelocity * 2.8 - mouseX * 0.25;

        combPivot.rotation.x += (dynamicTumbleX - combPivot.rotation.x) * 0.07;
        combPivot.rotation.y += (dynamicTumbleY - combPivot.rotation.y) * 0.07;
        combPivot.rotation.z += (dynamicTumbleZ - combPivot.rotation.z) * 0.07;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div id="threeScissorsCanvas" className="three-scissors-canvas" ref={containerRef} aria-hidden="true" />;
}
