window.addEventListener('load', async () => {
  const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local

  if (!token) {
    alert('Debes iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/index', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Envía el token en el header
      },
    });

    if (!response.ok) {
      alert('Tu sesión ha expirado o no estás autenticado');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    alert('Hubo un problema con el servidor');
    window.location.href = 'login.html';
  }
});

document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('token'); // Borra el token del almacenamiento local
  alert('Sesión cerrada');
  window.location.href = 'login.html';
});

/*************************************************************************/

function openFilter (id) {
    const filtro = document.getElementById(id);
    if (filtro) {
        filtro.classList.remove('disabled');
    }
}

function closeFilter (id) {
    const filtro = document.getElementById(id);
    if (filtro) {
        filtro.classList.add('disabled');
        const searchInput = filtro.querySelector('.search_inp');
        const searchResults = filtro.querySelector('.searchResults');

        if (searchInput) {
            searchInput.value = '';
            searchInput.removeAttribute('disabled');
        }

        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }
}

function vaciarInputs(id) {
    const formulario = document.getElementById('container-' + id);
    console.log(formulario);
    
    if(formulario) {
        const inputs = document.querySelectorAll('#container-' + id + ' input, textarea, select');
        const caja = document.querySelector('#notaspreparacion')
        const caja2 = document.querySelector('#notassalida')
        inputs.forEach(input => {
            input.value = '';
        })
        if(caja) {
          caja.innerHTML = '';
        }
        if(caja2) {
          caja2.innerHTML = '';
        }
        

    }
}

function soloLectura(id) {
    const formulario = document.getElementById('container-' + id);
    console.log(formulario);
    
    if(formulario) {
        const inputs = document.querySelectorAll('#container-' + id + ' input, textarea, select');
        inputs.forEach(input => {
            input.setAttribute('disabled', true);
        })
    }
}

function botonModificar(id) {
        const formulario = document.getElementById('container-' + id);
                
        if(formulario) {
            const inputs = document.querySelectorAll('#container-' + id + ' input, textarea, select');

            inputs.forEach(input => {
                input.removeAttribute('disabled')
            });
        }
}

function botonAgregar(id) {
  const formulario = document.getElementById('container-' + id);
                
        if(formulario) {
            const inputs = document.querySelectorAll('#container-' + id + ' input, textarea, select');

            inputs.forEach(input => {
                input.removeAttribute('disabled')
            });
            vaciarInputs(id);
        }
}

/************************************* SECCION INFANTES ***********************************/
document.getElementById('search_inp_inf').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_inf').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-infantes?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_inf');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.id_infante + ", Nombre: " + item.nombre + ", Apellido: " + item.apellido + ", DNI: " + item.dni];
                li.dataset.id = item.id_infante;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('infante');
                    selectResult(item.id_infante);
                    closeFilter('filter-inf');
                });
                botonModificar()
                searchResults.appendChild(li);
            });
        });
});

