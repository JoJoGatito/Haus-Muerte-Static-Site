
// Register GSAP plugins
gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
// Project titles
const items = Array(20).fill("");
// Generate thumbnail and full resolution image URLs
let imageUrls = [];
for (let i = 1; i <= 101; i++) {
  // Store both thumbnail and full resolution paths
  imageUrls.push({
    thumbnail: `assets/Images/gallery/QOW/Thumbnail/QOWlr${i}.webp`,
    full: `assets/Images/gallery/QOW/Full/QOW${i}.webp`
  });
}

// Seeded random function for consistent shuffle between page loads
function seededRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Shuffle array using Fisher-Yates algorithm with seeded random
function shuffleArray(array, seed) {
  const random = seededRandom(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Track the next image to load for sequential loading
let nextImageIndex = 0;

// Original shuffled approach (commented out for sequential loading)
// imageUrls = shuffleArray(imageUrls, 42);

// Add error handling for image loading
function handleImageError(img) {
  const isThumbnail = !img.src.includes('/full/');
  console.warn(`Failed to load ${isThumbnail ? 'thumbnail' : 'full resolution'} image: ${img.src}`);
  
  if (isThumbnail) {
    // If thumbnail fails, try loading full resolution as fallback
    img.src = img.dataset.fullRes;
  } else {
    // If full resolution fails, try reverting to thumbnail
    img.src = img.src.replace('/full/', '/thumbnail/');
  }
  
  // Remove the error handler after one retry to prevent infinite loops
  img.onerror = null;
}
const container = document.querySelector(".container");
const canvas = document.getElementById("canvas");
const overlay = document.getElementById("overlay");
// Gallery settings
const settings = {
  // Item sizes
  baseWidth: 400,
  smallHeight: 330,
  largeHeight: 500,
  itemGap: 65,
  hoverScale: 1.05,
  expandedScale: 0.4, // Percentage of viewport width
  dragEase: 0.075,
  momentumFactor: 200,
  bufferZone: 3,
  borderRadius: 0,
  vignetteSize: 0,
  // Page vignette settings - simplified to two main controls
  vignetteStrength: 0.7, // Controls opacity of all layers
  vignetteSize: 200, // Controls size of all layers
  // Overlay settings
  overlayOpacity: 0.9,
  overlayEaseDuration: 0.8,
  // Animation durations
  zoomDuration: 0.6 // Reduced from 1.0 to 0.6 for faster zoom
};

// Mobile settings for the gallery
const mobileSettings = {
  baseWidth: 210,
  smallHeight: 150,
  largeHeight: 270,
  itemGap: 25
};

// Function to check if device is mobile based on screen width
function isMobile() {
  return window.innerWidth < 768;
}

// Apply appropriate settings based on screen size
function applyResponsiveSettings() {
  if (isMobile()) {
    // Apply mobile settings
    settings.baseWidth = mobileSettings.baseWidth;
    settings.smallHeight = mobileSettings.smallHeight;
    settings.largeHeight = mobileSettings.largeHeight;
    settings.itemGap = mobileSettings.itemGap;
  } else {
    // Reset to desktop settings
    settings.baseWidth = 400;
    settings.smallHeight = 330;
    settings.largeHeight = 500;
    settings.itemGap = 65;
  }
  
  // Update the gallery with new settings
  updateSettings();
}
// Define item sizes based on settings
let itemSizes = [
  {
    width: settings.baseWidth,
    height: settings.smallHeight
  },
  {
    width: settings.baseWidth,
    height: settings.largeHeight
  }
];
let itemGap = settings.itemGap;
let columns = 4;
const itemCount = items.length;
// Calculate grid cell size based on the largest possible item
let cellWidth = settings.baseWidth + settings.itemGap;
let cellHeight =
  Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;
let isDragging = false;
let startX, startY;
let targetX = 0,
  targetY = 0;
let currentX = 0,
  currentY = 0;
let dragVelocityX = 0,
  dragVelocityY = 0;
let lastDragTime = 0;
let mouseHasMoved = false;
let visibleItems = new Set();
let lastUpdateTime = 0;
let lastX = 0,
  lastY = 0;
let isExpanded = false;
let activeItem = null;
let activeItemId = null;
let canDrag = true;
let originalPosition = null;
let expandedItem = null;
let overlayAnimation = null;
// Update CSS variable for border radius
function updateBorderRadius() {
  document.documentElement.style.setProperty(
    "--border-radius",
    `${settings.borderRadius}px`
  );
}
// Update CSS variable for item vignette
function updateVignetteSize() {
  document.documentElement.style.setProperty(
    "--vignette-size",
    `${settings.vignetteSize}px`
  );
}
// Update CSS variable for page vignette - now using the simplified controls
function updatePageVignette() {
  const strength = settings.vignetteStrength;
  const size = settings.vignetteSize;
  // Regular vignette (outer layer)
  const regularOpacity = strength * 0.7;
  const regularSize = size * 1.5;
  document.documentElement.style.setProperty(
    "--page-vignette-size",
    `${regularSize}px`
  );
  document.documentElement.style.setProperty(
    "--page-vignette-color",
    `rgba(0,0,0,${regularOpacity})`
  );
  // Strong vignette (middle layer)
  const strongOpacity = strength * 0.85;
  const strongSize = size * 0.75;
  document.documentElement.style.setProperty(
    "--page-vignette-strong-size",
    `${strongSize}px`
  );
  document.documentElement.style.setProperty(
    "--page-vignette-strong-color",
    `rgba(0,0,0,${strongOpacity})`
  );
  // Extreme vignette (inner layer)
  const extremeOpacity = strength;
  const extremeSize = size * 0.4;
  document.documentElement.style.setProperty(
    "--page-vignette-extreme-size",
    `${extremeSize}px`
  );
  document.documentElement.style.setProperty(
    "--page-vignette-extreme-color",
    `rgba(0,0,0,${extremeOpacity})`
  );
}
// Update CSS variable for hover scale
function updateHoverScale() {
  // Use CSS variables instead of directly modifying CSS rules
  document.documentElement.style.setProperty(
    "--hover-scale",
    settings.hoverScale
  );
  // Update all existing items with the new hover scale
  document.querySelectorAll(".item").forEach((item) => {
    const img = item.querySelector("img");
    if (img) {
      img.style.transition = "transform 0.3s ease";
    }
  });
}
// Update settings and rebuild the grid
function updateSettings() {
  // Update item sizes
  itemSizes = [
    {
      width: settings.baseWidth,
      height: settings.smallHeight
    },
    {
      width: settings.baseWidth,
      height: settings.largeHeight
    }
  ];
  itemGap = settings.itemGap;
  // Remove columns dependency - use a fixed value
  columns = 4;
  // Recalculate cell dimensions
  cellWidth = settings.baseWidth + settings.itemGap;
  cellHeight =
    Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;
  // Clear existing items and rebuild
  visibleItems.forEach((itemId) => {
    const item = document.getElementById(itemId);
    if (item && item.parentNode === canvas) {
      canvas.removeChild(item);
    }
  });
  visibleItems.clear();
  updateVisibleItems();
  // Update visual styles
  updateBorderRadius();
  updateVignetteSize();
  updateHoverScale();
  updatePageVignette();
}

// Animate overlay in
function animateOverlayIn() {
  if (overlayAnimation) overlayAnimation.kill();
  // Make sure we're using the current setting value
  overlayAnimation = gsap.to(overlay, {
    opacity: settings.overlayOpacity,
    duration: settings.overlayEaseDuration,
    ease: "power2.inOut",
    overwrite: true
  });
}
// Animate overlay out
function animateOverlayOut() {
  if (overlayAnimation) overlayAnimation.kill();
  overlayAnimation = gsap.to(overlay, {
    opacity: 0,
    duration: settings.overlayEaseDuration,
    ease: "power2.inOut"
  });
}
// Determine item size based on position
function getItemSize(row, col) {
  // Use a consistent pattern for size selection
  // This ensures the same position always gets the same size
  const sizeIndex = Math.abs((row * columns + col) % itemSizes.length);
  return itemSizes[sizeIndex];
}
// Generate a unique ID for each grid position
function getItemId(col, row) {
  return `${col},${row}`;
}
// Get the absolute position for an item
function getItemPosition(col, row) {
  const xPos = col * cellWidth;
  const yPos = row * cellHeight;
  return {
    x: xPos,
    y: yPos
  };
}

function updateVisibleItems() {
  const buffer = settings.bufferZone;
  const viewWidth = window.innerWidth * (1 + buffer);
  const viewHeight = window.innerHeight * (1 + buffer);
  // Calculate visible range based on current position and buffer
  const startCol = Math.floor((-currentX - viewWidth / 2) / cellWidth);
  const endCol = Math.ceil((-currentX + viewWidth * 1.5) / cellWidth);
  const startRow = Math.floor((-currentY - viewHeight / 2) / cellHeight);
  const endRow = Math.ceil((-currentY + viewHeight * 1.5) / cellHeight);
  const currentItems = new Set();
  // Create or update visible items
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const itemId = getItemId(col, row);
      currentItems.add(itemId);
      if (visibleItems.has(itemId)) continue;
      if (activeItemId === itemId && isExpanded) continue;
      // Get size and position for this item
      const itemSize = getItemSize(row, col);
      const position = getItemPosition(col, row);
      // Create the item element
      const item = document.createElement("div");
      item.className = "item";
      item.id = itemId;
      item.style.width = `${itemSize.width}px`;
      item.style.height = `${itemSize.height}px`;
      item.style.left = `${position.x}px`;
      item.style.top = `${position.y}px`;
      item.dataset.col = col;
      item.dataset.row = row;
      item.dataset.width = itemSize.width;
      item.dataset.height = itemSize.height;
      // Create image container for overflow control
      const imageContainer = document.createElement("div");
      imageContainer.className = "item-image-container";
      
      // Create image
      const img = document.createElement("img");
      
      // Use sequential loading for images
      const imageSet = imageUrls[nextImageIndex % imageUrls.length];
      nextImageIndex++; // Increment counter
      // Use thumbnail for grid view
      img.src = imageSet.thumbnail;
      // Store full resolution path for later use
      img.dataset.fullRes = imageSet.full;
      img.alt = `Image ${nextImageIndex}`;
      img.onerror = () => handleImageError(img);
      imageContainer.appendChild(img);
      item.appendChild(imageContainer);
      // Add caption inside the image
      // Add click handler
      item.addEventListener("click", (e) => {
        if (mouseHasMoved || isDragging) return;
        handleItemClick(item, itemNum);
      });
      canvas.appendChild(item);
      visibleItems.add(itemId);
    }
  }
  // Remove items that are no longer visible
  visibleItems.forEach((itemId) => {
    if (!currentItems.has(itemId) || (activeItemId === itemId && isExpanded)) {
      const item = document.getElementById(itemId);
      if (item && item.parentNode === canvas) {
        canvas.removeChild(item);
      }
      visibleItems.delete(itemId);
    }
  });
}

