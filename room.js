const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get('room');

socket.emit('join room', room);

document.getElementById('loadVideoButton').addEventListener('click', () => {
    const videoUrl = document.getElementById('videoUrlInput').value;
    socket.emit('video loaded', { url: videoUrl, room });
});

document.getElementById('videoPlayer').addEventListener('play', () => {
    socket.emit('video play', room);
});

document.getElementById('videoPlayer').addEventListener('pause', () => {
    socket.emit('video pause', room);
});

document.getElementById('videoPlayer').addEventListener('seeked', () => {
    const currentTime = document.getElementById('videoPlayer').currentTime;
    socket.emit('video seek', { time: currentTime, room });
});

document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('input');
    if (input.value) {
        socket.emit('chat message', { msg: input.value, room });
        input.value = '';
    }
});

socket.on('video loaded', (url) => {
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = url;
    videoPlayer.play();
});

socket.on('video play', () => {
    document.getElementById('videoPlayer').play();
});

socket.on('video pause', () => {
    document.getElementById('videoPlayer').pause();
});

socket.on('video seek', (time) => {
    document.getElementById('videoPlayer').currentTime = time;
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('video state', (videoState) => {
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = videoState.url;
    videoPlayer.currentTime = videoState.currentTime;
    if (videoState.isPlaying) {
        videoPlayer.play();
    }
});
/*lahmacun*/