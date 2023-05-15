const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require("mysql");
const dotenv = require('dotenv');
require('dotenv').config()
const { promisify } = require("util");


//db connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
db.connect((error) =>{
    if(error){
        console.log(error);
    }else{
        console.log("database connected...");
    }
})


exports.register = (req, res) => {
    
    
    const {name,email,password, confirm_password} = req.body;

    db.query('SELECT email FROM users WHERE email=?', [email], async (error, result)=>{
        if(error){
            console.log(error);
        }
        if(result.length > 0){
            return res.render('register',{
                message: 'email already in use'
            })

        }else if(password  !== confirm_password){
            res.render('register',{
                message: 'Password do not match'
            })
            
        }

        let hashed_password = await bcrypt.hash(password, 8);
        db.query('INSERT INTO users SET ?',{name:name, email:email, password:hashed_password}, (error, results) =>{
            if(error){
                console.log(error);
            }else{
                console.log(results);
                res.render('register',{
                    message: 'Registered successfully'
                })
            }

        })
        console.log(hashed_password);



    });

   // res.send("Form Submitted");
};

exports.login = async (req, res) => {
     
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).render("login", {
          message: "Please Enter Your Email and Password",
        
        });
      }
  
      db.query("SELECT * FROM users WHERE email=?",[email],async (error, result) => {
         // console.log(result);
          if (result.length <= 0) {
            return res.status(401).render("login", {
              message: "Please Enter Your Email and Password",
            });
          } else {
            const db_res = JSON.stringify(result);
            var res_json =  JSON.parse(db_res);

            //console.log(res_json[0].password);
            if (!(await bcrypt.compare(password, res_json[0].password))) {
              return res.status(401).render("login", {
                message: "Please Enter Your Email and Password",
               
              });
            } else {
             
              const id = res_json[0].id;
              const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
              console.log("The Token is " + token);
              const cookieOptions = {
                expires: new Date(
                  Date.now() +
                    process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
              };
              res.cookie("deno", token, cookieOptions);
              res.status(200).redirect("/home");
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  exports.isLoggedIn = async (req, res, next) => {
    //req.name = "Check Login....";
    console.log(req.cookies.deno);
    if (req.cookies.deno) {
      try {
        const decode = await promisify(jwt.verify)(
          req.cookies.deno,
          process.env.JWT_SECRET
        );
        //console.log(decode);
        db.query("SELECT * FROM users WHERE id=?",[decode.id],(err, results) => {
            console.log(results);
            if (!results) {
              return next();
            }
            console.log(results[0]);
            req.user = results[0];
            return next();
          }
        );
      } catch (error) {
        console.log(error);
        return next();
      }
    } else {
      next();
    }
  };

  exports.logout = async (req, res) => {
    res.cookie("deno", "logout", {
      expires: new Date(Date.now() + 2 * 1000),
      httpOnly: true,
    });
    res.status(200).redirect("/");
  };