import { io } from "socket.io-client";
// server: https://be-lumiq-greenbrige-a0kh.onrender.com
const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default socket;
