const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-Parser');
const path = require('path');
// history.replaceState(null,null,'hello');
app.use((req,res,next)=>{

    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

const PORT =3000;
const secretKey = 'My super secret key';
const jwtMW =exjwt({
    secret: secretKey,
    algorithms:['HS256']
});
let users=[


    {
        id:1,
        username:'shriya',
        password: '123'
    },
    {
        id:1,
        username:'mohit',
        password: '123'
    },
    {
        id:3,
        username:'abhi',
        password: '123'
    },

];


app.post('/api/login',(req,res) =>{
const{username,password} =req.body;
// console.log('This is me',username,password);
// res.json({data: 'it works'});

for(let user of users){

    if(username==user.username && password==user.password){

        let token =jwt.sign({id:user.id, username:user.username , password: user.password}, secretKey,{expiresIn:'6d'});
        res.json({
            success:true,
            err:null,
            token
        });break;
    }
    else{res.status(401).json({


        success:false,
        token:null,
        err:'username or pwd is incorrect'
    });
}
}

});

app.get('/api/dashboard',jwtMW,(req,res)=>{

    // console.log(req);
    res.json({

        success:true,
        myContent: 'Secret COntent only visible to authorized users'
    });
});

app.get('/api/prices',jwtMW,(req,res)=>{

    // console.log(req);
    res.json({

        success:true,
        myContent: 'Price is $3.89'
    });
});


app.get('/api/settings',jwtMW,(req,res)=>{

    // console.log(req);
    res.json({

        success:true,
        myContent: 'settings route created'
    });
});

app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.use(function(err,req,res,next){
// console.log(err.name == 'UnauthorizedError');
// console.log(err);


if(err.name ==='UnauthorizedError'){

    res.status(401).json({
        success:false,
        officialError: err,
        err: 'username/Pwd Incorrect'
    });
}
else next(err);
});

app.listen(PORT,() => {

console.log('serving');

});