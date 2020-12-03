
const koa = require('koa');
const json = require('koa-json');
const KoaRouter = require('koa-router');
const path = require('path');
const render = require('koa-ejs');

const app = new koa();
const router = new KoaRouter();

app.use(json());

render(app, {
    root: path.join(__dirname, 'views'), //view root directory
    layout: 'layout', // global layout file 
    viewExt: 'html', // view file extension
    cache: false, //cache compiled templates
    debug: false
});

// ctx is the koa context that encapsulates node's request and response objects into a single object
// which provides methods for writing web app
const home = async (ctx) => {
    await ctx.render('index', {
        title: 'template params for title'
    });
}


router.get('/', home);

router.get('/demo', ctx => (ctx.body = 'Using Router!!'))

// app.use(async ctx => (ctx.body = {msg: 'Hello World'}));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('Website is live!')