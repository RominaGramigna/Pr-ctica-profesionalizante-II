const personas = document.getElementById('people');
const inventario = document.getElementById('stock');
const usuarios = document.getElementById('users');
const contenidoPersonas = document.getElementById('people-content');
const contenidoInventario = document.getElementById('stock-content');
const contenidoUsuarios = document.getElementById('users-content');

personas.addEventListener('click', (e) => {
    e.stopPropagation();
    contenidoPersonas.classList.remove('disabled');
    contenidoInventario.classList.add('disabled');
    contenidoUsuarios.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');
});

inventario.addEventListener('click', (e) => {
    e.stopPropagation();
    contenidoInventario.classList.remove('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoUsuarios.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');
});

usuarios.addEventListener('click', (e) => {
    e.stopPropagation();
    contenidoUsuarios.classList.remove('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');
});

document.addEventListener('click', () => {
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');
});

const moduloInfantes = document.getElementById('infants');
const moduloTutores = document.getElementById('tutors');
const moduloColaboradores = document.getElementById('collaborators');
const moduloPersonal = document.getElementById('staff');
const sectInfantes = document.getElementById('people-infant-sect');
const sectTutores = document.getElementById('people-tutor-sect');
const sectColaboradores = document.getElementById('people-collaborator-sect');
const sectPersonal = document.getElementById('people-staff-sect');

const moduloAlimentos = document.getElementById('food');
const moduloJuguetes = document.getElementById('toys');
const moduloRopa = document.getElementById('clothes');
const moduloLibros = document.getElementById('books');
const moduloDonaciones = document.getElementById('donations');
const sectAlimentos = document.getElementById('stock-food-sect');
const sectJuguetes = document.getElementById('stock-toys-sect');
const sectLibros = document.getElementById('stock-books-sect');
const sectDonaciones = document.getElementById('stock-donations-sect');

const moduloUsuarios = document.getElementById('user');
const moduloTipos = document.getElementById('type');
const moduloRoles = document.getElementById('roles');

moduloInfantes.addEventListener('click', (e) => {
    e.stopPropagation();
    
    sectInfantes.classList.remove('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');
});

moduloTutores.addEventListener('click', (e) => {
    e.stopPropagation();

    sectTutores.classList.remove('disabled');
    sectInfantes.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');
});

moduloColaboradores.addEventListener('click', (e) => {
    e.stopPropagation();

    sectTutores.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectColaboradores.classList.remove('disabled');
    sectPersonal.classList.add('disabled');
});

moduloPersonal.addEventListener('click', (e) => {
    e.stopPropagation();

    sectTutores.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.remove('disabled');
});

moduloAlimentos.addEventListener('click', (e) => {
    e.stopPropagation();

    sectAlimentos.classList.remove('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');
})

moduloJuguetes.addEventListener('click', (e) => {
    e.stopPropagation();

    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.remove('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');
})

moduloLibros.addEventListener('click', (e) => {
    e.stopPropagation();

    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.remove('disabled');
    sectDonaciones.classList.add('disabled');
})

moduloDonaciones.addEventListener('click', (e) => {
    e.stopPropagation();

    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.remove('disabled');
})

function selectSection(section) {
    const sections = ['infante', 'conditions', 'tutores', 'emergencias', 'permisos', 'tutor', 'tutorcontact', 'tutorlabor', 'collaborator', 'personal', 'horarios', 'infoadicional', 'vacaciones', 'roles', 'alimentos', 'rubros', 'marcas', 'preparations', 'juguetes', 'tipojuguete', 'donaciones', 'tipodonacion', 'donations-outputs', 'libros', 'tipolibro', 'usuarios', 'tipousuario'];
    
    sections.forEach(sec => {
        const pointElement = document.getElementById(`point-${sec}`);
        const listItem = pointElement.parentElement;
        
        if (sec === section) {
            listItem.classList.add('selected');
        } else {
            listItem.classList.remove('selected');
        }
    });
}

/************************SECCIÓN DE INFANTES************************/
/************************Formulario de ingreso Infantes************************/
const botonInfante = document.getElementById('infant-btn');
const formInfante = document.getElementById('container-infante');

botonInfante.addEventListener('click', (e) => {
    e.stopPropagation();

    formInfante.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');
    
    selectSection('infante');
})

