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
       return client.execute(query, [ req.query.fruit_id ])
          .then(result => {
           return ('Fruta %s', result.rows[0].name)
          }
          );
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
/*
curl 127.0.0.1:8000?fruit_id=d4
*/