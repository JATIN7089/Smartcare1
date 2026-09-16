/**
 * Voice Service: Web Speech API wrapper
 * Handles Text-to-Speech (speechSynthesis) and Speech Recognition (SpeechRecognition).
 * Supports all 11 North Eastern and National languages with graceful fallback.
 */

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.enabled = true;

    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN';
      } catch (e) {
        console.warn('SpeechRecognition initialization note:', e);
      }
    }
  }

  getLocaleForLanguage(lang = 'en') {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'as': return 'bn-IN'; // Assamese phonetics closest to Eastern Indo-Aryan
      case 'bn': return 'bn-IN';
      case 'brx': return 'hi-IN';
      case 'mni': return 'bn-IN';
      case 'ne': return 'ne-NP';
      case 'kha':
      case 'lus':
      case 'nag':
      case 'trp':
      case 'en':
      default:
        return 'en-IN';
    }
  }

  speak(text, lang = 'en') {
    if (!this.enabled || !this.synth || !text) return;

    try {
      this.synth.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Slightly slower, calm pace for elderly comprehension
      utterance.pitch = 1.0;
      utterance.lang = this.getLocaleForLanguage(lang);

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  startListening({ onResult, onError, onEnd, lang = 'en' }) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use text input or suggestions.');
      return false;
    }

    try {
      this.recognition.lang = this.getLocaleForLanguage(lang);
      this.recognition.onstart = () => {
        this.isListening = true;
      };
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };
      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error || 'Microphone error');
      };
      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };
      this.recognition.start();
      return true;
    } catch (e) {
      this.isListening = false;
      if (onError) onError('Could not access microphone');
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}

export const voiceService = new VoiceService();
