/**
 * Three.js utility functions
 */

import * as THREE from 'three';

/**
 * Check if WebGL is supported
 * @returns {boolean} Whether WebGL is supported
 */
export function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/**
 * Create a particle system
 * @param {Object} options - Options for the particle system
 * @param {number} options.count - Number of particles
 * @param {number} options.size - Size of particles
 * @param {THREE.Color} options.color - Color of particles
 * @param {number} options.opacity - Opacity of particles
 * @param {number} options.maxDistance - Maximum distance of particles from center
 * @returns {THREE.Points} Particle system
 */
export function createParticleSystem(options = {}) {
  const {
    count = 1000,
    size = 0.1,
    color = new THREE.Color(0xffffff),
    opacity = 0.7,
    maxDistance = 50
  } = options;
  
  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * maxDistance;
    positions[i3 + 1] = (Math.random() - 0.5) * maxDistance;
    positions[i3 + 2] = (Math.random() - 0.5) * maxDistance;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Create material
  const material = new THREE.PointsMaterial({
    size,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });
  
  // Create points
  const particles = new THREE.Points(geometry, material);
  
  return particles;
}

/**
 * Create a complex particle system with varied sizes and colors
 * @param {Object} options - Options for the particle system
 * @param {number} options.count - Number of particles
 * @param {Array<number>} options.sizes - Array of possible particle sizes
 * @param {Array<THREE.Color>} options.colors - Array of possible particle colors
 * @param {number} options.opacity - Opacity of particles
 * @param {number} options.maxDistance - Maximum distance of particles from center
 * @returns {THREE.Points} Particle system
 */
export function createComplexParticleSystem(options = {}) {
  const {
    count = 1000,
    sizes = [0.05, 0.1, 0.15, 0.2],
    colors = [
      new THREE.Color(0x4285f4),
      new THREE.Color(0x34a853),
      new THREE.Color(0xfbbc05),
      new THREE.Color(0xea4335)
    ],
    opacity = 0.7,
    maxDistance = 50
  } = options;
  
  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes_array = new Float32Array(count);
  const colors_array = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Position
    positions[i3] = (Math.random() - 0.5) * maxDistance;
    positions[i3 + 1] = (Math.random() - 0.5) * maxDistance;
    positions[i3 + 2] = (Math.random() - 0.5) * maxDistance;
    
    // Size
    sizes_array[i] = sizes[Math.floor(Math.random() * sizes.length)];
    
    // Color
    const color = colors[Math.floor(Math.random() * colors.length)];
    colors_array[i3] = color.r;
    colors_array[i3 + 1] = color.g;
    colors_array[i3 + 2] = color.b;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes_array, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors_array, 3));
  
  // Create shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: new THREE.TextureLoader().load('assets/images/particle.png') }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
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
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  // Create points
  const particles = new THREE.Points(geometry, material);
  
  return particles;
}

/**
 * Create a case study card with 3D effect
 * @param {HTMLElement} element - The element to apply the 3D effect to
 * @param {Object} options - Options for the 3D effect
 * @param {number} options.depth - Depth of the 3D effect
 * @param {number} options.sensitivity - Sensitivity of the 3D effect
 * @param {number} options.perspective - Perspective value for the 3D effect
 * @param {number} options.layerDistance - Distance between layers
 * @param {number} options.transitionDuration - Duration of the transition
 */
export function createCaseStudyCard3D(element, options = {}) {
  if (!element) return;
  
  const {
    depth = 30,
    sensitivity = 30,
    perspective = 800,
    layerDistance = 5,
    transitionDuration = 0.5
  } = options;
  
  // Set perspective
  element.style.perspective = `${perspective}px`;
  
  // Get layers
  const image = element.querySelector('.portfolio-item-image');
  const content = element.querySelector('.portfolio-item-content');
  
  if (!image || !content) return;
  
  // Set initial styles
  element.style.transformStyle = 'preserve-3d';
  image.style.transform = 'translateZ(0)';
  content.style.transform = 'translateZ(0)';
  
  // Set transition
  element.style.transition = `transform ${transitionDuration}s ease-out`;
  image.style.transition = `transform ${transitionDuration}s ease-out`;
  content.style.transition = `transform ${transitionDuration}s ease-out`;
  
  // Calculate bounds
  let bounds = element.getBoundingClientRect();
  
  // Add resize event listener
  window.addEventListener('resize', () => {
    bounds = element.getBoundingClientRect();
  });
  
  // Add mouse move event listener
  element.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    const percentX = (mouseX - centerX) / (bounds.width / 2);
    const percentY = (mouseY - centerY) / (bounds.height / 2);
    
    const rotateY = percentX * (sensitivity / 10);
    const rotateX = -percentY * (sensitivity / 10);
    
    element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    image.style.transform = `translateZ(${depth}px)`;
    content.style.transform = `translateZ(${depth - layerDistance}px)`;
  });
  
  // Add mouse leave event listener
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'rotateX(0) rotateY(0)';
    image.style.transform = 'translateZ(0)';
    content.style.transform = 'translateZ(0)';
  });
}

