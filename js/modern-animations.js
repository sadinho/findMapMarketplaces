// Enhanced animations and interactions for Xcondo Shop - Complete Version

class ModernAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallaxEffects();
        this.setupHoverEffects();
        this.setupCounterAnimations();
        this.setupFormAnimations();
        this.setupLoadingAnimations();
        this.setupMapAnimations();
        this.addFloatingBackToTop();
        this.addFallbacks();
    }

    // Parallax effects for header background
    setupParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.site-header::before');
            
            if (parallaxElements.length > 0) {
                const rate = scrolled * -0.5;
                document.documentElement.style.setProperty('--parallax-offset', `${rate}px`);
            }
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // Enhanced hover effects for interactive elements
    setupHoverEffects() {
        // Efeitos de hover mais sutis e menos distraidores
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            // Remover o efeito magnético 3D exagerado
            // Manter apenas uma elevação sutil
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Button ripple effect (mantido mas mais sutil)
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(0);
                    animation: ripple 0.4s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    pointer-events: none;
                `;
                
                // Add ripple animation keyframes if not already present
                if (!document.querySelector('#ripple-styles')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-styles';
                    style.textContent = `
                        @keyframes ripple {
                            to {
                                transform: scale(3);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 400);
            });
        });
    }

    // Animated counter for marketplace count
    setupCounterAnimations() {
        const countElement = document.getElementById('marketplacesCount');
        
        if (countElement) {
            const animateCount = (target) => {
                const current = parseInt(countElement.textContent) || 0;
                const increment = target / 50;
                let currentCount = current;
                
                const timer = setInterval(() => {
                    currentCount += increment;
                    if (currentCount >= target) {
                        countElement.textContent = target;
                        clearInterval(timer);
                        
                        // Add celebration animation
                        countElement.style.animation = 'pulse 0.5s ease-in-out';
                        setTimeout(() => {
                            countElement.style.animation = '';
                        }, 500);
                    } else {
                        countElement.textContent = Math.floor(currentCount);
                    }
                }, 20);
            };
            
            // Expose function globally for use by main app
            window.animateMarketplaceCount = animateCount;
        }
    }

    // Form field animations
    setupFormAnimations() {
        const formControls = document.querySelectorAll('.form-select, .form-control');
        
        formControls.forEach(control => {
            const label = control.previousElementSibling;
            
            // Focus animations
            control.addEventListener('focus', () => {
                if (label) {
                    label.style.transform = 'translateY(-5px) scale(0.9)';
                    label.style.color = 'var(--primary-orange)';
                }
                
                control.style.boxShadow = '0 0 0 4px rgba(247, 99, 0, 0.1), 0 4px 12px rgba(247, 99, 0, 0.15)';
            });
            
            control.addEventListener('blur', () => {
                if (label && !control.value) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = 'var(--primary-blue)';
                }
                
                control.style.boxShadow = '';
            });
            
            // Add floating label effect
            if (control.value) {
                if (label) {
                    label.style.transform = 'translateY(-5px) scale(0.9)';
                }
            }
        });
    }

    // Loading animations
    setupLoadingAnimations() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        if (loadingOverlay) {
            // Enhanced loading spinner
            const spinner = loadingOverlay.querySelector('.loading-spinner');
            if (spinner) {
                spinner.style.background = 'conic-gradient(from 0deg, var(--primary-orange), var(--primary-blue), var(--primary-orange))';
                spinner.style.borderRadius = '50%';
                spinner.style.position = 'relative';
                
                // Add inner spinner for more sophisticated look
                const innerSpinner = document.createElement('div');
                innerSpinner.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 60%;
                    height: 60%;
                    border: 3px solid rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    animation: spin 1.5s linear infinite reverse;
                `;
                spinner.appendChild(innerSpinner);
            }
        }
    }

    // Map container animations (simplificado)
    setupMapAnimations() {
        const mapContainer = document.getElementById('map');
        
        if (mapContainer) {
            console.log("Setting up map animations...");
            
            // Simplificar - apenas verificar se o mapa carregou
            const checkMapLoaded = setInterval(() => {
                if (mapContainer.querySelector('.leaflet-container')) {
                    console.log("Map loaded successfully");
                    mapContainer.classList.remove('loading');
                    clearInterval(checkMapLoaded);
                }
            }, 100);
            
            // Timeout de segurança
            setTimeout(() => {
                mapContainer.classList.remove('loading');
                clearInterval(checkMapLoaded);
            }, 5000);
        }
    }

    // Marketplace card entrance animations
    animateMarketplaceCards() {
        const cards = document.querySelectorAll('.marketplace-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    // Notification animations
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            color: white;
            font-weight: 600;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(20px);
            z-index: 10000;
            transform: translateX(400px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Set color based on type
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'var(--gradient-primary)'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 400);
        });
    }

    // Smooth scroll to element
    smoothScrollTo(element) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Add floating action button for "back to top"
    addFloatingBackToTop() {
        const fab = document.createElement('button');
        fab.innerHTML = '<i class="fas fa-arrow-up"></i>';
        fab.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--gradient-primary);
            border: none;
            color: white;
            font-size: 1.2rem;
            box-shadow: 0 8px 24px rgba(247, 99, 0, 0.3);
            cursor: pointer;
            z-index: 1000;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(fab);
        
        // Show/hide based on scroll position
        const toggleFab = () => {
            if (window.scrollY > 300) {
                fab.style.transform = 'scale(1)';
            } else {
                fab.style.transform = 'scale(0)';
            }
        };
        
        window.addEventListener('scroll', toggleFab);
        
        // Scroll to top on click
        fab.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effects
        fab.addEventListener('mouseenter', () => {
            fab.style.transform = 'scale(1.1)';
            fab.style.boxShadow = '0 12px 32px rgba(247, 99, 0, 0.4)';
        });
        
        fab.addEventListener('mouseleave', () => {
            fab.style.transform = window.scrollY > 300 ? 'scale(1)' : 'scale(0)';
            fab.style.boxShadow = '0 8px 24px rgba(247, 99, 0, 0.3)';
        });
    }

    // Enhanced map marker animations
    animateMapMarkers(markers) {
        markers.forEach((marker, index) => {
            setTimeout(() => {
                // Add bounce animation to marker
                const markerElement = marker.getElement();
                if (markerElement) {
                    markerElement.style.animation = 'markerBounce 0.6s ease-out';
                }
            }, index * 200);
        });
        
        // Add marker bounce animation if not exists
        if (!document.querySelector('#marker-styles')) {
            const style = document.createElement('style');
            style.id = 'marker-styles';
            style.textContent = `
                @keyframes markerBounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translate3d(0, 0, 0);
                    }
                    40%, 43% {
                        transform: translate3d(0, -30px, 0);
                    }
                    70% {
                        transform: translate3d(0, -15px, 0);
                    }
                    90% {
                        transform: translate3d(0, -4px, 0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Progressive enhancement for older browsers
    addFallbacks() {
        // Check for CSS custom properties support
        if (!CSS.supports('color', 'var(--primary-orange)')) {
            const fallbackStyles = document.createElement('style');
            fallbackStyles.textContent = `
                .btn-primary { background: rgb(247, 99, 0) !important; }
                .card-title { color: rgb(0, 47, 109) !important; }
            `;
            document.head.appendChild(fallbackStyles);
        }
        
        // Check for backdrop-filter support
        if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
            const elements = document.querySelectorAll('.glass-effect');
            elements.forEach(el => {
                el.style.background = 'rgba(255, 255, 255, 0.9)';
            });
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.measureAnimationPerformance();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoad = perfData.loadEventEnd - perfData.loadEventStart;
            
            // Log performance if needed
            if (this.metrics.pageLoad > 3000) {
                console.warn('Page load time is high:', this.metrics.pageLoad, 'ms');
            }
        });
    }

    measureAnimationPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Optimize animations if FPS is low
                if (this.metrics.fps < 30) {
                    this.optimizeAnimations();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    optimizeAnimations() {
        // Reduce animation complexity on low-performance devices
        const style = document.createElement('style');
        style.textContent = `
            .card { transition: transform 0.2s ease !important; }
            .btn { transition: all 0.2s ease !important; }
            .marketplace-card { transition: all 0.2s ease !important; }
        `;
        document.head.appendChild(style);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animations = new ModernAnimations();
    const performanceMonitor = new PerformanceMonitor();
    
    // Expose animations globally for use by main app
    window.modernAnimations = animations;
    
    // Add custom event listeners for marketplace updates
    document.addEventListener('marketplacesUpdated', (event) => {
        animations.animateMarketplaceCards();
        
        if (window.animateMarketplaceCount) {
            window.animateMarketplaceCount(event.detail.count);
        }
    });
    
    // Add search completion animation
    document.addEventListener('searchCompleted', () => {
        animations.showNotification('Busca concluída com sucesso!', 'success');
    });
    
    // Add geolocation success/error animations
    document.addEventListener('geolocationSuccess', () => {
        animations.showNotification('Localização encontrada!', 'success');
    });
    
    document.addEventListener('geolocationError', () => {
        animations.showNotification('Não foi possível obter sua localização', 'warning');
    });
});

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernAnimations, PerformanceMonitor };
}