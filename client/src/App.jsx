import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:4000", {
    withCredentials: true
  }), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("")
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("User connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ height: 250 }} />
        <Typography variant="h5" component="div" gutterBottom>
          Welcome to Socket.io
        </Typography>

        <Typography>{socketId}</Typography>

        <form onSubmit={joinRoomHandler}>
          <h5>Join Room</h5>
          <TextField
            id="outlined-basic"
            label="Room Name"
            variant="outlined"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            id="outlined-basic"
            label="Message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Room"
            variant="outlined"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <Button type="submit" variant="contained" color="primary">
            Send Message
          </Button>
        </form>

        <Stack>
          {messages.map((message, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {message}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default App;
