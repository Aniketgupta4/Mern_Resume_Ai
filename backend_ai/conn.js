const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://aniketkumargupta302_db_user:nLjS4DdduMkkHuv5@cluster0.seydzee.mongodb.net/?appName=Cluster0').then((res)=>{
    console.log("connected to database")
}).catch(err=>{
    console.log("error connecting to database",err)
})

