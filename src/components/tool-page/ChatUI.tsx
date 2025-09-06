import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
}

const ChatUI = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: t('chat.initial_message'), sender: 'support' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: input, sender: 'user' },
      ]);
      setInput('');
      // Simulate a support response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            text: t('chat.auto_response'),
            sender: 'support',
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className='flex flex-col h-[400px]'>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }
              `}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className='flex p-4 border-t'>
        <Input
          className='flex-1 mr-2'
          placeholder={t('chat.type_message_placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend}>
          <Send className='w-5 h-5' />
        </Button>
      </div>
    </div>
  );
};

export default ChatUI;
