// Enhanced Marketplace Cards Generator - Complete Version

class MarketplaceCardsRenderer {
    constructor() {
        this.container = document.getElementById('marketplacesList');
        this.countElement = document.getElementById('marketplacesCount');
        this.isLoading = false;
        this.init();
    }

    init() {
        // Inicializar o renderizador
        console.log('Marketplace Cards Renderer initialized');
    }

    // Render marketplace cards with improved design
    renderMarketplaces(marketplaces) {
        if (!this.container) {
            console.error('Marketplace container not found');
            return;
        }

        // Clear existing content
        this.container.innerHTML = '';
        
        // Update count
        this.updateCount(marketplaces.length);

        if (marketplaces.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Render cards
        marketplaces.forEach((marketplace, index) => {
            const card = this.createMarketplaceCard(marketplace, index);
            this.container.appendChild(card);
        });

        // Trigger animation event
        this.triggerAnimations(marketplaces.length);
    }

    // Create individual marketplace card
    createMarketplaceCard(marketplace, index) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 col-sm-12';
        
        const card = document.createElement('div');
        card.className = 'marketplace-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());

        // Create card header with icon
        const header = document.createElement('div');
        header.className = 'marketplace-header';
        
        const icon = document.createElement('div');
        icon.className = 'marketplace-icon';
        icon.innerHTML = '<i class="fas fa-store"></i>';
        
        const titleContainer = document.createElement('div');
        titleContainer.className = 'flex-1';
        
        const title = document.createElement('h3');
        title.className = 'marketplace-name';
        title.textContent = marketplace.name || 'Marketplace';
        
        titleContainer.appendChild(title);
        header.appendChild(icon);
        header.appendChild(titleContainer);

        // Create card content
        const content = document.createElement('div');
        content.className = 'marketplace-content';

        // Location information
        const location = document.createElement('div');
        location.className = 'marketplace-location';

        // Add location items
        if (marketplace.location) {
            if (marketplace.location.cidade) {
                const cityItem = this.createLocationItem('fas fa-city', marketplace.location.cidade, 'location-primary');
                location.appendChild(cityItem);
            }
            
            if (marketplace.location.estado) {
                const stateItem = this.createLocationItem('fas fa-map-marker-alt', marketplace.location.estado);
                location.appendChild(stateItem);
            }
            
            if (marketplace.location.bairro) {
                const neighborhoodItem = this.createLocationItem('fas fa-home', marketplace.location.bairro);
                location.appendChild(neighborhoodItem);
            }
        }

        // Visit button
        const button = document.createElement('a');
        button.className = 'marketplace-btn';
        button.href = marketplace.url || '#';
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.innerHTML = `
            <i class="fas fa-external-link-alt"></i>
            <span>Visitar Site</span>
        `;

        // Add click tracking
        button.addEventListener('click', () => {
            this.trackMarketplaceClick(marketplace);
        });

        // Assemble card
        content.appendChild(location);
        content.appendChild(button);
        card.appendChild(header);
        card.appendChild(content);
        col.appendChild(card);

        return col;
    }

    // Create location item
    createLocationItem(iconClass, text, extraClass = '') {
        const item = document.createElement('div');
        item.className = `location-item ${extraClass}`;
        
        const icon = document.createElement('i');
        icon.className = iconClass;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        
        item.appendChild(icon);
        item.appendChild(textSpan);
        
        return item;
    }

    // Render empty state
    renderEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'col-12';
        emptyState.innerHTML = `
            <div class="marketplace-empty">
                <i class="fas fa-search"></i>
                <h3>Nenhum marketplace encontrado</h3>
                <p>Tente ajustar os filtros ou buscar em uma região diferente.</p>
            </div>
        `;
        this.container.appendChild(emptyState);
    }

    // Update count badge
    updateCount(count) {
        if (this.countElement) {
            // Animate count change
            const currentCount = parseInt(this.countElement.textContent) || 0;
            this.animateCountChange(currentCount, count);
        }
    }

    // Animate count change
    animateCountChange(from, to) {
        const duration = 500;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(from + (to - from) * easeOut);
            
            this.countElement.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Add celebration effect
                this.countElement.style.animation = 'badgePulse 0.6s ease-in-out';
                setTimeout(() => {
                    this.countElement.style.animation = '';
                }, 600);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Show loading state
    showLoading() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.container.innerHTML = '';
        
        // Create loading cards
        for (let i = 0; i < 6; i++) {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6 col-sm-12';
            
            const loadingCard = document.createElement('div');
            loadingCard.className = 'marketplace-card loading';
            
            col.appendChild(loadingCard);
            this.container.appendChild(col);
        }
    }

    // Hide loading state
    hideLoading() {
        this.isLoading = false;
    }

    // Trigger animations
    triggerAnimations(count) {
        // Dispatch custom event for animations
        document.dispatchEvent(new CustomEvent('marketplacesUpdated', {
            detail: { count }
        }));

        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Track marketplace clicks
    trackMarketplaceClick(marketplace) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'marketplace_click', {
                'marketplace_name': marketplace.name,
                'marketplace_location': `${marketplace.location?.cidade}, ${marketplace.location?.estado}`
            });
        }

        // Show notification
        if (window.modernAnimations) {
            window.modernAnimations.showNotification(
                `Redirecionando para ${marketplace.name}...`, 
                'info'
            );
        }
    }

    // Add filter animations
    animateFilter() {
        const cards = this.container.querySelectorAll('.marketplace-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 50);
        });
    }

    // Sort marketplaces by distance
    sortByDistance(marketplaces, userLocation) {
        if (!userLocation || !userLocation.lat || !userLocation.lng) {
            return marketplaces;
        }

        return marketplaces.sort((a, b) => {
            const distA = this.calculateDistance(
                userLocation.lat, userLocation.lng,
                a.location?.coordinates?.[0], a.location?.coordinates?.[1]
            );
            
            const distB = this.calculateDistance(
                userLocation.lat, userLocation.lng,
                b.location?.coordinates?.[0], b.location?.coordinates?.[1]
            );
            
            return distA - distB;
        });
    }

    // Calculate distance between two points
    calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
        
        const R = 6371; // Radius of the Earth in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

// Initialize marketplace cards renderer
document.addEventListener('DOMContentLoaded', () => {
    window.marketplaceRenderer = new MarketplaceCardsRenderer();
    
    // Exemplo de como usar (remova se já tiver implementado em app.js):
    // Dados de exemplo para teste
    if (typeof marketplacesData !== 'undefined') {
        window.marketplaceRenderer.renderMarketplaces(marketplacesData);
    }
    
    // Renderizar os cards de exemplo (remova se já tiver dados reais)
    setTimeout(() => {
        if (window.marketplaceRenderer) {
            window.marketplaceRenderer.renderMarketplaces(marketplacesData);
        }
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarketplaceCardsRenderer;
}