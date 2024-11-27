const express = require('express');
const connection = require('./conexion');
const { generateToken, authenticateJWT } = require('./auth');
const cors = require('cors');
const app = express();


app.use(cors({
  origin: 'http://127.0.0.1:5501',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

/********************************** LOGIN **********************************/
app.post('/login', (req, res) => {
  const { Usuario, Contraseña } = req.body;

  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?';
  connection.query(query, [Usuario, Contraseña], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      const user = { id: results[0].ID_Usuario, usuario: results[0].Usuario };
      const token = generateToken(user); // Genera el token para el usuario

      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  });
});

// Ruta protegida
app.get('/index', authenticateJWT, (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado', user: req.user });
});

/********************************** SECCION INFANTES **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-infantes', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT id_infante, nombre, apellido, dni FROM infantes';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de infantes:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT id_infante, nombre, apellido, dni FROM infantes WHERE nombre LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-infantes/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwinfantes WHERE id_infante = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-infantes', (req, res) => {
  const { id_infante, nombre, apellido, dni, genero, fechaNacimiento, ID_tutor, obra_social, medico_cabecera, hospital_pref, ID_condicion, medicacion, recibir_auxilio, recibir_atencion_med, fotos_redes } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM infantes WHERE id_infante = ?';
  connection.query(checkQuery, [id_infante], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del infante:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE infantes SET nombre = ?, apellido = ?, dni = ?, genero = ?, fechaNacimiento = ?, ID_tutor = ?, obra_social = ?, medico_cabecera = ?, hospital_pref = ?, ID_condicion = ?, medicacion = ?, recibir_auxilio = ?, recibir_atencion_med = ?, fotos_redes = ? WHERE id_infante = ?';
          const updateValues = [nombre, apellido, dni, genero, fechaNacimiento, ID_tutor, obra_social, medico_cabecera, hospital_pref, ID_condicion, medicacion, recibir_auxilio, recibir_atencion_med, fotos_redes, id_infante];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Infante actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO infantes (id_infante, nombre, apellido, dni, genero, fechaNacimiento, ID_tutor, obra_social, medico_cabecera, hospital_pref, ID_condicion, medicacion, recibir_auxilio, recibir_atencion_med, fotos_redes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          const insertValues = [id_infante, nombre, apellido, dni, genero, fechaNacimiento, ID_tutor, obra_social, medico_cabecera, hospital_pref, ID_condicion, medicacion, recibir_auxilio, recibir_atencion_med, fotos_redes];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Infante insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

app.get('/api/condiciones-select', (req, res) => {
  const query = 'SELECT ID_condicion, descripcion FROM condiciones';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener condiciones:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-infante/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del infante a eliminar

  const query = 'DELETE FROM infantes WHERE id_infante = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Infante no encontrado' });
      }
      res.status(200).json({ message: 'Infante eliminado correctamente' });
  });
});

/********************************** SECCION INFANTES - CONDICIONES **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-condiciones', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT id_condicion, descripcion FROM condiciones';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de condiciones:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  })
};
  const query = `SELECT * FROM condiciones WHERE descripcion LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
});

app.get('/api/completar-condiciones/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM condiciones WHERE ID_condicion = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-condiciones', (req, res) => {
  const {id_condicion, descripcion, anotaciones} = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM condiciones WHERE id_condicion = ?';
  connection.query(checkQuery, [id_infante], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del infante:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE condiciones SET descripcion = ?, anotaciones = ? WHERE id_condicion = ?';
          const updateValues = [descripcion, anotaciones, id_condicion];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Condicion actualizada correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO condiciones (id_condicion, descripcion, anotaciones) VALUES (?, ?, ?)';
          const insertValues = [id_condicion, descripcion, anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Condicion insertada correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-condiciones/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del infante a eliminar

  const query = 'DELETE FROM condiciones WHERE id_condicion = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Condicion no encontrada' });
      }
      res.status(200).json({ message: 'Condicion eliminada correctamente' });
  });
});

/********************************** SECCION TUTORES **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-tutores', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT id_tutor, nombre, apellido, dni FROM tutores';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de tutores:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  })
};
  const query = `SELECT id_tutor, nombre, apellido, dni FROM tutores WHERE nombre LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
})

app.get('/api/completar-tutores/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwTutores WHERE id_tutor = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-tutores', (req, res) => {
  const {id_tutor, nombre, apellido, telefono, direccion, parentezco, dni, correo, telefono_alternativo, ocupacion, empresa, direccion_trabajo, telefono_trabajo} = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM tutores WHERE id_tutor = ?';
  connection.query(checkQuery, [id_tutor], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del tutor:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE tutores SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, parentezco = ?, dni = ?, correo = ?, telefono_alternativo = ?, ocupacion = ?, empresa = ?, direccion_trabajo = ?, telefono_trabajo = ? WHERE id_tutor = ?';
          const updateValues = [nombre, apellido, telefono, direccion, parentezco, dni, correo, telefono_alternativo, ocupacion, empresa, direccion_trabajo, telefono_trabajo, id_tutor];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Tutor actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO tutores (id_tutor, nombre, apellido, telefono, direccion, parentezco, dni, correo, telefono_alternativo, ocupacion, empresa, direccion_trabajo, telefono_trabajo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          const insertValues = [id_tutor, nombre, apellido, telefono, direccion, parentezco, dni, correo, telefono_alternativo, ocupacion, empresa, direccion_trabajo, telefono_trabajo];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Tutor insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-tutores/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tutores WHERE id_tutor = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Tutor no encontrado' });
      }
      res.status(200).json({ message: 'Tutor eliminado correctamente' });
  });
});

/********************************** SECCION COLABORADORES **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-colaboradores', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT * FROM colaboradores';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de infantes:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT id_colaborador, nombre, apellido, dni FROM colaboradores WHERE nombre LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-colaboradores/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM colaboradores WHERE id_colaborador = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-colaboradores', (req, res) => {
  const { id_colaborador, nombre, apellido, dni, tipo_colaborador, direccion, telefono, email } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM colaboradores WHERE id_colaborador = ?';
  connection.query(checkQuery, [id_colaborador], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del colaborador:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE colaboradores SET nombre = ?, apellido = ?, dni = ?, tipo_colaborador = ?, direccion = ?, telefono = ?, email = ? WHERE id_colaborador = ?';
          const updateValues = [nombre, apellido, dni, tipo_colaborador, direccion, telefono, email, id_colaborador];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Colaborador actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO colaboradores (id_colaborador, nombre, apellido, dni, tipo_colaborador, direccion, telefono, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
          const insertValues = [id_colaborador, nombre, apellido, dni, tipo_colaborador, direccion, telefono, email];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Colaborador insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-colaboradores/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del infante a eliminar

  const query = 'DELETE FROM colaboradores WHERE id_colaborador = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Colaborador no encontrado' });
      }
      res.status(200).json({ message: 'Colaborador eliminado correctamente' });
  });
});

/********************************** SECCION PERSONAL **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-personal', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT * FROM vwpersonal';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de personal:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT * FROM vwpersonal WHERE nombre LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-personal/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwpersonal WHERE id_personal = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-personal', (req, res) => {
  const { ID_Personal, Nombre, Apellido, DNI, Direccion, Correo, Telefono, ID_Rol, Dias_Laborales, Hora_Inicio, Hora_Finalizacion, Condicion_Med, Emergencias, Dias_Vacaciones, Inicio_Vacaciones, Finalizacion_Vacaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM personal WHERE id_personal = ?';
  connection.query(checkQuery, [ID_Personal], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del personal:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE personal SET nombre = ?, apellido = ?, dni = ?, direccion = ?, correo = ?, telefono = ?, ID_rol = ?, dias_laborales = ?, hora_inicio = ?, hora_finalizacion = ?, condicion_med = ?, emergencias = ?, dias_vacaciones = ?, inicio_vacaciones = ?, finalizacion_vacaciones = ? WHERE id_personal = ?';
          const updateValues = [Nombre, Apellido, DNI, Direccion, Correo, Telefono, ID_Rol, Dias_Laborales, Hora_Inicio, Hora_Finalizacion, Condicion_Med, Emergencias, Dias_Vacaciones, Inicio_Vacaciones, Finalizacion_Vacaciones, ID_Personal];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Personal actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO personal (ID_personal, nombre, apellido, dni, direccion, correo, telefono, id_rol, dias_laborales, hora_inicio, hora_finalizacion, condicion_med, emergencias, dias_vacaciones, inicio_vacaciones, finalizacion_vacaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          const insertValues = [ID_Personal, Nombre, Apellido, DNI, Direccion, Correo, Telefono, ID_Rol, Dias_Laborales, Hora_Inicio, Hora_Finalizacion, Condicion_Med, Emergencias, Dias_Vacaciones, Inicio_Vacaciones, Finalizacion_Vacaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Personal insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

app.get('/api/roles-select', (req, res) => {
  const query = 'SELECT ID_rol, rol FROM roles';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener roles:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

/***************** Borrado *****************/
 app.delete('/api/eliminar-personal/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM personal WHERE id_personal = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Personal no encontrado' });
      }
      res.status(200).json({ message: 'Personal eliminado correctamente' });
  });
});

