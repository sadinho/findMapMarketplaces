// Inicialização do mapa
let map;
let markers = [];
let currentPosition = null;

// Função para inicializar o mapa
function initializeMap() {
    try {
        console.log("Initializing map...");
        
        // Verificar se o elemento do mapa existe
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error("Map element not found!");
            return false;
        }
        
        // Limpar qualquer mapa existente
        if (map) {
            map.remove();
        }
        
        // Verificar se é mobile
        const isMobile = window.innerWidth <= 768;
        console.log("Is mobile device:", isMobile);
        
        // Criar novo mapa (mesmo no mobile para manter funcionalidade)
        map = L.map('map', {
            preferCanvas: true,
            zoomControl: !isMobile, // Remover controles no mobile
            attributionControl: !isMobile
        }).setView([-15.788497, -47.879873], 4);
        
        // Adicionar tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        console.log("Map initialized successfully");
        
        // Remover classe de loading se existir
        mapElement.classList.remove('loading');
        
        // Forçar redimensionamento se necessário
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 100);
        
        return true;
    } catch (error) {
        console.error("Error initializing map:", error);
        return false;
    }
}

// Função para popular os dropdowns
function populateDropdowns() {
    const estados = [...new Set(marketplacesData.marketplaces.map(m => m.location.estado))];
    const estadoSelect = document.getElementById('estado');
    
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado;
        estadoSelect.appendChild(option);
    });
}

// Função para atualizar cidades baseado no estado selecionado
function updateCidades() {
    const estadoSelecionado = document.getElementById('estado').value;
    const cidadeSelect = document.getElementById('cidade');
    const bairroSelect = document.getElementById('bairro');
    
    cidadeSelect.innerHTML = '<option value="">Todas as cidades</option>';
    bairroSelect.innerHTML = '<option value="">Todos os bairros</option>';
    
    if (estadoSelecionado) {
        const cidades = [...new Set(marketplacesData.marketplaces
            .filter(m => m.location.estado === estadoSelecionado)
            .map(m => m.location.cidade))];
        
        cidades.forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });
    }
}

// Função para atualizar bairros baseado na cidade selecionada
function updateBairros() {
    const estadoSelecionado = document.getElementById('estado').value;
    const cidadeSelecionada = document.getElementById('cidade').value;
    const bairroSelect = document.getElementById('bairro');
    
    bairroSelect.innerHTML = '<option value="">Todos os bairros</option>';
    
    if (cidadeSelecionada) {
        const bairros = [...new Set(marketplacesData.marketplaces
            .filter(m => m.location.estado === estadoSelecionado && m.location.cidade === cidadeSelecionada)
            .map(m => m.location.bairro))];
        
        bairros.forEach(bairro => {
            const option = document.createElement('option');
            option.value = bairro;
            option.textContent = bairro;
            bairroSelect.appendChild(option);
        });
    }
}

// Função para limpar todos os marcadores do mapa
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

