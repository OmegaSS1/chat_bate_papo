import { useParams } from "react-router-dom"
import { useWebSocket } from "../hooks/useWebsocket"
import { useEffect } from "react"

export default function Room(){
    const {id} = useParams()
    const {socket} = useWebSocket(`ws://localhost:8000/${id}`)

    useEffect(() => {
        if(socket){
            socket.onclose = () => window.location.href = '/';
        }

    }, [socket])

    return (
        <div>
            <h1> Sala </h1>
        </div>
    )
}