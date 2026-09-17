/**
 * Voice Command Orchestrator Service
 * 
 * Flow:
 * USER SPEAKS
 *   ↓
 * Speech Recognition (Web Speech API)
 *   ↓
 * AI Natural Language Intent Detection (intentService.js)
 *   ↓
 * Command Router (commandRouter.js)
 *   ↓
 * Existing React Navigation / Application Action
 * 
 * Also supports direct text and quick prompt execution for full accessibility.
 */

import { voiceService } from './voiceService.js';
import { detectIntent, INTENTS } from './intentService.js';
import { executeCommand } from './commandRouter.js';

class VoiceCommandService {
  constructor() {
    this.isListening = false;
  }

  /**
   * Process a text or recognized speech utterance
   */
  processTextCommand(text = '', context = {}) {
    const intentResult = detectIntent(text, context);
    const execution = executeCommand(intentResult, context);
    return {
      rawText: text,
      intentResult,
      execution
    };
  }

  /**
   * Start microphone listening, recognize speech, detect intent, and execute action
   */
  listenAndExecute({
    onListeningStart,
    onTranscript,
    onIntentMatched,
    onError,
    onEnd,
    context = {}
  }) {
    if (this.isListening) {
      voiceService.stopListening();
      this.isListening = false;
      if (onEnd) onEnd();
      return false;
    }

    const lang = context.language || 'en';
    const started = voiceService.startListening({
      lang,
      onResult: (transcript) => {
        this.isListening = false;
        if (onTranscript) onTranscript(transcript);

        const result = this.processTextCommand(transcript, context);
        if (onIntentMatched) onIntentMatched(result);
      },
      onError: (err) => {
        this.isListening = false;
        if (onError) onError(err);
      },
      onEnd: () => {
        this.isListening = false;
        if (onEnd) onEnd();
      }
    });

    if (started) {
      this.isListening = true;
      if (onListeningStart) onListeningStart();
    }

    return started;
  }

  stopListening() {
    voiceService.stopListening();
    this.isListening = false;
  }
}

export const voiceCommandService = new VoiceCommandService();
export { INTENTS, detectIntent, executeCommand };
