import { useFetch } from "../hooks/useFetch.ts";
import { Button } from "../components/Button.tsx";
import { useWebSocket } from "../hooks/useWebsocket.ts";
import api from "../services/api.ts";
import { useEffect } from "react";
import { Link, Route } from "react-router-dom";

export default function Home() {
    const { socket } = useWebSocket("ws://localhost:8000/list_rooms")

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const roomsList = document.getElementById('rooms');
                if (roomsList) {
                    roomsList.innerHTML = '';
                    const rooms = JSON.parse(event.data);
                    rooms.map((room: number) => {

                        const li = document.createElement('li');
                        li.textContent = `Sala ${room}`;
                        li.setAttribute('id', `${room}`);
                        li.addEventListener('click', () => {
                            window.location.href = '/room/' + room
                        });
                        roomsList.appendChild(li);
                    });
                }
            }
        }
    }, [socket],)

    const handleCreateRoom = async () => {
        try {
            const {data: {room_id} } = await api.get("/create_room")
            window.location.href = '/room/' + room_id

        } catch (err) {
            console.error("Erro ao criar sala:", err);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Página Inicial</h1>
            <h1>Websocket</h1>
            <ul id="rooms"></ul>
        
            <Button text="Criar Sala" onClick={handleCreateRoom} />
        </div>
    );
}
