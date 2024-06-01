import requests

# Define la URL de la API y tu clave de API
url = "https://newsapi.org/v2/everything"
api_key = "8fc6900bb6bd4b6197f389a0e186b130"

# Define los parámetros de la solicitud
params = {
    'q': 'término de búsqueda',  # Cambia esto por el término de búsqueda que desees
    'apiKey': api_key,
}

# Realiza la solicitud GET a la API
response = requests.get(url, params=params)

# Verifica si la solicitud fue exitosa
if response.status_code == 200:
    data = response.json()
    
    # Itera sobre los artículos y extrae el contenido
    for article in data['articles']:
        content = article.get('content', 'No content available')
        print(f"Contenido = {content}")
else:
    print(f"Error: {response.status_code}")