function selectResult(id_infante) {
    fetch(`http://localhost:3000/api/completar-infantes/${id_infante}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del infante recibidos:', data);
            const fechaOriginal = new Date(data.FechaNacimiento);
            const fechaFormateada = fechaOriginal.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idinfante').value = data.ID_Infante;
            document.getElementById('nombreinfante').value = data.NombreInfante;
            document.getElementById('apellidoinfante').value = data.ApellidoInfante;
            document.getElementById('dniinfante').value = data.DNIInfante;
            document.getElementById('generoinfante').value = data.GeneroInfante;
            document.getElementById('direccioninfante').value = data.Direccion;
            document.getElementById('fecha-nacimientoinfante').value = fechaFormateada;
            document.getElementById('idtutores').value = data.ID_Tutor;
            document.getElementById('nombretutores').value = data.NombreTutor;
            document.getElementById('apellidotutores').value = data.ApellidoTutor;
            document.getElementById('dnitutores').value = data.DNITutor;
            document.getElementById('relacion-infantetutores').value = data.Parentezco;
            document.getElementById('seguroemergencias').value = data.ObraSocial;
            document.getElementById('medicoemergencias').value = data.MedicoCabecera;
            document.getElementById('hospitalemergencias').value = data.HospitalPreferido;
            document.getElementById('condicionemergencias').value = data.ID_Condicion;
            document.getElementById('medicacionemergencias').value = data.Medicacion;
            document.getElementById('autorizacion1').value = data.RecibirAuxilio;
            document.getElementById('autorizacion2').value = data.RecibirAtencionMedica;
            document.getElementById('autorizacion3').value = data.FotosRedes;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/*************************** Insercion **********************************/
async function guardarDatos() {
    
    // Obtener los valores de los campos del formulario
    const id_infante = document.getElementById('idinfante').value;
    const nombre = document.getElementById('nombreinfante').value;
    const apellido = document.getElementById('apellidoinfante').value;
    const dni = document.getElementById('dniinfante').value;
    const genero = document.getElementById('generoinfante').value;
    const fechaNacimiento = document.getElementById('fecha-nacimientoinfante').value;
    const ID_tutor = document.getElementById('idtutores').value;
    const obra_social = document.getElementById('seguroemergencias').value;
    const medico_cabecera = document.getElementById('medicoemergencias').value;
    const hospital_pref = document.getElementById('hospitalemergencias').value;
    const ID_condicion = document.getElementById('condicionemergencias').value;
    const medicacion = document.getElementById('medicacionemergencias').value;
    const recibir_auxilio = document.getElementById('autorizacion1').value;
    const recibir_atencion_med = document.getElementById('autorizacion2').value;
    const fotos_redes = document.getElementById('autorizacion3').value;

    // Crear un objeto con los datos
    const infante = {
      id_infante:  id_infante,
      nombre: nombre,
      apellido: apellido,
      dni: dni,
      genero: genero,
      fechaNacimiento: fechaNacimiento,
      ID_tutor: ID_tutor,
      obra_social: obra_social,
      medico_cabecera: medico_cabecera,
      hospital_pref: hospital_pref,
      ID_condicion: ID_condicion,
      medicacion: medicacion,
      recibir_auxilio: recibir_auxilio,
      recibir_atencion_med: recibir_atencion_med,
      fotos_redes: fotos_redes
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-infantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(infante),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('infante');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

  // Llamar esta función al cargar el formulario
async function cargarCondiciones() {
    try {
      const response = await fetch('http://localhost:3000/api/condiciones-select');
      const condiciones = await response.json();
  
      const selectCondicionMedica = document.getElementById('condicionemergencias');
      condiciones.forEach(condicion => {
        const option = document.createElement('option');
        option.value = condicion.ID_condicion; // Usar ID_condicion como valor
        option.textContent = condicion.descripcion; // Mostrar la descripción al usuario
        selectCondicionMedica.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar condiciones:', error);
    }
  }
  
/*********************** Borrado *****************************************/
async function borrarInfantes(id_infante) {
    console.log('ID Infante a eliminar:', id_infante);
    if (confirm("¿Estás seguro de que deseas eliminar este infante?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-infante/${id_infante}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Infante eliminado:', data);
                alert('Infante eliminado correctamente');
                vaciarInputs('infante');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el infante:', error);
            alert('Hubo un error al eliminar el infante');
        }
    }
}

/*********************** SECCION INFANTES - CONDICIONES *************************/
document.getElementById('search_inp_cond').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_cond').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-condiciones?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_cond');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_condicion + ", Descripcion: " + item.descripcion];
                li.dataset.id = item.id_condicion; // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('conditions')
                    selectResultCond(item.ID_condicion);
                    closeFilter('filter-cond')
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultCond(ID_condicion) {
    fetch(`http://localhost:3000/api/completar-condiciones/${ID_condicion}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de la condicion recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idcondition').value = data.ID_condicion;
            document.getElementById('descripcioncondition').value = data.descripcion;
            document.getElementById('notascondition').value = data.anotaciones;

        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarCondiciones() {
    
    // Obtener los valores de los campos del formulario
    const id_condicion = document.getElementById('idcondition').value;
    const nombreCondicion = document.getElementById('descripcioncondition').value;
    const anotacionesCondicion = document.getElementById('notascondition').value;

    // Crear un objeto con los datos
    const condicion = {
      id_condicion:  id_condicion,
      nombreCondicion: nombreCondicion,
      anotacionesCondicion: anotacionesCondicion
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-condiciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(condicion),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('conditions');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarCondiciones(id_condicion) {
    console.log('ID Condicion a eliminar:', id_condicion);
    if (confirm("¿Estás seguro de que deseas eliminar esta condicion?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-condiciones/${id_condicion}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Condicion eliminada:', data);
                alert('Condicion eliminada correctamente');
                vaciarInputs('conditions');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar la condicion:', error);
            alert('Hubo un error al eliminar la condicion');
        }
    }
}

/******************************** SECCION TUTORES *********************************/
document.getElementById('search_inp_tut').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_tut').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-tutores?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_tut');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.id_tutor + ", Nombre: " + item.nombre + ", Apellido: " + item.apellido + ", DNI: " + item.dni];
                li.dataset.id = item.id_tutor;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('tutor');
                    selectResultTut(item.id_tutor);
                    closeFilter('filter-tut');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultTut(id_tutor) {
    fetch(`http://localhost:3000/api/completar-tutores/${id_tutor}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del tutor recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idtutor').value = data.ID_Tutor;
            document.getElementById('nombretutor').value = data.NombreTutor;
            document.getElementById('apellidotutor').value = data.ApellidoTutor;
            document.getElementById('dnitutor').value = data.DNI;
            document.getElementById('relacion-infantetutor').value = data.Parentezco;
            document.getElementById('idinfantetutor').value = data.ID_Infante;
            document.getElementById('direcciontutorcontact').value = data.Direccion;
            document.getElementById('correotutorcontact').value = data.Correo;
            document.getElementById('numbertutorcontact').value = data.Telefono;
            document.getElementById('numberaltertutorcontact').value = data.Telefono_Alternativo;
            document.getElementById('ocupaciontutorlabor').value = data.Ocupacion;
            document.getElementById('empresatutorlabor').value = data.Empresa;
            document.getElementById('direcciontutorlabor').value = data.Direccion_Trabajo;
            document.getElementById('numbertutorlabor').value = data.Telefono_Trabajo;

        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarTutores() {
    
    // Obtener los valores de los campos del formulario
    const ID_tutor = document.getElementById('idtutor').value;
    const nombre = document.getElementById('nombretutor').value;
    const apellido = document.getElementById('apellidotutor').value;
    const telefono = document.getElementById('numbertutorcontact').value;
    const direccion = document.getElementById('direcciontutorcontact').value;
    const parentezco = document.getElementById('relacion-infantetutor').value;
    const dni = document.getElementById('dnitutor').value;
    const correo = document.getElementById('correotutorcontact').value;
    const telefono_alternativo = document.getElementById('numberaltertutorcontact').value;
    const ocupacion = document.getElementById('ocupaciontutorlabor').value;
    const empresa = document.getElementById('empresatutorlabor').value;
    const direccion_trabajo = document.getElementById('direcciontutorlabor').value;
    const telefono_trabajo = document.getElementById('numbertutorlabor').value;

    // Crear un objeto con los datos
    const tutor = {
       id_tutor: ID_tutor,
       nombre: nombre,
       apellido: apellido,
       telefono: telefono,
       direccion: direccion,
       parentezco: parentezco,
       dni: dni,
       correo: correo,
       telefono_alternativo: telefono_alternativo,
       ocupacion: ocupacion,
       empresa: empresa,
       direccion_trabajo: direccion_trabajo,
       telefono_trabajo: telefono_trabajo   
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-tutores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tutor),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('tutor');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarTutores(ID_tutor) {
    console.log('ID_tutor a eliminar:', ID_tutor);
    if (confirm("¿Estás seguro de que deseas eliminar este tutor?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-tutores/${ID_tutor}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Tutor eliminado:', data);
                alert('Tutor eliminado correctamente');
                vaciarInputs('tutor');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar al tutor:', error);
            alert('Hubo un error al eliminar al tutor');
        }
    }
}

/***************************************** SECCION COLABORADORES **************************************/
document.getElementById('search_inp_colab').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_colab').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-colaboradores?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_colab');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_colaborador + ", Nombre: " + item.nombre + ", Apellido: " + item.apellido + ", DNI: " + item.dni];
                li.dataset.id = item.ID_colaborador;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('collaborator')
                    selectResultColab(item.ID_colaborador);
                    closeFilter('filter-colab')
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultColab(ID_colaborador) {
    fetch(`http://localhost:3000/api/completar-colaboradores/${ID_colaborador}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del colaborador recibidos:', data);
            const fechaOriginal = new Date(data.fechaAlta);
            const fechaFormateada = fechaOriginal.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idcollaborator').value = data.ID_colaborador;
            document.getElementById('nombrecollaborator').value = data.nombre;
            document.getElementById('apellidocollaborator').value = data.apellido;
            document.getElementById('dnicollaborator').value = data.dni;
            document.getElementById('direccioncollaborator').value = data.direccion;
            document.getElementById('numerocollaborator').value = data.telefono;
            document.getElementById('correocollaborator').value = data.email;
            document.getElementById('tipocollaborator').value = data.tipo_colaborador;

        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarColaboradores() {
    
    // Obtener los valores de los campos del formulario
    const ID_colaborador = document.getElementById('idcollaborator').value;
    const nombre = document.getElementById('nombrecollaborator').value;
    const apellido = document.getElementById('apellidocollaborator').value;
    const dni = document.getElementById('dnicollaborator').value;
    const tipo_colaborador = document.getElementById('tipocollaborator').value;
    const direccion = document.getElementById('direccioncollaborator').value;
    const telefono = document.getElementById('numerocollaborator').value;
    const email = document.getElementById('correocollaborator').value;

    // Crear un objeto con los datos
    const colaborador = {
       id_colaborador: ID_colaborador,
       nombre: nombre,
       apellido: apellido,
       dni: dni,
       tipo_colaborador: tipo_colaborador,
       direccion: direccion,
       telefono: telefono,
       email: email,
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-colaboradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colaborador),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('collaborator');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarColaboradores(ID_colaborador) {
    console.log('ID_colaborador a eliminar:', ID_colaborador);
    if (confirm("¿Estás seguro de que deseas eliminar este colaborador?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-colaboradores/${ID_colaborador}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Colaborador eliminado:', data);
                alert('Colaborador eliminado correctamente');
                vaciarInputs('collaborator');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar al colaborador:', error);
            alert('Hubo un error al eliminar al colaborador');
        }
    }
}

/******************************************* SECCION PERSONAL **********************************/
document.getElementById('search_inp_per').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_per').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-personal?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_per');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Personal + ", Nombre: " + item.Nombre + ", Apellido: " + item.Apellido + ", DNI: " + item.DNI];
                li.dataset.id = item.ID_Personal;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('personal')
                    selectResultPer(item.ID_Personal);
                    closeFilter('filter-per')
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultPer(ID_Personal) {
    fetch(`http://localhost:3000/api/completar-personal/${ID_Personal}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del personal recibidos:', data);
            const fechaOriginal1 = new Date(data.Inicio_Vacaciones);
            const fechaOriginal2 = new Date(data.Finalizacion_Vacaciones);
            const fechaFormateada1 = fechaOriginal1.toISOString().split('T')[0];
            const fechaFormateada2 = fechaOriginal2.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idpersonal').value = data.ID_Personal;
            document.getElementById('nombrepersonal').value = data.Nombre;
            document.getElementById('apellidopersonal').value = data.Apellido;
            document.getElementById('dnipersonal').value = data.DNI;
            document.getElementById('direccionpersonal').value = data.Direccion;
            document.getElementById('correopersonal').value = data.Correo;
            document.getElementById('numberpersonal').value = data.Telefono;
            document.getElementById('puestopersonal').value = data.ID_Rol;
            document.getElementById('diaspersonalhorarios').value = data.Dias_Laborales;
            document.getElementById('iniciopersonalhorarios').value = data.Hora_Inicio;
            document.getElementById('finalizacionpersonalhorarios').value = data.Hora_Finalizacion;
            document.getElementById('condicionpersonaladicional').value = data.Condicion_Med;
            document.getElementById('instruccionpersonaladicional').value = data.Emergencias;
            document.getElementById('diaspersonalvacaciones').value = data.Dias_Vacaciones;
            document.getElementById('iniciopersonalvacaciones').value = fechaFormateada1;
            document.getElementById('finalizacionpersonalvacaciones').value = fechaFormateada2;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarPersonal() {
    
    // Obtener los valores de los campos del formulario
    const ID_personal = document.getElementById('idpersonal').value;
    const nombre = document.getElementById('nombrepersonal').value;
    const apellido = document.getElementById('apellidopersonal').value;
    const dni = document.getElementById('dnipersonal').value;
    const direccion = document.getElementById('direccionpersonal').value;
    const correo = document.getElementById('correopersonal').value;
    const telefono = document.getElementById('numberpersonal').value;
    const rol = document.getElementById('puestopersonal').value;
    const dias_laborales = document.getElementById('diaspersonalhorarios').value;
    const hora_inicio = document.getElementById('iniciopersonalhorarios').value;
    const hora_finalizacion = document.getElementById('finalizacionpersonalhorarios').value;
    const condicion_med = document.getElementById('condicionpersonaladicional').value;
    const emergencias = document.getElementById('instruccionpersonaladicional').value;
    const dias_vacaciones = document.getElementById('diaspersonalvacaciones').value;
    const inicio_vacaciones = document.getElementById('iniciopersonalvacaciones').value;
    const finalizacion_vacaciones = document.getElementById('finalizacionpersonalvacaciones').value;

    // Crear un objeto con los datos
    const personal = {
       ID_Personal: ID_personal,
       Nombre: nombre,
       Apellido: apellido,
       DNI: dni,
       Direccion: direccion,
       Correo: correo,
       Telefono: telefono,
       ID_Rol: rol,
       Dias_Laborales: dias_laborales,
       Hora_Inicio: hora_inicio,
       Hora_Finalizacion: hora_finalizacion,
       Condicion_Med: condicion_med,
       Emergencias: emergencias,
       Dias_Vacaciones: dias_vacaciones,
       Inicio_Vacaciones: inicio_vacaciones,
       Finalizacion_Vacaciones: finalizacion_vacaciones,
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-personal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personal),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('personal');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

  async function cargarRoles() {
    try {
      const response = await fetch('http://localhost:3000/api/roles-select');
      const Roles = await response.json();
  
      const selectRoles = document.getElementById('puestopersonal');
      Roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.ID_rol;
        option.textContent = rol.rol;
        selectRoles.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar condiciones:', error);
    }
  }

/*********************** Borrado *****************************************/
async function borrarPersonal(ID_personal) {
    console.log('ID_personal a eliminar:', ID_personal);
    if (confirm("¿Estás seguro de que deseas eliminar este personal?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-personal/${ID_personal}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Personal eliminado:', data);
                alert('Personal eliminado correctamente');
                vaciarInputs('personal');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar al personal:', error);
            alert('Hubo un error al eliminar al personal');
        }
    }
}

/************************************* SECCION ROLES ************************************/
document.getElementById('search_inp_roles').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_roles').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-roles?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_roles');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_rol + ", Rol: " + item.rol];
                li.dataset.id = item.ID_rol;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('roles');
                    selectResultRoles(item.ID_rol);
                    closeFilter('filter-roles');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultRoles(ID_rol) {
    fetch(`http://localhost:3000/api/completar-roles/${ID_rol}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos del roles recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idrol').value = data.ID_rol;
            document.getElementById('nombrerol').value = data.rol;
            document.getElementById('notasrol').value = data.anotaciones;

        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarRol() {
    
    // Obtener los valores de los campos del formulario
    const ID_rol = document.getElementById('idrol').value;
    const rol = document.getElementById('nombrerol').value;
    const anotaciones = document.getElementById('notasrol').value;

    // Crear un objeto con los datos
    const roles = {
       ID_rol: ID_rol,
       rol: rol,
       anotaciones: anotaciones
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roles),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('roles');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarRol(ID_rol) {
    console.log('ID_rol a eliminar:', ID_rol);
    if (confirm("¿Estás seguro de que deseas eliminar este rol?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-roles/${ID_rol}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Rol eliminado:', data);
                alert('Rol eliminado correctamente');
                vaciarInputs('roles');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el rol:', error);
            alert('Hubo un error al eliminar el rol');
        }
    }
}

/********************************** SECCION ALIMENTOS *****************************************/
document.getElementById('search_inp_alim').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_alim').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-alimentos?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_alim');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Alimento + ", Descripcion: " + item.alimento + ", Marca: " + item.Marca];
                li.dataset.id = item.ID_Alimento;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('alimentos');
                    selectResultAlim(item.ID_Alimento);
                    closeFilter('filter-alim')
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultAlim(ID_Alimento) {
    fetch(`http://localhost:3000/api/completar-alimentos/${ID_Alimento}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de alimentos recibidos:', data);
            
            const fechaOriginal1 = new Date(data.FechaIngreso);
            const fechaOriginal2 = new Date(data.Vencimiento);
            const fechaIngresoFormat = fechaOriginal1.toISOString().split('T')[0];
            const fechaVencimientoFormat = fechaOriginal2.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idalimentos').value = data.ID_Alimento;
            document.getElementById('nombrealimentos').value = data.alimento;
            document.getElementById('marcaalimentos').value = data.ID_Marca;
            document.getElementById('rubroalimentos').value = data.ID_Rubro;
            document.getElementById('cantidadalimentos').value = data.Cantidad;
            document.getElementById('ingresoalimentos').value = fechaIngresoFormat;
            document.getElementById('pesoalimentos').value = data.Peso;
            document.getElementById('vencimientoalimentos').value = fechaVencimientoFormat;

        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

async function cargarMarcas() {
  try {
    const response = await fetch('http://localhost:3000/api/marcas-select');
    const Marcas = await response.json();

    const selectRubros = document.getElementById('marcaalimentos');
    Marcas.forEach(marca => {
      const option = document.createElement('option');
      option.value = marca.ID_marca;
      option.textContent = marca.descripcion;
      selectRubros.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar condiciones:', error);
  }
}

async function cargarRubros() {
  try {
    const response = await fetch('http://localhost:3000/api/rubros-select');
    const Rubros = await response.json();

    const selectRubros = document.getElementById('rubroalimentos');
    Rubros.forEach(rubro => {
      const option = document.createElement('option');
      option.value = rubro.ID_rubro;
      option.textContent = rubro.descripcion; 
      selectRubros.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar condiciones:', error);
  }
}

/********************************* Insercion ***********************************/
async function guardarAlimentos() {
    
    // Obtener los valores de los campos del formulario
    const ID_Alimento = document.getElementById('idalimentos').value;
    const Alimento = document.getElementById('nombrealimentos').value;
    const peso = document.getElementById('pesoalimentos').value;
    const cantidad = document.getElementById('cantidadalimentos').value;
    const ID_Marca = document.getElementById('marcaalimentos').value;
    const ID_Rubro = document.getElementById('rubroalimentos').value;
    const vencimiento = document.getElementById('vencimientoalimentos').value;
    const fechaIngreso = document.getElementById('ingresoalimentos').value;

    // Crear un objeto con los datos
    const alimento = {
       ID_Alimento: ID_Alimento,
       alimento: Alimento,
       Peso: peso,
       Cantidad: cantidad,
       ID_Marca: ID_Marca,
       ID_Rubro: ID_Rubro,
       Vencimiento: vencimiento,
       FechaIngreso: fechaIngreso
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-alimentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alimento),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('alimentos');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarAlimentos(ID_Alimento) {
    console.log('ID_Alimento a eliminar:', ID_Alimento);
    if (confirm("¿Estás seguro de que deseas eliminar este alimento?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-alimentos/${ID_Alimento}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Alimento eliminado:', data);
                alert('Alimento eliminado correctamente');
                vaciarInputs('alimentos');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el alimento:', error);
            alert('Hubo un error al eliminar el alimento');
        }
    }
}

/************************************ SECCION RUBROS ************************************/
document.getElementById('search_inp_rubro').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_rubro').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-rubros?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_rubro');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_rubro + ", Descripcion: " + item.descripcion];
                li.dataset.id = item.ID_rubro;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('rubros');
                    selectResultRubro(item.ID_rubro);
                    closeFilter('filter-rubro');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultRubro(ID_rubro) {
    fetch(`http://localhost:3000/api/completar-rubros/${ID_rubro}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de alimentos recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idrubro').value = data.ID_rubro;
            document.getElementById('nombrerubro').value = data.descripcion;
            document.getElementById('notasrubro').value = data.anotaciones;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarRubros() {
    
    // Obtener los valores de los campos del formulario
    const ID_rubro = document.getElementById('idrubro').value;
    const descripcion = document.getElementById('nombrerubro').value;
    const anotaciones = document.getElementById('notasrubro').value;

    // Crear un objeto con los datos
    const rubros = {
       ID_rubro: ID_rubro,
       descripcion: descripcion,
       anotaciones: anotaciones
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-rubros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rubros),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('rubros');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarRubros(ID_rubro) {
    console.log('ID_rubro a eliminar:', ID_rubro);
    if (confirm("¿Estás seguro de que deseas eliminar este rubro?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-rubros/${ID_rubro}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Rubro eliminado:', data);
                alert('Rubro eliminado correctamente');
                vaciarInputs('rubros');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el rubro:', error);
            alert('Hubo un error al eliminar el rubro');
        }
    }
}

/***************************************** SECCION MARCAS ***************************************/
document.getElementById('search_inp_marca').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_marca').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-marcas?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_marca');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_marca + ", Descripcion: " + item.descripcion];
                li.dataset.id = item.ID_marca;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('marcas')
                    selectResultMarca(item.ID_marca);
                    closeFilter('filter-marca')
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultMarca(ID_marca) {
    fetch(`http://localhost:3000/api/completar-marcas/${ID_marca}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de alimentos recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idmarca').value = data.ID_marca;
            document.getElementById('nombremarca').value = data.descripcion;
            document.getElementById('notasmarca').value = data.anotaciones;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarMarcas() {
    
    // Obtener los valores de los campos del formulario
    const ID_marca = document.getElementById('idmarca').value;
    const descripcion = document.getElementById('nombremarca').value;
    const anotaciones = document.getElementById('notasmarca').value;

    // Crear un objeto con los datos
    const marcas = {
       ID_marca: ID_marca,
       descripcion: descripcion,
       anotaciones: anotaciones
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-marcas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(marcas),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('marcas');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarMarcas(ID_marca) {
    console.log('ID_marca a eliminar:', ID_marca);
    if (confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-marcas/${ID_marca}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Marca eliminada:', data);
                alert('Marca eliminada correctamente');
                vaciarInputs('marcas');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar la marca:', error);
            alert('Hubo un error al eliminar la marca');
        }
    }
}

/***************************** SECCION PREPARACIONES ***********************************/
document.getElementById('search_inp_prepa').addEventListener('input', () => {
  const searchTerm = document.getElementById('search_inp_prepa').value;
  console.log(searchTerm);
  fetch(`http://localhost:3000/api/obtener-preparaciones?q=${searchTerm}`)
      .then(response => response.json())
      .then(results => {
          const searchResults = document.getElementById('searchResults_prepa');
          searchResults.innerHTML = ''; // Limpiar resultados anteriores
          results.forEach(item => {
              const li = document.createElement('li');
              li.classList.add('linea-resultado')
              li.textContent = ["ID: " + item.ID_Preparacion + ", Nombre: " + item.Preparacion];
              li.dataset.id = item.ID_Preparacion;  // Almacenar ID del resultado
              li.addEventListener('click', () => {
                  soloLectura('preparations')
                  selectResultPrepa(item.ID_Preparacion);
                  closeFilter('filter-prepa')
              });
              searchResults.appendChild(li);
          });
      });
});

function selectResultPrepa(ID_Preparacion) {
  fetch(`http://localhost:3000/api/completar-preparaciones/${ID_Preparacion}`)
      .then(response => response.json())
      .then(data => {
          console.log('Datos recibidos:', data);
          const fechaOriginal = new Date(data.FechaAlta);
          const fechaFormateada = fechaOriginal.toISOString().split('T')[0];


          // Asignamos los valores recibidos a cada campo del formulario
          document.getElementById('idpreparacion').value = data.ID_Preparacion;
          document.getElementById('fechapreparacion').value = fechaFormateada;
          document.getElementById('nombrepreparacion').value = data.Preparacion;
          const notasPreparacion = document.getElementById('notaspreparacion');
          notasPreparacion.innerHTML = '';

          data.Alimentos.forEach(alimento => {
            const li = document.createElement('li');
            li.textContent = `ID Alimento: ${alimento.ID_Alimento} | Alimento: ${alimento.Alimento} | Cantidad: ${alimento.Cantidad}`;
            notasPreparacion.appendChild(li);
          });
      })
      .catch(err => console.error('Error al obtener los datos:', err));
}

/* *************************************** busqueda items alimentos *********************************** */
document.getElementById('search_inp_prepaalim').addEventListener('input', () => {
  const searchTerm = document.getElementById('search_inp_prepaalim').value;
  console.log(searchTerm);
  fetch(`http://localhost:3000/api/obtener-alimentos?q=${searchTerm}`)
      .then(response => response.json())
      .then(results => {
          const searchResults = document.getElementById('searchResults_prepaalim');
          searchResults.innerHTML = ''; // Limpiar resultados anteriores
          results.forEach(item => {
              const li = document.createElement('li');
              li.classList.add('linea-resultado')
              li.textContent = ["ID: " + item.ID_Alimento + ", Nombre: " + item.alimento];
              li.dataset.id = item.ID_Alimento;  // Almacenar ID del resultado
              li.addEventListener('click', () => {
                  selectResultPrepaAlim(item.ID_Alimento);
                  closeFilter('filter-prepaalim')
              });
              searchResults.appendChild(li);
          });
      });
});

function selectResultPrepaAlim(ID_Alimento) {
  fetch(`http://localhost:3000/api/completar-alimentos/${ID_Alimento}`)
      .then(response => response.json())
      .then(alimentos => {
          console.log('Datos recibidos:', alimentos);

          const notasPreparacion = document.getElementById('notaspreparacion');

          
          const li = document.createElement('li');
          li.classList.add('alimentoPrepa');
          li.innerHTML = `ID Alimento: ${alimentos.ID_Alimento} | Alimento: ${alimentos.alimento} | Cantidad: <input class='inputCantidad' type='number'><button onclick='borrarLineaAlimento()' class='del-alim-prepa' id='del-alim-prepa'><img class="iconos" src="icons/icons8-basura-50.png"></button>`;
          li.dataset.idAlimento = alimentos.ID_Alimento;
          notasPreparacion.appendChild(li);
          console.log('Elemento <li> generado:', li);


      })
      .catch(err => console.error('Error al obtener los datos:', err));
}

function borrarLineaAlimento() {
  const li = document.querySelector('.alimentoPrepa');
  li.remove();
}

/********************************* Insercion ***********************************/
async function guardarPreparaciones() {
  
  const listItems = document.querySelectorAll('#notaspreparacion .alimentoPrepa');
if (listItems.length === 0) {
  console.error('No se encontraron elementos <li> dentro de #alimentospreparacion.');
}

  // Ejemplo de cómo preparar los datos de items para enviar al servidor
const items = Array.from(listItems).map((li, index) => {
  const inputCantidad = li.querySelector('.inputCantidad');
  const idAlimento = li.dataset.idAlimento;
  return {
    NroItem: index + 1,
    ID_Alimento: idAlimento, // ID del alimento almacenado como data attribute
    Cantidad: inputCantidad ? parseInt(inputCantidad.value) || 0 : 0,  // Valor del input o 0 si no existe
  };
});

if (items.length === 0) {
  alert('Debes agregar al menos un ítem antes de guardar.');
  return;
}

// Validar que todas las cantidades sean mayores a 0
const invalidItems = items.filter(item => item.Cantidad <= 0);
if (invalidItems.length > 0) {
  alert('Todos los ítems deben tener una cantidad mayor a 0.');
  return;
}

// Crear el objeto de preparación
const preparacion = {
  ID_Preparacion: document.getElementById('idpreparacion').value,
  Preparacion: document.getElementById('nombrepreparacion').value,
  items: items,
  FechaAlta: document.getElementById('fechapreparacion').value
};

console.log('Preparación a guardar:', preparacion);


  try {
    // Envia los datos al backend usando fetch
    const response = await fetch('http://localhost:3000/api/guardar-preparaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preparacion),
    });

    // Verifica la respuesta del servidor
    if (response.ok) {
      const data = await response.json();
      console.log('Datos guardados correctamente:', data);
      alert('Datos guardados correctamente');
      vaciarInputs('preparations');
    } else {
      throw new Error('Error al guardar los datos');
    }
  } catch (error) {
    console.error('Error al guardar datos:', error);
    alert('Hubo un error al guardar los datos');
  }
}

/*********************** Borrado *****************************************/
async function borrarPreparaciones(ID_Preparacion) {
  console.log('ID_Preparacion a eliminar:', ID_Preparacion);
  if (confirm("¿Estás seguro de que deseas eliminar esta preparacion?")) {
      try {
          const response = await fetch(`http://localhost:3000/api/eliminar-preparacion/${ID_Preparacion}`, {
              method: 'DELETE',
          });
          if (response.ok) {
              const data = await response.json();
              console.log('Preparacion eliminada:', data);
              alert('Preparacion eliminada correctamente');
              vaciarInputs('preparations');
              // Aquí puedes agregar lógica adicional para actualizar la interfaz
          } else {
              const errorData = await response.json();
              alert(`Error: ${errorData.error}`);
          }
      } catch (error) {
          console.error('Error al eliminar la preparacion:', error);
          alert('Hubo un error al eliminar la preparacion');
      }
  }
}

/********************************* SECCION JUGUETES ************************************/
document.getElementById('search_inp_jug').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_jug').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-juguetes?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_jug');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Juguete + ", Descripcion: " + item.Nombre + ", Tipo: " + item.Tipo];
                li.dataset.id = item.ID_marca;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('juguetes')
                    selectResultJug(item.ID_Juguete);
                    closeFilter('filter-jug')
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultJug(ID_Juguete) {
    fetch(`http://localhost:3000/api/completar-juguetes/${ID_Juguete}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de alimentos recibidos:', data);
            const fechaOriginal1 = new Date(data.FechaIngreso);
            const fechaIngresoFormat = fechaOriginal1.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idjuguetes').value = data.ID_Juguete;
            document.getElementById('nombrejuguetes').value = data.Nombre;
            document.getElementById('tamañojuguetes').value = data.Tamaño;
            document.getElementById('edadjuguetes').value = data.EdadMinima;
            document.getElementById('ingresojuguetes').value = fechaIngresoFormat;
            document.getElementById('cantidadjuguetes').value = data.Cantidad;
            document.getElementById('tipojuguetes').value = data.ID_Tipo;

        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

async function cargarTipoJuguetes() {
  try {
    const response = await fetch('http://localhost:3000/api/tipojuguetes-select');
    const Tipos = await response.json();

    const selectTipo = document.getElementById('tipojuguetes');
    Tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo.ID_tipo;
      option.textContent = tipo.descripcion;
      selectTipo.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar condiciones:', error);
  }
}

/********************************* Insercion ***********************************/
async function guardarJuguetes() {
    
    // Obtener los valores de los campos del formulario
    const ID_Juguete = document.getElementById('idjuguetes').value;
    const Nombre = document.getElementById('nombrejuguetes').value;
    const Tamaño = document.getElementById('tamañojuguetes').value;
    const EdadMinima = document.getElementById('edadjuguetes').value;
    const FechaIngreso = document.getElementById('ingresojuguetes').value;
    const Cantidad = document.getElementById('cantidadjuguetes').value;
    const Tipo = document.getElementById('tipojuguetes').value;

    // Crear un objeto con los datos
    const juguete = {
       ID_Juguete: ID_Juguete,
       Nombre: Nombre,
       ID_Tipo: Tipo,
       Tamaño: Tamaño,
       EdadMinima: EdadMinima,
       FechaIngreso: FechaIngreso,
       Cantidad: Cantidad
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-juguetes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(juguete),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('juguetes');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarJuguetes(ID_Juguete) {
    console.log('ID_Juguete a eliminar:', ID_Juguete);
    if (confirm("¿Estás seguro de que deseas eliminar este juguete?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-juguetes/${ID_Juguete}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Juguete eliminado:', data);
                alert('Juguete eliminado correctamente');
                vaciarInputs('juguetes');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el juguete:', error);
            alert('Hubo un error al eliminar el juguete');
        }
    }
}

/************************************ SECCION TIPOS DE JUGUETES ************************/
document.getElementById('search_inp_tipojuguete').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_tipojuguete').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-tipojuguetes?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_tipojuguete');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_tipo + ", Descripcion: " + item.descripcion];
                li.dataset.id = item.ID_tipo;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('tipojuguete')
                    selectResultTipoJug(item.ID_tipo);
                    closeFilter('filter-tipojuguete')
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultTipoJug(ID_tipo) {
    fetch(`http://localhost:3000/api/completar-tipojuguetes/${ID_tipo}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de tipo juguetes recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idtipojuguete').value = data.ID_tipo;
            document.getElementById('nombretipojuguete').value = data.descripcion;
            document.getElementById('notastipojuguete').value = data.anotaciones;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarTipoJuguetes() {
    
    // Obtener los valores de los campos del formulario
    const ID_tipo = document.getElementById('idtipojuguete').value;
    const descripcion = document.getElementById('nombretipojuguete').value;
    const anotaciones = document.getElementById('notastipojuguete').value;

    // Crear un objeto con los datos
    const tipojuguetes = {   
       ID_tipo: ID_tipo,
       descripcion: descripcion,
       anotaciones: anotaciones
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-tipojuguetes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipojuguetes),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('tipojuguete');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarTipoJuguetes(ID_tipo) {
    console.log('ID_tipo a eliminar:', ID_tipo);
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de juguete?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-tipojuguetes/${ID_tipo}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Tipo juguete eliminado:', data);
                alert('Tipo juguete eliminado correctamente');
                vaciarInputs('tipojuguete');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el tipo de juguete:', error);
            alert('Hubo un error al eliminar el tipo de juguete');
        }
    }
}

/************************ SECCION LIBROS ************************/
document.getElementById('search_inp_libro').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_libro').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-libros?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_libro');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Libro + ", Nombre: " + item.Libro + ", Categoría: " + item.Categoria];
                li.dataset.id = item.ID_Libro;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('libros');
                    selectResultlibro(item.ID_Libro);
                    closeFilter('filter-libro');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultlibro(ID_Libro) {
    fetch(`http://localhost:3000/api/completar-libros/${ID_Libro}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de libros recibidos:', data);
            const fechaOriginal = new Date(data.FechaIngreso);
            const fechaFormateada = fechaOriginal.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idlibros').value = data.ID_Libro;
            document.getElementById('nombrelibros').value = data.Libro;
            document.getElementById('cantidadlibros').value = data.Cantidad;
            document.getElementById('ingresolibros').value = fechaFormateada;
            document.getElementById('catlibros').value = data.ID_Categoria;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarLibros() {
    
    // Obtener los valores de los campos del formulario
    const ID_Libro = document.getElementById('idlibros').value;
    const Libro = document.getElementById('nombrelibros').value;
    const Cantidad = document.getElementById('cantidadlibros').value;
    const fechaIngreso = document.getElementById('ingresolibros').value;
    const ID_Categoria = document.getElementById('catlibros').value;

    // Crear un objeto con los datos
    const libros = {   
       ID_Libro: ID_Libro,
       Libro: Libro,
       Cantidad: Cantidad,
       FechaIngreso: fechaIngreso,
       ID_Categoria: ID_Categoria
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-libros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(libros),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('libros');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

  async function cargarCategorias() {
    try {
      const response = await fetch('http://localhost:3000/api/categorias-select');
      const Categorias = await response.json();
  
      const selectCat = document.getElementById('catlibros');
      Categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.ID_Categoria;
        option.textContent = categoria.Descripcion;
        selectCat.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar condiciones:', error);
    }
  }

/*********************** Borrado *****************************************/
async function borrarLibros(ID_Libro) {
    console.log('ID_Libro a eliminar:', ID_Libro);
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de libro?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-libros/${ID_Libro}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Libro eliminado:', data);
                alert('Libro eliminado correctamente');
                vaciarInputs('libros');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
            alert('Hubo un error al eliminar el libro');
        }
    }
}

/************************ SECCION LIBROS-CATEGORIAS ************************/
document.getElementById('search_inp_tipolibro').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_tipolibro').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-categorias?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_tipolibro');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Categoria + ", Categoria: " + item.Descripcion];
                li.dataset.id = item.ID_Categoria;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('tipolibro');
                    selectResulttipolibro(item.ID_Categoria);
                    closeFilter('filter-tipolibro');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResulttipolibro(ID_Categoria) {
    fetch(`http://localhost:3000/api/completar-categorias/${ID_Categoria}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de categorías recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idtipolibro').value = data.ID_Categoria;
            document.getElementById('nombretipolibro').value = data.Descripcion;
            document.getElementById('notastipolibro').value = data.Anotaciones;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarCategorias() {
    
    // Obtener los valores de los campos del formulario
    const ID_Categoria = document.getElementById('idtipolibro').value;
    const Categoria = document.getElementById('nombretipolibro').value;
    const Anotaciones = document.getElementById('notastipolibro').value;

    // Crear un objeto con los datos
    const categorias = {   
       ID_Categoria: ID_Categoria,
       Descripcion: Categoria,
       Anotaciones: Anotaciones
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categorias),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('tipolibro');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarCategorias(ID_Categoria) {
    console.log('ID_Categoria a eliminar:', ID_Categoria);
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de categoria?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-categorias/${ID_Categoria}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Categoria eliminada:', data);
                alert('Categoria eliminada correctamente');
                vaciarInputs('tipolibro');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar la categoria:', error);
            alert('Hubo un error al eliminar la categoria');
        }
    }
}

/************************ SECCION DONACIONES ************************/
document.getElementById('search_inp_dona').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_dona').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-donaciones?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_dona');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Donacion + ", Colaborador: " + item.Colaborador + ", TipoDonacion: " + item.Tipo];
                li.dataset.id = item.ID_Donacion;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('donaciones');
                    selectResultdona(item.ID_Donacion);
                    closeFilter('filter-dona');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultdona(ID_Donacion) {
    fetch(`http://localhost:3000/api/completar-donaciones/${ID_Donacion}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de donaciones recibidos:', data);
            const fechaOriginal = new Date(data.fechaAlta);
            const fechaFormateada = fechaOriginal.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('iddonacion').value = data.ID_Donacion;
            document.getElementById('colaboradordonaciones').value = data.ID_Colaborador;
            document.getElementById('tipodonaciones').value = data.ID_Tipo;
            document.getElementById('cantidaddonaciones').value = data.Cantidad;
            document.getElementById('montodonaciones').value = data.Monto;
            document.getElementById('fechadonaciones').value = fechaFormateada;
            document.getElementById('descripciondonaciones').value = data.Descripcion;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarDonaciones() {
    
    // Obtener los valores de los campos del formulario
    const ID_Donacion = document.getElementById('iddonacion').value;
    const Colaborador = document.getElementById('colaboradordonaciones').value;
    const DonacionTipo = document.getElementById('tipodonaciones').value;
    const Cantidad = document.getElementById('cantidaddonaciones').value;
    const Monto = document.getElementById('montodonaciones').value;
    const fechaFormateada = document.getElementById('fechadonaciones').value;
    const Descripcion = document.getElementById('descripciondonaciones').value;

    // Crear un objeto con los datos
    const donacion = {   
      ID_Donacion: ID_Donacion,
      ID_colaborador: Colaborador,
      ID_Tipo: DonacionTipo,
      cantidad: Cantidad,
      monto: Monto,
      fechaAlta: fechaFormateada,
      descripcion: Descripcion
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-donaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donacion),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('donaciones');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

  async function cargarTipoDonaciones() {
    try {
      const response = await fetch('http://localhost:3000/api/tipodonacion-select');
      const TiposDona = await response.json();
  
      const selectTiposDona = document.getElementById('tipodonaciones');
      TiposDona.forEach(tipoDona => {
        const option = document.createElement('option');
        option.value = tipoDona.ID_Tipo;
        option.textContent = tipoDona.Tipo;
        selectTiposDona.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar condiciones:', error);
    }
  }

/*********************** Borrado *****************************************/
async function borrarDonaciones(ID_Donacion) {
    console.log('ID_Colaborador a eliminar:', ID_Donacion);
    if (confirm("¿Estás seguro de que deseas eliminar este colaborador?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-donaciones/${ID_Donacion}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Donacion eliminada:', data);
                alert('Donacion eliminada correctamente');
                vaciarInputs('donaciones');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar la donacion:', error);
            alert('Hubo un error al eliminar la donacion');
        }
    }
}

/************************ SECCION DONACIONES-TIPOS ************************/
document.getElementById('search_inp_tipodona').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_tipodona').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-tipodonacion?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_tipodona');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Tipo + ", TipoDonacion: " + item.Tipo];
                li.dataset.id = item.ID_Tipo;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('tipodonacion');
                    selectResulttipodona(item.ID_Tipo);
                    closeFilter('filter-tipodona');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResulttipodona(ID_Tipo) {
    fetch(`http://localhost:3000/api/completar-tipodonacion/${ID_Tipo}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de tipo de donaciones recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idtipodonacion').value = data.ID_Tipo;
            document.getElementById('nombretipodonacion').value = data.Tipo;
            document.getElementById('notastipodonacion').value = data.Anotaciones;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarTipoDonacion() {
    
    // Obtener los valores de los campos del formulario
    const ID_Tipo = document.getElementById('idtipodonacion').value;
    const Tipo = document.getElementById('nombretipodonacion').value;
    const Anotaciones = document.getElementById('notastipodonacion').value;

    // Crear un objeto con los datos
    const tipodonacion = {   
       ID_Tipo: ID_Tipo,
       Tipo: Tipo,
       Anotaciones: Anotaciones
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-tipodonacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipodonacion),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('tipodonacion');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarTipoDonacion(ID_Tipo) {
    console.log('ID_Tipo a eliminar:', ID_Tipo);
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de donacion?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-tipodonacion/${ID_Tipo}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Tipo de Donacion eliminada:', data);
                alert('Tipo de Donacion eliminada correctamente');
                vaciarInputs('tipodonacion');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el tipo de donacion:', error);
            alert('Hubo un error al eliminar el tipo de donacion');
        }
    }
}

/***************************** SECCION DONACIONES - SALIDAS ***********************************/
document.getElementById('search_inp_salidadona').addEventListener('input', () => {
  const searchTerm = document.getElementById('search_inp_salidadona').value;
  console.log(searchTerm);
  fetch(`http://localhost:3000/api/obtener-salidas?q=${searchTerm}`)
      .then(response => response.json())
      .then(results => {
          const searchResults = document.getElementById('searchResults_salidadona');
          searchResults.innerHTML = ''; // Limpiar resultados anteriores
          results.forEach(item => {
              const li = document.createElement('li');
              li.classList.add('linea-resultado')
              li.textContent = ["ID: " + item.ID_Salida + ", Recibió: " + item.Recibe];
              li.dataset.id = item.ID_Salida;
              li.addEventListener('click', () => {
                  soloLectura('donations-outputs')
                  selectResultSalidas(item.ID_Salida);
                  closeFilter('filter-salidadona')
              });
              searchResults.appendChild(li);
          });
      });
});

function selectResultSalidas(ID_Salida) {
  fetch(`http://localhost:3000/api/completar-salidas/${ID_Salida}`)
      .then(response => response.json())
      .then(data => {
          console.log('Datos recibidos:', data);
          const fechaOriginal = new Date(data.FechaAlta);
          const fechaFormateada = fechaOriginal.toISOString().split('T')[0];


          // Asignamos los valores recibidos a cada campo del formulario
          document.getElementById('idsalida').value = data.ID_Salida;
          document.getElementById('fechasalida').value = fechaFormateada;
          document.getElementById('destinosalida').value = data.Recibe;
          const notasSalidas = document.getElementById('notassalida');
          notasSalidas.innerHTML = '';

          data.Donaciones.forEach(donacion => {
            const li = document.createElement('li');
            li.textContent = `ID Articulo: ${donacion.ID_Donacion} | Descripcion: ${donacion.Descripcion} | Cantidad: ${donacion.Cantidad}`;
            notasSalidas.appendChild(li);
          });
      })
      .catch(err => console.error('Error al obtener los datos:', err));
}

/* *************************************** busqueda items donaciones *********************************** */
document.getElementById('search_inp_salidadonacion').addEventListener('input', () => {
  const searchTerm = document.getElementById('search_inp_salidadonacion').value;
  console.log(searchTerm);
  fetch(`http://localhost:3000/api/obtener-donaciones?q=${searchTerm}`)
      .then(response => response.json())
      .then(results => {
          const searchResults = document.getElementById('searchResults_salidadonacion');
          searchResults.innerHTML = ''; // Limpiar resultados anteriores
          results.forEach(item => {
              const li = document.createElement('li');
              li.classList.add('linea-resultado')
              li.textContent = ["ID: " + item.ID_Donacion + ", Descripcion: " + item.Descripcion];
              li.dataset.id = item.ID_Donacion;  // Almacenar ID del resultado
              li.addEventListener('click', () => {
                  selectResultSalidaDona(item.ID_Donacion);
                  closeFilter('filter-salidadonacion')
              });
              searchResults.appendChild(li);
          });
      });
});

function selectResultSalidaDona(ID_Donacion) {
  fetch(`http://localhost:3000/api/completar-donaciones/${ID_Donacion}`)
      .then(response => response.json())
      .then(donaciones => {
          console.log('Datos recibidos:', donaciones);

          const notasSalidas = document.getElementById('notassalida');

          
          const li = document.createElement('li');
          li.classList.add('alimentoPrepa');
          li.innerHTML = `ID: ${donaciones.ID_Donacion} | Descripcion: ${donaciones.Descripcion} | Cantidad: <input class='inputCantidad' type='number'><button onclick='borrarLineaAlimento()' class='del-alim-prepa' id='del-alim-prepa'><img class="iconos" src="icons/icons8-basura-50.png"></button>`;
          li.dataset.idDonacion = donaciones.ID_Donacion;
          notasSalidas.appendChild(li);
          console.log('Elemento <li> generado:', li);


      })
      .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarSalidas() {
  
  const listItems = document.querySelectorAll('#notassalida li');
if (listItems.length === 0) {
  console.error('No se encontraron elementos <li> dentro de #donacionessalidas.');
}

  // Ejemplo de cómo preparar los datos de items para enviar al servidor
const items = Array.from(listItems).map((li, index) => {
  const inputCantidad = li.querySelector('#notassalida .inputCantidad');
  const idDonacion = li.dataset.idDonacion;
  return {
    NroItem: index + 1,
    ID_Donacion: idDonacion, // ID del alimento almacenado como data attribute
    Cantidad: inputCantidad ? parseInt(inputCantidad.value) || 0 : 0,  // Valor del input o 0 si no existe
  };
});

if (items.length === 0) {
  alert('Debes agregar al menos un ítem antes de guardar.');
  return;
}

// Validar que todas las cantidades sean mayores a 0
const invalidItems = items.filter(item => item.Cantidad <= 0);
if (invalidItems.length > 0) {
  alert('Todos los ítems deben tener una cantidad mayor a 0.');
  return;
}

// Crear el objeto de preparación
const salida = {
  ID_Salida: document.getElementById('idsalida').value,
  Recibe: document.getElementById('destinosalida').value,
  items: items,
  FechaAlta: document.getElementById('fechasalida').value
};

console.log('Salida a guardar:', salida);


  try {
    // Envia los datos al backend usando fetch
    const response = await fetch('http://localhost:3000/api/guardar-salidas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salida),
    });

    // Verifica la respuesta del servidor
    if (response.ok) {
      const data = await response.json();
      console.log('Datos guardados correctamente:', data);
      alert('Datos guardados correctamente');
      vaciarInputs('donations-outputs');
    } else {
      throw new Error('Error al guardar los datos');
    }
  } catch (error) {
    console.error('Error al guardar datos:', error);
    alert('Hubo un error al guardar los datos');
  }
}

/*********************** Borrado *****************************************/
async function borrarSalidas(ID_Salida) {
  console.log('ID_Salida a eliminar:', ID_Salida);
  if (confirm("¿Estás seguro de que deseas eliminar esta salida?")) {
      try {
          const response = await fetch(`http://localhost:3000/api/eliminar-salida/${ID_Salida}`, {
              method: 'DELETE',
          });
          if (response.ok) {
              const data = await response.json();
              console.log('Salida eliminada:', data);
              alert('Salida eliminada correctamente');
              vaciarInputs('donations-outputs');
              // Aquí puedes agregar lógica adicional para actualizar la interfaz
          } else {
              const errorData = await response.json();
              alert(`Error: ${errorData.error}`);
          }
      } catch (error) {
          console.error('Error al eliminar la salida:', error);
          alert('Hubo un error al eliminar la salida');
      }
  }
}

/************************ SECCION USUARIOS ************************/
document.getElementById('search_inp_usuario').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_usuario').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-usuarios?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_usuario');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Usuario + ", Nombre: " + item.Usuario + ", TipoUsuario: " + item.Tipo];
                li.dataset.id = item.ID_Usuario;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('usuarios');
                    selectResultusuario(item.ID_Usuario);
                    closeFilter('filter-usuario');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResultusuario(ID_Usuario) {
    fetch(`http://localhost:3000/api/completar-usuarios/${ID_Usuario}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de usuarios recibidos:', data);
            const fechaOriginal = new Date(data.FechaAlta);
            const fechaFormateada = fechaOriginal.toISOString().split('T')[0];

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idusuarios').value = data.ID_Usuario;
            document.getElementById('nombreusuarios').value = data.Usuario;
            document.getElementById('contraseñausuarios').value = data.Contraseña;
            document.getElementById('tipousuarios').value = data.ID_Tipo;
            document.getElementById('altausuario').value = fechaFormateada;
        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarUsuarios() {
    
    // Obtener los valores de los campos del formulario
    const ID_Usuario = document.getElementById('idusuarios').value;
    const Usuario = document.getElementById('nombreusuarios').value;
    const Contraseña = document.getElementById('contraseñausuarios').value;
    const TipoUsuario = document.getElementById('tipousuarios').value;
    const fechaFormateada = document.getElementById('altausuario').value;

    // Crear un objeto con los datos
    const usuarios = {   
       ID_Usuario: ID_Usuario,
       Usuario: Usuario,
       Contraseña: Contraseña,
       ID_Tipo: TipoUsuario,
       FechaAlta: fechaFormateada
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarios),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('usuarios');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

  async function cargarTipoUsuarios() {
    try {
      const response = await fetch('http://localhost:3000/api/tipousuario-select');
      const Tipos = await response.json();
  
      const selectTipo = document.getElementById('tipousuarios');
      Tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.ID_Tipo;
        option.textContent = tipo.Tipo;
        selectTipo.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar condiciones:', error);
    }
  }

/*********************** Borrado *****************************************/
async function borrarUsuarios(ID_Usuario) {
    console.log('ID_Usuario a eliminar:', ID_Usuario);
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-usuarios/${ID_Usuario}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Usuario eliminado:', data);
                alert('Usuario eliminado correctamente');
                vaciarInputs('usuarios');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            alert('Hubo un error al eliminar el usuario');
        }
    }
}

/************************ SECCION USUARIOS-TIPOS ************************/
document.getElementById('search_inp_tipousua').addEventListener('input', () => {
    const searchTerm = document.getElementById('search_inp_tipousua').value;
    console.log(searchTerm);
    fetch(`http://localhost:3000/api/obtener-tipousuario?q=${searchTerm}`)
        .then(response => response.json())
        .then(results => {
            const searchResults = document.getElementById('searchResults_tipousua');
            searchResults.innerHTML = ''; // Limpiar resultados anteriores
            results.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('linea-resultado')
                li.textContent = ["ID: " + item.ID_Tipo + ", TipoUsuario: " + item.Tipo];
                li.dataset.id = item.ID_Tipo;  // Almacenar ID del resultado
                li.addEventListener('click', () => {
                    soloLectura('tipousuario');
                    selectResulttipousua(item.ID_Tipo);
                    closeFilter('filter-tipousua');
                });
                searchResults.appendChild(li);
            });
        });
});

