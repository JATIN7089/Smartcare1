import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { voiceService } from '../services/voiceService.js';
import { processVoiceCommand } from '../ai/assistantService.js';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Bot, 
  ArrowRight, 
  PhoneCall, 
  Info,
  Clock,
  Shield,
  Globe
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function VoiceAssistantPage() {
  const { role, user, reminders, routine, cognitiveProfile, language, setLanguage, supportedLanguages, currentLanguageObj, accessibility, t } = useApp();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [micError, setMicError] = useState(null);

  // Initialize or update conversation on role or language change
  useEffect(() => {
    const greetingMsg = processVoiceCommand('', role, { activeUser: user, language, reminders, routine, cognitiveProfile });
    setConversation([
      {
        sender: 'assistant',
        text: greetingMsg.reply,
        timestamp: 'Just now'
      }
    ]);
  }, [role, language]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage = { 
      sender: 'user', 
      text: query, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setConversation(prev => [...prev, userMessage]);
    setInputText('');
    setMicError(null);

    // Process through role-aware assistant engine
    const result = processVoiceCommand(query, role, {
      activeUser: user,
      reminders,
      routine,
      cognitiveProfile,
      language
    });

    const assistantMessage = {
      sender: 'assistant',
      text: result.reply,
      action: result.action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, assistantMessage]);
    setLastAction(result.action);

    // Speak aloud in selected language if enabled
    if (accessibility.voiceEnabled && result.spoken) {
      voiceService.speak(result.spoken, language);
    }

    // AUTOMATED ACTION ROUTER: Automatically execute navigation without requiring another click
    if (result.action?.type === 'NAVIGATE' && result.action?.route) {
      setTimeout(() => {
        navigate(result.action.route, {
          state: {
            autostart: result.action.autostart !== false,
            readAloud: Boolean(result.action.readAloud),
            intent: result.action.intent,
            voiceTriggered: true
          }
        });
      }, 900);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setMicError(null);
      const started = voiceService.startListening({
        lang: language,
        onResult: (transcript) => {
          setIsListening(false);
          handleSend(transcript);
        },
        onError: (err) => {
          setIsListening(false);
          setMicError('Microphone not recognized or permission blocked. Please use the quick prompts or text input below.');
        },
        onEnd: () => {
          setIsListening(false);
        }
      });

      if (started) {
        setIsListening(true);
      } else {
        setMicError('Speech recognition is not available in this browser environment. You can tap any sample question below or type.');
      }
    }
  };

  const samplePrompts = role === 'elderly' ? [
    'When is my medicine?',
    'What do I have today?',
    'Start memory game',
    'Start breathing',
    'Call my caregiver'
  ] : role === 'caregiver' ? [
    "Summarize Asha's activity today",
    'Check active alerts',
    'Check reminder adherence'
  ] : [
    'Summarize patient cohort adherence',
    'Review Asha cognitive trends'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-teal-700 tracking-wider">
              {role === 'elderly' ? 'Spoken Elderly Companion' : role === 'caregiver' ? 'Caregiver Copilot' : 'Clinical Insights Voice'}
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Role: {role.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {t('assistant_title', 'Talk to SmarTCARE')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('assistant_sub', 'Natural voice assistance tuned for North Eastern dialects and elderly conversation.')}
          </p>
        </div>

        {/* Language selector pills for all 11 languages */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 max-w-full overflow-x-auto">
          <Globe className="w-4 h-4 text-teal-600 flex-shrink-0 ml-1" />
          {supportedLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                language === lang.code 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.native}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Large Microphone Hero Area */}
      <div className="bg-gradient-to-br from-teal-50 via-sky-50 to-indigo-50 border-2 border-teal-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
        <button
          onClick={toggleMic}
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-xl transition-all transform active:scale-95 min-h-[44px] ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-300'
              : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105 ring-4 ring-teal-200'
          }`}
          aria-label="Microphone button"
        >
          {isListening ? (
            <>
              <MicOff className="w-12 h-12" />
              <span className="text-[11px] font-black uppercase mt-1">{t('mic_listening', 'Listening...')}</span>
            </>
          ) : (
            <>
              <Mic className="w-12 h-12" />
              <span className="text-[11px] font-black uppercase mt-1">{t('mic_tap', 'Tap & Speak')}</span>
            </>
          )}
        </button>

        <p className="text-sm font-bold text-slate-700">
          {isListening ? `Listening in ${currentLanguageObj.native}... Speak naturally` : `Active language: ${currentLanguageObj.flag} ${currentLanguageObj.native} (${currentLanguageObj.name})`}
        </p>

        {micError && (
          <div className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-4 py-2 rounded-xl max-w-md">
            {micError}
          </div>
        )}
      </div>

      {/* Quick Prompts (Elderly Accessible buttons) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {t('suggested_questions', 'Suggested Questions (Tap to ask instantly):')}
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 text-slate-800 text-xs sm:text-sm font-bold shadow-xs transition min-h-[44px]"
            >
              💬 "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-h-[420px] overflow-y-auto">
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div
              className={`max-w-lg rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <p>{msg.text}</p>

              {/* Action Buttons generated by the assistant */}
              {msg.action && msg.action.type === 'NAVIGATE' && (
                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => navigate(msg.action.route)}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {msg.action && msg.action.type === 'CALL_SIMULATION' && (
                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <a
                    href={`tel:${msg.action.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call {msg.action.contact} ({msg.action.phone})</span>
                  </a>
                </div>
              )}

              <span
                className={`text-[10px] block mt-1 ${
                  msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Text Fallback Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white border-2 border-slate-200 focus-within:border-teal-500 rounded-2xl p-2 shadow-xs transition"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type in ${currentLanguageObj.native} or English...`}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none"
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <DisclaimerBanner />
    </div>
  );
}
