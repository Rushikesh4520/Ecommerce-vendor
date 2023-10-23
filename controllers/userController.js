const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");

const securePassword = async(password) => {

    try{
        const passwordHash = await bcryptjs.hash(password,10);
        return passwordHash;

    }catch(error){
        res.status(400).send(error.message);
    }
}
 const register_user = async(req,res) =>{
    try{

        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:spassword,
            mobile:req.body.mobile,
            image:req.file.filename,
            type:req.body.type
            
        });

        const userData = await User.findOne({email:req.body.email});
        if(userData){
            res.status(200).send({ success: false, msg: "this email is already exists" });

        }
        else{
            const user_data = await user.save();
            res.status(200).send({success:true,data:user_data})
        }

    }catch(error){
        res.status(400).send(error.message);

    }
 }


//   login Method

const user_login = async(req,res) =>{
    try{

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcryptjs.compare(password,userData.password);    
            if(passwordMatch){
                const userResult = {
                    _id:userData._id,
                    name:userData.name,
                    email:userData.email,
                    password:userData.password,
                    image:userData.image,
                    mobile:userData.mobile,
                    type:userData.type,
                }
                const response = {
                    success:true,
                    msg:" User Details",
                    data:userResult
                }
                res.status(200).send(response);
            }
            else{
                res.status(200).send({success:false,msg:" Login Details are incorrect"})
            }
        }
            else{
             res.status(200).send({success:false,msg:" Login Details are incorrects"})
            }

    } catch (error){
        res.status(400).send(error.message);
    }
}







 module.exports ={
    register_user,
    user_login

 }