function handleItemClick(item, itemIndex) {
  if (isExpanded) {
    if (expandedItem) closeExpandedItem();
  } else {
    expandItem(item, itemIndex);
  }
}

function expandItem(item, itemIndex) {
  isExpanded = true;
  activeItem = item;
  activeItemId = item.id;
  canDrag = false;
  container.style.cursor = "auto";
  // Use the full resolution image path stored in the data attribute
  const imgSrc = item.querySelector("img").dataset.fullRes;
  const itemWidth = parseInt(item.dataset.width);
  const itemHeight = parseInt(item.dataset.height);
  const rect = item.getBoundingClientRect();
  originalPosition = {
    id: item.id,
    rect: rect,
    imgSrc: imgSrc,
    width: itemWidth,
    height: itemHeight
  };
  // Add active class to overlay but animate opacity with GSAP
  overlay.classList.add("active");
  animateOverlayIn();
  expandedItem = document.createElement("div");
  expandedItem.className = "expanded-item";
  expandedItem.style.width = `${itemWidth}px`;
  expandedItem.style.height = `${itemHeight}px`;
  expandedItem.style.zIndex = "10000"; // Explicitly set z-index
  // Apply the same border radius as the items
  expandedItem.style.borderRadius = `var(--border-radius, 0px)`;
  const img = document.createElement("img");
  img.src = imgSrc;
  expandedItem.appendChild(img);
  expandedItem.addEventListener("click", closeExpandedItem);
  document.body.appendChild(expandedItem);
  // Fade out other items with GSAP
  document.querySelectorAll(".item").forEach((el) => {
    if (el !== activeItem) {
      gsap.to(el, {
        opacity: 0,
        duration: settings.overlayEaseDuration,
        ease: "power2.inOut"
      });
    }
  });
  const viewportWidth = window.innerWidth;
  const targetWidth = viewportWidth * settings.expandedScale;
  // Maintain aspect ratio from original item
  const aspectRatio = itemHeight / itemWidth;
  const targetHeight = targetWidth * aspectRatio;
  gsap.fromTo(
    expandedItem,
    {
      width: itemWidth,
      height: itemHeight,
      x: rect.left + itemWidth / 2 - window.innerWidth / 2,
      y: rect.top + itemHeight / 2 - window.innerHeight / 2
    },
    {
      width: targetWidth,
      height: targetHeight,
      x: 0,
      y: 0,
      duration: settings.zoomDuration, // Use the faster zoom duration
      ease: "hop"
    }
  );
}

