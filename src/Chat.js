import React, { useState, useEffect } from 'react';
import "./Chat.css";
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import InsertEmoticonOutlinedIcon from '@mui/icons-material/InsertEmoticonOutlined';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useStateValue } from './StateProvider';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function Chat() {
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user}, dispatch] = useStateValue();

    useEffect(() => {
        if (roomId) {
            db.collection("rooms").doc(roomId).onSnapshot((snapshot) => setRoomName(snapshot.data().name));
            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot =>
                setMessages(snapshot.docs.map(doc => doc.data())
            ));
}
    }, [roomId])

useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
}, [roomId]);

const sendMessage = (e) => {
    e.preventDefault();

    db.collection('rooms').doc(roomId).collection('messages').add({
        message: input,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setInput("");
}
return (
    <div className='chat'>
        <div className="chat__header">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className='chat__headerInfo'>
                <h3>{roomName}</h3>
                <p>Last seen{" "}
                {new Date(messages[messages.length -1]?.timestamp?.toDate()).toLocaleTimeString()}</p>
            </div>
            <div className='chat__headerRight'>
                <IconButton><SearchOutlinedIcon /></IconButton>
                <IconButton><AttachFileOutlinedIcon /></IconButton>
                <IconButton><MoreVertIcon /></IconButton>
            </div>
        </div>
        <div className="chat__body">
        {messages.map(message => (
            <p className={`chat__message ${message.name ===user.displayName && 'chat__reciever'}`} > <span className='chat__name'>{message.name}</span>{message.message}
                <span className='chat__timestamp'>{new Date(message.timestamp?.toDate()).toLocaleTimeString()} </span>
            </p>
        ))}
            
        </div>
        <div className="chat__footer">
            <InsertEmoticonOutlinedIcon />
            <form>
                <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message"></input>
                <button onClick={sendMessage} type='submit'>Send a messgae</button>
            </form>
            <MicOutlinedIcon />
        </div>
    </div>
)
}

export default Chat;
