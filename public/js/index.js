const apiKey = '8fc6900bb6bd4b6197f389a0e186b130';
const pageSize = 9;
let currentPage = 1;
let totalResults = 0;
let currentCategory = '';
let country = 'us';

// PETICION AL ENDPOINT
async function fetchNews(page, category = '') {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${pageSize}&page=${page}&category=${category}&apiKey=${apiKey}`;
    
    // Mostrar loader
    document.getElementById('loader').style.display = 'block';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        totalResults = data.totalResults;
        displayShowcaseNews(data.articles[0]);
        displayNewsCards(data.articles.slice(1));
        displayPagination(category);
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        document.querySelector('.news-cards').innerHTML = '<p>Error al cargar noticias. Inténtalo de nuevo más tarde.</p>';
    } finally {
        // Ocultar loader
        document.getElementById('loader').style.display = 'none';
    }
}

// FUNCION DE BUSQUEDA
async function searchNews(query) {
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=${pageSize}&apiKey=${apiKey}`;
    
    // Mostrar loader
    document.getElementById('loader').style.display = 'block';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        totalResults = data.totalResults;
        displayNewsCards(data.articles);
    } catch (error) {
        console.error('Error al buscar noticias:', error);
        document.querySelector('.news-cards').innerHTML = '<p>Error al buscar noticias. Inténtalo de nuevo más tarde.</p>';
    } finally {
        // Ocultar loader
        document.getElementById('loader').style.display = 'none';
    }
}

// EVENTO ENTRADA DE INPUT PARA BÚSQUEDA EN TIEMPO REAL
document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 2) { // Buscar si la longitud de la consulta es mayor que 2 caracteres
        searchNews(query);
    } else {
        fetchNews(currentPage, currentCategory); // Si la consulta es menor, mostrar noticias principales
    }
});

// EVENTO DE CLIC EN EL BOTÓN DE BÚSQUEDA
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search').value;
    if (query.length > 2) { // Buscar si la longitud de la consulta es mayor que 2 caracteres
        searchNews(query);
    }
});

// FUNCION PARA MOSTRAR EN EL CONTENEDOR DE SHOWCASE
function displayShowcaseNews(article) {
    const showcase = document.querySelector('.showcase');
    showcase.style.backgroundImage = `url('${article.urlToImage || '/images/not-available.png'}')`;
    showcase.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description || 'Descripción no disponible'}< style="color: black"/p>
        <a href="${article.url}" class="btn" target="_blank">Leer más <i class="fas fa-chevron-right"></i></a>
    `;
}

// FUNCION PARA MOSTRAR CONTENIDO DE LAS NOTICIAS
function displayNewsCards(articles) {
    const newsCards = document.querySelector('.news-cards');
    newsCards.classList.remove('visible');

    setTimeout(() => {
        newsCards.innerHTML = '';
        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            const img = document.createElement('img');
            img.src = article.urlToImage || '/images/not-available.png';
            img.alt = article.title || 'No disponible';

            const title = document.createElement('h3');
            title.classList.add('news-title');
            title.textContent = article.title || 'Título no disponible';

            const description = document.createElement('p');
            description.classList.add('news-description');
            description.style.color = 'black'
            description.textContent = article.description || 'Descripción no disponible';

            const link = document.createElement('a');
            link.href = `details.html?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description)}&urlToImage=${encodeURIComponent(article.urlToImage)}&url=${encodeURIComponent(article.url)}`;
            link.textContent = 'Leer más';
            link.target = '_self';

            newsItem.appendChild(img);
            newsItem.appendChild(title);
            newsItem.appendChild(description);
            newsItem.appendChild(link);
            newsCards.appendChild(newsItem);
        });

        newsCards.classList.add('visible');
    }, 500);
}

// FUNCION DE PAGINACION
function displayPagination(category = '') {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalResults / pageSize);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.classList.toggle('disabled', currentPage === 1);
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchNews(currentPage, category);
        }
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.classList.toggle('disabled', currentPage === totalPages);
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchNews(currentPage, category);
        }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);
}

// FUNCION PARA AGREGAR EVENTOS A LAS CATEGORÍAS
function addCategoryEventListener(categoryId, categoryName) {
    document.getElementById(categoryId).addEventListener('click', (e) => {
        e.preventDefault();
        currentCategory = categoryName;
        currentPage = 1;
        fetchNews(currentPage, currentCategory);
        document.getElementById('news-cards').scrollIntoView({ behavior: 'smooth' });
    });
}

// AÑADIENDO EVENTOS A LAS CATEGORÍAS
addCategoryEventListener('negocios', 'business');
addCategoryEventListener('deportes', 'sports');
addCategoryEventListener('tecnologia', 'technology');
addCategoryEventListener('entretenimiento', 'entertainment');

fetchNews(currentPage, currentCategory);