// Função para mostrar marketplaces no mapa e na lista (ATUALIZADA)
function showMarketplaces(filteredMarketplaces) {
    clearMarkers();
    
    // Usar o novo renderizador de cards se disponível
    if (window.marketplaceRenderer) {
        window.marketplaceRenderer.renderMarketplaces(filteredMarketplaces);
    } else {
        // Fallback para método antigo
        const marketplacesList = document.getElementById('marketplacesList');
        marketplacesList.innerHTML = '';
        
        // Atualizar contador manualmente se o renderizador não estiver disponível
        const countElement = document.getElementById('marketplacesCount');
        if (countElement) {
            countElement.textContent = filteredMarketplaces.length;
        }
        
        filteredMarketplaces.forEach((marketplace, index) => {
            const card = document.createElement('div');
            card.className = 'col-lg-4 col-md-6 col-sm-12';
            card.innerHTML = createMarketplaceCardFallback(marketplace);
            marketplacesList.appendChild(card);
        });
    }
    
    // Adicionar marcadores no mapa (sempre, mesmo no mobile)
    if (map) {
        filteredMarketplaces.forEach(marketplace => {
            const marker = L.marker(marketplace.location.coordinates)
                .bindPopup(`
                    <div style="text-align: center; padding: 10px;">
                        <strong style="color: rgb(0, 47, 109); font-size: 1.1em;">${marketplace.name}</strong><br>
                        <div style="margin: 8px 0; color: rgb(247, 99, 0);">
                            <i class="fas fa-map-marker-alt"></i> 
                            ${marketplace.location.bairro}, ${marketplace.location.cidade}
                        </div>
                        <button 
                            onclick="openExternalLink('${marketplace.url}')" 
                            style="
                                background: linear-gradient(135deg, rgb(247, 99, 0), #ff8533);
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 8px;
                                font-weight: 600;
                                cursor: pointer;
                                margin-top: 5px;
                            ">
                            <i class="fas fa-external-link-alt"></i> Visitar Site
                        </button>
                    </div>
                `)
                .addTo(map);
            markers.push(marker);
        });
        
        // Animar marcadores se a função estiver disponível
        if (window.modernAnimations && typeof window.modernAnimations.animateMapMarkers === 'function') {
            window.modernAnimations.animateMapMarkers(markers);
        }
        
        // Ajustar visualização do mapa apenas se não for mobile
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && filteredMarketplaces.length > 0) {
            const bounds = L.latLngBounds(filteredMarketplaces.map(m => m.location.coordinates));
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (!isMobile && filteredMarketplaces.length === 0) {
            // Voltar para visão padrão do Brasil apenas no desktop
            map.setView([-15.788497, -47.879873], 4);
        }
    }
    
    // Disparar evento para animações
    document.dispatchEvent(new CustomEvent('marketplacesUpdated', {
        detail: { count: filteredMarketplaces.length }
    }));
    
    // Mostrar notificação de busca completa
    if (window.modernAnimations) {
        window.modernAnimations.showNotification(
            `${filteredMarketplaces.length} marketplace${filteredMarketplaces.length !== 1 ? 's' : ''} encontrado${filteredMarketplaces.length !== 1 ? 's' : ''}!`,
            'success'
        );
    }
}

// Função para filtrar marketplaces (ATUALIZADA)
function filterMarketplaces() {
    // Mostrar loading se disponível
    if (window.marketplaceRenderer) {
        window.marketplaceRenderer.showLoading();
    }
    
    // Pequeno delay para mostrar o loading
    setTimeout(() => {
        const estado = document.getElementById('estado').value;
        const cidade = document.getElementById('cidade').value;
        const bairro = document.getElementById('bairro').value;
        
        let filtered = marketplacesData.marketplaces;
        
        if (estado) filtered = filtered.filter(m => m.location.estado === estado);
        if (cidade) filtered = filtered.filter(m => m.location.cidade === cidade);
        if (bairro) filtered = filtered.filter(m => m.location.bairro === bairro);
        
        showMarketplaces(filtered);
        
        // Esconder loading
        if (window.marketplaceRenderer) {
            window.marketplaceRenderer.hideLoading();
        }
        
        // Disparar evento de busca completa
        document.dispatchEvent(new CustomEvent('searchCompleted'));
    }, 300);
}

// Função para calcular distância entre dois pontos (em km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Função para encontrar marketplace mais próximo (ATUALIZADA)
function findNearestMarketplaces() {
    if (!currentPosition) {
        if (window.modernAnimations) {
            window.modernAnimations.showNotification(
                'Por favor, permita o acesso à sua localização.',
                'warning'
            );
        } else {
            alert('Por favor, permita o acesso à sua localização.');
        }
        return;
    }
    
    // Mostrar loading
    if (window.marketplaceRenderer) {
        window.marketplaceRenderer.showLoading();
    }
    
    const marketplacesWithDistance = marketplacesData.marketplaces.map(marketplace => ({
        ...marketplace,
        distance: calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            marketplace.location.coordinates[0],
            marketplace.location.coordinates[1]
        )
    }));
    
    // Ordenar por distância e pegar os 10 mais próximos
    const nearest = marketplacesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
    
    // Usar o novo renderizador com ordenação por distância se disponível
    if (window.marketplaceRenderer && typeof window.marketplaceRenderer.sortByDistance === 'function') {
        const sortedNearest = window.marketplaceRenderer.sortByDistance(nearest, currentPosition);
        showMarketplaces(sortedNearest);
    } else {
        showMarketplaces(nearest);
    }
    
    // Esconder loading
    setTimeout(() => {
        if (window.marketplaceRenderer) {
            window.marketplaceRenderer.hideLoading();
        }
    }, 500);
    
    // Mostrar notificação de sucesso
    if (window.modernAnimations) {
        window.modernAnimations.showNotification(
            `Encontrados ${nearest.length} marketplaces próximos!`,
            'success'
        );
    }
}

