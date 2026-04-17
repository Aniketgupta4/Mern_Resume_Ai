const UserModel = require('../Modals/user');

exports.register = async(req,res)=>{
    try{
       const {name,email,photoUrl} = req.body;
       const userExist = await UserModel.findOne({email:email});
       if(!userExist){
        let newUser = new UserModel({name,email,photoUrl});
        await newUser.save();
        res.status(200).json({
            message:"user registered successfully",
            user:newUser
        })
       }
       return res.status(200).json({
        message:"Welcome Back",
        user:userExist
       })
    }catch(err){
        console.log(err)
        res.status(500).json({"message":"error registering user","error":err})
    }
}