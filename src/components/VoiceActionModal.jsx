import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { voiceCommandService } from '../services/voiceCommandService.js';
import { voiceService } from '../services/voiceService.js';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  ArrowRight, 
  Send, 
  RotateCcw,
  Volume2
} from 'lucide-react';

export default function VoiceActionModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, role, reminders, routine, cognitiveProfile, language, t, handleToggleReminder } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'acting' | 'error'
  const [manualInput, setManualInput] = useState('');
  const [replyChips, setReplyChips] = useState([]);

  const modalRef = useRef(null);

  // Suggested voice commands
  const quickChips = [
    { label: '🗺️ Mujhe ghar jana hai', cmd: 'mujhe ghar jana hai' },
    { label: '🎮 Game khelna hai', cmd: 'game khelna hai' },
    { label: '💊 Kaunsi medicine li?', cmd: 'kaunsi medicine li thi' },
    { label: '✅ Maine dawai kha li', cmd: 'maine dawai kha li' },
    { label: '⏰ Agli dawai kab hai?', cmd: 'agli dawai kab hai' },
    { label: '▶️ Start Memory Game', cmd: 'start memory game' },
    { label: '🫁 Start Breathing', cmd: 'start breathing' },
    { label: '📈 How am I doing?', cmd: 'how am I doing' }
  ];

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setFeedback('');
      setReplyChips([]);
      setStatus('listening');
      voiceCommandService.resetSession();
      startVoiceListening();
    } else {
      stopVoice();
    }

    return () => {
      stopVoice();
    };
  }, [isOpen]);

  const stopVoice = () => {
    voiceCommandService.stopListening();
    setIsListening(false);
  };

  /** Everything the NLU + dialogue engine needs, in one place. */
  const buildContext = () => ({
    navigate,
    user,
    reminders,
    routine,
    cognitiveProfile,
    role,
    language,
    onCompleteReminder: handleToggleReminder,
    onComplete: handleEngineResult
  });

  /**
   * Show the assistant's answer. The pop-up only closes when it actually
   * navigated somewhere — if the assistant answered a question or asked one
   * back, it stays open so the user can read and reply.
   */
  const handleEngineResult = (res) => {
    setReplyChips(res.chips || []);

    if (res.success) {
      setStatus('acting');
      setFeedback(res.text || 'Done.');
      if (!res.keepOpen) {
        setTimeout(() => onClose(), 1400);
      }
    } else {
      setStatus('error');
      setFeedback(res.text || "Sorry, I didn't understand. Try 'start memory game' or 'which medicine did I take'.");
    }
  };

  const startVoiceListening = () => {
    setIsListening(true);
    setStatus('listening');
    setFeedback(t('listening', 'Listening... Speak now.'));

    const started = voiceCommandService.listenAndExecute({
      context: buildContext(),
      onListeningStart: () => {
        setIsListening(true);
        setStatus('listening');
      },
      onTranscript: (spokenText) => {
        setTranscript(spokenText);
      },
      onIntentMatched: (result) => {
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        setStatus('idle');
        setFeedback('Microphone unavailable or paused. Tap any command below or type to try.');
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!started) {
      setIsListening(false);
      setStatus('idle');
      setFeedback('Microphone unavailable in this browser. Tap a prompt below or type.');
    }
  };

  const handleManualExecute = (cmdText) => {
    if (!cmdText.trim()) return;
    const text = cmdText.trim();
    setTranscript(text);
    setStatus('acting');

    voiceCommandService.processTextCommand(text, buildContext());

    setManualInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
            AI Voice Control
          </span>
          <h3 className="text-2xl font-black text-slate-900 pt-1">
            Talk to SmarTCARE
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Tell me what you'd like to do in simple words
          </p>
        </div>

        {/* Central Animated Mic Button */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Rings */}
            {isListening && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-teal-400/30 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-teal-500/20 animate-pulse" />
              </>
            )}

            <button
              onClick={isListening ? stopVoice : startVoiceListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 min-h-[56px] ${
                isListening
                  ? 'bg-rose-500 scale-105 shadow-rose-300'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>
          </div>

          <span className="text-sm font-black text-slate-700">
            {isListening ? '🎙️ Listening... Speak now' : 'Tap mic to speak'}
          </span>
        </div>

        {/* Transcription / Result Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1.5 min-h-[72px] flex flex-col items-center justify-center">
          {transcript && (
            <p className="text-xs text-slate-500 font-medium">
              You said: <strong className="text-slate-800">"{transcript}"</strong>
            </p>
          )}

          <p className={`text-sm font-bold ${
            status === 'error' ? 'text-amber-700' : status === 'acting' ? 'text-teal-700' : 'text-slate-600'
          }`}>
            {feedback || "Try saying: 'Start memory game' or 'Start breathing'"}
          </p>
        </div>

        {/* Suggestion chips — follow-ups from the assistant take priority */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
            {replyChips.length > 0 ? 'Tap to reply:' : 'Or tap any action:'}
          </span>
          <div className="flex flex-wrap gap-2 justify-center max-h-36 overflow-y-auto p-1">
            {(replyChips.length > 0 ? replyChips : quickChips).map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleManualExecute(chip.cmd)}
                className="bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs min-h-[44px]"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Input Line */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleManualExecute(manualInput);
          }}
          className="flex items-center gap-2 pt-1 border-t border-slate-100"
        >
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Type command (e.g. 'Play memory', 'Start breathing')..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold p-2.5 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
