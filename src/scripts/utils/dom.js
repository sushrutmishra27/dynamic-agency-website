/**
 * Utility functions for DOM manipulation
 */

/**
 * Shorthand for document.querySelector
 * @param {string} selector - CSS selector
 * @returns {Element} The first element that matches the selector
 */
export const select = (selector) => document.querySelector(selector);

/**
 * Shorthand for document.querySelectorAll
 * @param {string} selector - CSS selector
 * @returns {NodeList} All elements that match the selector
 */
export const selectAll = (selector) => document.querySelectorAll(selector);

/**
 * Create an element with optional attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Optional attributes to set on the element
 * @param {Array} children - Optional child elements or text to append
 * @returns {Element} The created element
 */
export const createElement = (tag, attrs = {}, children = []) => {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      element.classList.add(...value.split(' '));
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else if (key === 'style' && typeof value === 'object') {
      Object.entries(value).forEach(([styleKey, styleValue]) => {
        element.style[styleKey] = styleValue;
      });
    } else {
      element[key] = value;
    }
  });
  
  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  
  return element;
};

/**
 * Add event listener to an element
 * @param {Element} element - The element to add the event listener to
 * @param {string} event - The event name
 * @param {Function} callback - The callback function
 * @param {Object} options - Optional event listener options
 */
export const on = (element, event, callback, options = {}) => {
  element.addEventListener(event, callback, options);
};

/**
 * Remove event listener from an element
 * @param {Element} element - The element to remove the event listener from
 * @param {string} event - The event name
 * @param {Function} callback - The callback function
 * @param {Object} options - Optional event listener options
 */
export const off = (element, event, callback, options = {}) => {
  element.removeEventListener(event, callback, options);
};

/**
 * Check if an element is in viewport
 * @param {Element} element - The element to check
 * @param {number} offset - Optional offset
 * @returns {boolean} Whether the element is in viewport
 */
export const isInViewport = (element, offset = 0) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top + offset < window.innerHeight &&
    rect.bottom - offset > 0 &&
    rect.left + offset < window.innerWidth &&
    rect.right - offset > 0
  );
};

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait = 100) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Throttle function to limit the rate at which a function can fire
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit time in milliseconds
 * @returns {Function} The throttled function
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Get a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
export const random = (min, max) => Math.random() * (max - min) + min;

/**
 * Map a value from one range to another
 * @param {number} value - The value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export const map = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Clamp a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Lerp (linear interpolation) between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export const lerp = (start, end, t) => start * (1 - t) + end * t;

/**
 * Check if device has touch capability
 * @returns {boolean} Whether the device has touch capability
 */
export const hasTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/**
 * Get current device type
 * @returns {string} Device type ('mobile', 'tablet', or 'desktop')
 */
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Preload images
 * @param {Array} images - Array of image URLs
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadImages = (images = []) => {
  const promises = images.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  });
  return Promise.all(promises);
};

/**
 * Detect browser
 * @returns {Object} Browser information
 */
export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  let browser = 'unknown';
  let version = 'unknown';
  
  // Chrome
  if (/Chrome/.test(userAgent) && !/Chromium|Edge|Edg|OPR|Opera/.test(userAgent)) {
    browser = 'chrome';
    version = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
  }
  // Firefox
  else if (/Firefox/.test(userAgent)) {
    browser = 'firefox';
    version = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
  }
  // Safari
  else if (/Safari/.test(userAgent) && !/Chrome|Chromium|Edge|Edg|OPR|Opera/.test(userAgent)) {
    browser = 'safari';
    version = userAgent.match(/Version\/(\d+\.\d+)/)[1];
  }
  // Edge
  else if (/Edge|Edg/.test(userAgent)) {
    browser = 'edge';
    version = userAgent.match(/Edge\/(\d+\.\d+)|Edg\/(\d+\.\d+)/)[1] || userAgent.match(/Edge\/(\d+\.\d+)|Edg\/(\d+\.\d+)/)[2];
  }
  // Opera
  else if (/OPR|Opera/.test(userAgent)) {
    browser = 'opera';
    version = userAgent.match(/OPR\/(\d+\.\d+)|Opera\/(\d+\.\d+)/)[1] || userAgent.match(/OPR\/(\d+\.\d+)|Opera\/(\d+\.\d+)/)[2];
  }
  // IE
  else if (/MSIE|Trident/.test(userAgent)) {
    browser = 'ie';
    version = userAgent.match(/MSIE (\d+\.\d+)/) ? userAgent.match(/MSIE (\d+\.\d+)/)[1] : userAgent.match(/rv:(\d+\.\d+)/)[1];
  }
  
  return { browser, version };
};

/**
 * Detect OS
 * @returns {string} OS name
 */
export const detectOS = () => {
  const userAgent = navigator.userAgent;
  
  if (/Windows/.test(userAgent)) return 'windows';
  if (/Mac/.test(userAgent)) return 'mac';
  if (/Linux/.test(userAgent)) return 'linux';
  if (/Android/.test(userAgent)) return 'android';
  if (/iOS|iPhone|iPad|iPod/.test(userAgent)) return 'ios';
  
  return 'unknown';
};

/**
 * Check if reduced motion is preferred
 * @returns {boolean} Whether reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get transform values of an element
 * @param {Element} element - The element to get transform values from
 * @returns {Object} Transform values
 */
export const getTransformValues = (element) => {
  const style = window.getComputedStyle(element);
  const matrix = style.transform || style.webkitTransform || style.mozTransform;
  
  // No transform property
  if (matrix === 'none' || !matrix) {
    return {
      x: 0,
      y: 0,
      z: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      skewX: 0,
      skewY: 0,
    };
  }
  
  // Matrix 3d
  if (matrix.includes('3d')) {
    const matrixValues = matrix.match(/matrix3d\((.+)\)/)[1].split(', ');
    return {
      x: parseFloat(matrixValues[12]),
      y: parseFloat(matrixValues[13]),
      z: parseFloat(matrixValues[14]),
      scaleX: parseFloat(matrixValues[0]),
      scaleY: parseFloat(matrixValues[5]),
      scaleZ: parseFloat(matrixValues[10]),
      rotateX: 0, // Complex calculation required
      rotateY: 0, // Complex calculation required
      rotateZ: 0, // Complex calculation required
      skewX: 0, // Complex calculation required
      skewY: 0, // Complex calculation required
    };
  }
  
  // Matrix 2d
  const matrixValues = matrix.match(/matrix\((.+)\)/)[1].split(', ');
  return {
    x: parseFloat(matrixValues[4]),
    y: parseFloat(matrixValues[5]),
    z: 0,
    scaleX: parseFloat(matrixValues[0]),
    scaleY: parseFloat(matrixValues[3]),
    scaleZ: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: Math.atan2(parseFloat(matrixValues[1]), parseFloat(matrixValues[0])) * (180 / Math.PI),
    skewX: Math.atan2(parseFloat(matrixValues[2]), parseFloat(matrixValues[3])) * (180 / Math.PI),
    skewY: 0,
  };
};