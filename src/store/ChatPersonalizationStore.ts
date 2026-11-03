import {makeAutoObservable, runInAction} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChatTone =
  | 'friendly'
  | 'concise'
  | 'creative'
  | 'analytical'
  | 'humorous';

export const POCKETPAL_DEFAULT_SYSTEM_PROMPT =
  'You are PocketPal, an intelligent, helpful, and friendly AI assistant running locally and privately on the user\'s mobile device. You provide thoughtful, accurate, and constructive responses, respecting user privacy and local-first computing.';

export class ChatPersonalizationStore {
  enabled = true;
  baseSystemPrompt = POCKETPAL_DEFAULT_SYSTEM_PROMPT;
  tone: ChatTone = 'friendly';
  useMarkdown = true;
  suggestFollowups = false;
  enableReasoning = true;
  matchUserLanguage = true;
  conciseAnswers = false;
  customInstructions = '';
  enableMemory = true;
  enableChatLookup = true;
  chatLookupCount = 35;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'ChatPersonalizationStore',
      properties: [
        'enabled',
        'baseSystemPrompt',
        'tone',
        'useMarkdown',
        'suggestFollowups',
        'enableReasoning',
        'matchUserLanguage',
        'conciseAnswers',
        'customInstructions',
        'enableMemory',
        'enableChatLookup',
        'chatLookupCount',
      ],
      storage: AsyncStorage,
    });
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  setTone(tone: ChatTone) {
    this.tone = tone;
  }

  setBaseSystemPrompt(prompt: string) {
    this.baseSystemPrompt = prompt;
  }

  resetBaseSystemPrompt() {
    this.baseSystemPrompt = POCKETPAL_DEFAULT_SYSTEM_PROMPT;
  }

  setCustomInstructions(instructions: string) {
    this.customInstructions = instructions;
  }

  setUseMarkdown(val: boolean) {
    this.useMarkdown = val;
  }

  setSuggestFollowups(val: boolean) {
    this.suggestFollowups = val;
  }

  setEnableReasoning(val: boolean) {
    this.enableReasoning = val;
  }

  setMatchUserLanguage(val: boolean) {
    this.matchUserLanguage = val;
  }

  setConciseAnswers(val: boolean) {
    this.conciseAnswers = val;
  }

  setEnableMemory(val: boolean) {
    this.enableMemory = val;
  }

  setEnableChatLookup(val: boolean) {
    this.enableChatLookup = val;
  }

  setChatLookupCount(count: number) {
    this.chatLookupCount = Math.max(1, Math.min(100, count));
  }

  /**
   * Builds the consolidated personalization system prompt for normal chat only.
   * This is NEVER applied in PalsHub.
   */
  buildPersonalizationPrompt(): string {
    if (!this.enabled) {
      return this.baseSystemPrompt;
    }

    const sections: string[] = [];

    // 1. Identity & Base System Prompt
    sections.push(this.baseSystemPrompt.trim());

    // 2. Tone Guidelines
    const toneGuidelines: Record<ChatTone, string> = {
      friendly:
        'Adopt a warm, encouraging, and conversational tone, like a helpful and knowledgeable peer.',
      concise:
        'Be extremely direct, clear, and to the point. Trim unnecessary fluff and lead with key answers.',
      creative:
        'Be imaginative, engaging, and expressive. Use vivid descriptions and creative phrasing.',
      analytical:
        'Adopt a structured, rigorous, and logically precise tone. Break down problems systematically with rationale.',
      humorous:
        'Incorporate light, playful humor and witty remarks while remaining helpful and grounded.',
    };

    if (toneGuidelines[this.tone]) {
      sections.push(`Tone: ${toneGuidelines[this.tone]}`);
    }

    // 3. Behavioral Directives
    const behaviors: string[] = [];
    if (this.useMarkdown) {
      behaviors.push('Format responses with clean Markdown, headings, lists, and code blocks where helpful.');
    }
    if (this.conciseAnswers) {
      behaviors.push('Keep responses brief and easy to scan.');
    }
    if (this.suggestFollowups) {
      behaviors.push('Suggest 2-3 logical next questions or actions at the very end of your response.');
    }
    if (this.enableReasoning) {
      behaviors.push('Think through complex inquiries step-by-step before concluding.');
    }
    if (this.matchUserLanguage) {
      behaviors.push('Respond in the same language and locale used by the user.');
    }

    if (behaviors.length > 0) {
      sections.push(`Behavioral Guidelines:\n- ${behaviors.join('\n- ')}`);
    }

    // 4. Memory Instruction (Instructing the AI how to save new facts)
    if (this.enableMemory) {
      sections.push(
        'Memory Capability: You have access to user memory. If the user shares an important personal fact, preference, project context, or detail worth remembering for future conversations, output a tag `[MEMORY: concise fact to remember]` at the end of your response.',
      );
    }

    // 5. Advanced Custom Instructions
    if (this.customInstructions && this.customInstructions.trim()) {
      sections.push(
        `User Custom Instructions:\n${this.customInstructions.trim()}`,
      );
    }

    return sections.join('\n\n');
  }
}

export const chatPersonalizationStore = new ChatPersonalizationStore();