/**
 * Create a testimonial card with 3D effect
 * @param {HTMLElement} element - The element to apply the 3D effect to
 * @param {Object} options - Options for the 3D effect
 * @param {number} options.depth - Depth of the 3D effect
 * @param {number} options.sensitivity - Sensitivity of the 3D effect
 * @param {number} options.perspective - Perspective value for the 3D effect
 * @param {number} options.rotationFactor - Factor to adjust rotation amount
 * @param {number} options.transitionDuration - Duration of the transition
 */
export function createTestimonialCard3D(element, options = {}) {
  if (!element) return;
  
  const {
    depth = 20,
    sensitivity = 20,
    perspective = 800,
    rotationFactor = 0.5,
    transitionDuration = 0.3
  } = options;
  
  // Set perspective
  element.style.perspective = `${perspective}px`;
  element.style.transformStyle = 'preserve-3d';
  
  // Set transition
  element.style.transition = `transform ${transitionDuration}s ease-out`;
  
  // Calculate bounds
  let bounds = element.getBoundingClientRect();
  
  // Add resize event listener
  window.addEventListener('resize', () => {
    bounds = element.getBoundingClientRect();
  });
  
  // Add mouse move event listener
  element.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    const percentX = (mouseX - centerX) / (bounds.width / 2);
    const percentY = (mouseY - centerY) / (bounds.height / 2);
    
    const rotateY = percentX * (sensitivity / 10) * rotationFactor;
    const rotateX = -percentY * (sensitivity / 10) * rotationFactor;
    
    element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${depth}px)`;
  });
  
  // Add mouse leave event listener
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
  });
}

/**
 * Create a team member card with 3D effect
 * @param {HTMLElement} element - The element to apply the 3D effect to
 * @param {Object} options - Options for the 3D effect
 * @param {number} options.depth - Depth of the 3D effect
 * @param {number} options.sensitivity - Sensitivity of the 3D effect
 * @param {number} options.perspective - Perspective value for the 3D effect
 * @param {number} options.layerDistance - Distance between layers
 * @param {number} options.transitionDuration - Duration of the transition
 */
export function createTeamMemberCard3D(element, options = {}) {
  if (!element) return;
  
  const {
    depth = 20,
    sensitivity = 20,
    perspective = 800,
    layerDistance = 5,
    transitionDuration = 0.3
  } = options;
  
  // Set perspective
  element.style.perspective = `${perspective}px`;
  
  // Get layers
  const image = element.querySelector('.team-member-image');
  const content = element.querySelector('.team-member-content');
  
  if (!image || !content) return;
  
  // Set initial styles
  element.style.transformStyle = 'preserve-3d';
  image.style.transform = 'translateZ(0)';
  content.style.transform = 'translateZ(0)';
  
  // Set transition
  element.style.transition = `transform ${transitionDuration}s ease-out`;
  image.style.transition = `transform ${transitionDuration}s ease-out`;
  content.style.transition = `transform ${transitionDuration}s ease-out`;
  
  // Calculate bounds
  let bounds = element.getBoundingClientRect();
  
  // Add resize event listener
  window.addEventListener('resize', () => {
    bounds = element.getBoundingClientRect();
  });
  
  // Add mouse move event listener
  element.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    
    const percentX = (mouseX - centerX) / (bounds.width / 2);
    const percentY = (mouseY - centerY) / (bounds.height / 2);
    
    const rotateY = percentX * (sensitivity / 10);
    const rotateX = -percentY * (sensitivity / 10);
    
    element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    image.style.transform = `translateZ(${depth}px)`;
    content.style.transform = `translateZ(${depth - layerDistance}px)`;
  });
  
  // Add mouse leave event listener
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'rotateX(0) rotateY(0)';
    image.style.transform = 'translateZ(0)';
    content.style.transform = 'translateZ(0)';
  });
}