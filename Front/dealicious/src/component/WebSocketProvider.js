// WebSocketProvider.js
import { createContext, useContext, useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import { MdSunnySnowing } from 'react-icons/md';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [receivedata, setReceivedata] = useState(null);
  const user = useSelector(state => state.persistedReducer.user);
  useEffect(() => {
    const createWebSocket = () => {
      const sock = new SockJS('${url}/ws');
      return Stomp.over(sock);
    };

    const connectWebSocket = () => {
      const client = createWebSocket();
      client.connect({}, () => {
        console.log('WebSocket connected');
        client.subscribe('/sub/chat/'+user.email, (message) => {
          // Handle incoming message, you can parse and set the data accordingly
          console.log("구독들어오니?");
          const messageData = JSON.parse(message.body);
          console.log(messageData);
          setReceivedata(messageData);
        });
      });


      setStompClient(client);
    };
    if (user.email !== undefined && user.email !== '') {
      console.log("소켓 연결 및 구독 시작");
      connectWebSocket();
    }
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  const sendDataToServer = (data) => {
    // 여기에서 stompClient를 이용하여 데이터 서버로 전송
    if (stompClient && stompClient.connected) {
      console.log("provider")
      console.log(data)
      stompClient.send('/pub/chat', {}, JSON.stringify(data));
    }
  };

  return (
    <WebSocketContext.Provider value={{ stompClient, receivedata, sendDataToServer }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const { stompClient, receivedata, sendDataToServer } = useContext(WebSocketContext);
  return { stompClient, receivedata, sendDataToServer };
};
