/**
 * Utility functions for Three.js
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

/**
 * Create a basic Three.js scene
 * @param {Object} options - Scene options
 * @returns {Object} Scene, camera, renderer, and other objects
 */
export const createScene = (options = {}) => {
  const {
    container = document.body,
    cameraFov = 75,
    cameraNear = 0.1,
    cameraFar = 1000,
    cameraPosition = [0, 0, 5],
    backgroundColor = 0x000000,
    useOrbitControls = false,
    useResize = true,
    pixelRatio = Math.min(window.devicePixelRatio, 2),
    alpha = false,
    antialias = true,
    usePostProcessing = false,
  } = options;

  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    cameraFov,
    window.innerWidth / window.innerHeight,
    cameraNear,
    cameraFar
  );
  camera.position.set(...cameraPosition);
  scene.add(camera);

  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    alpha,
    antialias,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // Append canvas to container
  container.appendChild(renderer.domElement);

  // Create orbit controls
  let controls;
  if (useOrbitControls) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  // Create post-processing composer
  let composer;
  if (usePostProcessing) {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
  }

  // Handle resize
  if (useResize) {
    window.addEventListener('resize', () => {
      // Update camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Update composer
      if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
        composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });
  }

  // Return objects
  return {
    scene,
    camera,
    renderer,
    controls,
    composer,
  };
};

/**
 * Create a GLTF loader with Draco compression
 * @returns {GLTFLoader} GLTF loader
 */
export const createGLTFLoader = () => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  
  return gltfLoader;
};

/**
 * Load a GLTF model
 * @param {string} path - Path to the GLTF model
 * @returns {Promise} Promise that resolves with the loaded model
 */
export const loadGLTFModel = (path) => {
  const loader = createGLTFLoader();
  
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => resolve(gltf),
      (progress) => console.log('Loading model...', (progress.loaded / progress.total) * 100, '%'),
      (error) => reject(error)
    );
  });
};

/**
 * Load an environment map
 * @param {string} path - Path to the HDR environment map
 * @returns {Promise} Promise that resolves with the loaded environment map
 */
export const loadEnvironmentMap = (path) => {
  const rgbeLoader = new RGBELoader();
  
  return new Promise((resolve, reject) => {
    rgbeLoader.load(
      path,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        resolve(texture);
      },
      (progress) => console.log('Loading environment map...', (progress.loaded / progress.total) * 100, '%'),
      (error) => reject(error)
    );
  });
};

/**
 * Create lights for a scene
 * @param {THREE.Scene} scene - The scene to add lights to
 * @param {Object} options - Light options
 */
export const createLights = (scene, options = {}) => {
  const {
    ambientColor = 0xffffff,
    ambientIntensity = 0.5,
    directionalColor = 0xffffff,
    directionalIntensity = 0.8,
    directionalPosition = [5, 5, 5],
    addPointLights = false,
    pointLightPositions = [
      [-5, 2, 5],
      [5, 2, 5],
      [0, 5, -5]
    ],
    pointLightColors = [0xff0000, 0x00ff00, 0x0000ff],
    pointLightIntensity = 1,
    addHelpers = false,
  } = options;

  // Ambient light
  const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
  directionalLight.position.set(...directionalPosition);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);

  // Add point lights if enabled
  const pointLights = [];
  if (addPointLights) {
    pointLightPositions.forEach((position, index) => {
      const color = pointLightColors[index % pointLightColors.length];
      const pointLight = new THREE.PointLight(color, pointLightIntensity, 10, 2);
      pointLight.position.set(...position);
      pointLight.castShadow = true;
      scene.add(pointLight);
      pointLights.push(pointLight);
    });
  }

  // Add helpers
  if (addHelpers) {
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    scene.add(directionalLightHelper);

    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(directionalLightCameraHelper);

    if (addPointLights) {
      pointLights.forEach((light) => {
        const helper = new THREE.PointLightHelper(light, 0.5);
        scene.add(helper);
      });
    }
  }

  return {
    ambientLight,
    directionalLight,
    pointLights,
  };
};

