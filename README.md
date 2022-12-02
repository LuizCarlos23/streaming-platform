# PLATAFORMA DE STREAMING

### ROTAS:

##### 📌 Usuários(Autenticação)

POST http://localhost:3333/users - Cria um novo usuário

POST http://localhost:3333/login - Login de usuário

##### Todas as rotas abaixo precisam que o usuário esteja autenticado.

##### 🎥 Vídeos

GET http://localhost:3333/videos - Lista todos os vídeos

GET http://localhost:3333/videos/:id - Lista um único vídeo

POST http://localhost:3333/videos - Cria um vídeo

PUT http://localhost:3333/videos/:id - Atualiza um vídeo

DELETE http://localhost:3333/videos/:id - Deleta um vídeo

##### 📝 Tags

GET http://localhost:3333/tags - Lista todas as tags

GET http://localhost:3333/tags/:title_tag/videos - Lista vídeos daquela tag

POST http://localhost:3333/tags - Cria tag

PUT http://localhost:3333/tags/:id - Atualiza uma tag

DELETE http://localhost:3333/tags/:id - Deleta uma tag
