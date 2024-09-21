"use client"
"use client"
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'boxicons/css/boxicons.min.css';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{ text: string; sender: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Add user message to chat history
    setChatHistory(prevHistory => [...prevHistory, { text: inputText, sender: 'user' }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();

      if (data.success) {
        setChatHistory(prevHistory => [...prevHistory, { text: data.data, sender: 'bot' }]);
      } else {
        throw new Error('API response indicates failure');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prevHistory => [...prevHistory, { text: "Sorry, there was an error processing your request.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };
  const goTohome = () => {  
    router.push('/');
  }

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <header className="bg-blue-600 p-4">
        <div className="flex items-center">
          <div onClick={goTohome}><i className='bx bx-sm bxs-home-alt-2'></i></div>
          <h1 className="text-white m-auto text-2xl font-bold">HealthSense</h1>
        </div>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 text-black`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {message.sender === 'user' ? (
                message.text
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  className="prose prose-sm max-w-none"
                  components={{
                    a: ({...props}) => <a {...props} className="text-blue-600 hover:underline" />,
                    p: ({...props}) => <p {...props} className="mb-2" />,
                    ul: ({...props}) => <ul {...props} className="list-disc list-inside mb-2" />,
                    ol: ({...props}) => <ol {...props} className="list-decimal list-inside mb-2" />,
                    h1: ({...props}) => <h1 {...props} className="text-xl font-bold mb-2" />,
                    h2: ({...props}) => <h2 {...props} className="text-lg font-bold mb-2" />,
                    h3: ({...props}) => <h3 {...props} className="text-base font-bold mb-2" />,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-300 p-3 rounded-lg text-black">
              Thinking...
            </div>
          </div>
        )}
      </main>
      <footer className="bg-gray-300 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-grow bg-gray-200 rounded-l-full py-2 px-4 focus:outline-none text-black"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-600 text-white rounded-r-full py-2 px-4 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;