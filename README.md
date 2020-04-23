# Conferencia-BD2
USAC, Abril 2020, Bases de datos 2, Conferencia Introduccion a Cassandra con Node JS

# Indice
---
- [app](#app)
    - Dockerfile
    - index.js
- [docker-compose](#dokercompose)
- [BD](#bd)
- [Ejecutar](#ejecutar)

# app
La aplicacion se compone de dos fases:
- Dockerfile
Cada instruccion realiza lo siguiente
    - From: Descarga la imagen
    - Workdir: Establece el directorio de trabajo
    - Copy: copia todos los archivos a la imagen
    - RUN: instala todas las dependencias
    - EXPOSE: Documenta que usa el puerto 8000
    - CMD: Comando inicial
```
FROM node:carbon
WORKDIR /
COPY . /
RUN npm install
EXPOSE 8000
CMD node index.js
```
- servidor express node js
- Utiliza la libreria cassandra-driver para comunicarse con cassandra.
- Se puede configurar los puntos de contacto, es decir las ips de los nodos, la informacion de autenticacion y el keyspace especifico a utilizar.
- Se ejecutan comandos cql directamente, en este caso un simple get
```
'use strict';

const express = require('express');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

//”cassandra-driver” is in the node_modules folder. Redirect if necessary.
var cassandra = require('cassandra-driver'); 
//Replace Username and Password with your cluster settings
var authProvider = new cassandra.auth.PlainTextAuthProvider('Username', 'Password');
//Replace PublicIP with the IP addresses of your clusters
var client = new cassandra.Client({contactPoints:['cassandra'], authProvider: authProvider, keyspace:'grocery'});
 
// App
const app = express();

app.get('/', (req, res) => {
        const query = 'SELECT * from fruit_stock WHERE item_id = ?';
        client.execute(query, [ 'c3' ])
          .then(result => console.log('Fruta %s', result.rows[0].name));
          
    res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
```


# docker compose
---
Este archivo sirve para definir dos servicios:
- web server node
    - build: Se indica la ruta del archivo Dockerfile
    - ports: se mapea el puerto 8000 de la pc con el puerto 8000 del contenedor
    - links: se enlazan este servicio con la BD cassandra
    - networks: se une a la red 
    - command: se le indica que comando ejecutar al completar de construir el contenedor.

```
web_server:
    build: "./app"
    depends_on:
        - cassandra
    environment:
        - NODE_ENV=production
    ports:
        - "8000:8000"
    links: 
        - cassandra
    networks: 
        - service
    command: node index.js
```

- bd cassandra
Se define el servicio de base de datos de casandra.
    - image: Se crea a partir de la imagen cassandra
    - volumes: se enlaza una carpeta en el anfitrion dentro del contendor.
    - ports: Se mapea el puerto 9042 de la pc con el puerto del contenedor
    - networks: se une a la red 
    - restart: Si falla siempre se reinicia el servicio

```
  cassandra:
    image: cassandra
    ports:
      - "9042:9042"
    volumes:
      - "./db:/docker-entrypoint-initdb.d"
    networks:
      - service
    restart: always

```

- network
Se define una red de tipo puente para poder comunicar a los contenedores.
```
networks:
  service:
    driver: "bridge"
```


# Ejecutar
Para lanzar los servicios basta con utilizar el comando
```
docker-compose up -d --build
```