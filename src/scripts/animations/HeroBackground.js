import * as THREE from 'three';
import { gsap } from 'gsap';
import { createParticleSystem, createComplexParticleSystem } from '../utils/three-utils';

/**
 * Hero Background Animation
 * A particle system that reacts to mouse movement
 */
export class HeroBackground {
  constructor(container, options = {}) {
    // Store container
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    if (!this.container) {
      console.error('Container not found');
      return;
    }
    
    // Store options
    this.options = {
      scale: options.scale || 1,
      particleDensity: options.particleDensity || 1,
      quality: options.quality || 'high',
      colorScheme: options.colorScheme || 'default',
      ...options
    };
    
    // Initialize scene
    this.init();
    
    // Start animation loop
    this.startAnimation();
    
    // Add event listeners
    this.addEventListeners();
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 100;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container.querySelector('canvas'),
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (!this.container.querySelector('canvas')) {
      this.container.appendChild(this.renderer.domElement);
    }
    
    // Create particle system
    this.createComplexParticleSystem();
    
    // Create floating 3D object
    this.createFloatingObject();
    
    // Set up mouse tracking
    this.mouse = new THREE.Vector2(0, 0);
    this.mousePosition3D = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
    
    // Create light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }
  
  createParticles() {
    // Calculate particle count based on density and quality
    let particleCount = Math.floor(1000 * this.options.particleDensity);
    
    if (this.options.quality === 'low') {
      particleCount = Math.floor(particleCount * 0.3);
    } else if (this.options.quality === 'medium') {
      particleCount = Math.floor(particleCount * 0.6);
    }
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    // Define color scheme
    let colorOptions;
    if (this.options.colorScheme === 'default') {
      colorOptions = [
        new THREE.Color(0x4285f4), // Blue
        new THREE.Color(0x34a853), // Green
        new THREE.Color(0xfbbc05), // Yellow
        new THREE.Color(0xea4335)  // Red
      ];
    } else if (this.options.colorScheme === 'cool') {
      colorOptions = [
        new THREE.Color(0x0088ff), // Blue
        new THREE.Color(0x00aaff), // Light Blue
        new THREE.Color(0x00ffcc), // Teal
        new THREE.Color(0x88ddff)  // Sky Blue
      ];
    } else if (this.options.colorScheme === 'warm') {
      colorOptions = [
        new THREE.Color(0xff3300), // Orange-Red
        new THREE.Color(0xff8800), // Orange
        new THREE.Color(0xffcc00), // Yellow
        new THREE.Color(0xff5500)  // Red-Orange
      ];
    } else if (this.options.colorScheme === 'monochrome') {
      colorOptions = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xcccccc), // Light Gray
        new THREE.Color(0xaaaaaa), // Gray
        new THREE.Color(0xdddddd)  // Silver
      ];
    }
    
    const maxDistance = 100 * this.options.scale;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * maxDistance * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * maxDistance * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * maxDistance * 2;
      
      // Size
      sizes[i] = Math.random() * 3 + 0.5;
      
