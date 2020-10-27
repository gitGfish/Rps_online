import openSocket from 'socket.io-client';

const socket = openSocket("https://rps-backend2.herokuapp.com/");
// const socket = openSocket("localhost:4000/");
export default socket;