import * as THREE from 'three';
import { createScene, createAnimationLoop, createParticleSystem } from '../utils/three-utils';

/**
 * Hero Background Animation
 * A particle system that reacts to mouse movement
 */
export class HeroBackground {
  constructor(container) {
    // Store container
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    if (!this.container) {
      console.error('Container not found');
      return;
    }
    
    // Initialize scene
    this.init();
    
    // Start animation loop
    this.startAnimation();
    
    // Add event listeners
    this.addEventListeners();
  }
  
  createComplexParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: this.getCustomVertexShader(),
      fragmentShader: this.getCustomFragmentShader(),
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffffff) },
        uSize: { value: 2.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geometry, material);
  }

  createFloatingLogo() {
    const logoGeometry = new THREE.PlaneGeometry(20, 20);
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('/path/to/logo.png'),
      transparent: true,
      opacity: 0.8
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.z = 10;
    return logo;
  }

  init() {
    // Create scene
    const { scene, camera, renderer } = createScene({
      container: this.container,
      cameraPosition: [0, 0, 100],
      backgroundColor: 0x000000,
      alpha: true,
      antialias: true,
    });
    
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    
    // Create particle system
    this.particles = createParticleSystem(this.scene, {
      count: 1000,
      size: { min: 0.2, max: 0.8 },
      color: {
        base: 0xffffff,
        variation: 0x333333
      },
      maxDistance: 100,
      customShader: {
        vertex: this.getCustomVertexShader(),
        fragment: this.getCustomFragmentShader()
      },
      opacity: { min: 0.4, max: 0.8 }
    });
    
    // Set up mouse tracking
    this.mouse = new THREE.Vector2(0, 0);
    
    // Create animation loop
    this.animationController = createAnimationLoop(() => this.animate());
  }
  
  animate() {
    const time = performance.now() * 0.001;
    
    // Dynamic rotation based on time
    this.particles.rotation.x = Math.sin(time * 0.3) * 0.2;
    this.particles.rotation.y = Math.cos(time * 0.2) * 0.3;
    
    // Update particle system with wave patterns
    const positions = this.particles.geometry.attributes.position;
    const sizes = this.particles.geometry.attributes.size;
    const colors = this.particles.geometry.attributes.color;
    
    for (let i = 0; i < positions.count; i++) {
      const i3 = i * 3;
      
      // Get current position
      const x = positions.array[i3];
      const y = positions.array[i3 + 1];
      const z = positions.array[i3 + 2];
      
      // Calculate distance to mouse
      const mouseX = this.mouse.x * 100;
      const mouseY = this.mouse.y * 100;
      
      // Apply subtle attraction to mouse position
      const dx = mouseX - x;
      const dy = mouseY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 30) {
        positions.array[i3] += dx * 0.01;
        positions.array[i3 + 1] += dy * 0.01;
      }
      
      // Add some random movement
      positions.array[i3] += (Math.random() - 0.5) * 0.1;
      positions.array[i3 + 1] += (Math.random() - 0.5) * 0.1;
      positions.array[i3 + 2] += (Math.random() - 0.5) * 0.1;
      
      // Keep particles within bounds
      const maxDistance = 100;
      if (Math.abs(positions.array[i3]) > maxDistance) {
        positions.array[i3] *= 0.95;
      }
      if (Math.abs(positions.array[i3 + 1]) > maxDistance) {
        positions.array[i3 + 1] *= 0.95;
      }
      if (Math.abs(positions.array[i3 + 2]) > maxDistance) {
        positions.array[i3 + 2] *= 0.95;
      }
    }
    
    positions.needsUpdate = true;
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  startAnimation() {
    this.animationController.start();
  }
  
  stopAnimation() {
    this.animationController.stop();
  }
  
  handleMouseMove(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Setup raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouse, this.camera);

    // Calculate intersection point with z-plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    // Store 3D intersection point for particle interactions
    this.mousePosition3D = intersectionPoint;
  }
  
  handleResize() {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  addEventListeners() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  removeEventListeners() {
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
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
    
    // Remove canvas from container
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export default HeroBackground;