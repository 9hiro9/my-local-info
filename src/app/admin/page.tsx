'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: 'user' | 'bot' | 'admin';
  text: string;
}

export default function AdminChatPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAuthenticated) {
      scrollToBottom();
    }
  }, [messages, isAuthenticated]);

  // 폴링 (2초마다)
  useEffect(() => {
    let interval: any;
    if (isAuthenticated) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/chat-poll');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setMessages(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newMsgs = data
                  .filter((m: any) => !existingIds.has(Number(m.id)))
                  .map((m: any) => ({
                    id: Number(m.id) || Date.now() + Math.random(),
                    sender: m.sender as 'user' | 'bot' | 'admin',
                    text: m.message || m.text || ""
                  }));
                if (newMsgs.length === 0) return prev;
                return [...prev, ...newMsgs];
              });
            }
          }
        } catch (e) {
          console.error("Admin polling error:", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin1234') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const adminText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-human', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: adminText, sender: 'admin' }),
      });

      if (res.ok) {
        // 성공 시 낙관적 업데이트 생략 (폴링이 자동으로 가져옴)
      }
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-[family-name:var(--font-sans)]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">관리자 로그인</h1>
            <p className="text-gray-500 mt-2">상담 관리 페이지에 접속하려면 비밀번호를 입력하세요.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-[family-name:var(--font-sans)]">
      {/* 헤더 */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">실시간 상담 관리</h1>
              <p className="text-xs text-blue-100 opacity-80">방문자와의 대화를 실시간으로 관리합니다.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors font-medium border border-white/20"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 대화 영역 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white rounded-2xl shadow-inner border border-gray-200 overflow-y-auto mb-4 p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-center flex-col items-center justify-center text-gray-400 space-y-2 opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <p className="font-medium text-lg">아직 대화 내역이 없습니다.</p>
              <p className="text-sm">방문자가 메시지를 보내면 여기에 표시됩니다.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%] flex flex-col">
                  <span className={`text-[10px] mb-1 font-bold ${msg.sender === 'user' ? 'text-blue-500 text-right' : 'text-orange-500'}`}>
                    {msg.sender === 'user' ? '방문자' : '시스템/관리자'}
                  </span>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : msg.sender === 'admin' 
                          ? 'bg-orange-500 text-white rounded-tl-none' 
                          : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 답장 입력창 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sticky bottom-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="방문자에게 답장을 보내세요..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 text-white px-6 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors font-bold shadow-md flex items-center gap-2"
            >
              <span>전송</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