// Função para centralizar o mapa em um marketplace específico
function centerMapOnMarketplace(marketplaceId) {
    const marketplace = marketplacesData.marketplaces.find(m => m.id === marketplaceId);
    if (marketplace) {
        map.setView(marketplace.location.coordinates, 15);
        
        // Encontrar e abrir o popup do marcador
        markers.forEach(marker => {
            const latLng = marker.getLatLng();
            if (latLng.lat === marketplace.location.coordinates[0] && 
                latLng.lng === marketplace.location.coordinates[1]) {
                marker.openPopup();
                
                // Mostrar notificação
                if (window.modernAnimations) {
                    window.modernAnimations.showNotification(
                        `Centralizado em ${marketplace.name}`,
                        'info'
                    );
                }
            }
        });
    }
}

// Marketplace card template de fallback (caso o novo renderizador não esteja disponível)
function createMarketplaceCardFallback(marketplace) {
    return `
        <div class="marketplace-card" onclick="centerMapOnMarketplace(${marketplace.id})">
            <div class="marketplace-header">
                <div class="marketplace-icon">
                    <i class="fas fa-store"></i>
                </div>
                <div class="flex-1">
                    <h3 class="marketplace-name">${marketplace.name}</h3>
                </div>
            </div>
            <div class="marketplace-content">
                <div class="marketplace-location">
                    <div class="location-item location-primary">
                        <i class="fas fa-city"></i>
                        <span>${marketplace.location.cidade}</span>
                    </div>
                    <div class="location-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${marketplace.location.estado}</span>
                    </div>
                    <div class="location-item">
                        <i class="fas fa-home"></i>
                        <span>${marketplace.location.bairro}</span>
                    </div>
                </div>
                <button 
                   class="marketplace-btn"
                   onclick="event.stopPropagation(); openExternalLink('${marketplace.url}')">
                    <i class="fas fa-external-link-alt"></i>
                    <span>Visitar Site</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * Handle links in Android WebView
 * This function detects if the app is running in a WebView and modifies all links
 * to use Android's JavaScript interface for proper handling
 */
function setupWebViewLinks() {
    // Check if running in Android WebView (window.Android will exist if properly configured)
    const isAndroidWebView = typeof window.Android !== 'undefined';
    
    if (isAndroidWebView) {
        console.log("Running in Android WebView - setting up link handling");
        
        // Process all existing links on the page
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const url = this.getAttribute('href');
                
                // Call the Android method to open URL
                console.log("Opening URL via Android interface:", url);
                window.Android.openUrl(url);
            });
        });
    }
}

/**
 * Function to open external links via Android interface
 */
function openExternalLink(url) {
    if (typeof window.Android !== 'undefined') {
        console.log("Opening URL via Android interface:", url);
        window.Android.openUrl(url);
        
        // Mostrar notificação de redirecionamento
        if (window.modernAnimations) {
            window.modernAnimations.showNotification(
                'Abrindo marketplace...',
                'info'
            );
        }
    } else {
        // Fallback for browser testing
        window.open(url, '_blank');
        
        // Mostrar notificação para browser
        if (window.modernAnimations) {
            window.modernAnimations.showNotification(
                'Redirecionando para o marketplace...',
                'info'
            );
        }
    }
}

/**
 * Get user location with enhanced WebView support
 * This function tries multiple methods to get the user's location
 * and handles permissions more gracefully in WebView environments
 */
function getUserLocation() {
    // Show loading state
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.classList.remove('d-none');
    
    // Mostrar notificação de início de busca
    if (window.modernAnimations) {
        window.modernAnimations.showNotification(
            'Obtendo sua localização...',
            'info'
        );
    }
    
    // First, check if we can use Android's direct location API (preferred method in WebView)
    if (window.Android && typeof window.Android.getLocation === 'function') {
        try {
            console.log("Getting location via Android interface");
            window.Android.getLocation();
            // Note: This is asynchronous - the Android side will call setUserLocation() when ready
            return;
        } catch (err) {
            console.error("Error using Android location:", err);
            // Fall back to browser geolocation
        }
    }
    
    // Browser's geolocation API (backup method)
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000 // 5 minutos
        };
        
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                console.log("Got position via browser API:", position.coords);
                setUserLocation(position.coords.latitude, position.coords.longitude);
            },
            // Error callback
            (error) => {
                console.error("Geolocation error:", error);
                
                // Handle specific error codes
                let errorMessage = "Erro ao obter sua localização. ";
                let notificationType = 'error';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Acesso à localização negado. Ative a permissão nas configurações.";
                        notificationType = 'warning';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Localização indisponível. Verifique se o GPS está ativo.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Tempo esgotado. Tente novamente.";
                        break;
                    default:
                        errorMessage = "Erro desconhecido ao obter localização.";
                }
                
                // Mostrar notificação de erro
                if (window.modernAnimations) {
                    window.modernAnimations.showNotification(errorMessage, notificationType);
                } else {
                    alert(errorMessage);
                }
                
                // Disparar evento de erro de geolocalização
                document.dispatchEvent(new CustomEvent('geolocationError'));
                
                // Hide loading state
                if (loadingOverlay) loadingOverlay.classList.add('d-none');
            },
            options
        );
    } else {
        const errorMsg = "Seu navegador não suporta geolocalização.";
        
        if (window.modernAnimations) {
            window.modernAnimations.showNotification(errorMsg, 'error');
        } else {
            alert(errorMsg);
        }
        
        // Hide loading state
        if (loadingOverlay) loadingOverlay.classList.add('d-none');
    }
}

/**
 * Set user location from coordinates
 * This function is called either by the browser API or from Android
 */
function setUserLocation(latitude, longitude) {
    console.log(`Setting location: ${latitude}, ${longitude}`);
    
    // Update global currentPosition variable
    currentPosition = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
    };
    
    // Disparar evento de sucesso de geolocalização
    document.dispatchEvent(new CustomEvent('geolocationSuccess'));
    
    // Call the nearest marketplace function
    findNearestMarketplaces();
    
    // Hide loading state
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.classList.add('d-none');
}

// Inicialização (ATUALIZADA)
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Xcondo Shop App...");
    
    // Adicionar loading ao mapa
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.classList.add('loading');
    }
    
    // Verificar se os elementos existem
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');
    const bairroSelect = document.getElementById('bairro');
    const btnMaisProximo = document.getElementById('btnMaisProximo');
    
    console.log("Filter elements found:", {
        estado: !!estadoSelect,
        cidade: !!cidadeSelect,
        bairro: !!bairroSelect,
        btnMaisProximo: !!btnMaisProximo,
        map: !!mapElement
    });
    
    if (!estadoSelect || !cidadeSelect || !bairroSelect) {
        console.error("Filter elements not found! Check HTML structure.");
        return;
    }
    
    // Inicializar mapa primeiro
    const mapInitialized = initializeMap();
    if (!mapInitialized) {
        console.error("Failed to initialize map!");
    }
    
    // Event listeners para filtros
    estadoSelect.addEventListener('change', () => {
        console.log("Estado changed:", estadoSelect.value);
        updateCidades();
        filterMarketplaces();
    });

    cidadeSelect.addEventListener('change', () => {
        console.log("Cidade changed:", cidadeSelect.value);
        updateBairros();
        filterMarketplaces();
    });

    bairroSelect.addEventListener('change', () => {
        console.log("Bairro changed:", bairroSelect.value);
        filterMarketplaces();
    });
    
    // Event listener para botão "Mais Próximo"
    if (btnMaisProximo) {
        // Remove old event listener if there was one
        btnMaisProximo.replaceWith(btnMaisProximo.cloneNode(true));
        // Add our new event listener
        const newBtn = document.getElementById('btnMaisProximo');
        newBtn.addEventListener('click', () => {
            console.log("Mais próximo button clicked");
            getUserLocation();
        });
    }
    
    // Initialize WebView link handling
    setupWebViewLinks();
    
    // Load initial data
    console.log("Loading initial data...");
    populateDropdowns();
    
    // Aguardar o renderizador estar disponível antes de mostrar marketplaces
    const initializeMarketplaces = () => {
        if (window.marketplaceRenderer && map) {
            console.log("Marketplace renderer available - showing marketplaces");
            showMarketplaces(marketplacesData.marketplaces);
        } else {
            console.log("Marketplace renderer or map not ready - retrying in 200ms");
            setTimeout(initializeMarketplaces, 200);
        }
    };
    
    // Iniciar após o mapa estar carregado
    setTimeout(() => {
        if (map) {
            // Forçar redimensionamento do mapa
            map.invalidateSize();
            initializeMarketplaces();
        } else {
            console.error("Map not initialized after timeout");
        }
    }, 1000);
    
    console.log("Xcondo Shop App initialized successfully");
});