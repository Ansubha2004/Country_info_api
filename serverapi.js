const express=require('express');
const app=express();
const datas=require('./public/data.json');
const cors=require("cors");
const fs=require('fs');
require("dotenv").config();
const port=process.env.PORT || 8008;
const jsondatafile="./public/data.json";
const path=require('path');

//Rest API CRUD operations


app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.static('./public'));


app.route("/api/countryinfo")
.get((req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,"public","data.html"));
})
.post((req,res)=>{
    const body=req.body;
    datas.push({...body})
    console.log(body);
    fs.writeFile(jsondatafile,JSON.stringify(datas),(err,data)=>{
        if(err)
            console.log(err);
        else
        return res.json({"status":"post success"});
    })
    
});
app.route("/api/countryinfo/:nationcode")
.get((req,res)=>{
    const code=(req.params.nationcode);
    const nation=datas.find( (data)=> { return data.alpha2Code===code})
    return res.status(200).json(nation);
})
.delete((req,res)=>{
    const code=req.params.nationcode;
    const newcountryset=datas.filter((data)=>{return data.alpha2Code!==code});
    fs.writeFile(jsondatafile,JSON.stringify(newcountryset),(err,data)=>{
        if(err)
            console.log(err);
        else
        return res.json({"status":"delete success"});
    })
})

app.all("*",(req,res)=>{
    return res.status(404).send("Server Error..");
});

app.listen(port,()=>{
    console.log('Responding to server API....');
});