function closeExpandedItem() {
  if (!expandedItem || !originalPosition) return;
  animateOverlayOut();
  // Fade in other items with GSAP
  document.querySelectorAll(".item").forEach((el) => {
    if (el.id !== activeItemId) {
      gsap.to(el, {
        opacity: 1,
        duration: settings.overlayEaseDuration,
        delay: 0.3,
        ease: "power2.inOut"
      });
    }
  });
  const originalItem = document.getElementById(activeItemId);
  const originalRect = originalPosition.rect;
  const originalWidth = originalPosition.width;
  const originalHeight = originalPosition.height;

  // Switch back to thumbnail version in the grid
  if (originalItem) {
    const img = originalItem.querySelector('img');
    if (img) {
      img.src = img.src.replace('/full/', '/thumbnail/');
    }
  }
  gsap.to(expandedItem, {
    width: originalWidth,
    height: originalHeight,
    x: originalRect.left + originalWidth / 2 - window.innerWidth / 2,
    y: originalRect.top + originalHeight / 2 - window.innerHeight / 2,
    duration: settings.zoomDuration, // Use the faster zoom duration
    ease: "hop",
    onComplete: () => {
      if (expandedItem && expandedItem.parentNode) {
        document.body.removeChild(expandedItem);
      }
      if (originalItem) {
        originalItem.style.visibility = "visible";
      }
      expandedItem = null;
      isExpanded = false;
      activeItem = null;
      originalPosition = null;
      activeItemId = null;
      canDrag = true;
      container.style.cursor = "grab";
      dragVelocityX = 0;
      dragVelocityY = 0;
      // Remove active class from overlay after animation completes
      overlay.classList.remove("active");
    }
  });
}

