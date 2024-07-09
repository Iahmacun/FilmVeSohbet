const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const youtubedl = require('youtube-dl-exec');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    const clientIp = socket.request.connection.remoteAddress;
    console.log(`Yeni bir kullanıcı bağlandı: ${clientIp}`);

    socket.on('join room', ({ username, room }) => {
        socket.join(room);
        io.to(room).emit('user joined', `🚪 ${username} odaya katıldı`);
    });

    socket.on('chat message', ({ room, message }) => {
        const username = socket.handshake.query.username;
        io.to(room).emit('chat message', { username, message });
    });

    socket.on('load video', ({ room, videoUrl }) => {
        io.to(room).emit('load video', { videoUrl });
    });

    socket.on('video play', ({ room }) => {
        io.to(room).emit('video play');
    });

    socket.on('video pause', ({ room }) => {
        io.to(room).emit('video pause');
    });

    socket.on('video seek', ({ room, time }) => {
        io.to(room).emit('video seek', { time });
    });

    socket.on('load youtube video', async ({ room, videoUrl }) => {
        try {
            const info = await youtubedl(videoUrl, {
                dumpSingleJson: true,
                noWarnings: true,
                preferFreeFormats: true,
                youtubeSkipDashManifest: true
            });

            const downloadedFilePath = info.url;
            io.to(room).emit('load video', { videoUrl: downloadedFilePath });
        } catch (error) {
            console.error('YouTube video indirme hatası:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Kullanıcı bağlantısı kesildi: ${clientIp}`);
    });
});

server.listen(3000, () => {
    console.log('Sunucu çalışıyor, port 3000');
});


app.post('/upload-video', (req, res) => {
    const { videoFile } = req.files; 
    const videoPath = path.join(__dirname, 'uploads', videoFile.name);

    videoFile.mv(videoPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        res.json({ videoUrl: `/uploads/${videoFile.name}` });
    });
});
/*lahmacun*/