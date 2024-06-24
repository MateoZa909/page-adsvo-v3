document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const description = params.get('description');
    const urlToImage = params.get('urlToImage');
    const content = params.get('content');
    const url = params.get('url');

    document.getElementById('news-details').innerHTML = `
        <h1>${title}</h1>
        <img src="${urlToImage || 'images/not-available.png'}" alt="${title}" class="img-fluid">
        <p style="color: #000" class="desc">${description}</p>
        <a href="${url}" class="btn btn-primary" target="_blank">Leer artículo completo</a>
    `;

    // Fetch news by category and display
    await fetchNewsByCategory('business', 'Negocios');
    await fetchNewsByCategory('sports', 'Deportes');
    await fetchNewsByCategory('technology', 'Tecnología');
    await fetchNewsByCategory('entertainment', 'Entretenimiento');
});

async function fetchNewsByCategory(category, categoryName) {
    const apiKey = '8fc6900bb6bd4b6197f389a0e186b130';
    const pageSize = 8;
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=${pageSize}&category=${category}&apiKey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const categorySection = document.createElement('div');
    categorySection.classList.add('category-section');
    categorySection.innerHTML = `<h3>${categoryName}</h3>`;

    const newsCards = document.createElement('div');
    newsCards.classList.add('news-cards');

    data.articles.forEach(article => {
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
        description.textContent = article.description || 'Descripción no disponible';

        const link = document.createElement('a');
        link.href = `details.html?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description)}&urlToImage=${encodeURIComponent(article.urlToImage)}&content=${encodeURIComponent(article.content)}&url=${encodeURIComponent(article.url)}`;
        link.textContent = 'Leer más';
        link.target = '_self';

        newsItem.appendChild(img);
        newsItem.appendChild(title);
        newsItem.appendChild(description);
        newsItem.appendChild(link);
        newsCards.appendChild(newsItem);
    });

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    const prevButton = document.createElement('button');
    prevButton.textContent = '';
    prevButton.classList.add('btn', 'btn-outline-secondary');
    prevButton.disabled = data.page === 1;
    prevButton.addEventListener('click', () => {
        if (data.page > 1) {
            fetchNewsByCategory(category, categoryName, data.page - 1);
        }
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = '';
    nextButton.classList.add('btn', 'btn-outline-secondary');
    nextButton.disabled = data.page === Math.ceil(data.totalResults / pageSize);
    nextButton.addEventListener('click', () => {
        if (data.page < Math.ceil(data.totalResults / pageSize)) {
            fetchNewsByCategory(category, categoryName, data.page + 1);
        }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(nextButton);

    categorySection.appendChild(newsCards);
    categorySection.appendChild(pagination);
    document.getElementById('category-news').appendChild(categorySection);
}

// Recupera la información del usuario del localStorage
document.addEventListener('DOMContentLoaded', (event) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.nombre_usuario) {
        document.getElementById('name-user').textContent = user.nombre_usuario;
    }
});

const modal = document.getElementById("myModal"); // Modal registro login
const loginLink = document.querySelector('#btn-signin');

// Función para abrir el modal
function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

// Modal handling
const span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Evento cierre Modal
document.getElementById('registerFormElement').addEventListener('submit', function(event) {
    event.preventDefault();
    // Simulate registration request
    // alert('Registro exitoso!');
    closeModal();
});

// Manejador de evento para el enlace "Iniciar sesión"
loginLink.addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    openModal(); // Abre el modal
});

// Manejador de evento para el enlace "Iniciar sesión"
document.getElementById('btn-signin').addEventListener('click', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del enlace
    openModal(); // Abre el modal
});