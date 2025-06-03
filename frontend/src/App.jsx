import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Send, AlertTriangle, MessageSquare, Scale } from 'lucide-react';

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const exampleQuestions = [
  "What are the liquor licensing requirements in California?",
  "How do I handle tips and wage laws for servers in New York?",
  "What are the health code standards for kitchen sanitation in Texas?",
  "Can you explain overtime pay for restaurant employees in Florida?",
  "What permits do I need to open a new restaurant in Illinois?",
  "Are there specific food allergy labeling laws in Massachusetts?"
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedState, setSelectedState] = useState(usStates[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExampleQuestionIndex, setCurrentExampleQuestionIndex] = useState(0);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const chatEndRef = useRef(null);

  // Rotate example questions
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentExampleQuestionIndex(prevIndex => (prevIndex + 1) % exampleQuestions.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleInputChange = (e) => {
    setCurrentQuestion(e.target.value);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setShowStateDropdown(false);
  };

  const handleSubmit = async () => {
    if (!currentQuestion.trim()) return;
    const userMessage = { sender: 'user', text: currentQuestion, state: selectedState };
    setChatHistory(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsLoading(true);
    // Construct the message for the backend (include state in the message)
    const message = `State: ${selectedState}\nQuestion: ${userMessage.text}`;
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const result = await response.json();
      let botResponseText = result.answer || "Sorry, I couldn't process that request. Please try again.";
      setChatHistory(prev => [...prev, { sender: 'bot', text: botResponseText }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { sender: 'bot', text: `Error: ${error.message}. Please try again.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Header Component
  const Header = () => (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Scale className="h-10 w-10 mr-3 text-sky-400" />
          <h1 className="text-3xl font-bold tracking-tight">RestaurantLaw<span className="text-sky-400">.net</span></h1>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-sm text-slate-300 mb-1">Example questions you can ask:</p>
          <div className="h-6 overflow-hidden">
            <p className="text-md text-sky-300 transition-all duration-500 ease-in-out">
              "{exampleQuestions[currentExampleQuestionIndex]}"
            </p>
          </div>
        </div>
      </div>
    </header>
  );

  // Chat Message Component
  const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow ${
            isUser ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800'
          }`}
        >
          {isUser && <p className="text-xs opacity-70 mb-1">You (for {message.state}):</p>}
          {!isUser && <p className="text-xs opacity-70 mb-1 font-semibold">RestaurantLaw.net AI:</p>}
          <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
        </div>
      </div>
    );
  };

  // Footer Component
  const Footer = () => (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-800 text-slate-400 text-center text-sm">
      <div className="container mx-auto">
        <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
        <p className="mb-2">
          <strong>Disclaimer:</strong> The information provided by RestaurantLaw.net is for general informational purposes only,
          and does not constitute legal advice. We are not a law firm and the use of this service does not create an
          attorney-client relationship. Always consult with a qualified legal professional for advice tailored to your specific situation.
        </p>
        <p>&copy; {new Date().getFullYear()} RestaurantLaw.net. Developed by Lopez Ventures.</p>
      </div>
    </footer>
  );

  // Main layout
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Chat Window Area */}
        <div className="bg-white shadow-xl rounded-lg flex-grow flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-grow p-6 space-y-4 overflow-y-auto bg-slate-50">
            {chatHistory.length === 0 && (
              <div className="text-center text-slate-500 py-10">
                <MessageSquare size={48} className="mx-auto mb-4" />
                <p className="text-lg font-semibold">Welcome to RestaurantLaw.net!</p>
                <p>Select your state and ask a question about restaurant legal or compliance matters.</p>
              </div>
            )}
            {chatHistory.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            <div ref={chatEndRef} /> {/* For scrolling to bottom */}
          </div>
          {/* Input Area */}
          <div className="bg-slate-100 p-4 border-t border-slate-200">
            {isLoading && (
              <div className="flex items-center justify-center mb-2 text-sm text-sky-600">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Thinking...</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              {/* State Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowStateDropdown(!showStateDropdown)}
                  className="flex items-center justify-between w-full sm:w-48 bg-white border border-slate-300 rounded-lg shadow-sm px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  {selectedState}
                  <ChevronDown className={`ml-2 h-5 w-5 text-slate-400 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showStateDropdown && (
                  <div className="absolute z-10 bottom-full mb-2 w-48 max-h-60 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {usStates.map(state => (
                        <button
                          key={state}
                          onClick={() => handleStateChange(state)}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-sky-100 hover:text-sky-700"
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Text Input */}
              <input
                type="text"
                value={currentQuestion}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
                placeholder="Ask your question here..."
                className="flex-grow p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none shadow-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !currentQuestion.trim()}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App; 