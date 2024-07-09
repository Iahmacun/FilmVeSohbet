const socket = io();

document.getElementById('usernameForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const roomName = document.getElementById('roomName').value;
    if (username && roomName) {
        window.location.href = `room.html?username=${username}&room=${roomName}`;
    }
});
/*lahmacun*/