const sideInfant = document.getElementById('side-infant');
const sideTutor = document.getElementById('side-infant-tutor');
const sideEmergency = document.getElementById('side-emergency');
const sidePermissions = document.getElementById('side-permissions');
const sideInfantForm = document.getElementById('form-container-infante');
const sideTutorForm = document.getElementById('form-container-tutores');
const sideEmergencyForm = document.getElementById('form-container-emergencias');
const sidePermissionsForm = document.getElementById('form-container-permisos');

sideInfant.addEventListener('click', (e) => {
    e.stopPropagation();

    sideTutorForm.classList.add('disabled');
    sideEmergencyForm.classList.add('disabled');
    sidePermissionsForm.classList.add('disabled');
    sideInfantForm.classList.remove('disabled');

})

sideTutor.addEventListener('click', (e) => {
    e.stopPropagation();

    sideInfantForm.classList.add('disabled');
    sideTutorForm.classList.remove('disabled');
    sideEmergencyForm.classList.add('disabled');
    sidePermissionsForm.classList.add('disabled');
})

sideEmergency.addEventListener('click', (e) => {
    e.stopPropagation();

    sideInfantForm.classList.add('disabled');
    sideTutorForm.classList.add('disabled');
    sideEmergencyForm.classList.remove('disabled');
    sidePermissionsForm.classList.add('disabled');
})

sidePermissions.addEventListener('click', (e) => {
    e.stopPropagation();

    sideInfantForm.classList.add('disabled');
    sideTutorForm.classList.add('disabled');
    sideEmergencyForm.classList.add('disabled');
    sidePermissionsForm.classList.remove('disabled');
})

/************************Formulario de ingreso Infantes-Condiciones************************/
const botonCondiciones = document.getElementById('infant-condition-btn');
const formCondiciones = document.getElementById('container-conditions');

botonCondiciones.addEventListener('click', (e) => {
    e.stopPropagation();

    formCondiciones.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');

    selectSection('conditions');
})

/************************SECCIÓN DE TUTORES************************/
/************************Formulario de ingreso Tutores************************/
const botonTutores = document.getElementById('tutors-btn');
const formTutores = document.getElementById('container-tutor');

botonTutores.addEventListener('click', (e) => {
    e.stopPropagation();

    formTutores.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');

    selectSection('tutor');
});

const sideTutorIngreso = document.getElementById('side-tutor');
const sideTutorContact = document.getElementById('side-tutorcontact');
const sideTutorLabor = document.getElementById('side-tutorlabor');
const sideFormTutor = document.getElementById('form-container-tutor');
const sideFormContact = document.getElementById('form-container-tutorcontact');
const sideFormLabor = document.getElementById('form-container-tutorlabor');

sideTutorIngreso.addEventListener('click', (e) => {
    e.stopPropagation();

    sideFormTutor.classList.remove('disabled');
    sideFormContact.classList.add('disabled');
    sideFormLabor.classList.add('disabled');
});

sideTutorContact.addEventListener('click', (e) => {
    e.stopPropagation();

    sideFormContact.classList.remove('disabled');
    sideFormTutor.classList.add('disabled');
    sideFormLabor.classList.add('disabled');

});

sideTutorLabor.addEventListener('click', (e) => {
    e.stopPropagation();

    sideFormLabor.classList.remove('disabled');
    sideFormTutor.classList.add('disabled');
    sideFormContact.classList.add('disabled');
});

/************************SECCIÓN DE COLABORADORES************************/
/************************Formulario de ingreso Colaboradores************************/
const botonColaboradores = document.getElementById('collaborator-btn');
const formColaboradores = document.getElementById('container-collaborator');

botonColaboradores.addEventListener('click', (e) => {
    e.stopPropagation();

    formColaboradores.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');

    selectSection('collaborator');
});

/************************SECCIÓN DE PERSONAL************************/
/************************Formulario de ingreso Personal************************/
const botonPersonal = document.getElementById('staff-btn');
const formPersonal = document.getElementById('container-personal');

botonPersonal.addEventListener('click', (e) => {
    e.stopPropagation();

    formPersonal.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');

    selectSection('personal');
})

const sidePersonal = document.getElementById('side-personal');
const sideSchedule = document.getElementById('side-horarios');
const sideInfoAd = document.getElementById('side-infoadicional');
const sideVacation = document.getElementById('side-vacaciones');
const sideFormPersonal = document.getElementById('form-container-personal');
const sideFormSchedule = document.getElementById('form-container-personalhorarios');
const sideFormInfoAd = document.getElementById('form-container-personaladicional');
const sideFormVacation = document.getElementById('form-container-personalvacaciones');