/**
 * Create a simple animation loop
 * @param {Function} callback - Callback function for each frame
 * @returns {Object} Animation controller
 */
export const createAnimationLoop = (callback) => {
  let animationId = null;
  let running = false;
  let lastTime = 0;
  let fps = 0;
  let frameCount = 0;
  let frameTime = 0;

  const animate = (time) => {
    if (!running) return;
    
    animationId = requestAnimationFrame(animate);
    
    // Calculate FPS
    if (lastTime) {
      const delta = time - lastTime;
      frameTime += delta;
      frameCount++;
      
      if (frameTime >= 1000) {
        fps = Math.round((frameCount * 1000) / frameTime);
        frameCount = 0;
        frameTime = 0;
      }
    }
    
    lastTime = time;
    
    // Call callback with time and fps
    callback(time, fps);
  };

  const start = () => {
    if (running) return;
    
    running = true;
    lastTime = 0;
    animate(0);
  };

  const stop = () => {
    if (!running) return;
    
    running = false;
    cancelAnimationFrame(animationId);
  };

  return {
    start,
    stop,
    isRunning: () => running,
    getFPS: () => fps,
  };
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
export const degToRad = (degrees) => degrees * (Math.PI / 180);

/**
 * Convert radians to degrees
 * @param {number} radians - Radians
 * @returns {number} Degrees
 */
export const radToDeg = (radians) => radians * (180 / Math.PI);

/**
 * Check if WebGL is supported
 * @returns {boolean} Whether WebGL is supported
 */
export const isWebGLSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

/**
 * Get device GPU information
 * @returns {Object} GPU information
 */
export const getGPUInfo = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) {
    return {
      vendor: 'unknown',
      renderer: 'unknown',
    };
  }
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  
  if (!debugInfo) {
    return {
      vendor: 'unknown',
      renderer: 'unknown',
    };
  }
  
  return {
    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
  };
};

/**
 * Create a particle system with enhanced options
 * @param {THREE.Scene} scene - The scene to add the particle system to
 * @param {Object} options - Particle system options
 * @returns {THREE.Points} Particle system
 */
export const createParticleSystem = (scene, options = {}) => {
  const {
    count = 1000,
    size = 0.1,
    sizeVariation = 0,
    color = 0xffffff,
    colorVariation = false,
    colors = [0xff0000, 0x00ff00, 0x0000ff],
    maxDistance = 10,
    texture = null,
    blending = THREE.NormalBlending,
    transparent = true,
    opacity = 1,
    vertexColors = false,
    depthWrite = true,
    depthTest = true,
  } = options;

  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  
  // Create colors array if using color variation
  let colorsAttribute;
  if (colorVariation) {
    colorsAttribute = new Float32Array(count * 3);
  }
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Set random positions
    positions[i3] = (Math.random() - 0.5) * maxDistance;
    positions[i3 + 1] = (Math.random() - 0.5) * maxDistance;
    positions[i3 + 2] = (Math.random() - 0.5) * maxDistance;
    
    // Set random sizes if variation is enabled
    sizes[i] = size * (1 + (Math.random() - 0.5) * sizeVariation);
    
    // Set random colors if variation is enabled
    if (colorVariation && colorsAttribute) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = new THREE.Color(colors[colorIndex]);
      
      colorsAttribute[i3] = color.r;
      colorsAttribute[i3 + 1] = color.g;
      colorsAttribute[i3 + 2] = color.b;
    }
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  if (colorVariation && colorsAttribute) {
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsAttribute, 3));
  }

  // Create material
  const materialOptions = {
    size,
    sizeAttenuation: true,
    transparent,
    opacity,
    depthWrite,
    depthTest,
    blending,
  };
  
  if (texture) {
    materialOptions.map = texture;
    materialOptions.alphaTest = 0.001;
  }
  
  if (colorVariation) {
    materialOptions.vertexColors = true;
  } else {
    materialOptions.color = new THREE.Color(color);
  }
  
  const material = new THREE.PointsMaterial(materialOptions);

  // Create points
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return particles;
};

/**
 * Create a custom shader material for particles
 * @param {Object} options - Shader options
 * @returns {THREE.ShaderMaterial} Shader material
 */
