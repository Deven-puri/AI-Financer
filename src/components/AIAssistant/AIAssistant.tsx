import React, { useState, FormEvent, ChangeEvent } from 'react';
import TopNav from '../TopNav/TopNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { askGROQ } from '../GROQAI';
import { Income, Expense } from '../../types';

interface AIAssistantProps {
  incomes: Income[];
  expenses: Expense[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const renderMarkdown = (text: string): JSX.Element[] => {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  const renderInlineMarkdown = (line: string): JSX.Element => {
    const parts: (string | JSX.Element)[] = [];
    const boldRegex = /(\*\*|__)(.+?)\1/g;
    let match;
    let lastIndex = 0;
    let hasBold = false;

    while ((match = boldRegex.exec(line)) !== null) {
      hasBold = true;
      if (match.index > lastIndex) {
        const beforeText = line.substring(lastIndex, match.index);
        if (beforeText) {
          parts.push(beforeText);
        }
      }
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold text-black">
          {match[2]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    if (!hasBold) {
      return <>{line}</>;
    }

    return <>{parts}</>;
  };

  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();

    if (trimmedLine.match(/^#{1,6}\s/)) {
      const level = trimmedLine.match(/^#+/)?.[0].length || 1;
      const text = trimmedLine.replace(/^#+\s/, '').trim();
      const Tag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingClasses = {
        1: 'text-xl sm:text-2xl font-bold mt-6 mb-3 text-black',
        2: 'text-lg sm:text-xl font-bold mt-5 mb-2 text-black',
        3: 'text-base sm:text-lg font-semibold mt-4 mb-2 text-black',
        4: 'text-sm sm:text-base font-semibold mt-3 mb-2 text-black',
        5: 'text-sm font-semibold mt-3 mb-1 text-black',
        6: 'text-xs sm:text-sm font-semibold mt-2 mb-1 text-black',
      };
      elements.push(
        <Tag key={idx} className={headingClasses[level as keyof typeof headingClasses] || headingClasses[3]}>
          {renderInlineMarkdown(text)}
        </Tag>
      );
      return;
    }

    if (trimmedLine.match(/^[-•*]\s/)) {
      const content = trimmedLine.replace(/^[-•*]\s/, '').trim();
      elements.push(
        <div key={idx} className="flex items-start ml-4 mb-2">
          <span className="mr-3 mt-1 text-black font-bold">•</span>
          <span className="flex-1">{renderInlineMarkdown(content)}</span>
        </div>
      );
      return;
    }
    if (trimmedLine.match(/^\d+\.\s/)) {
      const number = trimmedLine.match(/^\d+\./)?.[0];
      const content = trimmedLine.replace(/^\d+\.\s/, '').trim();
      elements.push(
        <div key={idx} className="flex items-start ml-4 mb-2">
          <span className="mr-3 font-semibold text-black">{number}</span>
          <span className="flex-1">{renderInlineMarkdown(content)}</span>
        </div>
      );
      return;
    }

    if (!trimmedLine) {
      elements.push(<br key={idx} />);
      return;
    }

    elements.push(
      <p key={idx} className="mb-3 last:mb-0 text-gray-800">
        {renderInlineMarkdown(trimmedLine)}
      </p>
    );
  });

  return elements;
};

const AIAssistant: React.FC<AIAssistantProps> = ({ incomes, expenses }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hello! I\'m your AI financial assistant. Ask me about your finances, get tips to save money, or analyze your income and expense trends!'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await askGROQ(userMessage, incomes, expenses);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="pt-20 sm:pt-24 md:pt-28 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <BreadcrumbAndProfile
          pageTitle="AI Assistant"
          breadcrumbItems={[
            { name: 'Dashboard', path: '/dashboard', active: false },
            { name: 'AI Assistant', path: '/ai-assistant', active: true }
          ]}
        />

        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm flex flex-col h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faRobot} className="text-lg sm:text-2xl text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-black">
                  AI Financial Assistant
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">Ask me anything about your finances</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                    msg.role === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {msg.role === 'ai' ? (
                      <div className="text-xs sm:text-sm leading-relaxed">
                        {renderMarkdown(msg.content)}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-black" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 border-t border-gray-200">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-sm sm:text-base" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 hidden sm:block">
              Try: "How can I save more money?" or "Show my income growth this month"
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
