const url_ws = "ws://localhost:8000"
const url_http = "http://localhost:8000"

$(document).ready(async () => {
    listRooms()
    createRoom()
    // receiveMessage()
    // sendMessage()

})

function websocket(path){
    return new WebSocket(`${url_ws}/${path}`);
}

function listRooms(){
    const roomListSocket = websocket('list_rooms')

    roomListSocket.onopen = () => {
        console.log("Conectado para listar salas.");
    };

    roomListSocket.onmessage = (event) => {
        updateRoomList(event.data);
    };

    roomListSocket.onclose = () => {
        console.log("Desconectado da listagem de salas.");
    };
}

function updateRoomList(data){
    const rooms = JSON.parse(data)

    if(rooms.length == 0) return;

    const container = document.getElementById("rooms");
    $(container).empty()
    for(let i in rooms){
        const li = document.createElement("li");
        // room.className = "message received";
        li.textContent = `Sala ${rooms[i]}`;
        container.appendChild(li);
    }
}

async function createRoom(){
    try {

        $("#create_room").on('click', async () => {
            const response = await fetch(`${url_http}/create_room`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            const roomId = data.room_id;
            console.log(roomId)
            return;
            console.log("Sala criada:", roomId);

            roomListSocket.close(); // Fecha a conexão de listagem
            connectToRoom(roomId);
        })
    } catch (error) {
        console.error("Erro ao criar sala:", error);
    }
}

function receiveMessage() {
    const messageList = document.getElementById("messages");
    const newMessage = document.createElement("li");
    newMessage.className = "message received";
    newMessage.textContent = event.data;
    messageList.appendChild(newMessage);
}

function sendMessage() {
    $('#enviarMensagem').on('click', () => {
        const input = document.getElementById("messageInput");
        const messageList = document.getElementById("messages");
        
        // Criar mensagem enviada
        const newMessage = document.createElement("li");
        newMessage.className = "message sent";
        newMessage.textContent = input.value;
        messageList.appendChild(newMessage);
        
        // Enviar para o WebSocket
        socket.send(input.value);
        input.value = "";
    })
}
