const koa = require("koa");
const Router = require("koa-router");
const Logger = require("koa-logger");
// const mongo = require('koa-mongo');
const BodyParser = require("koa-bodyparser");
const MongoClient = require('mongodb').MongoClient;

const app = new koa ();
const router = new Router();
const url = 'mongodb://localhost:27017';
let db;

app.use(Logger());
app.use(BodyParser()); //parses the json and url encoded data

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if(err)
        return console.log(err);
    db = client.db("demodb")
    app.db = db;
    console.log('Connected to db');
});
// app.use(mongo({
//     host: 'localhost',
//     port: 27017,
//     db: 'demodb'
// }));

//ctx is the Koa context that encapsulates the request and response objects into a single object
const fetchAllRecords = async (ctx) => {
    try{
        ctx.body = await ctx.app.db.collection("people").find().toArray();
    }
    catch(err)
    {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
}

const createRecord = async (ctx) => {
    try{
        ctx.body = await ctx.app.db.collection("people").insertOne(ctx.request.body);
    }
    catch(err)
    {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
}

const fetchRecord = async (ctx) => {
    try{
        ctx.body = await ctx.app.db.collection("people").findOne({"_id": mongo.ObjectId(ctx.params.id)})
    }
    catch(err)
    {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
}

const updateRecord = async (ctx) => {
    let documentQuery = {"_id": mongo.ObjectId(ctx.params.id)};
    let valuesToUpdate = ctx.request.body;
    try {
        ctx.body = await ctx.app.db.collection("people").updateOne(documentQuery, {$set: valuesToUpdate});
    }
    catch(err)
    {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
}

const deleteRecord = async (ctx) => {
    let documentQuery = {"_id": mongo.ObjectId(ctx.params.id)};
    try {
        ctx.body = await ctx.app.db.collection("people").deleteOne(documentQuery);
    }
    catch(err)
    {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
}

//Read
router.get("/people", fetchAllRecords);

//Create
router.post("/people", createRecord);

//Get by ID
router.get("/people/:id", fetchRecord);

//Update
router.put("/people/:id", updateRecord);

//Delete
router.delete("/people/:id", deleteRecord);

//returns seperate middleware for responding to options requests. This also handles 405 error Method Not Allowed and 501 Not Implemented
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


