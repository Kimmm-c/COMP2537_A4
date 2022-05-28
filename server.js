const express = require('express')
const app = express()
const session = require('express-session')
const path = require('path');

app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})

app.use(session(
    {
        secret: 'thisisasecret',
        saveUninitialized: true,
        resave: true
    }
))

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://kimmm-c:comp1537a3@cluster0.gddfm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const timelineSchema = new mongoose.Schema({
    activity: String,
    hits: Number,
    time: String
});
const Timeline = mongoose.model("timelines", timelineSchema);

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    email: String,
    password: String,
    shoppingCart: Array,
    price: Number,
    orderHistory: Array,
    timeline: [
        {
            activity: String,
            hits: Number,
            time: String
        }
    ]

});
const User = mongoose.model("users", userSchema);


//decode the request
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
    extended: true
}))

app.use(bodyparser.json())

function authentication(req, res, next) {
    req.session.authenticated ? next() : res.redirect(`/login`);
}

function admin(req, res, next) {
    req.session.user.title == 'admin' ? next() : res.redirect(`/user_profile`);
}

// app.get('/', authentication, (req, res) => {
//     //console.log('running')
//     //console.log(req.session.authenticated)
//     console.log(req.session)
//     res.redirect('/home');
// })

function isloggedIn(req, res, next) {
    req.session.authenticated ? res.redirect(`/user_profile`) : next();
}

app.get("/", authentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/home', authentication, (req, res) => {
    //console.log('home called')
    //console.log(path.join(__dirname, 'public/index.html'))
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/search', authentication, (req, res) => {
    //console.log('home called')
    //console.log(path.join(__dirname, 'public/index.html'))
    res.sendFile(path.join(__dirname, 'public/pokemon_search.html'))
})

app.get('/user_profile', authentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/user_profile.html'))
})

app.get('/shoppingCart', authentication, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/shoppingcart.html'))
})

app.get('/login', isloggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'))
})

app.post('/login', (req, res) => {
    console.log('login called')
    User.find({ email: req.body.email, password: req.body.password }, (err, user) => {
        if (user.length > 0) {
            // console.log(user)
            req.session.authenticated = true;
            req.session.user = user[0];
            // if(user[0].title == "admin"){
            //     req.session.admin = true;
            // }
            console.log(req.session)
            res.send(user[0])
        } else {
            // console.log(user.length)
            res.send('fail')
        }
    })
})

app.get('/register', isloggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'))
})

app.post('/register', (req, res) => {
    //console.log(req.body.first, req.body.last, req.body.email, req.body.password)
    console.log(req.body)
    User.find({ email: req.body.email }, (err, user) => {
        if (user.length > 0) {
            console.log('user exists')
            res.send('exist')
        } else {
            //console.log(user.length)
            req.body.shoppingCart = []
            req.body.orderHistory = []
            req.body.timeline = []
            req.body.price = 0
            //console.log(req.body)
            User.create(req.body)
            res.send('success')
        }
    })
})

// app.get('/pokemon_profile', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/profile.html'))
// })

app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log(req.session)
    res.redirect('/')
})

app.put('/add_to_cart', (req, res) => {
    //console.log(req.session)
    //console.log(req.session.user["_id"]);
    User.findByIdAndUpdate({ _id: req.session.user["_id"] }, { $inc: { 'price': req.body.price }, $push: { 'shoppingCart': req.body["poke_name"] } }, (err, user) => {
        //console.log(user)
        //console.log(req.session)
        res.send('success')
    })
})

app.get('/get_cart', (req, res) => {
    User.find({ _id: req.session.user["_id"] }, (err, user) => {
        err ? console.log(err) : res.send(user)
    })
})

app.post('/checkout', (req, res) => {
    // console.log(req.session)
    User.findByIdAndUpdate({ _id: req.session.user["_id"] }, { $push: { 'orderHistory': { 'cart': req.body.cart, 'price': req.body.price } }, $set: { 'shoppingCart': [], 'price': 0 } }, (err, user) => {
        err ? console.log(err) : res.send('checkout successfully')
    })
})

app.get('/get_order_history', (req, res) => {
    User.find({ _id: req.session.user["_id"] }, (err, user) => {
        err ? console.log(err) : res.send(user[0].orderHistory)
    })
})

app.get('/get_user', (req, res) => {
    User.find({ _id: req.session.user["_id"] }, (err, user) => {
        err ? console.log(err) : res.send(user[0])
    })
})

app.post('/add_timeline', (req, res) => {
    //Timeline.create(req.body)
    console.log(req.body);
    User.findByIdAndUpdate({ _id: req.session.user["_id"] }, { $push: { 'timeline': { 'activity': req.body.activity, 'hits': req.body.hits, 'time': req.body.time } } }, (err, user) => {
        err ? console.log(err) : res.send('timeline added')
    })
})

// app.get('/get_all_timeline', (req, res) => {
//     //console.log(req.query.name);
//     Timeline.find({}, (err, timeline) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.send(timeline);
//         }
//     })
// })

app.put('/delete_timeline/:data', (req, res) => {
    // console.log(req.params.data);
    User.findByIdAndUpdate({ _id: req.session.user["_id"] }, { $pull: { "timeline": { 'time': req.params.data } } }, (err, user) => {
        err ? console.log(err) : res.send('timeline removed')
    })
})

app.put('/update_likes/:data', (req, res) => {
    console.log(req.params.data);
    User.findOneAndUpdate({ _id: req.session.user["_id"], 'timeline.time': req.params.data}, { $inc: {'timeline.$.hits': 1 }}, (err, user) => {
        err ? console.log(err) : res.send('')
    })
})

app.delete('/remove_item/:data/:price', (req, res) =>{
    User.findByIdAndUpdate({_id: req.session.user["_id"]}, {$pull: {'shoppingCart': req.params.data}, $inc: {'price': -req.params.price}}, (err, user) =>{
        err ? console.log(err) : res.send(`item removed`)
    })
})

app.get('/admin', admin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'))
})
app.get('/get_all_users', (req, res) => {
    User.find({}, (err, users) => {
        err ? console.log(err) : res.send(users)
    })
})

app.delete('/delete_user', (req, res) => {
    //console.log('delete called')
    User.findByIdAndRemove({_id: req.body.id}, (err, result) => {
        err ? console.log(err) : res.send('deleted')
    })
})
app.use(express.static("./public"))