const express = require("express")
const range_parser = require("range-parser");
const fs = require('fs');
const path = require("path");
const ytdl = require("ytdl-core");
const ProgressBar = require("progress")

const app = express()

const URL = "https://www.youtube.com/watch?v=1uPBzLkDYLI"

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
})


let bar;
app.get("/video",(req,res)=>{
    console.log("Request on /video")

    const stream = ytdl(URL, {
        filter:"audioandvideo",
        quality:"highestvideo",
    })
    .on("response",(res)=>{
        console.log("Response of video")
        bar = new ProgressBar('downloading [:bar] :percent :etas', { 
            complete : String.fromCharCode(0x2588), 
            total    : parseInt(res.headers['content-length'], 10) 
        });
    })
    .on("data",chunk=>{
        bar.tick(chunk.length)
    })
    .on("progress",(length,totalDownloaded,total)=>{
        console.log({length,totalDownloaded,total})
    })
    .on("end",()=>{
        res.end()
    })
    
    stream.pipe(res)
})

app.listen(3000,()=>{
    console.log("Server started")
})