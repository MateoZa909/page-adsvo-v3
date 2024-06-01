let isLogin = false;
const modal = document.getElementById("myModal"); // Modal registro login
const nameUser = document.getElementById("name-user"); 
const btnLogout = document.getElementById("log-out"); 
let userRecord = {};

// Peticion al endpoint de login
document.getElementById('loginFormElement').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtén los valores de los campos del formulario
    const email = document.getElementById('loginEmail').value;
    const contrasena = document.getElementById('loginPassword').value;

    // Crea el objeto de datos para enviar
    const data = {
      email: email,
      contrasena: contrasena
    };

    try {
        console.log(data);
      // Envía los datos al servidor usando Fetch
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Maneja la respuesta del servidor
      const result = await response.json();
      console.log(result);
      if (result.error) {
        alert(result.message);
      } else {
        isLogin = true;
        modal.style.display = 'none';
        userRecord = result.user;
        nameUser.innerHTML = `${userRecord.nombre_usuario}`
        // Puedes redirigir al usuario o realizar otras acciones aquí
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Ocurrió un error al registrar. Inténtalo de nuevo.');
    }
});

// Peticion al endpoint de registro
document.getElementById('registerFormElement').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtén los valores de los campos del formulario
    const nombres = document.getElementById('registerNombres').value;
    const nombre_usuario = document.getElementById('registerNombreUsuario').value;
    const email = document.getElementById('registerEmail').value;
    const contrasena = document.getElementById('registerPassword').value;

    // Crea el objeto de datos para enviar
    const data = {
      nombres: nombres,
      nombre_usuario: nombre_usuario,
      email: email,
      contrasena: contrasena
    };

    try {
        console.log(data);
      // Envía los datos al servidor usando Fetch
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Maneja la respuesta del servidor
      const result = await response.json();
      console.log(result);
      if (result.error) {
        alert(result.message);
      } else {
        console.log('Entro aqui');
        alert('Registro exitoso!');
        // Puedes redirigir al usuario o realizar otras acciones aquí
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Ocurrió un error al registrar. Inténtalo de nuevo.');
    }
});

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Funcion logout
const logout = () => {
    isLogin = false;
    userRecord = {};
    nameUser.innerHTML = '';
    console.log('asa');
}

// LLamada a la funcion logout
btnLogout.addEventListener('click', () => {
    logout();
})

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

function showModal(message) {
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

// Mostrar modal después de 1 minuto (60000 ms)
setTimeout(function() {
    if (!isLogin) {
        modal.style.display = 'flex';
    } 
}, 3000);

// Evento cierre Modal
document.getElementById('registerFormElement').addEventListener('submit', function(event) {
    event.preventDefault();
    // Simulate registration request
    // alert('Registro exitoso!');
    closeModal();
});

// funcion para cambiar de inicio a registro
// function toggleForms() {
//     const loginForm = $('#loginForm');
//     const registerForm = $('#registerForm');
//     loginForm.toggle();
//     registerForm.toggle();
// }
