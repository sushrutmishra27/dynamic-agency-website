/**
 * Three.js utility functions for 3D effects and animations
 */

import * as THREE from 'three';
import { hasTouch, getDeviceType } from './dom';

/**
 * Check if WebGL is supported
 * @returns {boolean} Whether WebGL is supported
 */
export function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/**
 * Create a 3D card effect for portfolio items
 * @param {HTMLElement} element - The element to add the 3D effect to
 * @param {Object} options - Options for the 3D effect
 */
export function createCaseStudyCard3D(element, options = {}) {
  if (!element || hasTouch()) return;
  
  const {
    depth = 30,
    sensitivity = 30,
    perspective = 800,
    layerDistance = 5,
    transitionDuration = 0.5
  } = options;
  
  // Set perspective on parent
  element.style.perspective = `${perspective}px`;
  
  // Get card elements
  const card = element;
  const image = element.querySelector('.portfolio-item-image');
  const content = element.querySelector('.portfolio-item-content');
  const title = element.querySelector('.portfolio-item-title');
  const category = element.querySelector('.portfolio-item-category');
  const description = element.querySelector('.portfolio-item-description');
  
  // Set initial styles
  card.style.transformStyle = 'preserve-3d';
  card.style.transition = `transform ${transitionDuration}s ease-out`;
  
  if (image) {
    image.style.transform = 'translateZ(0px)';
    image.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (content) {
    content.style.transform = 'translateZ(0px)';
    content.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (title) {
    title.style.transform = 'translateZ(0px)';
    title.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (category) {
    category.style.transform = 'translateZ(0px)';
    category.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (description) {
    description.style.transform = 'translateZ(0px)';
    description.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  // Add mouse move event listener
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * sensitivity / 5;
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * sensitivity / 5;
    
    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    if (image) {
      image.style.transform = `translateZ(${depth}px) scale(1.05)`;
    }
    
    if (content) {
      content.style.transform = `translateZ(${depth/2}px)`;
    }
    
    if (title) {
      title.style.transform = `translateZ(${depth/1.5}px)`;
    }
    
    if (category) {
      category.style.transform = `translateZ(${depth/2.5}px)`;
    }
    
    if (description) {
      description.style.transform = `translateZ(${depth/3}px)`;
    }
  });
  
  // Add mouse leave event listener
  element.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    
    if (image) {
      image.style.transform = 'translateZ(0px) scale(1)';
    }
    
    if (content) {
      content.style.transform = 'translateZ(0px)';
    }
    
    if (title) {
      title.style.transform = 'translateZ(0px)';
    }
    
    if (category) {
      category.style.transform = 'translateZ(0px)';
    }
    
    if (description) {
      description.style.transform = 'translateZ(0px)';
    }
  });
}

/**
 * Create a 3D card effect for testimonial cards
 * @param {HTMLElement} element - The element to add the 3D effect to
 * @param {Object} options - Options for the 3D effect
 */
export function createTestimonialCard3D(element, options = {}) {
  if (!element || hasTouch()) return;
  
  const {
    depth = 20,
    sensitivity = 20,
    perspective = 800,
    rotationFactor = 0.5,
    transitionDuration = 0.3
  } = options;
  
  // Set perspective on parent
  element.style.perspective = `${perspective}px`;
  
  // Get card elements
  const card = element;
  const quote = element.querySelector('.testimonial-quote');
  const clientInfo = element.querySelector('.client-info');
  const clientImage = element.querySelector('.client-image');
  const clientDetails = element.querySelector('.client-details');
  
  // Set initial styles
  card.style.transformStyle = 'preserve-3d';
  card.style.transition = `transform ${transitionDuration}s ease-out`;
  
  if (quote) {
    quote.style.transform = 'translateZ(0px)';
    quote.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (clientInfo) {
    clientInfo.style.transform = 'translateZ(0px)';
    clientInfo.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (clientImage) {
    clientImage.style.transform = 'translateZ(0px)';
    clientImage.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (clientDetails) {
    clientDetails.style.transform = 'translateZ(0px)';
    clientDetails.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  // Add mouse move event listener
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * sensitivity * rotationFactor;
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * sensitivity * rotationFactor;
    
    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    if (quote) {
      quote.style.transform = `translateZ(${depth}px)`;
    }
    
    if (clientInfo) {
      clientInfo.style.transform = `translateZ(${depth/1.5}px)`;
    }
    
    if (clientImage) {
      clientImage.style.transform = `translateZ(${depth/1.2}px)`;
    }
    
    if (clientDetails) {
      clientDetails.style.transform = `translateZ(${depth/1.8}px)`;
    }
  });
  
  // Add mouse leave event listener
  element.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    
    if (quote) {
      quote.style.transform = 'translateZ(0px)';
    }
    
    if (clientInfo) {
      clientInfo.style.transform = 'translateZ(0px)';
    }
    
    if (clientImage) {
      clientImage.style.transform = 'translateZ(0px)';
    }
    
    if (clientDetails) {
      clientDetails.style.transform = 'translateZ(0px)';
    }
  });
}

/**
 * Create a 3D card effect for pricing cards
 * @param {HTMLElement} element - The element to add the 3D effect to
 * @param {Object} options - Options for the 3D effect
 */
export function createPricingCard3D(element, options = {}) {
  if (!element || hasTouch()) return;
  
  const {
    depth = 30,
    rotationFactor = 0.5,
    shadowIntensity = 0.4,
    highlightColor = '#ffffff',
    perspective = 800,
    transitionDuration = 0.3
  } = options;
  
  // Set perspective on parent
  element.style.perspective = `${perspective}px`;
  
  // Get card elements
  const card = element;
  const header = element.querySelector('.card-header');
  const price = element.querySelector('.price-container');
  const features = element.querySelector('.features');
  const footer = element.querySelector('.card-footer');
  
  // Set initial styles
  card.style.transformStyle = 'preserve-3d';
  card.style.transition = `transform ${transitionDuration}s ease-out, box-shadow ${transitionDuration}s ease-out`;
  card.style.boxShadow = `0 10px 30px rgba(0, 0, 0, ${shadowIntensity / 2})`;
  
  if (header) {
    header.style.transform = 'translateZ(0px)';
    header.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (price) {
    price.style.transform = 'translateZ(0px)';
    price.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (features) {
    features.style.transform = 'translateZ(0px)';
    features.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (footer) {
    footer.style.transform = 'translateZ(0px)';
    footer.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  // Add mouse move event listener
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10 * rotationFactor;
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * 10 * rotationFactor;
    
    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    card.style.boxShadow = `
      0 ${15 + Math.abs(rotateX)}px ${30 + Math.abs(rotateX) * 2}px rgba(0, 0, 0, ${shadowIntensity}),
      ${rotateY * -1}px ${rotateX * -1}px ${Math.abs(rotateY) + Math.abs(rotateX)}px rgba(${highlightColor.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(', ')}, 0.1)
    `;
    
    if (header) {
      header.style.transform = `translateZ(${depth}px)`;
    }
    
    if (price) {
      price.style.transform = `translateZ(${depth/1.5}px)`;
    }
    
    if (features) {
      features.style.transform = `translateZ(${depth/2}px)`;
    }
    
    if (footer) {
      footer.style.transform = `translateZ(${depth/1.2}px)`;
    }
  });
  
  // Add mouse leave event listener
  element.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    card.style.boxShadow = `0 10px 30px rgba(0, 0, 0, ${shadowIntensity / 2})`;
    
    if (header) {
      header.style.transform = 'translateZ(0px)';
    }
    
    if (price) {
      price.style.transform = 'translateZ(0px)';
    }
    
    if (features) {
      features.style.transform = 'translateZ(0px)';
    }
    
    if (footer) {
      footer.style.transform = 'translateZ(0px)';
    }
  });
  
  // Return object with cleanup method
  return {
    dispose: () => {
      element.style.transform = '';
      element.style.transformStyle = '';
      element.style.transition = '';
      element.style.boxShadow = '';
      
      if (header) header.style.transform = '';
      if (price) price.style.transform = '';
      if (features) features.style.transform = '';
      if (footer) footer.style.transform = '';
      
      element.removeEventListener('mousemove', () => {});
      element.removeEventListener('mouseleave', () => {});
    }
  };
}

/**
 * Create a 3D card effect for team member cards
 * @param {HTMLElement} element - The element to add the 3D effect to
 * @param {Object} options - Options for the 3D effect
 */
export function createTeamMemberCard3D(element, options = {}) {
  if (!element || hasTouch()) return;
  
  const {
    depth = 20,
    sensitivity = 20,
    perspective = 800,
    layerDistance = 5,
    transitionDuration = 0.3
  } = options;
  
  // Set perspective on parent
  element.style.perspective = `${perspective}px`;
  
  // Get card elements
  const card = element;
  const image = element.querySelector('.team-member-image');
  const content = element.querySelector('.team-member-content');
  const name = element.querySelector('.team-member-name');
  const role = element.querySelector('.team-member-role');
  const social = element.querySelector('.team-member-social');
  
  // Set initial styles
  card.style.transformStyle = 'preserve-3d';
  card.style.transition = `transform ${transitionDuration}s ease-out`;
  
  if (image) {
    image.style.transform = 'translateZ(0px)';
    image.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (content) {
    content.style.transform = 'translateZ(0px)';
    content.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (name) {
    name.style.transform = 'translateZ(0px)';
    name.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (role) {
    role.style.transform = 'translateZ(0px)';
    role.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  if (social) {
    social.style.transform = 'translateZ(0px)';
    social.style.transition = `transform ${transitionDuration}s ease-out`;
  }
  
  // Add mouse move event listener
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * sensitivity / 5;
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * sensitivity / 5;
    
    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    if (image) {
      image.style.transform = `translateZ(${depth}px) scale(1.05)`;
    }
    
    if (content) {
      content.style.transform = `translateZ(${depth/2}px)`;
    }
    
    if (name) {
      name.style.transform = `translateZ(${depth/1.5}px)`;
    }
    
    if (role) {
      role.style.transform = `translateZ(${depth/2.5}px)`;
    }
    
    if (social) {
      social.style.transform = `translateZ(${depth/3}px)`;
    }
  });
  
  // Add mouse leave event listener
  element.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    
    if (image) {
      image.style.transform = 'translateZ(0px) scale(1)';
    }
    
    if (content) {
      content.style.transform = 'translateZ(0px)';
    }
    
    if (name) {
      name.style.transform = 'translateZ(0px)';
    }
    
    if (role) {
      role.style.transform = 'translateZ(0px)';
    }
    
    if (social) {
      social.style.transform = 'translateZ(0px)';
    }
  });
}

/**
 * Create a 3D particle system
 * @param {Object} options - Options for the particle system
 * @returns {THREE.Points} The particle system
 */
export function createParticleSystem(options = {}) {
  const {
    count = 1000,
    color = 0xffffff,
    size = 0.1,
    spread = 50,
    opacity = 0.8
  } = options;
  
  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread;
    positions[i3 + 2] = (Math.random() - 0.5) * spread;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Create material
  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  // Create points
  const particles = new THREE.Points(geometry, material);
  
  return particles;
}

/**
 * Create a complex particle system with color variation
 * @param {Object} options - Options for the particle system
 * @returns {THREE.Points} The particle system
 */
export function createComplexParticleSystem(options = {}) {
  const {
    count = 2000,
    colors = [0x0088ff, 0x8800ff, 0xff0088],
    minSize = 0.05,
    maxSize = 0.15,
    spread = 50,
    opacity = 0.6
  } = options;
  
  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors_attr = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  
  const color = new THREE.Color();
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Position
    positions[i3] = (Math.random() - 0.5) * spread;
    positions[i3 + 1] = (Math.random() - 0.5) * spread;
    positions[i3 + 2] = (Math.random() - 0.5) * spread;
    
    // Color
    const colorIndex = Math.floor(Math.random() * colors.length);
    color.set(colors[colorIndex]);
    colors_attr[i3] = color.r;
    colors_attr[i3 + 1] = color.g;
    colors_attr[i3 + 2] = color.b;
    
    // Size
    sizes[i] = Math.random() * (maxSize - minSize) + minSize;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors_attr, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create shader material for more control
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: new THREE.TextureLoader().load('assets/images/particle.png') },
      opacity: { value: opacity }
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
      uniform float opacity;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, opacity) * texture2D(pointTexture, gl_PointCoord);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true
  });
  
  // Create points
  const particles = new THREE.Points(geometry, material);
  
  return particles;
}

