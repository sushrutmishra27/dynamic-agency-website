/**
 * Team module for handling team grid, filtering, and team member modal
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { select, selectAll } from '../utils/dom';
import { createTeamGridAnimation } from '../utils/animation-utils';
import { teamMembers, teamDepartments } from '../data/team-data';
import { createTeamMemberCard3D } from '../utils/three-utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize team section
 */
export function initTeamSection() {
  // Initialize team grid
  initTeamGrid();
  
  // Initialize team filters
  initTeamFilters();
  
  // Initialize team member modal
  initTeamMemberModal();
}

/**
 * Initialize team grid
 */
function initTeamGrid() {
  const teamGrid = select('.team-grid');
  
  if (!teamGrid) return;
  
  // Clear existing items
  teamGrid.innerHTML = '';
  
  // Create team members
  teamMembers.forEach((member, index) => {
    // Create team member element
    const teamMember = document.createElement('div');
    teamMember.className = 'team-member';
    teamMember.dataset.id = member.id;
    teamMember.dataset.department = member.department;
    
    // Create HTML structure
    teamMember.innerHTML = `
      <div class="team-member-image">
        <img src="${member.image}" alt="${member.name}">
        <div class="team-member-overlay"></div>
      </div>
      <div class="team-member-content">
        <h3 class="team-member-name">${member.name}</h3>
        <div class="team-member-role">${member.role}</div>
        <div class="team-member-social">
          ${member.social.linkedin ? `<a href="${member.social.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
          ${member.social.twitter ? `<a href="${member.social.twitter}" class="social-link" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
          ${member.social.dribbble ? `<a href="${member.social.dribbble}" class="social-link" target="_blank"><i class="fab fa-dribbble"></i></a>` : ''}
          ${member.social.github ? `<a href="${member.social.github}" class="social-link" target="_blank"><i class="fab fa-github"></i></a>` : ''}
          ${member.social.instagram ? `<a href="${member.social.instagram}" class="social-link" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
          ${member.social.vimeo ? `<a href="${member.social.vimeo}" class="social-link" target="_blank"><i class="fab fa-vimeo-v"></i></a>` : ''}
        </div>
      </div>
    `;
    
    // Add to grid
    teamGrid.appendChild(teamMember);
    
    // Add click event listener
    teamMember.addEventListener('click', (e) => {
      // Don't open modal if clicking on social link
      if (e.target.closest('.social-link')) return;
      
      openTeamMemberModal(member.id);
    });
    
    // Initialize 3D effect if WebGL is supported
    if (window.appState?.webglSupported && !window.appState?.reducedMotion) {
      // Add 3D effect with a slight delay to prevent layout thrashing
      setTimeout(() => {
        createTeamMemberCard3D(teamMember, {
          depth: 20,
          sensitivity: 20,
          perspective: 800,
          layerDistance: 5,
          transitionDuration: 0.3
        });
      }, 100 + (index * 50));
    }
  });
  
  // Initialize team grid animation
  createTeamGridAnimation(teamGrid);
}

/**
 * Initialize team filters
 */
function initTeamFilters() {
  const filterButtons = selectAll('.team-filter .filter-btn');
  const teamMembers = selectAll('.team-member');
  
  if (!filterButtons.length || !teamMembers.length) return;
  
  // Add click event listener to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get filter value
      const filterValue = button.dataset.filter;
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter items
      if (filterValue === 'all') {
        // Show all items
        teamMembers.forEach(item => {
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            clearProps: 'transform',
            onStart: () => {
              item.style.display = 'block';
            }
          });
        });
      } else {
        // Filter items
        teamMembers.forEach(item => {
          const department = item.dataset.department;
          
          if (department === filterValue) {
            // Show item
            gsap.to(item, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power3.out',
              clearProps: 'transform',
              onStart: () => {
                item.style.display = 'block';
              }
            });
          } else {
            // Hide item
            gsap.to(item, {
              opacity: 0,
              scale: 0.8,
              duration: 0.5,
              ease: 'power3.out',
              onComplete: () => {
                item.style.display = 'none';
              }
            });
          }
        });
      }
    });
  });
}

/**
 * Initialize team member modal
 */
function initTeamMemberModal() {
  const modal = select('#team-modal');
  const modalOverlay = modal?.querySelector('.modal-overlay');
  const modalClose = modal?.querySelector('.modal-close');
  
  if (!modal) return;
  
  // Add click event listener to modal overlay
  modalOverlay?.addEventListener('click', () => {
    closeTeamMemberModal();
  });
  
  // Add click event listener to modal close button
  modalClose?.addEventListener('click', () => {
    closeTeamMemberModal();
  });
  
  // Add escape key event listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeTeamMemberModal();
    }
  });
}

/**
 * Open team member modal
 * @param {number} id - Team member ID
 */
function openTeamMemberModal(id) {
  const modal = select('#team-modal');
  const teamMember = teamMembers.find(member => member.id === id);
  
  if (!modal || !teamMember) return;
  
  // Update modal content
  updateTeamMemberModalContent(teamMember);
  
  // Show modal
  document.body.classList.add('modal-open');
  modal.classList.add('active');
  
  // Animate modal opening
  const modalContainer = modal.querySelector('.modal-container');
  
  gsap.fromTo(modalContainer, {
    opacity: 0,
    y: 50
  }, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: 'power3.out'
  });
}

/**
 * Close team member modal
 */
function closeTeamMemberModal() {
  const modal = select('#team-modal');
  
  if (!modal) return;
  
  // Animate modal closing
  const modalContainer = modal.querySelector('.modal-container');
  
  gsap.to(modalContainer, {
    opacity: 0,
    y: 50,
    duration: 0.3,
    ease: 'power3.in',
    onComplete: () => {
      // Hide modal
      document.body.classList.remove('modal-open');
      modal.classList.remove('active');
    }
  });
}

/**
 * Update team member modal content
 * @param {Object} teamMember - Team member data
 */
function updateTeamMemberModalContent(teamMember) {
  const modal = select('#team-modal');
  
  if (!modal || !teamMember) return;
  
  // Update image
  const image = modal.querySelector('.team-member-image');
  if (image) {
    image.innerHTML = `<img src="${teamMember.image}" alt="${teamMember.name}">`;
  }
  
  // Update name
  const name = modal.querySelector('.team-member-name');
  if (name) name.textContent = teamMember.name;
  
  // Update role
  const role = modal.querySelector('.team-member-role');
  if (role) role.textContent = teamMember.role;
  
  // Update social links
  const socialLinks = modal.querySelector('.team-member-social');
  if (socialLinks) {
    socialLinks.innerHTML = '';
    
    Object.entries(teamMember.social).forEach(([platform, url]) => {
      if (!url) return;
      
      const link = document.createElement('a');
      link.href = url;
      link.className = 'social-link';
      link.target = '_blank';
      
      let icon;
      switch (platform) {
        case 'linkedin':
          icon = 'fab fa-linkedin-in';
          break;
        case 'twitter':
          icon = 'fab fa-twitter';
          break;
        case 'dribbble':
          icon = 'fab fa-dribbble';
          break;
        case 'github':
          icon = 'fab fa-github';
          break;
        case 'instagram':
          icon = 'fab fa-instagram';
          break;
        case 'vimeo':
          icon = 'fab fa-vimeo-v';
          break;
        default:
          icon = 'fas fa-link';
      }
      
      link.innerHTML = `<i class="${icon}"></i>`;
      socialLinks.appendChild(link);
    });
  }
  
  // Update bio
  const bio = modal.querySelector('.team-member-bio');
  if (bio) bio.textContent = teamMember.bio;
  
  // Update quote
  const quote = modal.querySelector('.team-member-quote');
  if (quote) quote.textContent = teamMember.quote;
  
  // Update expertise
  const expertiseList = modal.querySelector('.expertise-list');
  if (expertiseList) {
    expertiseList.innerHTML = '';
    teamMember.expertise.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      expertiseList.appendChild(li);
    });
  }
  
  // Update education
  const education = modal.querySelector('.team-member-education');
  if (education) education.textContent = teamMember.education;
}