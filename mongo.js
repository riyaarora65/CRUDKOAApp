var MongoClient = require('mongodb').MongoClient,
// Connection url
var url = 'mongodb://localhost:27017';
// Connect using MongoClient

let db;

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if(err)
        return console.log(err);
    db = client.db("demodb")
    console.log('Connected to db');
});