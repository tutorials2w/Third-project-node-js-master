const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios/:id', validateusuarioId);

const usuarios = [];

function logRequests(request, response, next) {
  const {method, url} =request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  next();

}

app.use(logRequests); 

function validateusuarioId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)) 
     return (response.status(400).json({ error: 'Invalid project ID. (Middleware)' }));

  return next();

}

app.get('/usuarios', (request, response) => {
  const { name, email} = request.query;

  
  results = name ?
    usuarios.filter(usuario => usuario.title.includes(name)) :
    usuarios;

 
  results = email ?
    results.filter(usuario => usuario.owner.includes(email)) :
    results;

  return response.json(results);
});


app.post('/usuarios', (request, response) => {
  const { name, email } = request.body;
  const id = uuid();

  const usuario = { id, name, email };
  usuarios.push(usuario);

  return response.json(usuario);
});

app.put('/usuarios/:id', validateusuarioId, (request, response) => {
  const { id } = request.params;
  const { name, email } = request.body;

  usuarioIndex = usuarios.findIndex(usuario => usuario.id === id);

  if (usuarioIndex < 0) {
    return response.status(400).json({ error: 'usuario não encontrado'});
  }

  const usuario = { id, name, email };

  usuarios[usuarioIndex] = usuario;

  return response.json(usuario);
});

app.delete('/usuarios/:id', validateusuarioId, (request, response) => {
  const { id } = request.params;

  usuarioIndex = usuarios.findIndex(usuario => usuario.id === id);

  if (usuarioIndex < 0) {
    return response.status(400).json({ error: 'usuario não encontrado'});
  }

  usuarios.splice(usuarioIndex, 1);

  return response.json({ 'Status da exclusão': 'sucessidido' });

});

app.listen(4000, () => {
  console.log('Servidor iniciado.')
});