/********************************** SECCION ROLES **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-roles', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_rol, rol FROM roles';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de roles:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_rol, rol FROM roles WHERE rol LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-roles/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM roles WHERE ID_rol = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-roles', (req, res) => {
  const { ID_rol, rol, anotaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM roles WHERE ID_rol = ?';
  connection.query(checkQuery, [ID_rol], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del rol:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE roles SET rol = ?, anotaciones = ? WHERE ID_rol = ?';
          const updateValues = [rol, anotaciones, ID_rol];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Rol actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO roles (ID_rol, rol, anotaciones) VALUES (?, ?, ?)';
          const insertValues = [ID_rol, rol, anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Rol insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-roles/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del rol a eliminar

  const query = 'DELETE FROM roles WHERE ID_rol = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Rol no encontrado' });
      }
      res.status(200).json({ message: 'Rol eliminado correctamente' });
  });
});

/********************************** SECCION ALIMENTOS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-alimentos', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_Alimento, alimento, Marca, Rubro FROM vwalimentos';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de alimentos:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_Alimento, alimento, Marca, Rubro FROM vwalimentos WHERE alimento LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-alimentos/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwalimentos WHERE ID_Alimento = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-alimentos', (req, res) => {
  const { ID_Alimento, alimento, Peso, Cantidad, ID_Marca, ID_Rubro, Vencimiento, FechaIngreso } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM alimentos WHERE ID_Alimento = ?';
  connection.query(checkQuery, [ID_Alimento], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia de alimentos:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE alimentos SET alimento = ?, peso = ?, cantidad = ?, ID_Marca = ?, ID_Rubro = ?, vencimiento = ?, fechaIngreso = ? WHERE ID_Alimento = ?';
          const updateValues = [alimento, Peso, Cantidad, ID_Marca, ID_Rubro, Vencimiento, FechaIngreso, ID_Alimento];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Alimento actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO alimentos (ID_Alimento, alimento, Peso, Cantidad, ID_Marca, ID_Rubro, Vencimiento, FechaIngreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
          const insertValues = [ID_Alimento, alimento, Peso, Cantidad, ID_Marca, ID_Rubro, Vencimiento, FechaIngreso];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Alimento insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

app.get('/api/marcas-select', (req, res) => {
  const query = 'SELECT ID_marca, descripcion FROM marcas';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener marcas:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

app.get('/api/rubros-select', (req, res) => {
  const query = 'SELECT ID_rubro, descripcion FROM rubros';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener rubros:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-alimentos/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM alimentos WHERE ID_Alimento = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Alimento no encontrado' });
      }
      res.status(200).json({ message: 'Alimento eliminado correctamente' });
  });
});

/********************************** SECCION ALIMENTOS - RUBROS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-rubros', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_rubro, descripcion FROM rubros';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de rubros:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_rubro, descripcion FROM rubros WHERE descripcion LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-rubros/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM rubros WHERE ID_rubro = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-rubros', (req, res) => {
  const { id_rubro, descripcion, anotaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM rubros WHERE ID_rubro = ?';
  connection.query(checkQuery, [id_rol], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del rubro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE rubros SET descripcion = ?, anotaciones = ? WHERE ID_rubro = ?';
          const updateValues = [descripcion, anotaciones, id_rubro];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Rubro actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO rubros (ID_rubro, descripcion, anotaciones) VALUES (?, ?, ?)';
          const insertValues = [id_rubro, descripcion, anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Rubro insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-rubros/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del rubro a eliminar

  const query = 'DELETE FROM rubros WHERE ID_rubro = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Rubro no encontrado' });
      }
      res.status(200).json({ message: 'Rubro eliminado correctamente' });
  });
});

/********************************** SECCION ALIMENTOS - MARCAS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-marcas', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_marca, descripcion FROM marcas';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de marcas:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_marca, descripcion FROM marcas WHERE descripcion LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-marcas/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM marcas WHERE ID_marca = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-marcas', (req, res) => {
  const { ID_marca, descripcion, anotaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM marcas WHERE ID_marca = ?';
  connection.query(checkQuery, [ID_marca], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia de la marca:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE marcas SET descripcion = ?, anotaciones = ? WHERE ID_marca = ?';
          const updateValues = [descripcion, anotaciones, ID_marca];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Marca actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO marcas (ID_marca, descripcion, anotaciones) VALUES (?, ?, ?)';
          const insertValues = [ID_marca, descripcion, anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Marca insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-marcas/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID de la marca a eliminar

  const query = 'DELETE FROM marcas WHERE ID_marca = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Marca no encontrado' });
      }
      res.status(200).json({ message: 'Marca eliminado correctamente' });
  });
});

/********************************** SECCION PREPARACIONES ******************************/
/***************** Busqueda *****************/
app.get('/api/obtener-preparaciones', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT DISTINCT ID_Preparacion, Preparacion FROM vwpreparaciones';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de preparaciones:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT DISTINCT ID_Preparacion, Preparacion FROM vwpreparaciones WHERE preparacion LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-preparaciones/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwpreparaciones WHERE ID_preparacion = ?`;
  connection.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };

      const preparacion = {
        ID_Preparacion: results[0].ID_Preparacion,
        FechaAlta: results[0].FechaAlta,
        Preparacion: results[0].Preparacion,
        Alimentos: results.map(row => ({
          NroItem: row.NroItem,
          ID_Alimento: row.ID_Alimento,
          Alimento: row.Alimento,
          Cantidad: row.Cantidad
        }))
      };
  
      res.json(preparacion);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-preparaciones', (req, res) => {
  const { ID_Preparacion, Preparacion, items, FechaAlta } = req.body;

  if (!Preparacion || Preparacion.trim() === '' || !ID_Preparacion || !items || items.length === 0) {
    return res.status(400).json({ error: 'Falta completar campos.' });
  }

  const queries = Array.isArray(items) ? items.map((item) => {
    return new Promise((resolve, reject) => {
      if (!item.NroItem) {
        const nroItemQuery = `
          SELECT MAX(NroItem) AS maxItem 
          FROM preparaciones 
          WHERE ID_Preparacion = ?`;
        connection.query(nroItemQuery, [ID_Preparacion], (error, results) => {
          if (error) {
            console.error('Error al calcular NroItem:', error);
            return reject(error);
          }
          const nextNroItem = (results[0].maxItem || 0) + 1;
          item.NroItem = nextNroItem;
          insertarOActualizar(item).then(resolve).catch(reject);
        });
      } else {
        insertarOActualizar(item).then(resolve).catch(reject);
      }

      function insertarOActualizar(item) {
        return new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO preparaciones (ID_Preparacion, Preparacion, NroItem, ID_Alimento, Cantidad) 
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            Preparacion = ?, FechaAlta = ?`;
      
          const values = [
            ID_Preparacion, Preparacion, item.NroItem, item.ID_Alimento, item.Cantidad,
            Preparacion, FechaAlta
          ];
      
          connection.query(insertQuery, values, (error) => {
            if (error) {
              console.error('Error al insertar o actualizar:', error);
              return reject(error); // Rechaza la Promesa si hay un error
            }
            resolve(`Item ${item.NroItem} procesado.`); // Resuelve la Promesa si se inserta/actualiza correctamente
          });

          const updateStockQuery = `
          UPDATE alimentos
          SET Cantidad = Cantidad - ?
          WHERE ID_Alimento = ?`; // Aseguramos que no se reste si el stock es insuficiente
        const updateValues = [item.Cantidad, item.ID_Alimento];

        connection.query(updateStockQuery, updateValues, (updateError, updateResults) => {
          if (updateError) {
            console.error('Error al actualizar stock de alimentos:', updateError);
            return reject(updateError);
          }

          // Verificar si el stock fue suficiente
          if (updateResults.affectedRows === 0) {
            return reject(new Error(`Stock insuficiente para el alimento con ID ${item.ID_Alimento}`));
          }

          resolve(`Item ${item.NroItem} procesado y stock actualizado.`);
        });
        });
      }      
    });
  }) : [];

  Promise.all(queries)
    .then((results) => {
      res.status(200).json({ message: 'Preparaciones guardadas correctamente.', details: results });
    })
    .catch((error) => {
      console.error('Error al guardar preparaciones:', error);
      res.status(500).json({ error: 'Error al guardar las preparaciones.' });
    });
});



/***************** Borrado *****************/
app.delete('/api/eliminar-preparacion/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID de la marca a eliminar

  const query = 'DELETE FROM preparaciones WHERE ID_preparacion = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Preparacion no encontrada' });
      }
      res.status(200).json({ message: 'Preparacion eliminada correctamente' });
  });
});

/********************************** SECCION JUGUETES **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-juguetes', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_Juguete, Nombre, Tipo FROM vwjuguetes';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de juguetes:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_Juguete, Nombre, Tipo FROM vwjuguetes WHERE Nombre LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-juguetes/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwjuguetes WHERE ID_Juguete = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-juguetes', (req, res) => {
  const { ID_Juguete, Nombre, ID_Tipo, Tamaño, EdadMinima, FechaIngreso, Cantidad } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM juguetes WHERE ID_Juguete = ?';
  connection.query(checkQuery, [ID_Juguete], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del juguete:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE juguetes SET nombre = ?, ID_Tipo = ?, tamaño = ?, edadminima = ?, fechaingreso = ?, cantidad = ? WHERE ID_Juguete = ?';
          const updateValues = [Nombre, ID_Tipo, Tamaño, EdadMinima, FechaIngreso, Cantidad, ID_Juguete];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Juguete actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO juguetes (ID_Juguete, nombre, ID_Tipo, tamaño, edadminima, fechaingreso, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)';
          const insertValues = [ID_Juguete, Nombre, ID_Tipo, Tamaño, EdadMinima, FechaIngreso, Cantidad];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Juguete insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

app.get('/api/tipojuguetes-select', (req, res) => {
  const query = 'SELECT ID_tipo, descripcion FROM tipojuguetes';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener tipo de juguete:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-juguetes/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del juguete a eliminar

  const query = 'DELETE FROM juguetes WHERE ID_Juguete = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Juguete no encontrado' });
      }
      res.status(200).json({ message: 'Juguete eliminado correctamente' });
  });
});

/********************************** SECCION JUGUETES - TIPOS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-tipojuguetes', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_tipo, descripcion FROM tipojuguetes';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de tipojuguetes:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_tipo, descripcion FROM tipojuguetes WHERE descripcion LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-tipojuguetes/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM tipojuguetes WHERE ID_tipo = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-tipojuguetes', (req, res) => {
  const { ID_tipo, descripcion, anotaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM tipojuguetes WHERE ID_tipo = ?';
  connection.query(checkQuery, [ID_tipo], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia de tipojuguetes:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE tipojuguetes SET ID_tipo = ?, descripcion = ?, anotaciones = ? WHERE ID_tipo = ?';
          const updateValues = [descripcion, anotaciones, ID_tipo];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'tipojuguetes actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO tipojuguetes (ID_tipo, descripcion, anotaciones) VALUES (?, ?, ?)';
          const insertValues = [ID_tipo, descripcion, anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'tipojuguetes insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-tipojuguetes/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del tipo de juguete a eliminar

  const query = 'DELETE FROM tipojuguetes WHERE ID_tipo = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'tipojuguetes no encontrado' });
      }
      res.status(200).json({ message: 'tipojuguetes eliminado correctamente' });
  });
});

/********************************** SECCION LIBROS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-libros', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_Libro, Libro, Categoria FROM vwlibros';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de libros:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_Libro, Libro, Categoria FROM vwlibros WHERE Libro LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-libros/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwlibros WHERE ID_Libro = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});


/***************** Insercion y modificacion *****************/
app.post('/api/guardar-libros', (req, res) => {
  const { ID_Libro, Libro, Cantidad, FechaIngreso, ID_Categoria } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM libros WHERE ID_Libro = ?';
  connection.query(checkQuery, [ID_Libro], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del libro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE libros SET Libro = ?, Cantidad = ?, FechaIngreso = ?, ID_Categoria = ? WHERE ID_Libro = ?';
          const updateValues = [Libro, Cantidad, FechaIngreso, ID_Categoria, ID_Libro];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Libro actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          
          const insertQuery = 'INSERT INTO libros (ID_Libro, Libro, Cantidad, ID_Categoria) VALUES (?, ?, ?, ?)';
          const insertValues = [ID_Libro, Libro, Cantidad, ID_Categoria];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Libro insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

app.get('/api/categorias-select', (req, res) => {
  const query = 'SELECT ID_Categoria, Descripcion FROM categorias';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener categorias:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-libros/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del libro a eliminar

  const query = 'DELETE FROM libros WHERE ID_Libro = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Libro no encontrado' });
      }
      res.status(200).json({ message: 'Libro eliminado correctamente' });
  });
});

/********************************** SECCION LIBROS - CATEGORIAS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-categorias', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT ID_Categoria, Descripcion FROM categorias';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de categorias:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT ID_Categoria, Descripcion FROM categorias WHERE Descripcion LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-categorias/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM categorias WHERE ID_Categoria = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-categorias', (req, res) => {
  const { ID_Categoria, Descripcion, Anotaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM categorias WHERE ID_Categoria = ?';
  connection.query(checkQuery, [ID_Categoria], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia de categorias:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE categorias SET Descripcion = ?, Anotaciones = ? WHERE ID_Categoria = ?';
          const updateValues = [Descripcion, Anotaciones, ID_Categoria];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'categorias actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO categorias (ID_Categoria, Descripcion, Anotaciones) VALUES (?, ?, ?)';
          const insertValues = [ID_Categoria, Descripcion, Anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Categorias insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
app.delete('/api/eliminar-categorias/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID de la categoria a eliminar

  const query = 'DELETE FROM categorias WHERE ID_Categoria = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'categoria no encontrado' });
      }
      res.status(200).json({ message: 'categoria eliminado correctamente' });
  });
});

/********************************** SECCION DONACIONES **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-donaciones', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT * FROM vwdonaciones';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de donaciones:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT * FROM vwdonaciones WHERE descripcion LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-donaciones/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwdonaciones WHERE id_donacion = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-donaciones', (req, res) => {
  const { ID_Donacion, ID_colaborador, monto, cantidad, ID_Tipo, descripcion } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM donaciones WHERE id_donacion = ?';
  connection.query(checkQuery, [ID_Donacion], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia de la donacion:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE donaciones SET ID_Colaborador = ?, monto = ?, cantidad = ?, id_tipo = ?, descripcion = ? WHERE id_donacion = ?';
          const updateValues = [ID_colaborador, monto, cantidad, ID_Tipo, descripcion, ID_Donacion];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Usuario actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO donaciones (ID_Donacion, ID_colaborador, monto, cantidad, ID_Tipo, descripcion) VALUES (?, ?, ?, ?, ?, ?)';
          const insertValues = [ID_Donacion, ID_colaborador, monto, cantidad, ID_Tipo, descripcion];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Donacion insertada correctamente', id: insertResults.insertId });
          });
      }
  });
});

app.get('/api/tipodonacion-select', (req, res) => {
  const query = 'SELECT ID_Tipo, Tipo FROM donacionestipos';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener roles:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

/***************** Borrado *****************/
 app.delete('/api/eliminar-donaciones/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM donaciones WHERE id_donacion = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Donacion no encontrada' });
      }
      res.status(200).json({ message: 'Donacion eliminada correctamente' });
  });
});

/********************************** SECCION DONACIONES - TIPOS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-tipodonacion', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT * FROM donacionestipos';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de los tipos:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT * FROM donacionestipos WHERE tipo LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-tipodonacion/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM donacionestipos WHERE id_tipo = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-tipodonacion', (req, res) => {
  const { ID_Tipo, Tipo, Anotaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM donacionestipos WHERE id_tipo = ?';
  connection.query(checkQuery, [ID_Tipo], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del tipo de donacion:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE donacionestipos SET tipo = ?, anotaciones = ? WHERE id_tipo = ?';
          const updateValues = [Tipo, Anotaciones, ID_Tipo];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Tipo de donacion actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO donacionestipos (ID_Tipo, Tipo, Anotaciones) VALUES (?, ?, ?)';
          const insertValues = [ID_Tipo, Tipo, Anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Tipo de donacion insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
 app.delete('/api/eliminar-tipodonacion/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del infante a eliminar

  const query = 'DELETE FROM donacionestipos WHERE id_tipo = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Tipo de usuario no encontrado' });
      }
      res.status(200).json({ message: 'Tipo de usuario eliminado correctamente' });
  });
});

/********************************** SECCION DONACIONES - SALIDAS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-salidas', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT DISTINCT ID_Salida, Recibe FROM vwsalidas';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de salidas:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT DISTINCT ID_Salida, Recibe FROM vwsalidas WHERE Recibe LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-salidas/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwsalidas WHERE ID_Salida = ?`;
  connection.query(query, [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };

      const salida = {
        ID_Salida: results[0].ID_Salida,
        FechaAlta: results[0].FechaAlta,
        Recibe: results[0].Recibe,
        Donaciones: results.map(row => ({
          NroItem: row.NroItem,
          ID_Donacion: row.ID_Donacion,
          Descripcion: row.Descripcion,
          Cantidad: row.Cantidad
        }))
      };
  
      res.json(salida);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-salidas', (req, res) => {
  const { ID_Salida, Recibe, items, FechaAlta } = req.body;

  if (!Recibe || Recibe.trim() === '' || !ID_Salida || !items || items.length === 0) {
    return res.status(400).json({ error: 'Falta completar campos.' });
  }

  const queries = Array.isArray(items) ? items.map((item) => {
    return new Promise((resolve, reject) => {
      if (!item.NroItem) {
        const nroItemQuery = `
          SELECT MAX(NroItem) AS maxItem 
          FROM salidas 
          WHERE ID_Salida = ?`;
        connection.query(nroItemQuery, [ID_Salida], (error, results) => {
          if (error) {
            console.error('Error al calcular NroItem:', error);
            return reject(error);
          }
          const nextNroItem = (results[0].maxItem || 0) + 1;
          item.NroItem = nextNroItem;
          insertarOActualizar(item).then(resolve).catch(reject);
        });
      } else {
        insertarOActualizar(item).then(resolve).catch(reject);
      }

      function insertarOActualizar(item) {
        return new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO salidas (ID_Salida, Recibe, NroItem, ID_Donacion, Cantidad) 
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            Recibe = ?, FechaAlta = ?`;
      
          const values = [
            ID_Salida, Recibe, item.NroItem, item.ID_Donacion, item.Cantidad,
            Recibe, FechaAlta
          ];
      
          connection.query(insertQuery, values, (error) => {
            if (error) {
              console.error('Error al insertar o actualizar:', error);
              return reject(error); // Rechaza la Promesa si hay un error
            }
            resolve(`Item ${item.NroItem} procesado.`); // Resuelve la Promesa si se inserta/actualiza correctamente
          });

          const updateStockQuery = `
          UPDATE donaciones
          SET cantidad = cantidad - ?
          WHERE ID_Donacion = ?`; // Aseguramos que no se reste si el stock es insuficiente
        const updateValues = [item.Cantidad, item.ID_Donacion];

        connection.query(updateStockQuery, updateValues, (updateError, updateResults) => {
          if (updateError) {
            console.error('Error al actualizar stock de donaciones:', updateError);
            return reject(updateError);
          }

          // Verificar si el stock fue suficiente
          if (updateResults.affectedRows === 0) {
            return reject(new Error(`Stock insuficiente para la donacion con ID ${item.ID_Donacion}`));
          }

          resolve(`Item ${item.NroItem} procesado y stock actualizado.`);
        });
          
        });
      }      
    });
  }) : [];

  Promise.all(queries)
    .then((results) => {
      res.status(200).json({ message: 'Preparaciones guardadas correctamente.', details: results });
    })
    .catch((error) => {
      console.error('Error al guardar preparaciones:', error);
      res.status(500).json({ error: 'Error al guardar las preparaciones.' });
    });
});



/***************** Borrado *****************/
app.delete('/api/eliminar-salida/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID de la marca a eliminar

  const query = 'DELETE FROM salidas WHERE ID_Salida = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Salida no encontrada' });
      }
      res.status(200).json({ message: 'Salida eliminada correctamente' });
  });
});

/********************************** SECCION USUARIOS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-usuarios', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT * FROM vwusuarios';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de usuarios:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT * FROM vwusuarios WHERE usuario LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-usuarios/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM vwusuarios WHERE id_usuario = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-usuarios', (req, res) => {
  const { ID_Usuario, Usuario, Contraseña, ID_Tipo } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE id_usuario = ?';
  connection.query(checkQuery, [ID_Usuario], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del usuario:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE usuarios SET usuario = ?, contraseña = ?, id_tipo = ? WHERE id_usuario = ?';
          const updateValues = [Usuario, Contraseña, ID_Tipo, ID_Usuario];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Usuario actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO usuarios (ID_usuario, usuario, contraseña, id_tipo) VALUES (?, ?, ?, ?)';
          const insertValues = [ID_Usuario, Usuario, Contraseña, ID_Tipo];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Usuario insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

app.get('/api/tipousuario-select', (req, res) => {
  const query = 'SELECT ID_Tipo, Tipo FROM usuariostipo';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener tipos:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.json(results);
  });
});

/***************** Borrado *****************/
 app.delete('/api/eliminar-usuarios/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del infante a eliminar

  const query = 'DELETE FROM usuarios WHERE id_usuario = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
  });
});

/********************************** SECCION USUARIOS - TIPOS **********************************/
/***************** Busqueda *****************/
app.get('/api/obtener-tipousuario', (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm || searchTerm == '') {
    const selectAll = 'SELECT * FROM usuariostipo';
    connection.query(selectAll, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de los tipos:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(200).json(results);
  });
} else {
  const query = `SELECT * FROM usuariostipo WHERE tipo LIKE ?`;
  connection.query(query, [`%${searchTerm}%`], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
  });
}
});

app.get('/api/completar-tipousuario/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = `SELECT * FROM usuariostipo WHERE id_tipo = ?`;
  connection.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err)
      };
      res.json(result[0]);
  });
});

/***************** Insercion y modificacion *****************/
app.post('/api/guardar-tipousuario', (req, res) => {
  const { ID_Tipo, Tipo, Anotaciones } = req.body;

  // Verificar si el ID ya existe
  const checkQuery = 'SELECT COUNT(*) AS count FROM usuariostipo WHERE id_tipo = ?';
  connection.query(checkQuery, [ID_Tipo], (error, results) => {
      if (error) {
          console.error('Error al verificar la existencia del tipo de usuario:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      const exists = results[0].count > 0;

      if (exists) {
          // Si existe, realiza un UPDATE
          const updateQuery = 'UPDATE usuariostipo SET tipo = ?, anotaciones = ? WHERE id_tipo = ?';
          const updateValues = [Tipo, Anotaciones, ID_Tipo];

          connection.query(updateQuery, updateValues, (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar datos en la base de datos:', updateError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(200).json({ message: 'Tipo de usuario actualizado correctamente' });
          });
      } else {
          // Si no existe, realiza un INSERT
          const insertQuery = 'INSERT INTO usuariostipo (ID_Tipo, Tipo, Anotaciones) VALUES (?, ?, ?)';
          const insertValues = [ID_Tipo, Tipo, Anotaciones];

          connection.query(insertQuery, insertValues, (insertError, insertResults) => {
              if (insertError) {
                  console.error('Error al insertar datos en la base de datos:', insertError);
                  return res.status(500).json({ error: 'Error en el servidor' });
              }
              res.status(201).json({ message: 'Tipo de usuario insertado correctamente', id: insertResults.insertId });
          });
      }
  });
});

/***************** Borrado *****************/
 app.delete('/api/eliminar-tipousuario/:id', (req, res) => {
  const { id } = req.params; // Obtén el ID del infante a eliminar

  const query = 'DELETE FROM usuariostipo WHERE id_tipo = ?';
  connection.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error al eliminar el registro:', error);
          return res.status(500).json({ error: 'Error en el servidor' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Tipo de usuario no encontrado' });
      }
      res.status(200).json({ message: 'Tipo de usuario eliminado correctamente' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
