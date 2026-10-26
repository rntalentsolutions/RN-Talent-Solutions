(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 800px)').matches;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
  script.async = true;
  script.onload = () => {
    if (!window.THREE) return;
    document.querySelectorAll('[data-three-scene]').forEach((host, index) => {
      if (host.dataset.threeReady === 'true') return;
      host.dataset.threeReady = 'true';
      const THREE = window.THREE;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance'
        });
      } catch (err) {
        host.classList.add('three-fallback');
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.8));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = 'three-canvas';
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 10);
      const group = new THREE.Group();
      scene.add(group);

      const gold = new THREE.MeshStandardMaterial({
        color: 0xe5c477, metalness: 0.78, roughness: 0.28,
        emissive: 0x6b4a17, emissiveIntensity: 0.16
      });
      const blue = new THREE.MeshStandardMaterial({
        color: 0x254968, metalness: 0.35, roughness: 0.38,
        emissive: 0x102b46, emissiveIntensity: 0.35
      });
      const lightBlue = new THREE.MeshStandardMaterial({
        color: 0x8fc5e5, metalness: 0.5, roughness: 0.3,
        emissive: 0x1a5a80, emissiveIntensity: 0.4
      });
      const lineMat = new THREE.LineBasicMaterial({ color: 0xd9bd7b, transparent: true, opacity: 0.56 });
      const faintLineMat = new THREE.LineBasicMaterial({ color: 0x8cb1ce, transparent: true, opacity: 0.27 });

      // The core is a physically lit sphere with a fine network shell.
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(2.02, 64, 48), blue);
      group.add(sphere);
      const wire = new THREE.Mesh(
        new THREE.SphereGeometry(2.045, 32, 22),
        new THREE.MeshBasicMaterial({ color: 0x82abc9, wireframe: true, transparent: true, opacity: 0.16 })
      );
      group.add(wire);

      // Latitude and longitude rings make the globe feel dimensional.
      const ringGroup = new THREE.Group();
      group.add(ringGroup);
      [0, Math.PI / 4, -Math.PI / 4].forEach((rotation, i) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(2.06, i === 0 ? 0.012 : 0.008, 8, 160),
          i === 0 ? lineMat : faintLineMat
        );
        ring.rotation.x = Math.PI / 2 + rotation;
        ring.rotation.y = i * 0.45;
        ringGroup.add(ring);
      });
      [0, Math.PI / 3, -Math.PI / 3].forEach((rotation, i) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(2.065, 0.008, 8, 160),
          faintLineMat
        );
        ring.rotation.y = Math.PI / 2 + rotation;
        ring.rotation.x = i * 0.24;
        ringGroup.add(ring);
      });

      // Orbit paths at different 3D angles.
      const orbitGroup = new THREE.Group();
      group.add(orbitGroup);
      const orbitDefs = [
        { rx: 3.1, ry: 1.08, rz: -0.38, speed: 0.28, color: lineMat },
        { rx: 3.45, ry: 1.42, rz: 0.72, speed: -0.2, color: faintLineMat },
        { rx: 2.82, ry: 1.72, rz: 1.04, speed: 0.16, color: faintLineMat }
      ];
      const orbitObjects = [];
      orbitDefs.forEach((def, i) => {
        const points = [];
        for (let j = 0; j <= 220; j++) {
          const t = j / 220 * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(t) * def.rx, Math.sin(t) * def.ry, 0));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const orbit = new THREE.Line(curve, def.color);
        orbit.rotation.set(def.rx * 0.1, def.ry * 0.15, def.rz);
        orbitGroup.add(orbit);
        orbitObjects.push({ orbit, def });
      });

      // Floating nodes connected by fine lines.
      const nodePositions = [];
      const nodeCount = isMobile ? 26 : 46;
      for (let i = 0; i < nodeCount; i++) {
        const u = (i + 0.5) / nodeCount;
        const y = 1 - 2 * u;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const phi = i * Math.PI * (3 - Math.sqrt(5));
        const p = new THREE.Vector3(Math.cos(phi) * r * 2.09, y * 2.09, Math.sin(phi) * r * 2.09);
        nodePositions.push(p);
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(i % 7 === 0 ? 0.055 : 0.028, 12, 10),
          i % 4 === 0 ? gold : lightBlue
        );
        node.position.copy(p);
        group.add(node);
      }
      const connectionPoints = [];
      nodePositions.forEach((p, i) => {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const q = nodePositions[j];
          if (p.distanceTo(q) < (isMobile ? 1.0 : 0.82) && connectionPoints.length < 180) {
            connectionPoints.push(p.clone(), q.clone());
          }
        }
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints(connectionPoints);
      const connections = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
        color: 0x9fc2dc, transparent: true, opacity: 0.22
      }));
      group.add(connections);

      // Gold 3D centerpiece monogram made from extruded text-like geometry.
      const badge = new THREE.Group();
      const badgeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.82, 0.16, 64), gold);
      badgeDisc.rotation.x = Math.PI / 2;
      badge.add(badgeDisc);
      const badgeInner = new THREE.Mesh(new THREE.CircleGeometry(0.69, 64), new THREE.MeshStandardMaterial({
        color: 0x11243a, metalness: 0.3, roughness: 0.42
      }));
      badgeInner.position.z = 0.09;
      badge.add(badgeInner);
      // RN monogram rendered as canvas texture for sharp readable letters.
      const logoCanvas = document.createElement('canvas');
      logoCanvas.width = 512; logoCanvas.height = 256;
      const ctx = logoCanvas.getContext('2d');
      ctx.clearRect(0, 0, 512, 256);
      ctx.font = '800 170px Manrope, Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f4d993';
      ctx.fillText('RN', 256, 126);
      const texture = new THREE.CanvasTexture(logoCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(1.16, 0.58),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
      );
      logo.position.z = 0.13;
      badge.add(logo);
      group.add(badge);

      // Ambient star field gives the hero a deep cinematic background.
      const starVertices = [];
      for (let i = 0; i < (isMobile ? 180 : 340); i++) {
        starVertices.push((Math.random() - 0.5) * 13, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 5 - 1);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
        color: 0x9ab7d1, size: 0.018, transparent: true, opacity: 0.58
      }));
      scene.add(stars);

      const ambient = new THREE.AmbientLight(0xa8c7e1, 1.15);
      scene.add(ambient);
      const keyLight = new THREE.PointLight(0xf0d99e, 34, 24);
      keyLight.position.set(3.5, 4, 5);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0x4b9ad1, 25, 20);
      rimLight.position.set(-4, -1, -3);
      scene.add(rimLight);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      if (!reducedMotion) {
        host.addEventListener('pointermove', event => {
          const rect = host.getBoundingClientRect();
          pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7;
          pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.45;
        }, { passive: true });
        host.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; }, { passive: true });
      }

      const resize = () => {
        const w = Math.max(1, host.clientWidth);
        const h = Math.max(1, host.clientHeight);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.z = w < 500 ? 10.8 : (w < 800 ? 9.7 : 8.8);
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);
      resize();

      const clock = new THREE.Clock();
      let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        if (!reducedMotion) {
          group.rotation.y = t * 0.095 + pointer.x * 0.24;
          group.rotation.x = Math.sin(t * 0.22) * 0.055 + pointer.y * 0.16;
          ringGroup.rotation.y = -t * 0.045;
          orbitGroup.rotation.y = t * 0.07;
          orbitObjects.forEach(({ orbit, def }, i) => {
            orbit.rotation.z = def.rz + Math.sin(t * def.speed + i) * 0.08;
          });
          stars.rotation.y = t * 0.006;
          pointer.x += (pointer.tx - pointer.x) * 0.035;
          pointer.y += (pointer.ty - pointer.y) * 0.035;
        }
        renderer.render(scene, camera);
      };
      animate();

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else if (!reducedMotion) animate();
        else renderer.render(scene, camera);
      });
    });
  };
  document.head.appendChild(script);
})();