/**
 * Create a floating 3D object
 * @param {THREE.Object3D} object - The object to animate
 * @param {Object} options - Animation options
 */
export function createFloatingAnimation(object, options = {}) {
  const {
    amplitude = 0.1,
    speed = 0.5,
    rotationSpeed = 0.01
  } = options;
  
  let time = 0;
  
  // Animation function
  function animate() {
    time += 0.01;
    
    // Position animation
    object.position.y = Math.sin(time * speed) * amplitude;
    
    // Rotation animation
    object.rotation.y += rotationSpeed;
    
    // Request next frame
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
}

/**
 * Create a raycaster for mouse interaction with 3D objects
 * @param {THREE.Camera} camera - The camera
 * @param {HTMLElement} domElement - The DOM element for mouse events
 * @returns {THREE.Raycaster} The raycaster
 */
export function createRaycaster(camera, domElement) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Mouse move event listener
  function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const rect = domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);
  }
  
  // Add event listener
  domElement.addEventListener('mousemove', onMouseMove, false);
  
  // Return the raycaster
  return raycaster;
}

/**
 * Optimize 3D scene based on device capabilities
 * @param {THREE.Scene} scene - The scene to optimize
 * @param {Object} options - Optimization options
 */
export function optimizeScene(scene, options = {}) {
  const {
    maxParticles = 2000,
    minParticles = 500,
    maxLights = 3,
    minLights = 1,
    enableShadows = true
  } = options;
  
  // Get device type
  const deviceType = getDeviceType();
  
  // Optimize based on device type
  if (deviceType === 'mobile') {
    // Reduce particle count
    const particleSystems = scene.children.filter(child => child instanceof THREE.Points);
    particleSystems.forEach(particles => {
      const geometry = particles.geometry;
      const positions = geometry.attributes.position;
      const count = Math.min(positions.count, minParticles);
      
      // Update geometry
      const newPositions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        newPositions[i] = positions.array[i];
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    });
    
    // Reduce light count
    const lights = scene.children.filter(child => child instanceof THREE.Light);
    for (let i = minLights; i < lights.length; i++) {
      scene.remove(lights[i]);
    }
    
    // Disable shadows
    if (!enableShadows) {
      scene.traverse(object => {
        if (object instanceof THREE.Light) {
          object.castShadow = false;
        }
        if (object instanceof THREE.Object3D) {
          object.receiveShadow = false;
          object.castShadow = false;
        }
      });
    }
  }
}