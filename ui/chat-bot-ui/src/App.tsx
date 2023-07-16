import { useState } from 'react'
import './App.css'
import ChatWindow from './components/chat-window/index'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="chat-window-container">
        <ChatWindow/>
      </div>
      
    </>
  )
}

export default App
