document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from an API
    const services = [
        {
            id: 1,
            title: 'Digital Marketing',
            description: 'Strategic campaigns across search, social, and display networks.',
            icon: 'digital-marketing.svg'
        },
        {
            id: 2,
            title: 'Web Development',
            description: 'Custom websites and applications built with cutting-edge technology.',
            icon: 'web-development.svg'
        },
        {
            id: 3,
            title: 'Brand Strategy',
            description: 'Comprehensive brand development and positioning strategies.',
            icon: 'brand-strategy.svg'
        }
    ];

    const portfolioItems = [
        {
            id: 1,
            title: 'E-commerce Redesign',
            category: 'Web Design',
            image: 'portfolio-1.jpg'
        },
        {
            id: 2,
            title: 'Product Launch Campaign',
            category: 'Digital Marketing',
            image: 'portfolio-2.jpg'
        },
        {
            id: 3,
            title: 'Brand Identity System',
            category: 'Branding',
            image: 'portfolio-3.jpg'
        }
    ];

    // Dynamically load services
    const servicesGrid = document.querySelector('.services-grid');
    
    if (servicesGrid) {
        services.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'service-item';
            serviceElement.innerHTML = `
                <div class="service-icon">
                    <img src="assets/images/${service.icon}" alt="${service.title}">
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            `;
            servicesGrid.appendChild(serviceElement);
        });
    }

    // Dynamically load portfolio items
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    if (portfolioGrid) {
        portfolioItems.forEach(item => {
            const portfolioElement = document.createElement('div');
            portfolioElement.className = 'portfolio-item';
            portfolioElement.innerHTML = `
                <img src="assets/images/${item.image}" alt="${item.title}">
                <div class="portfolio-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.category}</p>
                </div>
            `;
            portfolioGrid.appendChild(portfolioElement);
        });
    }

    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll (simple implementation)
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-item, .portfolio-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll);
});
