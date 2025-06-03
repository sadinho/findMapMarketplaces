# Marketplace Finder Brasil

Uma aplicação web responsiva para encontrar marketplaces no Brasil, com funcionalidades de busca por localização e visualização em mapa.

## Funcionalidades

- Mapa interativo do Brasil com marcadores de marketplaces
- Filtros por Estado, Cidade e Bairro
- Função "Mais Próximo a Mim" usando geolocalização
- Visualização em lista com cards dos marketplaces
- Design responsivo para todos os dispositivos

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3
- Leaflet.js para mapas
- OpenStreetMap para tiles do mapa

## Como Usar

1. Clone este repositório
2. Configure seu servidor Apache para servir os arquivos
3. Acesse através do navegador

## Estrutura de Arquivos

```
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── data.js
└── README.md
```

## Configuração no Apache

1. Copie todos os arquivos para o diretório do seu servidor Apache (geralmente `/var/www/html/` ou similar)
2. Certifique-se de que o Apache está configurado para servir arquivos estáticos
3. Acesse através do navegador usando o endereço do seu servidor

## Personalização

Para adicionar ou modificar marketplaces, edite o arquivo `js/data.js`. Cada marketplace deve seguir o formato:

```javascript
{
    id: number,
    name: string,
    url: string,
    location: {
        estado: string,
        cidade: string,
        bairro: string,
        coordinates: [latitude, longitude]
    }
}
```

## Licença

MIT