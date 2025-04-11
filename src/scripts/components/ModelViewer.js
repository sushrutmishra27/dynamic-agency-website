import * as THREE from 'three';
import { createScene, loadGLTFModel, createLights, createAnimationLoop } from '../utils/three-utils';

/**
 * 3D Model Viewer Component
 * Displays a 3D model with rotation and interaction
 */
export class ModelViewer {
  constructor(container, modelPath, options = {}) {
    // Store container and model path
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.modelPath = modelPath;
    
    // Default options
    this.options = {
      autoRotate: true,
      rotationSpeed: 0.005,
      backgroundColor: 0xffffff,
      interactive: true,
      scale: 1,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      lights: true,
      ...options,
    };
    
    if (!this.container) {
      console.error('Container not found');
      return;
    }
    
    // Initialize scene
    this.init();
    
    // Load model
    this.loadModel();
    
    // Start animation loop
    this.startAnimation();
    
    // Add event listeners
    if (this.options.interactive) {
      this.addEventListeners();
    }
  }
  
  init() {
    // Create scene
    const { scene, camera, renderer, controls } = createScene({
      container: this.container,
      cameraPosition: [0, 0, 5],
      backgroundColor: this.options.backgroundColor,
      useOrbitControls: this.options.interactive,
      alpha: true,
      antialias: true,
    });
    
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    
    // Add lights
    if (this.options.lights) {
      this.lights = createLights(this.scene, {
        ambientIntensity: 0.5,
        directionalIntensity: 0.8,
        directionalPosition: [5, 5, 5],
        addHelpers: false,
      });
    }
    
    // Create animation loop
    this.animationController = createAnimationLoop(() => this.animate());
    
    // Set up mouse tracking for interaction
    this.mouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();
    this.intersectedObject = null;
  }
  
  async loadModel() {
    try {
      // Show loading indicator
      this.showLoading();
      
      // Load model
      const gltf = await loadGLTFModel(this.modelPath);
      
      // Store model
      this.model = gltf.scene;
      
      // Apply scale, position, and rotation
      this.model.scale.set(
        this.options.scale,
        this.options.scale,
        this.options.scale
      );
      
      this.model.position.set(
        this.options.position[0],
        this.options.position[1],
        this.options.position[2]
      );
      
      this.model.rotation.set(
        this.options.rotation[0],
        this.options.rotation[1],
        this.options.rotation[2]
      );
      
      // Add model to scene
      this.scene.add(this.model);
      
      // Center camera on model
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Adjust camera position based on model size
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = this.camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5; // Add some margin
      
      this.camera.position.z = cameraZ;
      
      // Set controls target to model center
      if (this.controls) {
        this.controls.target.copy(center);
        this.controls.update();
      }
      
      // Hide loading indicator
      this.hideLoading();
      
      // Emit loaded event
      this.container.dispatchEvent(new CustomEvent('model-loaded'));
    } catch (error) {
      console.error('Error loading model:', error);
      this.hideLoading();
      this.showError();
    }
  }
  
  animate() {
    // Auto-rotate model if enabled
    if (this.options.autoRotate && this.model && !this.isDragging) {
      this.model.rotation.y += this.options.rotationSpeed;
    }
    
    // Update controls if interactive
    if (this.controls) {
      this.controls.update();
    }
    
    // Check for intersections if interactive
    if (this.options.interactive && this.model) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.model, true);
      
      if (intersects.length > 0) {
        if (this.intersectedObject !== intersects[0].object) {
          // Reset previous intersected object
          if (this.intersectedObject) {
            this.intersectedObject.material.emissive?.setHex(this.intersectedObject.currentHex || 0x000000);
          }
          
          // Set new intersected object
          this.intersectedObject = intersects[0].object;
          
          // Highlight intersected object if it has a material with emissive property
          if (this.intersectedObject.material && this.intersectedObject.material.emissive) {
            this.intersectedObject.currentHex = this.intersectedObject.material.emissive.getHex();
            this.intersectedObject.material.emissive.setHex(0x333333);
          }
          
          // Change cursor
          this.container.style.cursor = 'pointer';
        }
      } else {
        // Reset intersected object
        if (this.intersectedObject) {
          if (this.intersectedObject.material && this.intersectedObject.material.emissive) {
            this.intersectedObject.material.emissive.setHex(this.intersectedObject.currentHex || 0x000000);
          }
          this.intersectedObject = null;
          
          // Reset cursor
          this.container.style.cursor = 'auto';
        }
      }
    }
    
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
    // Get mouse position relative to container
    const rect = this.container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to normalized device coordinates
    this.mouse.x = (x / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -(y / this.container.clientHeight) * 2 + 1;
  }
  
  handleMouseDown() {
    this.isDragging = true;
  }
  
  handleMouseUp() {
    this.isDragging = false;
    
    // Trigger click event if intersected object exists
    if (this.intersectedObject) {
      this.container.dispatchEvent(new CustomEvent('model-click', {
        detail: {
          object: this.intersectedObject,
        },
      }));
    }
  }
  
  handleResize() {
    // Get container dimensions
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    // Update camera aspect ratio
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  addEventListeners() {
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  removeEventListeners() {
    this.container.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
  
  showLoading() {
    // Create loading indicator if it doesn't exist
    if (!this.loadingElement) {
      this.loadingElement = document.createElement('div');
      this.loadingElement.style.position = 'absolute';
      this.loadingElement.style.top = '50%';
      this.loadingElement.style.left = '50%';
      this.loadingElement.style.transform = 'translate(-50%, -50%)';
      this.loadingElement.style.color = '#ffffff';
      this.loadingElement.style.fontFamily = 'sans-serif';
      this.loadingElement.style.fontSize = '16px';
      this.loadingElement.style.textAlign = 'center';
      this.loadingElement.innerHTML = `
        <div class="loading-spinner"></div>
        <div style="margin-top: 10px;">Loading 3D Model...</div>
      `;
      
      // Add styles for loading spinner
      const style = document.createElement('style');
      style.textContent = `
        .loading-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `;
      document.head.appendChild(style);
      
      this.container.appendChild(this.loadingElement);
    }
    
    // Show loading indicator
    this.loadingElement.style.display = 'block';
  }
  
  hideLoading() {
    // Hide loading indicator
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }
  
  showError() {
    // Create error message if it doesn't exist
    if (!this.errorElement) {
      this.errorElement = document.createElement('div');
      this.errorElement.style.position = 'absolute';
      this.errorElement.style.top = '50%';
      this.errorElement.style.left = '50%';
      this.errorElement.style.transform = 'translate(-50%, -50%)';
      this.errorElement.style.color = '#ff0000';
      this.errorElement.style.fontFamily = 'sans-serif';
      this.errorElement.style.fontSize = '16px';
      this.errorElement.style.textAlign = 'center';
      this.errorElement.innerHTML = 'Error loading 3D model';
      
      this.container.appendChild(this.errorElement);
    }
    
    // Show error message
    this.errorElement.style.display = 'block';
  }
  
  hideError() {
    // Hide error message
    if (this.errorElement) {
      this.errorElement.style.display = 'none';
    }
  }
  
  destroy() {
    // Stop animation
    this.stopAnimation();
    
    // Remove event listeners
    this.removeEventListeners();
    
    // Dispose resources
    if (this.model) {
      this.scene.remove(this.model);
      this.model.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // Remove loading and error elements
    if (this.loadingElement) {
      this.container.removeChild(this.loadingElement);
    }
    
    if (this.errorElement) {
      this.container.removeChild(this.errorElement);
    }
    
    // Remove canvas from container
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export default ModelViewer;