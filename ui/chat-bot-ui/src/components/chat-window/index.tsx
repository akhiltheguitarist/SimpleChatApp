import React, { useState } from 'react'
import './chat-window.css'

interface ChatMessage {
    message: string
    sender: 'user' | 'bot'
}

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isMinimized, setIsMinimized] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(inputValue.trim() === '') return

        const newMessage: ChatMessage = {
            message: inputValue,
            sender: 'user',
        }
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        

        try {
          const response = await fetch('http://localhost:8000/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage),
          });
      
          if (response.ok) {
            const responseData = await response.json();
            const receivedMessage = responseData.message;

            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }

          // setMessages([...messages, newMessage]);
          else {
            console.log('Invalid API response')
          }
        } catch (error) {
          console.log('API request failure')
        }
        setInputValue('');
    }

    const toggleMinimize = () => {
        setIsMinimized((prevIsMinimized) => !prevIsMinimized);
      };
    

    return (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
      <div className="header">
        <div className="title">
          Simple Chat
        </div>
        <button className="minimize-button" onClick={toggleMinimize}>
          {isMinimized ? '+' : '-'}
        </button>
      </div>
      {!isMinimized && (
        <>
          <div className="message-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.message}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
    )
}

export default ChatWindow