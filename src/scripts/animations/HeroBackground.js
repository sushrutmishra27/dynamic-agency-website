import * as THREE from 'three';
import { createParticleSystem } from '../utils/three-utils';

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
    this.particles = this.createParticles();
    this.scene.add(this.particles);
    
    // Set up mouse tracking
    this.mouse = new THREE.Vector2(0, 0);
    this.mousePosition3D = new THREE.Vector3(0, 0, 0);
  }
  
  createParticles() {
    // Calculate particle count based on density
    const particleCount = Math.floor(1000 * this.options.particleDensity);
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x4285f4);
    const color2 = new THREE.Color(0x34a853);
    const color3 = new THREE.Color(0xfbbc05);
    const color4 = new THREE.Color(0xea4335);
    const colorOptions = [color1, color2, color3, color4];
    
    const maxDistance = 100 * this.options.scale;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * maxDistance * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * maxDistance * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * maxDistance * 2;
      
      // Size
      sizes[i] = Math.random() * 2 + 0.5;
      
      // Color
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create material
    const material = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    // Create points
    return new THREE.Points(geometry, material);
  }
  
  animate = () => {
    const time = performance.now() * 0.001;
    
    // Dynamic rotation based on time
    this.particles.rotation.x = Math.sin(time * 0.3) * 0.2;
    this.particles.rotation.y = Math.cos(time * 0.2) * 0.3;
    
    // Update particle system with wave patterns
    const positions = this.particles.geometry.attributes.position;
    
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
      const maxDistance = 100 * this.options.scale;
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
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouse, this.camera);

    // Calculate intersection point with z-plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);

    // Store 3D intersection point for particle interactions
    this.mousePosition3D = intersectionPoint;
  }
  
  handleResize = () => {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  addEventListeners() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);
  }
  
  removeEventListeners() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
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
    
    this.particles = this.createParticles();
    this.scene.add(this.particles);
  }
  
  updateParallax(progress) {
    if (this.particles) {
      // Move particles based on scroll progress
      this.particles.position.y = progress * -50;
      this.particles.rotation.x = progress * 0.5;
    }
  }
  
  show() {
    gsap.to(this.particles.material, {
      opacity: 0.8,
      duration: 1
    });
  }
  
  hide() {
    gsap.to(this.particles.material, {
      opacity: 0,
      duration: 1
    });
  }
  
  setQuality(quality) {
    if (quality === 'low') {
      // Reduce particle count
      this.updateConfig({
        particleDensity: 0.3
      });
    } else if (quality === 'medium') {
      this.updateConfig({
        particleDensity: 0.6
      });
    } else if (quality === 'high') {
      this.updateConfig({
        particleDensity: 1
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
    
    // Remove canvas from container
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export default HeroBackground;