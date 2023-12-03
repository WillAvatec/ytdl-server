const express = require("express")
const range_parser = require("range-parser");
const fs = require('fs');
const path = require("path");
const ytdl = require("ytdl-core");
const ProgressBar = require("progress")
const morgan = require("morgan")
const bodyParser = require("body-parser")

const app = express()

const URL = "https://www.youtube.com/watch?v=1uPBzLkDYLI"

app.use(morgan("dev"))
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
})


let bar;
app.get("/video",(req,res)=>{
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
    .on("end",()=>{
        console.log("finished downloading video")
        res.end()
    })
    
    stream.pipe(res)
})
 
app.post("/video/:id/:format",async (req,res)=>{
    console.log(req.params)
    const {id, format } = req.params;

    const info = await ytdl.getBasicInfo(id);
    const length = info.formats[0].contentLength
    const title = info.videoDetails.title;
    const fileName = `${title}.${format === "audio" ? "mp3" : "mp4"}`;
    const contentType = format === "audio" ? "audio/mpeg" : "video/mp4"; 

    res.setHeader(
        "Content-Type", contentType
    )
    res.setHeader(
        "Content-Disposition", `attachment; filename=${fileName}`
    )


    const stream = ytdl(id,{
        quality:"highestvideo",
        filter: format === "audio" ? "audioonly" : "audioandvideo"
    })

    stream.pipe(res)
})

app.listen(3000,()=>{
    console.log("Using attachment")
})