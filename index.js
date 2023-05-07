const fs = require("fs");
const path = require('path');
const express = require("express");

const app = express();
const chunkSize = 10 ** 6;

app
    .use(express.static('public'))

    .get("/video",
        (req, res, next) => {
            if (!req.headers.range)
                return res.status(400).send("Requires Range header");
            next();
        }, (req, res) => {
            const vPath = path.resolve('media', 'vediofile.m4v');
            const start = Number(req.headers.range.replace(/\D/g, ""));

            const vSize = fs.statSync(vPath).size;
            const end = Math.min(start + chunkSize, vSize - 1);

            res.writeHead(206, {
                "Accept-Ranges": "bytes",
                "Content-Type": "video/m4v",
                "Content-Length": end - start + 1,
                "Content-Range": `bytes ${start}-${end}/${vSize}`,
            });

            fs.createReadStream(vPath, {start, end}).pipe(res);
        })

    .listen(8000, function () {
        console.log("Listening on port 8000!");
    });