import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const EXAMPLES = [
  'What permits do I need to open a restaurant in Texas?',
  'How do I get a liquor license in California?',
  'What are the health code requirements in Florida?',
  'What are the labor laws for restaurant staff in New York?',
  'How do I handle food allergies legally in Illinois?'
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function RotatingExamples() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="examples">
      <span>Example: </span>
      <span className="example-text">{EXAMPLES[index]}</span>
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { role: 'assistant', content: data.answer }]);
    } catch {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>{msg.content}</div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Ask a legal question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>RestaurantLaw.net</h1>
      </header>
      <RotatingExamples />
      <Chat />
      <footer>
        <div className="disclaimer">
          Answers are for informational purposes only and not legal advice.
        </div>
        <div className="credit">Developed by Lopez Ventures</div>
      </footer>
    </div>
  );
} 