function selectResulttipousua(ID_Tipo) {
    fetch(`http://localhost:3000/api/completar-tipousuario/${ID_Tipo}`)
        .then(response => response.json())
        .then(data => {
            console.log('Datos de tipo de usuario recibidos:', data);

            // Asignamos los valores recibidos a cada campo del formulario
            document.getElementById('idtipousuario').value = data.ID_Tipo;
            document.getElementById('nombretipousuario').value = data.Tipo;
            document.getElementById('notastipousuario').value = data.Anotaciones;

        })
        .catch(err => console.error('Error al obtener los datos:', err));
}

/********************************* Insercion ***********************************/
async function guardarTipoUsuario() {
    
    // Obtener los valores de los campos del formulario
    const ID_Tipo = document.getElementById('idtipousuario').value;
    const Tipo = document.getElementById('nombretipousuario').value;
    const Anotaciones = document.getElementById('notastipousuario').value;

    // Crear un objeto con los datos
    const tipousuario = {   
       ID_Tipo: ID_Tipo,
       Tipo: Tipo,
       Anotaciones: Anotaciones
    };
  
    try {
      // Envia los datos al backend usando fetch
      const response = await fetch('http://localhost:3000/api/guardar-tipousuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipousuario),
      });
  
      // Verifica la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log('Datos guardados correctamente:', data);
        alert('Datos guardados correctamente');
        vaciarInputs('tipousuario');
      } else {
        throw new Error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un error al guardar los datos');
    }
  }

/*********************** Borrado *****************************************/
async function borrarTipoUsuario(ID_Tipo) {
    console.log('ID_Tipo a eliminar:', ID_Tipo);
    if (confirm("¿Estás seguro de que deseas eliminar este tipo de usuario?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/eliminar-tipousuario/${ID_Tipo}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Tipo de usuario eliminado:', data);
                alert('Tipo de usuario eliminado correctamente');
                vaciarInputs('tipousuario');
                // Aquí puedes agregar lógica adicional para actualizar la interfaz
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al eliminar el tipo de usuario:', error);
            alert('Hubo un error al eliminar el tipo de usuario');
        }
    }
}
