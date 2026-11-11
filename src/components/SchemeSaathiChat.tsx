import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
  Globe
} from 'lucide-react';
import { CitizenProfile, Language, AgentChatMessage } from '../types';

interface SchemeSaathiChatProps {
  profile: CitizenProfile;
  chatHistory: AgentChatMessage[];
  onSaveChatHistory: (history: AgentChatMessage[]) => void;
  onClearChatHistory: () => void;
  onNavigateToAction: (actionType: string, payload?: any) => void;
}

export const SchemeSaathiChat: React.FC<SchemeSaathiChatProps> = ({
  profile,
  chatHistory,
  onSaveChatHistory,
  onClearChatHistory,
  onNavigateToAction
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeLang, setActiveLang] = useState<Language>(profile.language || 'en');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    {
      label: '🎓 "I am a college student from Maharashtra. My family\'s annual income is approximately ₹1,50,000. Find scholarships that I may qualify for."',
      lang: 'en',
      text: "I am a college student from Maharashtra. My family's annual income is approximately ₹1,50,000. Find scholarships that I may qualify for."
    },
    {
      label: '🇮🇳 "मुझे महाराष्ट्र में स्कॉलरशिप चाहिए"',
      lang: 'hi',
      text: 'मुझे महाराष्ट्र में कॉलेज स्कॉलरशिप चाहिए।'
    },
    {
      label: '🚩 "मला उच्च शिक्षणासाठी शासकीय शिष्यवृत्ती हवी आहे"',
      lang: 'mr',
      text: 'मला महाराष्ट्रात पदवी शिक्षणासाठी शासकीय शिष्यवृत्ती हवी आहे.'
    },
    {
      label: '📄 "What documents are required for MahaDBT scholarships?"',
      lang: 'en',
      text: 'What documents are required for MahaDBT scholarships?'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Handle Speech Recognition (voice input)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = activeLang === 'hi' ? 'hi-IN' : activeLang === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  // Text-To-Speech audio
  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = activeLang === 'hi' ? 'hi-IN' : activeLang === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');

    const userMessage: AgentChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
      language: activeLang
    };

    const newHistory = [...chatHistory, userMessage];
    onSaveChatHistory(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          profile,
          language: activeLang
        })
      });

      const data = await response.json();

      const agentMessage: AgentChatMessage = {
        id: `msg-${Date.now()}-agent`,
        sender: 'agent',
        text: data.reply || 'I processed your request using the Scheme Saathi Orchestrator.',
        timestamp: new Date().toISOString(),
        language: activeLang,
        toolInvocations: data.toolExecutions || [],
        actionSuggestions: data.actionSuggestions || []
      };

      onSaveChatHistory([...newHistory, agentMessage]);
    } catch (err: any) {
      const errorMessage: AgentChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: 'agent',
        text: 'I encountered a connection error while contacting the Scheme Saathi Orchestrator. However, our deterministic rules engine and portal features are accessible in offline mode.',
        timestamp: new Date().toISOString(),
        language: activeLang
      };
      onSaveChatHistory([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[82vh] flex flex-col bg-[#161d24] border border-[#273441] rounded-3xl shadow-2xl overflow-hidden">
      {/* Top Agent Bar */}
      <div className="p-4 bg-[#12161a] border-b border-[#242e38] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-[#fdfbf7]">Scheme Saathi AI Orchestrator</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                25 Real Tools Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Rules Decide • AI Assists • Multilingual (EN, HI, MR)
            </p>
          </div>
        </div>

        {/* Right Tools: Language & Clear */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-[#1d2731] p-1 rounded-xl border border-zinc-700 text-xs">
            <button
              onClick={() => setActiveLang('en')}
              className={`px-2 py-0.5 rounded-lg font-medium transition ${activeLang === 'en' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLang('hi')}
              className={`px-2 py-0.5 rounded-lg font-medium transition ${activeLang === 'hi' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setActiveLang('mr')}
              className={`px-2 py-0.5 rounded-lg font-medium transition ${activeLang === 'mr' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
            >
              मराठी
            </button>
          </div>

          <button
            onClick={onClearChatHistory}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
            title="Clear Chat Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                isUser 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] space-y-2.5 ${isUser ? 'text-right' : 'text-left'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-700/80 text-white rounded-tr-none'
                    : 'bg-[#182028] text-zinc-200 border border-[#2a3644] rounded-tl-none shadow-md'
                }`}>
                  <p className="whitespace-pre-line text-left">{msg.text}</p>

                  {/* Audio Read-out for Agent Messages */}
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded text-xs transition ${
                          speakingMsgId === msg.id ? 'bg-amber-500 text-black font-semibold' : 'hover:text-emerald-300'
                        }`}
                      >
                        {speakingMsgId === msg.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{speakingMsgId === msg.id ? 'Stop Voice' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Transparent Tool Executions Card (Under message) */}
                {msg.toolInvocations && msg.toolInvocations.length > 0 && (
                  <div className="bg-[#12161a] border border-[#232c37] rounded-xl p-3 text-left space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block flex items-center space-x-1">
                      <Layers className="w-3 h-3" />
                      <span>Agent Backend Tool Executions ({msg.toolInvocations.length}):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.toolInvocations.map((tool, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-emerald-300 border border-zinc-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{tool.toolName}()</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Suggestions in Chat */}
                {msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-left pt-1">
                    {msg.actionSuggestions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigateToAction(act.actionType, act.payload)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center space-x-1.5 transition shadow"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3 text-xs text-zinc-400">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#182028] p-3 rounded-2xl border border-zinc-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Scheme Saathi Orchestrator evaluating tools and rules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="p-3 bg-[#131920] border-t border-[#232c37] overflow-x-auto flex space-x-2 text-xs scrollbar-none">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveLang(p.lang as Language);
              handleSendMessage(p.text);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#1b232c] hover:bg-[#232d38] text-zinc-300 hover:text-emerald-300 border border-[#2d3a48] whitespace-nowrap transition flex items-center space-x-1 flex-shrink-0"
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-[#12161a] border-t border-[#232c37]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl border transition ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-[#1a222a] text-zinc-400 hover:text-white border-zinc-700'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Speak inquiry using voice'}
            aria-label="Voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeLang === 'hi' 
                ? 'अपनी योजना या छात्रवृत्ति के बारे में पूछें...'
                : activeLang === 'mr'
                ? 'तुमच्या शासकीय योजना अथवा शिष्यवृत्तीबद्दल विचारा...'
                : 'Ask about government schemes, eligibility, documents...'
            }
            className="flex-1 px-4 py-3 bg-[#172029] border border-[#2d3a48] rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-2xl font-bold transition flex items-center justify-center ${
              inputText.trim() && !isLoading
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white shadow-lg shadow-emerald-950'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
            }`}
            aria-label="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
