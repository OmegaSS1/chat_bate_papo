from fastapi import FastAPI, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, List
from uuid import uuid4
import json

app  = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rooms: Dict[int, List[WebSocket]] = {}
room_clients: List[WebSocket] = []
connected_clients: List[WebSocket] = []

@app.websocket("/{room_id}")
async def chat_endpoint(websocket: WebSocket, room_id: int):
    if room_id in rooms:
        await websocket.accept()
        
        rooms[room_id].append(websocket)
        print(rooms)
        await notifyClientOnChat(websocket, "entrou no chat!")

    try:
        while True:
            data = await websocket.receive_text()
            for client in connected_clients:
                if client != websocket:  # Envia apenas para outros clientes
                    await client.send_text(data)
    
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        await notifyClientOnChat(websocket, "saiu do chat!")

    except WebSocketException:
        connected_clients.remove(websocket)
        await notifyClientOnChat(websocket, "saiu do chat!")

@app.get("/create_room")
async def create_room():
    room_id = len(rooms) + 1
    rooms[room_id] = []
    await send_room_list()

    data = {"room_id": room_id}
    return JSONResponse(status_code=200, content=data)


@app.websocket("/list_rooms")
async def list_rooms(websocket: WebSocket):
    await websocket.accept()
    room_clients.append(websocket)
    await send_room_list()

    try :
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        room_clients.remove(websocket)


async def send_room_list():
    """Atualiza a lista de salas para todos os clientes conectados à listagem."""
    room_ids = list(rooms.keys())
    data = json.dumps(room_ids)

    for client in room_clients:
        await client.send_text(data)

# async def showRooms(websocket: WebSocket):
#     await websocket.send_json(rooms)


async def notifyClientOnChat(websocket: WebSocket, message: str):
    for client in connected_clients:
        if client != websocket:
            await client.send_text(f"{websocket} {message}")