export const createParticleShaderMaterial = (options = {}) => {
  const {
    color = 0xffffff,
    size = 1,
    texture = null,
    opacity = 1,
    vertexColors = false,
    transparent = true,
    depthWrite = true,
    depthTest = true,
    blending = THREE.NormalBlending,
    vertexShader = null,
    fragmentShader = null,
  } = options;
  
  // Default vertex shader
  const defaultVertexShader = `
    attribute float size;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  // Default fragment shader
  const defaultFragmentShader = `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    varying vec3 vColor;
    
    void main() {
      gl_FragColor = vec4(color * vColor, 1.0);
      
      #ifdef USE_MAP
        gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
      #endif
    }
  `;
  
  // Create uniforms
  const uniforms = {
    color: { value: new THREE.Color(color) },
    opacity: { value: opacity },
  };
  
  if (texture) {
    uniforms.pointTexture = { value: texture };
  }
  
  // Create shader material
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vertexShader || defaultVertexShader,
    fragmentShader: fragmentShader || defaultFragmentShader,
    transparent,
    depthWrite,
    depthTest,
    blending,
  });
  
  if (vertexColors) {
    material.vertexColors = true;
  }
  
  return material;
};

/**
 * Create an interactive background with performance optimizations
 * @param {THREE.Scene} scene - The scene to add the background to
 * @param {Object} options - Background options
 * @returns {Object} Background objects and controls
 */
export const createInteractiveBackground = (scene, options = {}) => {
  const {
    particleCount = 1000,
    particleSize = 0.1,
    particleColor = 0xffffff,
    maxDistance = 10,
    interactive = true,
    interactionStrength = 0.1,
    autoRotate = true,
    rotationSpeed = 0.001,
    useTexture = false,
    texturePath = null,
    useColors = false,
    colors = [0xff0000, 0x00ff00, 0x0000ff],
  } = options;
  
  // Load texture if specified
  let texture = null;
  if (useTexture && texturePath) {
    texture = new THREE.TextureLoader().load(texturePath);
  }
  
  // Create particle system
  const particles = createParticleSystem(scene, {
    count: particleCount,
    size: particleSize,
    sizeVariation: 0.5,
    color: particleColor,
    colorVariation: useColors,
    colors: colors,
    maxDistance: maxDistance,
    texture: texture,
    transparent: true,
    depthWrite: false,
  });
  
  // Set up mouse tracking
  const mouse = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  let isDragging = false;
  
  // Set up interaction handlers
  const handleMouseMove = (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  
  const handleMouseDown = () => {
    isDragging = true;
  };
  
  const handleMouseUp = () => {
    isDragging = false;
  };
  
  // Add event listeners if interactive
  if (interactive) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
  }
  
  // Update function for animation loop
  const update = () => {
    // Auto-rotate if enabled and not dragging
    if (autoRotate && !isDragging) {
      particles.rotation.y += rotationSpeed;
      particles.rotation.x += rotationSpeed * 0.5;
    }
    
    // Apply mouse interaction if interactive
    if (interactive) {
      // Get particle positions
      const positions = particles.geometry.attributes.position;
      
      // Convert mouse position to world coordinates
      raycaster.setFromCamera(mouse, scene.camera);
      const intersects = raycaster.intersectObject(particles);
      
      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        
        // Apply force to nearby particles
        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          
          // Get current position
          const x = positions.array[i3];
          const y = positions.array[i3 + 1];
          const z = positions.array[i3 + 2];
          
          // Calculate distance to intersection point
          const dx = intersectionPoint.x - x;
          const dy = intersectionPoint.y - y;
          const dz = intersectionPoint.z - z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // Apply force if within range
          if (dist < 2) {
            const force = (1 - dist / 2) * interactionStrength;
            positions.array[i3] += dx * force;
            positions.array[i3 + 1] += dy * force;
            positions.array[i3 + 2] += dz * force;
          }
          
          // Add some random movement
          positions.array[i3] += (Math.random() - 0.5) * 0.01;
          positions.array[i3 + 1] += (Math.random() - 0.5) * 0.01;
          positions.array[i3 + 2] += (Math.random() - 0.5) * 0.01;
          
          // Keep particles within bounds
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
      }
    }
  };
  
  // Clean up function
  const dispose = () => {
    if (interactive) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    scene.remove(particles);
    particles.geometry.dispose();
    particles.material.dispose();
    
    if (texture) {
      texture.dispose();
    }
  };
  
  return {
    particles,
    update,
    dispose,
    mouse,
    isDragging: () => isDragging,
  };
};

/**
 * Optimize 3D scene performance based on device capabilities
 * @param {Object} sceneObjects - Scene objects (scene, camera, renderer, etc.)
 * @param {Object} options - Optimization options
 */
export const optimizeScenePerformance = (sceneObjects, options = {}) => {
  const {
    scene,
    renderer,
    camera,
    composer,
  } = sceneObjects;
  
  const {
    targetFPS = 60,
    adaptiveResolution = true,
    minPixelRatio = 0.5,
    checkInterval = 1000,
    reduceParticleCount = true,
    particleSystems = [],
    particleReductionFactor = 0.5,
  } = options;
  
  // Get device info
  const gpuInfo = getGPUInfo();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Initial optimization based on device type
  if (isMobile) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    
    // Reduce particle count for mobile devices
    if (reduceParticleCount && particleSystems.length > 0) {
      particleSystems.forEach((particles) => {
        if (particles.geometry && particles.geometry.attributes.position) {
          const originalCount = particles.geometry.attributes.position.count;
          const newCount = Math.floor(originalCount * particleReductionFactor);
          
          // Create new geometry with reduced count
          const newGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array(newCount * 3);
          
          for (let i = 0; i < newCount; i++) {
            const i3 = i * 3;
            const srcI3 = (i % originalCount) * 3;
            
            positions[i3] = particles.geometry.attributes.position.array[srcI3];
            positions[i3 + 1] = particles.geometry.attributes.position.array[srcI3 + 1];
            positions[i3 + 2] = particles.geometry.attributes.position.array[srcI3 + 2];
          }
          
          newGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          particles.geometry.dispose();
          particles.geometry = newGeometry;
        }
      });
    }
  }
  
  // Set up adaptive resolution if enabled
  if (adaptiveResolution) {
    let lastFPS = 0;
    let currentPixelRatio = renderer.getPixelRatio();
    
    // Check FPS periodically and adjust resolution
    const checkFPS = () => {
      // Get current FPS (implementation depends on your animation loop)
      const currentFPS = lastFPS;
      
      // Adjust pixel ratio based on FPS
      if (currentFPS < targetFPS * 0.8 && currentPixelRatio > minPixelRatio) {
        currentPixelRatio = Math.max(currentPixelRatio - 0.1, minPixelRatio);
        renderer.setPixelRatio(currentPixelRatio);
        
        if (composer) {
          composer.setPixelRatio(currentPixelRatio);
        }
      } else if (currentFPS > targetFPS * 0.9 && currentPixelRatio < window.devicePixelRatio) {
        currentPixelRatio = Math.min(currentPixelRatio + 0.1, window.devicePixelRatio);
        renderer.setPixelRatio(currentPixelRatio);
        
        if (composer) {
          composer.setPixelRatio(currentPixelRatio);
        }
      }
    };
    
    // Set up interval for checking FPS
    const fpsInterval = setInterval(checkFPS, checkInterval);
    
    // Update FPS in animation loop
    const updateFPS = (fps) => {
      lastFPS = fps;
    };
    
    // Return cleanup function
    return {
      updateFPS,
      cleanup: () => {
        clearInterval(fpsInterval);
      },
    };
  }
  
  return {
    updateFPS: () => {},
    cleanup: () => {},
  };
};

/**
 * Create a skybox
 * @param {THREE.Scene} scene - The scene to add the skybox to
 * @param {Array} urls - Array of 6 URLs for the skybox textures
 * @returns {THREE.Mesh} Skybox mesh
 */
export const createSkybox = (scene, urls) => {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load(urls);
  scene.background = texture;
  
  return texture;
};