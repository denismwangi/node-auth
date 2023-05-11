

exports.register = (req, res) => {

    const {name,email,password, confirm_password} = req.body;

    db.query('SELECT email FROM users WHERE email=?', [email], (error, result)=>{
        if(error){
            console.log(error);
        }
        if(result.length > 0){
            return res.render('register',{
                message: 'email already in use'
            })
        }elseif(){
            
        }

    })

    res.send("Form Submitted");
}