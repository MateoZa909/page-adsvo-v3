const express = require('express');
const mysql = require('mysql2')
// import axios from 'axios';
// import cheerio from 'cheerio';
const bodyParser = require('body-parser');

// bcrypt
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middleware para analizar datos de formularios en las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));  

// Middleware para analizar datos JSON en las solicitudes
app.use(bodyParser.json());

const cors = require('cors'); // Importar el paquete 'cors'
app.use(cors());
// const apiKey = '8fc6900bb6bd4b6197f389a0e186b130';
// const newsApiUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + apiKey;

const connection = mysql.createConnection({
    host: 'localhost',       // Cambia esto si tu base de datos no está en localhost
    user: 'root',      // Reemplaza con tu usuario de MySQL
    password: '', // Reemplaza con tu contraseña de MySQL
    database: 'news'         // Nombre de tu base de datos
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log(`Conectado a la base de datos MySQL news`);
});


// Endpoint de registro
app.post('/register', async (req, res) => {
    const { nombres, nombre_usuario, email, contrasena } = req.body;

    if (!nombres || !nombre_usuario || !email || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const [results] = await connection.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (results.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña
        const hashedPassword = bcrypt.hashSync(contrasena, 8);

        // Crear el nuevo usuario
        await connection.promise().query('INSERT INTO usuarios (nombres, nombre_usuario, email, contrasena) VALUES (?, ?, ?, ?)', 
        [nombres, nombre_usuario, email, hashedPassword]);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
        console.log('Registro exitoso');
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// Endpoint de login
app.post('/login', async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        // Buscar al usuario por email
        const [results] = await connection.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
        console.log(results);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];

        // Verificar la contraseña
        const isPasswordValid = bcrypt.compareSync(contrasena, user.contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Crear un token JWT
        // const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', user});
    } catch (err) {
        console.error('Error al buscar el usuario:', err);
        res.status(500).json({ message: 'Error al buscar el usuario' });
    }
});

// app.get('/api/news', async (req, res) => {
//     try {
//         const response = await axios.get(newsApiUrl);
//         const articles = response.data.articles;

//         const detailedArticles = await Promise.all(articles.map(async article => {
//             const fullContent = await getFullContent(article.url);
//             return {
//                 ...article,
//                 fullContent
//             };
//         }));

//         res.json(detailedArticles);
//     } catch (error) {
//         console.error('Error fetching news:', error);
//         res.status(500).send('Error fetching news');
//     }
// });

// async function getFullContent(url) {
//     try {
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);
//         return $('article').text();  // Ajusta el selector según la estructura de la página
//     } catch (error) {
//         console.error('Error scraping content:', error);
//         return 'Contenido completo no disponible';
//     }
// }

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
