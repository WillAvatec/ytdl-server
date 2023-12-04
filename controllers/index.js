const ytdl = require("ytdl-core");
const ProgressBar = require("progress");

exports.videoController = async function (req, res) {
  // Alias params
  const id = req.params.id;

  // Get info of the video
  const info = await ytdl.getBasicInfo(id);
  const fileName = `${info.videoDetails.title}.mp4`;
  const length = info.formats[0].contentLength;

  // Set Headers
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", `attachment;filename="${fileName}"`);
  res.setHeader("Transfer-Encoding", "chunked");
  if (length) {
    res.setHeader("Content-Length", String(length));
  }

  const stream = ytdl(id, {
    filter: "videoandaudio",
    quality: "highestvideo",
  });

  stream.pipe(res);
};

exports.audioController = async function (req, res) {
  // Alias params
  const id = req.params.id;

  // Get info of the video
  const info = await ytdl.getBasicInfo(id);
  const fileName = `${info.videoDetails.title}.mp3`;
  const length = info.formats[0].contentLength;

  // Set Headers
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Disposition", `attachment;filename="${fileName}"`);
  res.setHeader("Transfer-Encoding", "chunked");
  if (length) {
    res.setHeader("Content-Length", String(length));
  }

  const stream = ytdl(id, {
    filter: "audio",
    quality: "highestaudio",
  });

  stream.pipe(res);
};

exports.barTestController = async function (req, res) {
  const SAMPLE_URL = "https://www.youtube.com/watch?v=1uPBzLkDYLI";
  let bar;

  const stream = ytdl(SAMPLE_URL, {
    filter: "audioandvideo",
    quality: "highestvideo",
  })
    .on("response", (res) => {
      length = true;
      console.log("Response of video");
      bar = new ProgressBar("downloading [:bar] :percent :etas", {
        complete: String.fromCharCode(0x2588),
        total: parseInt(res.headers["content-length"], 10),
      });
    })
    .on("data", (chunk) => {
      bar.tick(chunk.length);
    })
    .on("end", () => {
      console.log("finished downloading video");
      length = false;
      res.end();
    });

  stream.pipe(res);
};

exports.cron = function (req,res) {
  res.send("hola")
}