sidePersonal.addEventListener('click', (e) => {
    e.stopPropagation();

    sideFormPersonal.classList.remove('disabled');
    sideFormSchedule.classList.add('disabled');
    sideFormInfoAd.classList.add('disabled');
    sideFormVacation.classList.add('disabled');
});

sideSchedule.addEventListener('click', (e) => {
    e.stopPropagation();

    sideFormSchedule.classList.remove('disabled');
    sideFormPersonal.classList.add('disabled');
    sideFormInfoAd.classList.add('disabled');
    sideFormVacation.classList.add('disabled');
});

sideInfoAd.addEventListener('click', (e) => {
    e.stopPropagation();

    sideFormSchedule.classList.add('disabled');
    sideFormPersonal.classList.add('disabled');
    sideFormInfoAd.classList.remove('disabled');
    sideFormVacation.classList.add('disabled');
});

sideVacation.addEventListener('click', (e) => {
    e.stopPropagation();

    sideFormSchedule.classList.add('disabled');
    sideFormPersonal.classList.add('disabled');
    sideFormInfoAd.classList.add('disabled');
    sideFormVacation.classList.remove('disabled');
});

/************************Formulario de ingreso Personal-Roles************************/
const botonRoles = document.getElementById('staff-type-btn');
const formRoles = document.getElementById('container-roles');

botonRoles.addEventListener('click', (e) => {
    e.stopPropagation();

    formRoles.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectInfantes.classList.add('disabled');
    sectTutores.classList.add('disabled');
    sectColaboradores.classList.add('disabled');
    sectPersonal.classList.add('disabled');

    selectSection('roles');
});

/************************SECCIÓN DE ALIMENTOS************************/
/************************Formulario de ingreso Alimentos************************/
const botonAlimentos = document.getElementById('food-btn');
const formAlimentos = document.getElementById('container-alimentos');

botonAlimentos.addEventListener('click', (e) =>{
    e.stopPropagation();

    formAlimentos.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('alimentos');
});

/************************Formulario de ingreso Rubros************************/
const botonRubros = document.getElementById('food-category-btn');
const formRubros = document.getElementById('container-rubros');

botonRubros.addEventListener('click', (e) =>{
    e.stopPropagation();

    formRubros.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('rubros');
});

/************************Formulario de ingreso Marcas************************/
const botonMarcas = document.getElementById('food-brands-btn');
const formMarcas = document.getElementById('container-marcas');

botonMarcas.addEventListener('click', (e) =>{
    e.stopPropagation();

    formMarcas.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('marcas');
});

/************************Formulario de Preparaciones************************/
const botonPreparaciones = document.getElementById('food-preparations-btn');
const formPreparations = document.getElementById('container-preparations');

botonPreparaciones.addEventListener('click', (e) => {
    e.stopPropagation();

    formPreparations.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('preparations');
});

/************************SECCIÓN DE JUGUETES************************/
/************************Formulario de ingreso Juguetes************************/
const botonJuguetes = document.getElementById('toys-btn');
const formJuguetes = document.getElementById('container-juguetes');

botonJuguetes.addEventListener('click', (e) =>{
    e.stopPropagation();

    formJuguetes.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('juguetes');
});

/************************Formulario de ingreso Juguetes-Tipos************************/
const botonTipoJuguetes = document.getElementById('toys-type-btn');
const formTipoJuguetes = document.getElementById('container-tipojuguete');

botonTipoJuguetes.addEventListener('click', (e) =>{
    e.stopPropagation();

    formTipoJuguetes.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('tipojuguete');
});

/************************SECCIÓN DE LIBROS************************/
/************************Formulario de ingreso Libros************************/
const botonLibros = document.getElementById('books-btn');
const formLibros = document.getElementById('container-libros');

botonLibros.addEventListener('click', (e) =>{
    e.stopPropagation();

    formLibros.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('libros');
});

/************************Formulario de ingreso Libros-Categorías************************/
const botonCatLibros = document.getElementById('books-ages-btn');
const formCatLibros = document.getElementById('container-tipolibro');

botonCatLibros.addEventListener('click', (e) =>{
    e.stopPropagation();

    formCatLibros.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('tipolibro');
});

/************************SECCIÓN DE DONACIONES************************/
/************************Formulario de ingreso Donaciones************************/
const botonDonaciones = document.getElementById('donation-btn');
const formDonaciones = document.getElementById('container-donaciones');

botonDonaciones.addEventListener('click', (e) =>{
    e.stopPropagation();

    formDonaciones.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('donaciones');
});