function animate() {
  if (canDrag) {
    const ease = settings.dragEase;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // Reset sequential counter when returning near start position
    if (Math.abs(currentX) < 100 && Math.abs(currentY) < 100) {
      nextImageIndex = 0;
    }
    const now = Date.now();
    const distMoved = Math.sqrt(
      Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
    );
    if (distMoved > 100 || now - lastUpdateTime > 120) {
      updateVisibleItems();
      lastX = currentX;
      lastY = currentY;
      lastUpdateTime = now;
    }
  }
  requestAnimationFrame(animate);
}
container.addEventListener("mousedown", (e) => {
  if (!canDrag) return;
  isDragging = true;
  mouseHasMoved = false;
  startX = e.clientX;
  startY = e.clientY;
  container.style.cursor = "grabbing";
});
window.addEventListener("mousemove", (e) => {
  if (!isDragging || !canDrag) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    mouseHasMoved = true;
  }
  const now = Date.now();
  const dt = Math.max(10, now - lastDragTime);
  lastDragTime = now;
  dragVelocityX = dx / dt;
  dragVelocityY = dy / dt;
  targetX += dx;
  targetY += dy;
  startX = e.clientX;
  startY = e.clientY;
});
window.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  if (canDrag) {
    container.style.cursor = "grab";
    if (Math.abs(dragVelocityX) > 0.1 || Math.abs(dragVelocityY) > 0.1) {
      const momentumFactor = settings.momentumFactor;
      targetX += dragVelocityX * momentumFactor;
      targetY += dragVelocityY * momentumFactor;
    }
  }
});
overlay.addEventListener("click", () => {
  if (isExpanded) closeExpandedItem();
});
container.addEventListener("touchstart", (e) => {
  if (!canDrag) return;
  isDragging = true;
  mouseHasMoved = false;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
window.addEventListener("touchmove", (e) => {
  if (!isDragging || !canDrag) return;
  const dx = e.touches[0].clientX - startX;
  const dy = e.touches[0].clientY - startY;
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    mouseHasMoved = true;
  }
  targetX += dx;
  targetY += dy;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
window.addEventListener("touchend", () => {
  isDragging = false;
});
window.addEventListener("resize", () => {
  if (isExpanded && expandedItem) {
    const viewportWidth = window.innerWidth;
    const targetWidth = viewportWidth * settings.expandedScale;
    // Maintain aspect ratio
    const originalWidth = originalPosition.width;
    const originalHeight = originalPosition.height;
    const aspectRatio = originalHeight / originalWidth;
    const targetHeight = targetWidth * aspectRatio;
    gsap.to(expandedItem, {
      width: targetWidth,
      height: targetHeight,
      duration: 0.3,
      ease: "power2.out"
    });
  } else {
    // Check if we need to update settings based on screen size
    applyResponsiveSettings();
    updateVisibleItems();
  }
});
// Add this right before the // Initialize comment
function initializeStyles() {
  updateBorderRadius();
  updateVignetteSize();
  updateHoverScale();
  updatePageVignette();
}
// Initialize
initializeStyles();
// Apply responsive settings based on current screen size
applyResponsiveSettings();
updateVisibleItems();
animate();