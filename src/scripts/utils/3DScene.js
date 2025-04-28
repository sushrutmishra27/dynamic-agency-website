/**
 * Base class for all 3D scenes in the application
 * Handles common Three.js setup, performance monitoring, and responsive handling
 */

import * as THREE from 'three';
import { isWebGLSupported, optimizeScene } from './three-utils';
import { gsap } from 'gsap';

export class Scene3D {
  /**
   * Create a new 3D scene
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Scene options
   */
  constructor(container, options = {}) {
    // Store container
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    if (!this.container) {
      console.error('Scene3D: Container not found');
      return;
    }
    
    // Default options
    this.options = {
      // Camera options
      fov: 75,
      nearPlane: 0.1,
      farPlane: 1000,
      cameraPosition: { x: 0, y: 0, z: 100 },
      
      // Renderer options
      clearColor: 0x000000,
      clearAlpha: 0,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
      alpha: true,
      
      // Performance options
      autoOptimize: true,
      targetFPS: 60,
      quality: 'high', // 'low', 'medium', 'high'
      
      // Animation options
      autoStart: true,
      
      // Extend with provided options
      ...options
    };
    
    // Performance monitoring
    this.performance = {
      fps: 0,
      frameTime: 0,
      lastTime: performance.now(),
      frames: 0,
      lowFPSCounter: 0,
      quality: this.options.quality
    };
    
    // Animation state
    this.animationState = {
      running: false,
      frameId: null
    };
    
    // Mouse tracking
    this.mouse = {
      position: new THREE.Vector2(0, 0),
      normalized: new THREE.Vector2(0, 0),
      raycaster: null
    };
    
    // Initialize the scene
    this.init();
    
    // Start animation if autoStart is enabled
    if (this.options.autoStart) {
      this.startAnimation();
    }
  }
  
  /**
   * Initialize the scene
   * @private
   */
  init() {
    // Check WebGL support
    if (!isWebGLSupported()) {
      console.error('Scene3D: WebGL not supported');
      this.container.innerHTML = '<div class="webgl-error">WebGL is not supported on your device</div>';
      return;
    }
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      this.options.fov,
      this.container.clientWidth / this.container.clientHeight,
      this.options.nearPlane,
      this.options.farPlane
    );
    this.camera.position.set(
      this.options.cameraPosition.x,
      this.options.cameraPosition.y,
      this.options.cameraPosition.z
    );
    this.scene.add(this.camera);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.options.antialias,
      alpha: this.options.alpha
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(this.options.pixelRatio);
    this.renderer.setClearColor(this.options.clearColor, this.options.clearAlpha);
    
    // Find or create canvas
    const existingCanvas = this.container.querySelector('canvas');
    if (existingCanvas) {
      this.renderer.domElement = existingCanvas;
    } else {
      this.container.appendChild(this.renderer.domElement);
    }
    
    // Set up raycaster
    this.mouse.raycaster = new THREE.Raycaster();
    
    // Add event listeners
    this.addEventListeners();
    
    // Auto optimize scene if enabled
    if (this.options.autoOptimize) {
      this.optimizeScene();
    }
    
