# Conferencia-BD2
USAC, Abril 2020, Bases de datos 2, Conferencia Introduccion a Cassandra con Node JS

# Indice
---
- docker-compose
- script
- aplicacion node js

# docker-compose
---
Este archivo sirve para definir dos servicios:
- web server node
    - build: Se indica la ruta del archivo Dockerfile
    - volumes: se enlaza una carpeta en el anfitrion dentro del contendor.

```
web_server:
    build: "./app"
    volumes:
      - "./db:/home"
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

```
  cassandra:
    image: cassandra
    ports:
      - "9042:9042"
    networks:
      - service
    restart: always

```

- network

```
networks:
  service:
    driver: "bridge"
    
```
