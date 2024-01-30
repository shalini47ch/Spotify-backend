//here we need to perform the routing for our apps
const router = require("express").Router();

//import the user and validate from the models folder
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");


//here we need to create a new user
router.post("/",async(req,res)=>{
    const {error}=validate(req.body)
    if(error){
        return res.status(403).send({message:error.details[0].message})
    }
    //here we will find the user with a specific email
    const user=await User.findOne({email:req.body.email})
    //now the next step is to see if this user already exists or we need to create a new user
    if(user){
        return res.status(403).send({message:"User already exists"})
    }
    //this is meant for hashing of password and salting is done so that password wont be attacked 
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
	const hashPassword = await bcrypt.hash(req.body.password, salt);

    //here if it is not the case then we create a new user 
    let newUser= await new User({
        ...req.body,
        password:hashPassword
    }).save()

    //this line is written so that we dont have to pass the password from the client side
    newUser.password = undefined;
	newUser.__v = undefined;
    res.status(200).send({data:newUser,message:"User created successfully"})
    
})

module.exports=router;