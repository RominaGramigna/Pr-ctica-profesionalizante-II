document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const Usuario = document.getElementById('usuario').value;
    const Contraseña = document.getElementById('contraseña').value;
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario, Contraseña }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token); // Guarda el token en el almacenamiento local
        alert('Login exitoso');
        window.location.href = 'index.html';
      } else {
        alert(data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      alert('Hubo un problema con el servidor');
    }
  });
  