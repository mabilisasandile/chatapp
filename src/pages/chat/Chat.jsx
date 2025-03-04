import React, {useEffect, useState, useContext} from 'react';
import './Chat.css';
import RightSidebar from '../../components/rightSidebar/RightSidebar';
import LeftSidebar from '../../components/leftSidebar/LeftSidebar';
import ChatBox from '../../components/chatBox/ChatBox';
import { AppContext } from '../../context/AppContext';

const Chat = () => {

  const {chatData, userData} = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if (chatData && userData) {
      setLoading(false)
    }
  },[chatData,userData])

  return (
    <div className='chat'>
      {
        loading ? <p className='loading'>Loading...</p>
        :
        <div className='chat-container'>
          <LeftSidebar />
          <ChatBox />
          <RightSidebar />
        </div>
      }
    </div>
  )
}

export default Chat