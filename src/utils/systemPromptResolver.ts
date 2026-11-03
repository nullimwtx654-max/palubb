import type {Pal} from '../types/pal';
import type {Model} from './types';
import {generateFinalSystemPrompt} from './palshub-template-parser';
import {chatPersonalizationStore} from '../store/ChatPersonalizationStore';
import {sillyTavernPresetStore} from '../store/SillyTavernPresetStore';
import {
  expandSillyTavernMacros,
  evaluateWorldInfoEntries,
} from './sillyTavernPresetEngine';

export interface SystemPromptDependencies {
  pal?: Pal | null;
  model?: Model | null;
}

/**
 * Resolves the system prompt based on priority:
 * 1. Pal's system prompt (with parameter rendering + SillyTavern & Experimental Macro Engine) - for PalsHub
 * 2. PocketPal Chat Personalization - for normal chat only
 * 3. Fallback to model's chat template system prompt
 * 4. Empty string if neither exists
 */
export function resolveSystemPrompt(
  dependencies: SystemPromptDependencies,
): string {
  const {pal, model} = dependencies;

  // Priority 1: Pal's system prompt (PalsHub)
  if (pal?.systemPrompt) {
    let rawPrompt = pal.systemPrompt;
    // Check if the pal has parameters that need rendering
    if (pal.parameters && Object.keys(pal.parameters).length > 0) {
      rawPrompt = generateFinalSystemPrompt(pal.systemPrompt, pal.parameters);
    }

    // Apply SillyTavern & Experimental Macro Engine expansion for Pals
    try {
      const preset = sillyTavernPresetStore.getPresetForPal(
        pal.sillyTavernPresetId,
      );
      const cardData = pal.characterCard?.data;
      const mCtx = {
        charName: pal.name || 'Character',
        userName: sillyTavernPresetStore.userName || 'User',
        userPersona: sillyTavernPresetStore.userPersona || '',
        description: cardData?.description || pal.description || '',
        personality: cardData?.personality || '',
        scenario: cardData?.scenario || '',
        mesExamples: cardData?.mes_example || '',
        original: rawPrompt,
        authorsNote: preset?.authors_note || '',
        experimentalMacroEngine:
          sillyTavernPresetStore.experimentalMacroEngine,
      };

      const wi = evaluateWorldInfoEntries(
        cardData?.character_book,
        rawPrompt,
        preset,
        mCtx,
      );
      mCtx.outlets = wi.outlets;

      let expanded = expandSillyTavernMacros(rawPrompt, mCtx);
      const loreBlocks = [...wi.before, ...wi.after].filter(Boolean);
      if (loreBlocks.length > 0) {
        expanded = `${loreBlocks.join('\n')}\n\n${expanded}`;
      }
      if (preset?.authors_note && preset.authors_note.trim()) {
        expanded = `${expanded}\n\n${expandSillyTavernMacros(
          preset.authors_note.trim(),
          mCtx,
        )}`;
      }
      return expanded;
    } catch {
      return rawPrompt;
    }
  }

  // Priority 2: PocketPal Personalization & Identity (Normal Chat only!)
  if (chatPersonalizationStore && chatPersonalizationStore.enabled) {
    const personalPrompt = chatPersonalizationStore.buildPersonalizationPrompt();
    if (personalPrompt && personalPrompt.trim()) {
      return personalPrompt;
    }
  }

  // Priority 3: Model's chat template system prompt
  if (model?.chatTemplate?.systemPrompt) {
    return model.chatTemplate.systemPrompt;
  }

  // Priority 4: Empty string
  return '';
}

type ChatMessage = {role: string; content?: unknown};

/**
 * Fold the system prompt + every talent fragment into ONE leading system
 * message; a second system message makes strict chat templates raise.
 */
export function assembleMessages(
  systemMessages: Array<{role: 'system'; content: string}>,
  systemPromptFragments: string[],
  followingMessages: ChatMessage[],
): ChatMessage[] {
  const parts = [
    ...systemMessages.map(msg => msg.content),
    ...systemPromptFragments,
  ].filter(part => part.trim().length > 0);

  const leadingSystemMessage: ChatMessage[] = parts.length
    ? [{role: 'system', content: parts.join('\n\n')}]
    : [];

  const messages = [...leadingSystemMessage, ...followingMessages];

  if (__DEV__) {
    const systemPositions = messages
      .map((msg, index) => (msg.role === 'system' ? index : -1))
      .filter(index => index >= 0);
    if (
      systemPositions.length > 1 ||
      (systemPositions.length === 1 && systemPositions[0] !== 0)
    ) {
      console.error(
        'assembleMessages: chat templates require at most one leading system ' +
          `message, but found system messages at [${systemPositions.join(', ')}].`,
      );
    }
  }

  return messages;
}

/**
 * Resolves system prompt and formats it as a system message array
 * Returns empty array if no system prompt is available
 */
export function resolveSystemMessages(
  dependencies: SystemPromptDependencies,
): Array<{role: 'system'; content: string}> {
  const systemPrompt = resolveSystemPrompt(dependencies);

  if (!systemPrompt.trim()) {
    return [];
  }

  return [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
  ];
}