    // Initialize scene (to be implemented by subclasses)
    this.initScene();
  }
  
  /**
   * Initialize the scene content
   * To be implemented by subclasses
   */
  initScene() {
    // Default implementation - can be overridden by subclasses
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }
  
  /**
   * Add event listeners
   * @private
   */
  addEventListeners() {
    // Resize event
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Mouse events
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('click', this.handleClick.bind(this));
    
    // Touch events for mobile
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }
  
  /**
   * Remove event listeners
   * @private
   */
  removeEventListeners() {
    // Resize event
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    // Mouse events
    this.container.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.removeEventListener('click', this.handleClick.bind(this));
    
    // Touch events
    this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.container.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  /**
   * Handle window resize
   * @private
   */
  handleResize() {
    // Update camera aspect ratio
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Call resize handler in subclass if implemented
    if (typeof this.onResize === 'function') {
      this.onResize();
    }
  }
  
  /**
   * Handle mouse move
   * @param {MouseEvent} event - Mouse event
   * @private
   */
  handleMouseMove(event) {
    // Get container bounds
    const rect = this.container.getBoundingClientRect();
    
    // Update mouse position
    this.mouse.position.x = event.clientX - rect.left;
    this.mouse.position.y = event.clientY - rect.top;
    
    // Update normalized mouse position (-1 to 1)
    this.mouse.normalized.x = (this.mouse.position.x / this.container.clientWidth) * 2 - 1;
    this.mouse.normalized.y = -(this.mouse.position.y / this.container.clientHeight) * 2 + 1;
    
    // Update raycaster
    this.mouse.raycaster.setFromCamera(this.mouse.normalized, this.camera);
    
    // Call mouse move handler in subclass if implemented
    if (typeof this.onMouseMove === 'function') {
      this.onMouseMove(event);
    }
  }
  
  /**
   * Handle mouse click
   * @param {MouseEvent} event - Mouse event
   * @private
   */
  handleClick(event) {
    // Call click handler in subclass if implemented
    if (typeof this.onClick === 'function') {
      this.onClick(event);
    }
  }
  
  /**
   * Handle touch start
   * @param {TouchEvent} event - Touch event
   * @private
   */
  handleTouchStart(event) {
    if (event.touches.length > 0) {
      // Get container bounds
      const rect = this.container.getBoundingClientRect();
      
      // Update mouse position based on first touch
      this.mouse.position.x = event.touches[0].clientX - rect.left;
      this.mouse.position.y = event.touches[0].clientY - rect.top;
      
      // Update normalized mouse position (-1 to 1)
      this.mouse.normalized.x = (this.mouse.position.x / this.container.clientWidth) * 2 - 1;
      this.mouse.normalized.y = -(this.mouse.position.y / this.container.clientHeight) * 2 + 1;
      
      // Update raycaster
      this.mouse.raycaster.setFromCamera(this.mouse.normalized, this.camera);
    }
    
    // Call touch start handler in subclass if implemented
    if (typeof this.onTouchStart === 'function') {
      this.onTouchStart(event);
    }
  }
  
  /**
   * Handle touch move
   * @param {TouchEvent} event - Touch event
   * @private
   */
  handleTouchMove(event) {
    if (event.touches.length > 0) {
      // Get container bounds
      const rect = this.container.getBoundingClientRect();
      
      // Update mouse position based on first touch
      this.mouse.position.x = event.touches[0].clientX - rect.left;
      this.mouse.position.y = event.touches[0].clientY - rect.top;
      
      // Update normalized mouse position (-1 to 1)
      this.mouse.normalized.x = (this.mouse.position.x / this.container.clientWidth) * 2 - 1;
      this.mouse.normalized.y = -(this.mouse.position.y / this.container.clientHeight) * 2 + 1;
      
      // Update raycaster
      this.mouse.raycaster.setFromCamera(this.mouse.normalized, this.camera);
    }
    
    // Call touch move handler in subclass if implemented
    if (typeof this.onTouchMove === 'function') {
      this.onTouchMove(event);
    }
  }
  
  /**
   * Handle touch end
   * @param {TouchEvent} event - Touch event
   * @private
   */
  handleTouchEnd(event) {
    // Call touch end handler in subclass if implemented
    if (typeof this.onTouchEnd === 'function') {
      this.onTouchEnd(event);
    }
  }
  
  /**
   * Start animation loop
   */
  startAnimation() {
    if (!this.animationState.running) {
      this.animationState.running = true;
      this.animationState.frameId = requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  /**
   * Stop animation loop
   */
  stopAnimation() {
    if (this.animationState.running && this.animationState.frameId) {
      cancelAnimationFrame(this.animationState.frameId);
      this.animationState.running = false;
      this.animationState.frameId = null;
    }
  }
  
  /**
   * Animation loop
   * @private
   */
  animate() {
    // Calculate delta time
    const now = performance.now();
    const deltaTime = (now - this.performance.lastTime) / 1000;
    
    // Update performance metrics
    this.performance.frames++;
    if (now >= this.performance.lastTime + 1000) {
      this.performance.fps = this.performance.frames;
      this.performance.frameTime = (now - this.performance.lastTime) / this.performance.frames;
      this.performance.frames = 0;
      this.performance.lastTime = now;
      
      // Auto-adjust quality if performance is poor
      this.monitorPerformance();
    }
    
    // Call update method (to be implemented by subclasses)
    if (typeof this.update === 'function') {
      this.update(deltaTime);
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
    
    // Continue animation loop
    if (this.animationState.running) {
      this.animationState.frameId = requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  /**
   * Monitor performance and adjust quality if needed
   * @private
   */
  monitorPerformance() {
    // Check if FPS is below target
    if (this.performance.fps < this.options.targetFPS * 0.7) {
      this.performance.lowFPSCounter++;
      
      // If FPS is consistently low, reduce quality
      if (this.performance.lowFPSCounter >= 3) {
        this.reduceQuality();
        this.performance.lowFPSCounter = 0;
      }
    } else {
      this.performance.lowFPSCounter = 0;
    }
  }
  
  /**
   * Reduce quality to improve performance
   */
  reduceQuality() {
    if (this.performance.quality === 'high') {
      this.performance.quality = 'medium';
      this.setQuality('medium');
      console.log('Scene3D: Reduced quality to medium for better performance');
    } else if (this.performance.quality === 'medium') {
      this.performance.quality = 'low';
      this.setQuality('low');
      console.log('Scene3D: Reduced quality to low for better performance');
    }
  }
  
  /**
   * Set scene quality
   * @param {string} quality - Quality level ('low', 'medium', 'high')
   */
  setQuality(quality) {
    this.performance.quality = quality;
    
    // Adjust renderer pixel ratio
    if (quality === 'low') {
      this.renderer.setPixelRatio(1);
    } else if (quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    } else {
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
    
    // Call quality change handler in subclass if implemented
    if (typeof this.onQualityChange === 'function') {
      this.onQualityChange(quality);
    }
  }
  
  /**
   * Optimize scene based on device capabilities
   */
  optimizeScene() {
    // Use optimizeScene utility from three-utils
    optimizeScene(this.scene, {
      quality: this.performance.quality
    });
  }
  
  /**
   * Add object to scene
   * @param {THREE.Object3D} object - Object to add
   */
  add(object) {
    this.scene.add(object);
  }
  
  /**
   * Remove object from scene
   * @param {THREE.Object3D} object - Object to remove
   */
  remove(object) {
    this.scene.remove(object);
  }
  
  /**
   * Perform raycasting on objects
   * @param {Array<THREE.Object3D>} objects - Objects to test
   * @returns {Array<Object>} Intersection results
   */
  raycast(objects) {
    return this.mouse.raycaster.intersectObjects(objects, true);
  }
  
  /**
   * Create a tween animation using GSAP
   * @param {Object} target - Target object to animate
   * @param {Object} properties - Properties to animate
   * @param {Object} options - Animation options
   * @returns {gsap.core.Tween} GSAP tween
   */
  createTween(target, properties, options = {}) {
    return gsap.to(target, {
      ...properties,
      ...options
    });
  }
  
  /**
   * Show scene with fade-in animation
   * @param {Object} options - Animation options
   */
  show(options = {}) {
    const defaults = {
      duration: 1,
      ease: 'power2.out'
    };
    
    const config = { ...defaults, ...options };
    
    // Fade in renderer opacity
    if (this.renderer.domElement) {
      gsap.fromTo(
        this.renderer.domElement,
        { opacity: 0 },
        { opacity: 1, duration: config.duration, ease: config.ease }
      );
    }
  }
  
  /**
   * Hide scene with fade-out animation
   * @param {Object} options - Animation options
   */
  hide(options = {}) {
    const defaults = {
      duration: 1,
      ease: 'power2.in'
    };
    
    const config = { ...defaults, ...options };
    
    // Fade out renderer opacity
    if (this.renderer.domElement) {
      gsap.to(this.renderer.domElement, {
        opacity: 0,
        duration: config.duration,
        ease: config.ease
      });
    }
  }
  
  /**
   * Dispose scene and release resources
   */
  dispose() {
    // Stop animation
    this.stopAnimation();
    
    // Remove event listeners
    this.removeEventListeners();
    
    // Dispose scene objects
    this.scene.traverse((object) => {
      // Dispose geometries
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      // Dispose materials
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            disposeMaterial(material);
          });
        } else {
          disposeMaterial(object.material);
        }
      }
    });
    
    // Dispose renderer
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Helper function to dispose material and its textures
    function disposeMaterial(material) {
      // Dispose textures
      for (const key in material) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose();
        }
      }
      
      // Dispose material
      material.dispose();
    }
    
    // Clear scene
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    
    // Remove canvas from DOM
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    
    console.log('Scene3D: Disposed scene and released resources');
  }
}

export default Scene3D;