/************************Formulario de ingreso Donaciones-Tipos************************/
const botonTipoDonaciones = document.getElementById('donation-type-btn');
const formTipoDonaciones = document.getElementById('container-tipodonacion');

botonTipoDonaciones.addEventListener('click', (e) =>{
    e.stopPropagation();

    formTipoDonaciones.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('tipodonacion');
});

/************************Formulario de ingreso Donaciones-Salidas************************/
const botonSalidaDonaciones = document.getElementById('donation-outputs-btn');
const formSalidaDonaciones = document.getElementById('container-donations-outputs');

botonSalidaDonaciones.addEventListener('click', (e) =>{
    e.stopPropagation();

    formSalidaDonaciones.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('donations-outputs');
});

/************************SECCIÓN DE USUARIOS************************/
/************************Formulario de ingreso Usuarios************************/
const botonUsuarios = document.getElementById('user');
const formUsuarios = document.getElementById('container-usuarios');

botonUsuarios.addEventListener('click', (e) =>{
    e.stopPropagation();

    formUsuarios.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');
    
    selectSection('usuarios');
});

/************************Formulario de ingreso Usuarios-Tipos************************/
const botonTipoUsuarios = document.getElementById('type');
const formTipoUsuarios = document.getElementById('container-tipousuario');

botonTipoUsuarios.addEventListener('click', (e) =>{
    e.stopPropagation();

    formTipoUsuarios.classList.remove('disabled');
    contenidoUsuarios.classList.add('disabled');
    contenidoPersonas.classList.add('disabled');
    contenidoInventario.classList.add('disabled');
    sectAlimentos.classList.add('disabled');
    sectJuguetes.classList.add('disabled');
    sectLibros.classList.add('disabled');
    sectDonaciones.classList.add('disabled');

    selectSection('tipousuario');
});

/************************PRUEBA BOTON DE BUSQUEDA************************/
const botonBusqueda = document.querySelector('.search');

botonBusqueda.addEventListener('click', (e)=>{
    e.stopPropagation();

});

/************************************************************************/
function closeForm() {
    
    const inputs = document.querySelectorAll('#container-infante input');
    inputs.forEach(input => {
        input.value = '';
        input.removeAttribute('readonly');
    })

    const formInfante = document.getElementById('container-infante');
    const formTutores = document.getElementById('container-tutor');
    const formColaboradores = document.getElementById('container-collaborator');
    const formPersonal = document.getElementById('container-personal');
    const formCondiciones = document.getElementById('container-conditions');
    const formRoles = document.getElementById('container-roles');
    const formAlimentos = document.getElementById('container-alimentos');
    const formRubros = document.getElementById('container-rubros');
    const formMarcas = document.getElementById('container-marcas');
    const formJuguetes = document.getElementById('container-juguetes');
    const formTipoJuguetes = document.getElementById('container-tipojuguete');
    const formLibros = document.getElementById('container-libros');
    const formCatLibros = document.getElementById('container-tipolibro');
    const formDonaciones = document.getElementById('container-donaciones');
    const formTipoDonaciones = document.getElementById('container-tipodonacion');
    const formUsuarios = document.getElementById('container-usuarios');
    const formTipoUsuarios = document.getElementById('container-tipousuario');
    const formPreparations = document.getElementById('container-preparations');
    const formSalidaDonaciones = document.getElementById('container-donations-outputs');
    
    const forms = [
        formInfante, formTutores, formColaboradores, formPersonal, formCondiciones, formRoles,
        formAlimentos, formRubros, formMarcas, formJuguetes, formTipoJuguetes, formLibros,
        formCatLibros, formDonaciones, formTipoDonaciones, formUsuarios, formTipoUsuarios,
        formPreparations, formSalidaDonaciones
    ];

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
            input.removeAttribute('readonly');
        });
        form.classList.add('disabled'); 
    });

    const sideForms = [
        sideInfantForm, sideTutorForm, sideEmergencyForm, sidePermissionsForm, sideFormTutor, sideFormContact,
         sideFormLabor, sideFormPersonal, sideFormSchedule, sideFormInfoAd, sideFormVacation
    ];

    sideForms.forEach(sideForm => {
        sideForm.classList.add('disabled');
        sideInfantForm.classList.remove('disabled');
        sideFormTutor.classList.remove('disabled');
        sideFormPersonal.classList.remove('disabled');        
    });

    const caja = document.getElementById('notaspreparacion');
    const caja2 = document.getElementById('notassalida');
    caja.innerHTML = '';
    caja2.innerHTML = '';

}

