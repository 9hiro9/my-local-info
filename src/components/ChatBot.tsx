'use client';

import React, { useState, useEffect, useRef } from 'react';
import chatData from '../../chat-data.json';

interface Message {
  id: number;
  sender: 'user' | 'bot' | 'admin';
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      sender: 'bot',
      text: '안녕하세요! 성남시 생활 정보 AI 상담원입니다. 무엇을 도와드릴까요?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // 실시간 상담 폴링 (2초마다)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isHumanMode) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/chat-poll');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              const adminMsgs = data.filter((m: any) => m.sender === 'admin');
              if (adminMsgs.length > 0) {
                setMessages(prev => {
                  const existingIds = new Set(prev.map(p => p.id));
                  const newMsgs = adminMsgs
                    .filter((m: any) => !existingIds.has(m.id))
                    .map((m: any) => ({
                      id: m.id || Date.now() + Math.random(),
                      sender: 'admin',
                      text: m.text || m.message
                    }));
                  if (newMsgs.length === 0) return prev;
                  return [...prev, ...newMsgs];
                });
              }
            }
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isHumanMode]);

  const handleQuestionClick = (question: string, answer: string) => {
    if (isHumanMode) return;
    const userMsg: Message = { id: Date.now(), sender: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text: answer };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const switchToHuman = () => {
    setIsHumanMode(true);
    const systemMsg: Message = {
      id: Date.now(),
      sender: 'bot',
      text: '상담원 대기 모드로 전환되었습니다. 잠시만 기다려 주시면 상담원이 직접 답변해 드립니다.'
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // 유저 메시지 추가
    const userMsg: Message = { id: Date.now(), sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    
    setIsLoading(true);

    try {
      if (isHumanMode) {
        // 상담원 모드: /api/chat-human 호출
        await fetch('/api/chat-human', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, sender: 'user' }),
        });
      } else {
        // AI 모드: 기존 로직
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const botText = data.response || data.result?.response || "죄송합니다. 답변을 가져오지 못했습니다.";
        const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text: botText };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error('호출 오류:', error);
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: "에러가 발생했습니다. 잠시 후 다시 시도해 주세요." 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
        aria-label="채팅 상담 열기"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* 채팅창 */}
      <div
        className={`fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out sm:w-[360px] sm:h-[600px] ${
          isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
        }
        max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none`}
      >
        {/* 헤더 */}
        <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm">{isHumanMode ? '실시간 상담원' : 'AI 상담원'}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs opacity-90 text-blue-100 italic">online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="sm:hidden p-1 hover:bg-white/10 rounded">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : msg.sender === 'admin' 
                      ? 'bg-orange-500 text-white rounded-tl-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 질문 및 입력 영역 */}
        <div className="bg-white border-t border-gray-100 overflow-hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {/* 자주 묻는 질문 (AI 모드 전용) */}
          {!isHumanMode && (
            <div className="p-4 pb-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase font-bold text-gray-400 ml-1 tracking-wider">자주 묻는 질문</p>
                <button 
                  onClick={switchToHuman}
                  className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-md font-bold hover:bg-orange-100 transition-colors border border-orange-100"
                >
                  상담원 연결
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {chatData.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionClick(item.question, item.answer)}
                    className="text-left text-[11px] bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all py-1.5 px-3 rounded-lg border border-gray-200 text-gray-600 font-medium"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isHumanMode && (
            <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
              <p className="text-[10px] text-orange-600 font-medium text-center">지금부터 상담원과 연결됩니다.</p>
            </div>
          )}
          
          {/* 텍스트 입력창 */}
          <form onSubmit={handleSendMessage} className="p-4 pt-2 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isHumanMode ? "메시지를 보내세요..." : "궁금한 내용을 입력하세요..."}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 text-white p-2.5 rounded-xl disabled:opacity-50 disabled:bg-gray-400 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
