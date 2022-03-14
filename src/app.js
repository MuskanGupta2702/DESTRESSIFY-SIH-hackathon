const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
// const upload = require("express-fileupload");
const fs = require('fs');
const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;
const bcrypt = require("bcrypt");

const server = require("http").Server(app);
const io = require('socket.io')(server);
const {v4: uuidv4} = require("uuid");

const connection = require("./utils/dbconnection");
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectory));
app.use(express.json());
// app.use(upload());

app.use(flash());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//allow to access data from req
app.use(express.urlencoded({ extended: false }));


//using passport
const initializePassport = require("./utils/passportConfig");
initializePassport(passport, email => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `userdetail` WHERE `email` = '" + email + "'";
        connection.query(sql, (err, rows) => {
            resolve(rows[0]);
        })
    })
}, id => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `userdetail` WHERE `id` = " + id + "";
        connection.query(sql, (err, rows) => {
            resolve(rows[0]);
        })
    })
});


//ENDPOINTS
app.get('/', (req, res) => {
    res.render("home")
})

app.get('/orgStu', (req, res) => {
    res.render("orgStu")
})



app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/userdashboard",
    failureRedirect: "/",
    failureFlash: true,
}))


//patient signup
app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register")
})

// const checkAlreayExist = (email) => {
//     return new Promise((resolve, reject) => {
//         let sql1 = "SELECT * FROM `userdetail` WHERE `email` LIKE '" + email + "' AND `status` LIKE 'patient'";
//         connection.query(sql1, (err, rows) => {
//             if (rows.length > 0) {
//                 reject();
//             } else {
//                 resolve();
//             }
//         })
//     })
// }


// app.post("/register", checkNotAuthenticated, async (req, res) => {
//     try {
//         res.set({ 'Content-Type': 'application/json' });
//         let name = req.body.name;
//         let email = req.body.email;
//         let password = req.body.password
//         // let password = await bcrypt.hash(req.body.password, 10);
//         console.log(name + email + password)
//         await checkAlreayExist(email);
//         const sql = "INSERT INTO `userdetail` (`id`, `name`, `email`, `password`, `status`) VALUES (NULL, '" + name + "', '" + email + "', '" + password + "', 'patient');"
//         connection.query(sql, (err, rows) => {
//             if (!err) {
//                 return res.send({
//                     msg: "Account Created",
//                 });
//             } else {
//                 res.redirect("/");
//             }
//         })
//     } catch (err) {
//         // console.log("inside catch");
//         return res.send({
//             msg: "Email already registered",
//         });
//     }
// })


// const checkAlreayExistDr = (email) => {
//     return new Promise((resolve, reject) => {
//         let sql1 = "SELECT * FROM `drdetail` WHERE `email` LIKE '" + email + "'";
//         connection.query(sql1, (err, rows) => {
//             if (rows.length > 0) {
//                 reject();
//             } else {
//                 resolve();
//             }
//         })
//     })
// }


app.get("/logout", checkAuthenticated, (req, res) => {
    req.logOut();
    console.log('Log out done');

    res.redirect("/");
})


// Video-calling
app.get("/video-calling", (req,res) => {
    res.redirect(`/video-calling${uuidv4()}`)
});

app.get('/video-calling:room' , (req, res) =>{    
    res.render('room', { roomID : req.params.room})
})

io.on('connection', socket =>{
    socket.on('join-room', (roomID, userId)=>{
        console.log('Joined Room');
        socket.join(roomID);
        // socket.to(roomId).broadcast.emit('user-connected');
        socket.broadcast.to(roomID).emit('user-connected', userId);

        socket.on('message', message =>{
            io.to(roomID).emit('createMessage', message);
        })
    })
})


//middlewares
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}



// START THE SERVER
server.listen(port, () => {
    console.log(`Server is running at http://${hostname}:${port}/`)
})