      // Color
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create shader material for better control
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load('assets/images/particle.png') },
        time: { value: 0.0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Add subtle animation based on time
          vec3 pos = position;
          pos.x += sin(pos.y * 0.05 + time * 0.5) * 2.0;
          pos.y += cos(pos.x * 0.05 + time * 0.5) * 2.0;
          pos.z += sin(pos.z * 0.05 + time * 0.5) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * pixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });
    
    // Create points
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    return this.particles;
  }
  
  createComplexParticleSystem() {
    // Calculate particle count based on density and quality
    let particleCount = Math.floor(2000 * this.options.particleDensity);
    
    if (this.options.quality === 'low') {
      particleCount = Math.floor(particleCount * 0.3);
    } else if (this.options.quality === 'medium') {
      particleCount = Math.floor(particleCount * 0.6);
    }
    
    // Define color scheme
    let colors;
    if (this.options.colorScheme === 'default') {
      colors = [0x4285f4, 0x34a853, 0xfbbc05, 0xea4335];
    } else if (this.options.colorScheme === 'cool') {
      colors = [0x0088ff, 0x00aaff, 0x00ffcc, 0x88ddff];
    } else if (this.options.colorScheme === 'warm') {
      colors = [0xff3300, 0xff8800, 0xffcc00, 0xff5500];
    } else if (this.options.colorScheme === 'monochrome') {
      colors = [0xffffff, 0xcccccc, 0xaaaaaa, 0xdddddd];
    }
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors_attr = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speed = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    const maxDistance = 150 * this.options.scale;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position with clusters
      const radius = Math.random() * maxDistance;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // Create cluster effect by adding random offsets
      const clusterFactor = Math.random() > 0.3 ? 1 : 0.3;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta) * clusterFactor;
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * clusterFactor;
      positions[i3 + 2] = radius * Math.cos(phi) * clusterFactor;
      
      // Color
      const colorIndex = Math.floor(Math.random() * colors.length);
      color.set(colors[colorIndex]);
      colors_attr[i3] = color.r;
      colors_attr[i3 + 1] = color.g;
      colors_attr[i3 + 2] = color.b;
      
      // Size with variation
      sizes[i] = Math.random() * 2.5 + 0.5;
      
      // Random speed for animation
      speed[i] = Math.random() * 0.1 + 0.05;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors_attr, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speed, 1));
    
    // Create shader material for better control
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load('assets/images/particle.png') },
        time: { value: 0.0 },
        mouse: { value: new THREE.Vector3(0, 0, 0) },
        pixelRatio: { value: window.devicePixelRatio },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute float speed;
        varying vec3 vColor;
        uniform float time;
        uniform vec3 mouse;
        uniform float pixelRatio;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          // First corner
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          // Permutations
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
          // Gradients: 7x7 points over a square, mapped onto an octahedron.
          // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
          float n_ = 0.142857142857; // 1.0/7.0
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        
        void main() {
          vColor = color;
          
          // Calculate noise based on position and time
          float noise = snoise(vec3(position.x * 0.02, position.y * 0.02, time * 0.1));
          
          // Add animation based on noise and time
          vec3 pos = position;
          pos.x += sin(time * speed + position.z * 0.05) * 2.0;
          pos.y += cos(time * speed + position.x * 0.05) * 2.0;
          pos.z += sin(time * speed * 0.5 + position.y * 0.05) * 2.0;
          
          // Add mouse interaction
          float distToMouse = distance(pos, mouse);
          float mouseFactor = smoothstep(30.0, 0.0, distToMouse);
          vec3 dir = normalize(pos - mouse);
          pos += dir * mouseFactor * 10.0;
          
          // Add noise displacement
          pos.x += noise * 5.0;
          pos.y += noise * 5.0;
          pos.z += noise * 5.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * pixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float opacity;
        varying vec3 vColor;
        
        void main() {
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          if (texColor.a < 0.1) discard;
          gl_FragColor = vec4(vColor, opacity) * texColor;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });
    
    // Create points
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    return this.particles;
  }
  
  createFloatingObject() {
    // Create a floating logo or 3D object
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4285f4,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    
    this.floatingObject = new THREE.Mesh(geometry, material);
    this.floatingObject.position.set(30, -20, -20);
    this.floatingObject.scale.set(0.5, 0.5, 0.5);
    this.floatingObject.visible = false; // Hide by default
    this.scene.add(this.floatingObject);
  }
  
  animate = () => {
    const time = performance.now() * 0.001;
    
    // Update shader uniforms
    if (this.particles.material.uniforms) {
      this.particles.material.uniforms.time.value = time;
      this.particles.material.uniforms.mouse.value = this.mousePosition3D;
    }
    
    // Animate floating object
    if (this.floatingObject && this.floatingObject.visible) {
      this.floatingObject.rotation.x = time * 0.2;
      this.floatingObject.rotation.y = time * 0.3;
      this.floatingObject.position.y = Math.sin(time * 0.5) * 2 - 20;
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
    
    // Continue animation loop
    this.animationFrameId = requestAnimationFrame(this.animate);
  }
  
  startAnimation() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }
  
  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  handleMouseMove = (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Setup raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Calculate intersection point with z-plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(plane, intersectionPoint);

    // Store 3D intersection point for particle interactions
    this.mousePosition3D.copy(intersectionPoint);
  }
  
  handleResize = () => {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Update shader uniform
    if (this.particles.material.uniforms) {
      this.particles.material.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }
  }
  
  addEventListeners() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('click', this.handleClick);
  }
  
  removeEventListeners() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('click', this.handleClick);
  }
  
  handleClick = (event) => {
    // Toggle floating object visibility on click
    if (this.floatingObject) {
      this.floatingObject.visible = !this.floatingObject.visible;
    }
  }
  
  updateConfig(options) {
    this.options = {
      ...this.options,
      ...options
    };
    
    // Recreate particles with new options
    this.scene.remove(this.particles);
    this.particles.geometry.dispose();
    this.particles.material.dispose();
    
    this.createComplexParticleSystem();
  }
  
  updateParallax(progress) {
    if (this.particles) {
      // Move particles based on scroll progress
      this.particles.position.y = progress * -50;
      this.particles.rotation.x = progress * 0.5;
    }
    
    if (this.floatingObject) {
      // Move floating object based on scroll progress
      this.floatingObject.position.y = -20 + progress * -30;
      this.floatingObject.rotation.x = progress * 1.0;
    }
  }
  
  show() {
    if (this.particles && this.particles.material.uniforms) {
      gsap.to(this.particles.material.uniforms.opacity, {
        value: 0.8,
        duration: 1
      });
    }
    
    if (this.floatingObject) {
      gsap.to(this.floatingObject.material, {
        opacity: 1,
        duration: 1,
        onStart: () => {
          this.floatingObject.visible = true;
          this.floatingObject.material.transparent = true;
        }
      });
    }
  }
  
  hide() {
    if (this.particles && this.particles.material.uniforms) {
      gsap.to(this.particles.material.uniforms.opacity, {
        value: 0,
        duration: 1
      });
    }
    
    if (this.floatingObject) {
      gsap.to(this.floatingObject.material, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          this.floatingObject.visible = false;
        }
      });
    }
  }
  
  setQuality(quality) {
    this.options.quality = quality;
    
    // Update particle system
    this.updateConfig({ quality });
  }
  
  setColorScheme(colorScheme) {
    this.options.colorScheme = colorScheme;
    
    // Update particle system
    this.updateConfig({ colorScheme });
  }
  
  showFloatingObject() {
    if (this.floatingObject) {
      this.floatingObject.visible = true;
      gsap.from(this.floatingObject.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)"
      });
    }
  }
  
  hideFloatingObject() {
    if (this.floatingObject) {
      gsap.to(this.floatingObject.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          this.floatingObject.visible = false;
        }
      });
    }
  }
  
  destroy() {
    // Stop animation
    this.stopAnimation();
    
    // Remove event listeners
    this.removeEventListeners();
    
    // Dispose resources
    this.scene.remove(this.particles);
    this.particles.geometry.dispose();
    this.particles.material.dispose();
    
    if (this.floatingObject) {
      this.scene.remove(this.floatingObject);
      this.floatingObject.geometry.dispose();
      this.floatingObject.material.dispose();
    }
    
    // Remove canvas from container
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export default HeroBackground;