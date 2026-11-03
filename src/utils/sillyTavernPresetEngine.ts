/**
 * SillyTavern Preset & Experimental Macro Engine:
 * - Full Standard & Experimental Macro Engine (recursive inside-out evaluation,
 *   scoped & global variables, math/calc, conditionals, string/regex, pipe filters, outlets)
 * - World Info / Lorebook multi-pass recursive scanner with selective keys & outlets
 * - Regex replacement script runner
 * - Prompt Manager ordering & depth injection assembler
 * - Generation samplers mapper
 */

import type {
  SillyTavernPreset,
  STMacroContext,
  STPromptItem,
} from '../types/sillyTavernPreset';
import type {CharacterBook, RegexScript} from '../types/characterCard';
import type {CompletionParams} from './completionTypes';

export const DEFAULT_ST_PROMPTS: STPromptItem[] = [
  {
    identifier: 'main',
    name: 'Main Prompt',
    system_prompt: true,
    role: 'system',
    content:
      "Write {{char}}'s next reply in a fictional chat between {{char}} and {{user}}.",
    marker: false,
    injection_position: 0,
    injection_depth: 4,
    enabled: true,
  },
  {
    identifier: 'worldInfoBefore',
    name: 'World Info (before)',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'personaDescription',
    name: 'Persona Description',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'charDescription',
    name: 'Char Description',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'charPersonality',
    name: 'Char Personality',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'scenario',
    name: 'Scenario',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'enhanceDefinitions',
    name: 'Enhance Definitions',
    system_prompt: true,
    role: 'system',
    content:
      "If you have more knowledge of {{char}}, add to the character's lore and personality to enhance them.",
    marker: false,
    injection_position: 0,
    enabled: false,
  },
  {
    identifier: 'nsfw',
    name: 'Auxiliary Prompt',
    system_prompt: true,
    role: 'system',
    content:
      'Stay true to the established tone, setting, and character voice of {{char}}.',
    marker: false,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'worldInfoAfter',
    name: 'World Info (after)',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'dialogueExamples',
    name: 'Chat Examples',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'chatHistory',
    name: 'Chat History',
    system_prompt: true,
    role: 'system',
    content: '',
    marker: true,
    injection_position: 0,
    enabled: true,
  },
  {
    identifier: 'jailbreak',
    name: 'Post-History Instructions',
    system_prompt: true,
    role: 'system',
    content:
      '[System note: Write vivid, in-character responses for {{char}}. Do not speak or act for {{user}}.]',
    marker: false,
    injection_position: 0,
    enabled: true,
  },
];

export const BUILT_IN_ST_PRESETS: SillyTavernPreset[] = [
  {
    id: 'st-default-roleplay',
    name: 'SillyTavern Default Roleplay',
    description: 'Standard SillyTavern character chat & roleplay preset.',
    isBuiltin: true,
    temperature: 0.95,
    top_p: 0.95,
    top_k: 40,
    min_p: 0.05,
    top_a: 0,
    typical_p: 1,
    tfs: 1,
    repetition_penalty: 1.1,
    repetition_penalty_range: 1024,
    frequency_penalty: 0,
    presence_penalty: 0,
    dry_multiplier: 0.8,
    xtc_probability: 0,
    xtc_threshold: 0.1,
    dynatemp_low: 0.7,
    dynatemp_high: 1.2,
    smoothing_factor: 0.2,
    max_tokens: 512,
    wi_format: '[World Info — {0}: {1}]',
    scenario_format: '[Scenario: {{scenario}}]',
    personality_format: "[{{char}}'s personality: {{personality}}]",
    new_chat_prompt: '[Start a new Chat]',
    continue_nudge_prompt:
      '[Continue the following message without repeating its original text: {{lastChatMessage}}]',
    impersonation_prompt:
      "[Write your next reply from the point of view of {{user}}, using the chat history so far as a guideline for {{user}}'s writing style. Don't write as {{char}}.]",
    authors_note:
      "[Author's Note: Use vivid sensory details and stay faithful to {{char}}'s established voice.]",
    authors_note_depth: 4,
    authors_note_role: 'system',
    names_behavior: 0,
    custom_prompt_post_processing: 'none',
    squash_system_messages: false,
    wrap_in_quotes: false,
    prompts: JSON.parse(JSON.stringify(DEFAULT_ST_PROMPTS)),
    prompt_order: [
      {
        order: DEFAULT_ST_PROMPTS.map(p => ({
          identifier: p.identifier,
          enabled: p.enabled ?? true,
        })),
      },
    ],
  },
  {
    id: 'st-immersive-creative',
    name: 'Immersive Creative Novelist',
    description:
      'Atmospheric literary fiction preset with higher creativity and sensory depth.',
    isBuiltin: true,
    temperature: 1.12,
    top_p: 0.98,
    top_k: 60,
    min_p: 0.06,
    top_a: 0,
    typical_p: 1,
    tfs: 1,
    repetition_penalty: 1.12,
    repetition_penalty_range: 2048,
    frequency_penalty: 0.05,
    presence_penalty: 0.05,
    dry_multiplier: 0.8,
    xtc_probability: 0.15,
    xtc_threshold: 0.1,
    dynatemp_low: 0.85,
    dynatemp_high: 1.35,
    smoothing_factor: 0.25,
    max_tokens: 768,
    wi_format: '[Lorebook ({0}): {1}]',
    scenario_format: '[Current Scenario: {{scenario}}]',
    personality_format: '[Character Traits: {{personality}}]',
    new_chat_prompt: '[Begin Narrative Scene]',
    continue_nudge_prompt:
      '[Continue seamlessly from the exact point where the last paragraph ended.]',
    impersonation_prompt:
      '[Write the next response from {{user}}\'s perspective in rich narrative prose.]',
    authors_note:
      "[Author's Note: Emphasize atmosphere, body language, internal monologue, and natural pacing.]",
    authors_note_depth: 3,
    authors_note_role: 'system',
    names_behavior: 0,
    custom_prompt_post_processing: 'merge',
    squash_system_messages: false,
    wrap_in_quotes: false,
    prompts: JSON.parse(JSON.stringify(DEFAULT_ST_PROMPTS)),
    prompt_order: [
      {
        order: DEFAULT_ST_PROMPTS.map(p => ({
          identifier: p.identifier,
          enabled: p.enabled ?? true,
        })),
      },
    ],
  },
  {
    id: 'st-precise-grounded',
    name: 'Focused & Grounded Logic',
    description:
      'Low-temperature, coherent preset for structured roleplay and long-context consistency.',
    isBuiltin: true,
    temperature: 0.72,
    top_p: 0.9,
    top_k: 30,
    min_p: 0.08,
    top_a: 0,
    typical_p: 1,
    tfs: 1,
    repetition_penalty: 1.08,
    repetition_penalty_range: 1024,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 512,
    wi_format: '[Context ({0}): {1}]',
    scenario_format: '[Scenario: {{scenario}}]',
    personality_format: '[Personality: {{personality}}]',
    new_chat_prompt: '[Start Session]',
    continue_nudge_prompt: '[Continue your previous response.]',
    impersonation_prompt: '[Respond as {{user}}.]',
    authors_note:
      "[Author's Note: Maintain strict continuity with established facts and character logic.]",
    authors_note_depth: 4,
    authors_note_role: 'system',
    names_behavior: 0,
    custom_prompt_post_processing: 'none',
    squash_system_messages: false,
    wrap_in_quotes: false,
    prompts: JSON.parse(JSON.stringify(DEFAULT_ST_PROMPTS)),
    prompt_order: [
      {
        order: DEFAULT_ST_PROMPTS.map(p => ({
          identifier: p.identifier,
          enabled: p.enabled ?? true,
        })),
      },
    ],
  },
];

// Runtime variable stores for {{setvar}} / {{getvar}} and {{setglobalvar}} / {{getglobalvar}}
const stRuntimeVariables: Record<string, string> = {};
const stGlobalVariables: Record<string, string> = {};
const stRuntimeOutlets: Record<string, string> = {};

export const getSillyTavernVariables = () => ({
  local: {...stRuntimeVariables},
  global: {...stGlobalVariables},
  outlets: {...stRuntimeOutlets},
});

export const setSillyTavernVariable = (
  key: string,
  value: string,
  isGlobal = false,
) => {
  if (isGlobal) {
    stGlobalVariables[key.trim()] = value;
  } else {
    stRuntimeVariables[key.trim()] = value;
  }
};

/**
 * Truthiness helper for Experimental Macro Engine conditionals
 */
function isMacroTruthy(val: string | undefined | null): boolean {
  if (val === undefined || val === null) {
    return false;
  }
  const s = String(val).trim().toLowerCase();
  return s !== '' && s !== '0' && s !== 'false' && s !== 'null' && s !== 'undefined' && s !== 'nan';
}

/**
 * Safe arithmetic expression evaluator for {{calc::...}} / {{math::...}}
 * Supports +, -, *, /, %, ^, parentheses, and decimal numbers without eval()
 */
export function evaluateSafeMathExpression(expr: string): string {
  const sanitized = expr.replace(/[^0-9+\-*/%.^()\s]/g, '').trim();
  if (!sanitized) {
    return '0';
  }
  try {
    let pos = 0;
    const str = sanitized.replace(/\s+/g, '');

    function parseExpression(): number {
      let val = parseTerm();
      while (pos < str.length && (str[pos] === '+' || str[pos] === '-')) {
        const op = str[pos++];
        const right = parseTerm();
        val = op === '+' ? val + right : val - right;
      }
      return val;
    }

    function parseTerm(): number {
      let val = parsePower();
      while (
        pos < str.length &&
        (str[pos] === '*' || str[pos] === '/' || str[pos] === '%')
      ) {
        const op = str[pos++];
        const right = parsePower();
        if (op === '*') {
          val *= right;
        } else if (op === '/') {
          val = right !== 0 ? val / right : 0;
        } else {
          val = right !== 0 ? val % right : 0;
        }
      }
      return val;
    }

    function parsePower(): number {
      let val = parseFactor();
      while (pos < str.length && str[pos] === '^') {
        pos++;
        const right = parseFactor();
        val = Math.pow(val, right);
      }
      return val;
    }

    function parseFactor(): number {
      if (str[pos] === '+') {
        pos++;
        return parseFactor();
      }
      if (str[pos] === '-') {
        pos++;
        return -parseFactor();
      }
      if (str[pos] === '(') {
        pos++;
        const val = parseExpression();
        if (str[pos] === ')') {
          pos++;
        }
        return val;
      }
      const start = pos;
      while (
        pos < str.length &&
        ((str[pos] >= '0' && str[pos] <= '9') || str[pos] === '.')
      ) {
        pos++;
      }
      const numStr = str.slice(start, pos);
      const parsed = parseFloat(numStr);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    const res = parseExpression();
    if (!Number.isFinite(res)) {
      return '0';
    }
    return Number.isInteger(res) ? String(res) : String(Number(res.toFixed(6)));
  } catch {
    return '0';
  }
}

/**
 * Evaluates a pipe filter in the Experimental Macro Engine: e.g. `value | uppercase | trim`
 */
function applyPipeFilter(value: string, filterSpec: string, ctx: STMacroContext): string {
  const parts = filterSpec.trim().split(/[:\s]+/);
  const filterName = (parts[0] || '').toLowerCase();
  const arg = parts.slice(1).join(' ');

  switch (filterName) {
    case 'upper':
    case 'uppercase':
      return value.toUpperCase();
    case 'lower':
    case 'lowercase':
      return value.toLowerCase();
    case 'capitalize':
      return value.charAt(0).toUpperCase() + value.slice(1);
    case 'title':
    case 'titlecase':
      return value.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
      );
    case 'trim':
      return value.trim();
    case 'reverse':
      return value.split('').reverse().join('');
    case 'length':
    case 'len':
      return String(value.length);
    case 'default':
      return value && value.trim() ? value : arg;
    case 'add':
    case 'plus': {
      const a = parseFloat(value);
      const b = parseFloat(arg);
      if (!Number.isNaN(a) && !Number.isNaN(b)) {
        return String(a + b);
      }
      return value + arg;
    }
    case 'sub':
    case 'minus': {
      const a = parseFloat(value) || 0;
      const b = parseFloat(arg) || 0;
      return String(a - b);
    }
    case 'mul':
    case 'times': {
      const a = parseFloat(value) || 0;
      const b = parseFloat(arg) || 0;
      return String(a * b);
    }
    case 'div': {
      const a = parseFloat(value) || 0;
      const b = parseFloat(arg) || 1;
      return b !== 0 ? String(a / b) : '0';
    }
    case 'round':
      return String(Math.round(parseFloat(value) || 0));
    case 'floor':
      return String(Math.floor(parseFloat(value) || 0));
    case 'ceil':
      return String(Math.ceil(parseFloat(value) || 0));
    case 'abs':
      return String(Math.abs(parseFloat(value) || 0));
    default:
      return expandSingleInnermostMacro(filterName + (arg ? `::${arg}` : ''), ctx);
  }
}

/**
 * Evaluates a single innermost macro body (without the outer `{{` and `}}`)
 * Supports both classic SillyTavern macros and Experimental Macro Engine syntax.
 */
function expandSingleInnermostMacro(rawBody: string, ctx: STMacroContext): string {
  const body = rawBody.trim();
  if (!body) {
    return '';
  }

  // 1. Comments
  if (body.startsWith('//') || body.startsWith('/+') || body.startsWith('!')) {
    return '';
  }

  // 2. Experimental Macro Engine Pipe Syntax: `expr | filter1 | filter2`
  if (body.includes('|') && !body.includes('::')) {
    const segments = body.split('|').map(s => s.trim()).filter(Boolean);
    if (segments.length > 1) {
      let current = expandSingleInnermostMacro(segments[0], ctx);
      // If first segment wasn't a known macro, treat it as a literal or variable lookup
      if (current === `{{${segments[0]}}}`) {
        current =
          stRuntimeVariables[segments[0]] ??
          stGlobalVariables[segments[0]] ??
          segments[0];
      }
      for (let i = 1; i < segments.length; i++) {
        current = applyPipeFilter(current, segments[i], ctx);
      }
      return current;
    }
  }

  // 3. Colon-separated (`::` or `:`) parameterized macros
  if (body.includes('::')) {
    const parts = body.split('::');
    const cmd = parts[0].trim().toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      // Local & Global Variables
      case 'setvar': {
        const key = (args[0] || '').trim();
        const val = args.slice(1).join('::');
        if (key) {
          stRuntimeVariables[key] = val;
        }
        return '';
      }
      case 'getvar': {
        const key = (args[0] || '').trim();
        return stRuntimeVariables[key] ?? '';
      }
      case 'hasvar': {
        const key = (args[0] || '').trim();
        return String(Object.prototype.hasOwnProperty.call(stRuntimeVariables, key));
      }
      case 'flushvar':
      case 'delvar': {
        const key = (args[0] || '').trim();
        delete stRuntimeVariables[key];
        return '';
      }
      case 'setglobalvar': {
        const key = (args[0] || '').trim();
        const val = args.slice(1).join('::');
        if (key) {
          stGlobalVariables[key] = val;
        }
        return '';
      }
      case 'getglobalvar': {
        const key = (args[0] || '').trim();
        return stGlobalVariables[key] ?? '';
      }
      case 'hasglobalvar': {
        const key = (args[0] || '').trim();
        return String(Object.prototype.hasOwnProperty.call(stGlobalVariables, key));
      }
      case 'flushglobalvar':
      case 'delglobalvar': {
        const key = (args[0] || '').trim();
        delete stGlobalVariables[key];
        return '';
      }
      case 'addvar': {
        const key = (args[0] || '').trim();
        const delta = args.slice(1).join('::');
        const cur = stRuntimeVariables[key] ?? '0';
        const numCur = parseFloat(cur);
        const numDelta = parseFloat(delta);
        if (!Number.isNaN(numCur) && !Number.isNaN(numDelta)) {
          stRuntimeVariables[key] = String(numCur + numDelta);
        } else {
          stRuntimeVariables[key] = (stRuntimeVariables[key] ?? '') + delta;
        }
        return '';
      }
      case 'addglobalvar': {
        const key = (args[0] || '').trim();
        const delta = args.slice(1).join('::');
        const cur = stGlobalVariables[key] ?? '0';
        const numCur = parseFloat(cur);
        const numDelta = parseFloat(delta);
        if (!Number.isNaN(numCur) && !Number.isNaN(numDelta)) {
          stGlobalVariables[key] = String(numCur + numDelta);
        } else {
          stGlobalVariables[key] = (stGlobalVariables[key] ?? '') + delta;
        }
        return '';
      }
      case 'incvar': {
        const key = (args[0] || '').trim();
        const next = (parseFloat(stRuntimeVariables[key] || '0') || 0) + 1;
        stRuntimeVariables[key] = String(next);
        return String(next);
      }
      case 'decvar': {
        const key = (args[0] || '').trim();
        const next = (parseFloat(stRuntimeVariables[key] || '0') || 0) - 1;
        stRuntimeVariables[key] = String(next);
        return String(next);
      }
      case 'incglobalvar': {
        const key = (args[0] || '').trim();
        const next = (parseFloat(stGlobalVariables[key] || '0') || 0) + 1;
        stGlobalVariables[key] = String(next);
        return String(next);
      }
      case 'decglobalvar': {
        const key = (args[0] || '').trim();
        const next = (parseFloat(stGlobalVariables[key] || '0') || 0) - 1;
        stGlobalVariables[key] = String(next);
        return String(next);
      }

      // Outlets
      case 'outlet': {
        const name = (args[0] || '').trim();
        return ctx.outlets?.[name] ?? stRuntimeOutlets[name] ?? '';
      }
      case 'setoutlet': {
        const name = (args[0] || '').trim();
        const val = args.slice(1).join('::');
        if (name) {
          stRuntimeOutlets[name] = val;
        }
        return '';
      }

      // Random / Pick
      case 'random':
      case 'pick': {
        const items = args.filter(Boolean);
        return items.length
          ? items[Math.floor(Math.random() * items.length)]
          : '';
      }

      // Dice Roll
      case 'roll': {
        return evaluateDiceRoll(args[0] || '1d20');
      }

      // Math & Arithmetic (Experimental Macro Engine)
      case 'add':
      case 'sum': {
        const sum = args.reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
        return String(sum);
      }
      case 'sub':
      case 'subtract': {
        const a = parseFloat(args[0] || '0') || 0;
        const b = parseFloat(args[1] || '0') || 0;
        return String(a - b);
      }
      case 'mul':
      case 'multiply': {
        const prod = args.reduce((acc, v) => acc * (parseFloat(v) || 0), 1);
        return String(prod);
      }
      case 'div':
      case 'divide': {
        const a = parseFloat(args[0] || '0') || 0;
        const b = parseFloat(args[1] || '1') || 1;
        return b !== 0 ? String(a / b) : '0';
      }
      case 'mod': {
        const a = parseFloat(args[0] || '0') || 0;
        const b = parseFloat(args[1] || '1') || 1;
        return b !== 0 ? String(a % b) : '0';
      }
      case 'pow': {
        const a = parseFloat(args[0] || '0') || 0;
        const b = parseFloat(args[1] || '1') || 1;
        return String(Math.pow(a, b));
      }
      case 'min': {
        const nums = args.map(v => parseFloat(v)).filter(n => !Number.isNaN(n));
        return nums.length ? String(Math.min(...nums)) : '0';
      }
      case 'max': {
        const nums = args.map(v => parseFloat(v)).filter(n => !Number.isNaN(n));
        return nums.length ? String(Math.max(...nums)) : '0';
      }
      case 'abs':
        return String(Math.abs(parseFloat(args[0] || '0') || 0));
      case 'round':
        return String(Math.round(parseFloat(args[0] || '0') || 0));
      case 'floor':
        return String(Math.floor(parseFloat(args[0] || '0') || 0));
      case 'ceil':
        return String(Math.ceil(parseFloat(args[0] || '0') || 0));
      case 'calc':
      case 'math':
        return evaluateSafeMathExpression(args.join('::'));

      // Conditionals & Boolean Comparisons (Experimental Macro Engine)
      case 'if':
      case 'ifelse': {
        const cond = isMacroTruthy(args[0]);
        const thenBranch = args[1] ?? '';
        const elseBranch = args.slice(2).join('::');
        return cond ? thenBranch : elseBranch;
      }
      case 'unless': {
        const cond = isMacroTruthy(args[0]);
        const thenBranch = args[1] ?? '';
        const elseBranch = args.slice(2).join('::');
        return !cond ? thenBranch : elseBranch;
      }
      case 'eq':
      case 'equals':
        return String((args[0] ?? '').trim() === (args[1] ?? '').trim());
      case 'ne':
      case 'neq':
        return String((args[0] ?? '').trim() !== (args[1] ?? '').trim());
      case 'gt':
        return String((parseFloat(args[0] || '0') || 0) > (parseFloat(args[1] || '0') || 0));
      case 'lt':
        return String((parseFloat(args[0] || '0') || 0) < (parseFloat(args[1] || '0') || 0));
      case 'gte':
        return String((parseFloat(args[0] || '0') || 0) >= (parseFloat(args[1] || '0') || 0));
      case 'lte':
        return String((parseFloat(args[0] || '0') || 0) <= (parseFloat(args[1] || '0') || 0));
      case 'and':
        return String(args.every(a => isMacroTruthy(a)));
      case 'or':
        return String(args.some(a => isMacroTruthy(a)));
      case 'not':
        return String(!isMacroTruthy(args[0]));
      case 'contains':
        return String((args[0] ?? '').toLowerCase().includes((args[1] ?? '').toLowerCase()));
      case 'matches': {
        try {
          const re = new RegExp(args[1] || '', 'i');
          return String(re.test(args[0] || ''));
        } catch {
          return 'false';
        }
      }

      // String & Regex Transformations
      case 'lowercase':
      case 'lower':
        return args.join('::').toLowerCase();
      case 'uppercase':
      case 'upper':
        return args.join('::').toUpperCase();
      case 'capitalize': {
        const s = args.join('::');
        return s.charAt(0).toUpperCase() + s.slice(1);
      }
      case 'titlecase': {
        const s = args.join('::');
        return s.replace(
          /\w\S*/g,
          txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
        );
      }
      case 'reverse':
        return args.join('::').split('').reverse().join('');
      case 'trim':
        return args.join('::').trim();
      case 'length':
      case 'len':
        return String(args.join('::').length);
      case 'substr':
      case 'substring': {
        const str = args[0] || '';
        const start = parseInt(args[1] || '0', 10) || 0;
        const len = args[2] !== undefined ? parseInt(args[2], 10) : undefined;
        return len !== undefined ? str.slice(start, start + len) : str.slice(start);
      }
      case 'replace': {
        const str = args[0] || '';
        const find = args[1] || '';
        const rep = args[2] ?? '';
        return find ? str.split(find).join(rep) : str;
      }
      case 'regex_replace': {
        const str = args[0] || '';
        const pattern = args[1] || '';
        const rep = args[2] ?? '';
        try {
          return str.replace(new RegExp(pattern, 'g'), rep);
        } catch {
          return str;
        }
      }
      case 'repeat': {
        const count = Math.min(100, Math.max(0, parseInt(args[0] || '1', 10) || 0));
        const str = args.slice(1).join('::');
        return str.repeat(count);
      }
      case 'join': {
        const sep = args[0] ?? ', ';
        return args.slice(1).join(sep);
      }

      // Message History Lookups
      case 'nthmessage': {
        const idx = parseInt(args[0] || '0', 10);
        const msgs = ctx.messages || [];
        if (idx >= 0 && idx < msgs.length) {
          return msgs[idx].text || '';
        }
        if (idx < 0 && Math.abs(idx) <= msgs.length) {
          return msgs[msgs.length + idx].text || '';
        }
        return '';
      }
      case 'lastmessages': {
        const count = Math.max(1, parseInt(args[0] || '3', 10) || 3);
        const msgs = ctx.messages || [];
        return msgs
          .slice(-count)
          .map(m => m.text)
          .join('\n');
      }
      case 'time_diff': {
        const t1 = new Date(args[0] || Date.now()).getTime();
        const t2 = new Date(args[1] || Date.now()).getTime();
        const diffMins = Math.round(Math.abs(t2 - t1) / 60000);
        return `${diffMins}m`;
      }
    }
  }

  // 4. Single-colon macros (`random:a,b,c`, `pick:a,b,c`, `roll:1d20+2`)
  if (body.includes(':')) {
    const colonIdx = body.indexOf(':');
    const cmd = body.slice(0, colonIdx).trim().toLowerCase();
    const argStr = body.slice(colonIdx + 1).trim();

    if (cmd === 'random' || cmd === 'pick') {
      const items = argStr
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      return items.length
        ? items[Math.floor(Math.random() * items.length)]
        : '';
    }
    if (cmd === 'roll') {
      return evaluateDiceRoll(argStr);
    }
  }

  // 5. Simple token macros
  const now = new Date();
  switch (body.toLowerCase()) {
    case 'char':
      return ctx.charName || 'Assistant';
    case 'user':
      return ctx.userName || 'User';
    case 'persona':
      return ctx.userPersona || '';
    case 'description':
      return ctx.description || '';
    case 'personality':
      return ctx.personality || '';
    case 'scenario':
      return ctx.scenario || '';
    case 'mesexamples':
    case 'mes_examples':
      return ctx.mesExamples || '';
    case 'original':
    case 'card_prompt':
    case 'system':
    case 'systemprompt':
      return ctx.original || '';
    case 'charprompt':
    case 'char_prompt':
      return ctx.charPrompt || '';
    case 'charinstruction':
    case 'char_instruction':
      return ctx.charInstruction || '';
    case 'char_version':
    case 'charversion':
      return ctx.charVersion || '1.0';
    case 'authorsnote':
    case 'authors_note':
      return ctx.authorsNote || '';
    case 'chardepthprompt':
    case 'char_depth_prompt':
      return ctx.charDepthPrompt || '';
    case 'lastchatmessage':
    case 'lastmessage':
      return ctx.lastChatMessage || '';
    case 'lastusermessage':
    case 'input':
      return ctx.lastUserMessage || '';
    case 'lastcharmessage':
      return ctx.lastCharMessage || '';
    case 'model':
      return ctx.modelName || 'Local AI';
    case 'mes_count':
    case 'message_count':
      return String(ctx.messageCount ?? ctx.messages?.length ?? 0);
    case 'turn_count':
      return String(ctx.turnCount ?? Math.ceil((ctx.messages?.length ?? 0) / 2));
    case 'lastmessageid':
      return String(ctx.lastMessageId ?? Math.max(0, (ctx.messages?.length ?? 1) - 1));
    case 'firstincludedmessageid':
      return String(ctx.firstIncludedMessageId ?? 0);
    case 'time':
      return now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    case 'time_utc':
      return now.toISOString().slice(11, 16) + ' UTC';
    case 'date':
      return now.toLocaleDateString();
    case 'weekday':
      return now.toLocaleDateString([], {weekday: 'long'});
    case 'isotime':
      return now.toISOString().slice(11, 19);
    case 'isodate':
      return now.toISOString().slice(0, 10);
    case 'idle_duration':
      return '0m';
    case 'newline':
      return '\n';
    case 'noop':
    case 'empty':
      return '';
    case 'trim':
      return '{{trim}}';
    default: {
      // Experimental Macro Engine fallback: if a bare identifier matches a runtime/global variable, resolve it
      if (ctx.experimentalMacroEngine !== false) {
        if (Object.prototype.hasOwnProperty.call(stRuntimeVariables, body)) {
          return stRuntimeVariables[body];
        }
        if (Object.prototype.hasOwnProperty.call(stGlobalVariables, body)) {
          return stGlobalVariables[body];
        }
      }
      return `{{${rawBody}}}`;
    }
  }
}

function evaluateDiceRoll(formula: string): string {
  const m = formula.trim().match(/^(?:(\d+)?d)?(\d+)([+-]\d+)?$/i);
  if (!m) {
    return '1';
  }
  const count = Math.min(100, Math.max(1, parseInt(m[1] || '1', 10)));
  const sides = Math.max(1, parseInt(m[2], 10));
  const mod = m[3] ? parseInt(m[3], 10) : 0;
  let total = mod;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return String(total);
}

/**
 * Resolves a single balanced `{{...}}` expression by recursively expanding any
 * nested `{{...}}` inside it first (left-to-right, inside-out per expression).
 */
function evaluateBalancedMacro(innerContent: string, ctx: STMacroContext, depth = 0): string {
  if (depth > 16) {
    return `{{${innerContent}}}`;
  }
  const resolvedInner =
    ctx.experimentalMacroEngine === false && depth > 0
      ? innerContent
      : expandMacrosLeftToRight(innerContent, ctx, depth + 1);

  if (resolvedInner.trim().toLowerCase() === 'trim') {
    return '{{trim}}';
  }
  return expandSingleInnermostMacro(resolvedInner, ctx);
}

/**
 * Resolves Handlebars-style conditional blocks from the Experimental Macro Engine:
 * `{{#if cond}}...{{else}}...{{/if}}` and `{{#unless cond}}...{{else}}...{{/unless}}`
 */
function resolveHandlebarsConditionals(input: string, ctx: STMacroContext): string {
  let text = input;
  let guard = 0;

  while (guard < 16) {
    guard++;
    const matchOpen = /\{\{#(if|unless)\s+/i.exec(text);
    if (!matchOpen) {
      break;
    }

    const type = matchOpen[1].toLowerCase();
    const startIdx = matchOpen.index;
    let condStart = startIdx + matchOpen[0].length;

    // Find balanced closing `}}` for `{{#if ...}}`
    let braceDepth = 1;
    let j = condStart;
    const n = text.length;
    while (j < n && braceDepth > 0) {
      if (text[j] === '{' && j + 1 < n && text[j + 1] === '{') {
        braceDepth++;
        j += 2;
      } else if (text[j] === '}' && j + 1 < n && text[j + 1] === '}') {
        braceDepth--;
        j += 2;
      } else {
        j++;
      }
    }

    if (braceDepth !== 0) {
      break;
    }

    const rawCond = text.slice(condStart, j - 2);
    const closeTag = `{{/${type}}}`;
    const closeIdx = text.toLowerCase().indexOf(closeTag, j);
    if (closeIdx === -1) {
      break;
    }

    const bodyContent = text.slice(j, closeIdx);
    const elseIdx = bodyContent.indexOf('{{else}}');
    const thenPart = elseIdx !== -1 ? bodyContent.slice(0, elseIdx) : bodyContent;
    const elsePart = elseIdx !== -1 ? bodyContent.slice(elseIdx + 8) : '';

    const expandedCond = expandMacrosLeftToRight(rawCond.trim(), ctx, 1).trim();
    let evaluatedCond = expandSingleInnermostMacro(expandedCond, ctx);
    if (evaluatedCond === `{{${expandedCond}}}`) {
      evaluatedCond =
        stRuntimeVariables[expandedCond] ??
        stGlobalVariables[expandedCond] ??
        expandedCond;
    }
    const truthy = isMacroTruthy(evaluatedCond);
    const takeThen = type === 'if' ? truthy : !truthy;
    const replacement = takeThen ? thenPart : elsePart;

    text = text.slice(0, startIdx) + replacement + text.slice(closeIdx + closeTag.length);
  }
  return text;
}

/**
 * Scans `input` left-to-right for balanced `{{ ... }}` blocks so stateful
 * macros (`setvar`, `addvar`, `incvar`, `getvar`) execute in strict reading order
 * while still supporting arbitrarily nested inner `{{ ... }}` macros.
 */
function expandMacrosLeftToRight(
  input: string,
  ctx: STMacroContext,
  depth = 0,
): string {
  if (!input || !input.includes('{{') || depth > 16) {
    return input;
  }

  let text = input;
  if (text.includes('{{#if') || text.includes('{{#unless')) {
    text = resolveHandlebarsConditionals(text, ctx);
  }

  let out = '';
  let i = 0;
  const n = text.length;

  while (i < n) {
    if (text[i] === '{' && i + 1 < n && text[i + 1] === '{') {
      // Find matching closing `}}` accounting for nested `{{`
      let braceDepth = 1;
      let j = i + 2;
      while (j < n && braceDepth > 0) {
        if (text[j] === '{' && j + 1 < n && text[j + 1] === '{') {
          braceDepth++;
          j += 2;
        } else if (text[j] === '}' && j + 1 < n && text[j + 1] === '}') {
          braceDepth--;
          j += 2;
        } else {
          j++;
        }
      }

      if (braceDepth === 0) {
        const inner = text.slice(i + 2, j - 2);
        out += evaluateBalancedMacro(inner, ctx, depth);
        i = j;
        continue;
      }
    }
    out += text[i];
    i++;
  }

  return out;
}

/**
 * Expands all SillyTavern & Experimental Macro Engine macros in a template string.
 * Performs left-to-right balanced recursive evaluation so nested macros like
 * `{{getvar::{{lowercase::{{char}}}}_mood}}` or `{{if::{{gt::{{getvar::hp}}::0}}::Alive::Dead}}`
 * resolve in exact reading order.
 */
export const expandSillyTavernMacros = (
  template: string,
  ctx: STMacroContext,
): string => {
  if (!template) {
    return '';
  }

  let text = String(template);

  // Strip multiline comments first
  text = text.replace(/\{\{\/\/[\s\S]*?\}\}/g, '');
  text = text.replace(/\{\{\/\+[\s\S]*?\}\}/g, '');

  text = expandMacrosLeftToRight(text, ctx, 0);

  // Trim macro
  if (text.toLowerCase().includes('{{trim}}')) {
    text = text.replace(/[ \t\r\n]*\{\{trim\}\}[ \t\r\n]*/gi, '').trim();
  }

  return text;
};

/**
 * Alias for Experimental Macro Engine callers
 */
export const expandExperimentalMacros = (
  template: string,
  ctx: STMacroContext,
): string =>
  expandSillyTavernMacros(template, {
    ...ctx,
    experimentalMacroEngine: true,
  });

/**
 * Scan chat context for World Info / Lorebook keyword matches
 */
export const evaluateWorldInfoEntries = (
  book: CharacterBook | undefined,
  chatText: string,
  preset: SillyTavernPreset,
  ctx: STMacroContext,
): {before: string[]; after: string[]; outlets: Record<string, string>} => {
  if (!book || !book.entries || !Array.isArray(book.entries)) {
    return {before: [], after: [], outlets: {}};
  }

  const triggeredEntries = new Map<any, any>();
  let scanContext = chatText.toLowerCase();

  // Multi-pass recursive scanning (up to 3 passes so triggered lore can trigger further lore)
  for (let pass = 0; pass < 3; pass++) {
    let newTriggeredInPass = 0;

    for (const entry of book.entries) {
      if (entry.enabled === false || triggeredEntries.has(entry)) {
        continue;
      }

      let isMatch = Boolean(entry.constant);

      // Primary keys check
      if (!isMatch && entry.keys && entry.keys.length > 0) {
        isMatch = entry.keys.some(k => {
          const keyStr = String(k).trim().toLowerCase();
          return keyStr && scanContext.includes(keyStr);
        });
      }

      // Secondary keys & selective logic (AND_ANY, NOT_ANY, NOT_ALL)
      if (isMatch && entry.secondary_keys && entry.secondary_keys.length > 0) {
        const secMatches = entry.secondary_keys.filter(k => {
          const keyStr = String(k).trim().toLowerCase();
          return keyStr && scanContext.includes(keyStr);
        });

        const logic = (entry as any).selective_logic ?? 0; // 0 = AND_ANY, 1 = NOT_ANY, 2 = NOT_ALL
        if (logic === 0 || logic === 'AND_ANY') {
          isMatch = secMatches.length > 0;
        } else if (logic === 1 || logic === 'NOT_ANY') {
          isMatch = secMatches.length === 0;
        } else if (logic === 2 || logic === 'NOT_ALL') {
          isMatch = secMatches.length < entry.secondary_keys.length;
        }
      }

      if (isMatch && entry.content) {
        triggeredEntries.set(entry, entry);
        scanContext += ' ' + entry.content.toLowerCase();
        newTriggeredInPass++;
      }
    }

    if (newTriggeredInPass === 0) {
      break;
    }
  }

  // Sort by insertion order
  const sorted = Array.from(triggeredEntries.values()).sort(
    (a, b) =>
      (a.insertion_order ?? a.order ?? 100) -
      (b.insertion_order ?? b.order ?? 100),
  );

  const before: string[] = [];
  const after: string[] = [];
  const outlets: Record<string, string> = {};

  for (const entry of sorted) {
    const formatted = (preset.wi_format || '[World Info: {1}]')
      .replace(
        '{0}',
        entry.comment || entry.name || (entry.keys && entry.keys[0]) || 'Lore',
      )
      .replace('{1}', expandSillyTavernMacros(entry.content, ctx));

    const outletName = (entry as any).outlet || (entry.extensions as any)?.outlet;
    if (outletName) {
      outlets[outletName] = outlets[outletName]
        ? `${outlets[outletName]}\n${formatted}`
        : formatted;
    } else if (entry.position === 'after_char') {
      after.push(formatted);
    } else {
      before.push(formatted);
    }
  }

  return {before, after, outlets};
};

/**
 * Apply SillyTavern Regex Scripts to text
 */
export const applySillyTavernRegexScripts = (
  text: string,
  scripts: RegexScript[] | undefined,
): string => {
  if (!scripts || !Array.isArray(scripts) || scripts.length === 0) {
    return text;
  }

  let result = text;
  scripts.forEach(s => {
    if (s.disabled || !s.find_regex) {
      return;
    }
    try {
      const regex = new RegExp(s.find_regex, 'g');
      result = result.replace(regex, s.replace_string ?? '');
    } catch {
      // ignore invalid regex
    }
  });
  return result;
};

/**
 * Prompt Manager: Assembles final prompt messages from SillyTavern preset blocks,
 * in-chat depth injections, Author's Note, and message history.
 */
export const buildSillyTavernMessages = (params: {
  preset: SillyTavernPreset;
  rawMessages: Array<{role: 'system' | 'user' | 'assistant'; text: string}>;
  charName: string;
  userName?: string;
  userPersona?: string;
  description?: string;
  personality?: string;
  scenario?: string;
  mesExamples?: string;
  originalSystemPrompt?: string;
  characterBook?: CharacterBook;
  depthPrompt?: {prompt: string; depth: number; role?: string};
  experimentalMacroEngine?: boolean;
}): Array<{role: 'system' | 'user' | 'assistant'; content: string}> => {
  const {
    preset,
    rawMessages,
    charName,
    userName = 'User',
    userPersona = '',
    description = '',
    personality = '',
    scenario = '',
    mesExamples = '',
    originalSystemPrompt = '',
    characterBook,
    depthPrompt,
    experimentalMacroEngine = true,
  } = params;

  const userMsgs = rawMessages.filter(m => m.role === 'user');
  const charMsgs = rawMessages.filter(m => m.role === 'assistant');

  const mCtx: STMacroContext = {
    charName,
    userName,
    userPersona,
    description,
    personality,
    scenario,
    mesExamples,
    original: originalSystemPrompt,
    authorsNote: preset.authors_note || '',
    charDepthPrompt: depthPrompt?.prompt || '',
    lastChatMessage: rawMessages[rawMessages.length - 1]?.text || '',
    lastUserMessage: userMsgs[userMsgs.length - 1]?.text || '',
    lastCharMessage: charMsgs[charMsgs.length - 1]?.text || '',
    messageCount: rawMessages.length,
    turnCount: Math.ceil(rawMessages.length / 2),
    lastMessageId: Math.max(0, rawMessages.length - 1),
    firstIncludedMessageId: 0,
    messages: rawMessages,
    experimentalMacroEngine,
  };

  const chatText = rawMessages
    .slice(-8)
    .map(m => m.text)
    .join('\n');
  const wi = evaluateWorldInfoEntries(characterBook, chatText, preset, mCtx);
  mCtx.outlets = wi.outlets;

  const beforeHistory: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = [];
  const afterHistory: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = [];
  const depthInjections: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
    depth: number;
  }> = [];

  let seenHistoryMarker = false;

  const promptOrder =
    preset.prompt_order?.[0]?.order ??
    preset.prompts.map(p => ({
      identifier: p.identifier,
      enabled: p.enabled ?? true,
    }));

  promptOrder.forEach(orderItem => {
    if (!orderItem.enabled) {
      return;
    }
    const item = preset.prompts.find(
      p => p.identifier === orderItem.identifier,
    );
    if (!item) {
      return;
    }

    if (item.identifier === 'chatHistory') {
      seenHistoryMarker = true;
      return;
    }

    let content = '';
    const role: 'system' | 'user' | 'assistant' = item.role || 'system';

    if (item.marker) {
      switch (item.identifier) {
        case 'worldInfoBefore':
          content = wi.before.join('\n');
          break;
        case 'worldInfoAfter':
          content = wi.after.join('\n');
          break;
        case 'personaDescription':
          if (userPersona) {
            content = `[${userName}'s Persona: ${expandSillyTavernMacros(userPersona, mCtx)}]`;
          }
          break;
        case 'charDescription':
          if (description) {
            content = expandSillyTavernMacros(description, mCtx);
          }
          break;
        case 'charPersonality':
          if (personality) {
            content = expandSillyTavernMacros(
              preset.personality_format || '{{personality}}',
              mCtx,
            );
          }
          break;
        case 'scenario':
          if (scenario) {
            content = expandSillyTavernMacros(
              preset.scenario_format || '{{scenario}}',
              mCtx,
            );
          }
          break;
        case 'dialogueExamples':
          if (mesExamples) {
            content = expandSillyTavernMacros(mesExamples, mCtx);
          }
          break;
      }
    } else {
      content = expandSillyTavernMacros(item.content, mCtx);
      if (
        item.identifier === 'main' &&
        originalSystemPrompt &&
        !item.content.includes('{{original}}')
      ) {
        content = `${content}\n\n${expandSillyTavernMacros(originalSystemPrompt, mCtx)}`;
      }
    }

    if (!content || !content.trim()) {
      return;
    }

    if (item.injection_position === 1) {
      depthInjections.push({
        role,
        content: content.trim(),
        depth: item.injection_depth ?? 4,
      });
    } else if (!seenHistoryMarker) {
      beforeHistory.push({role, content: content.trim()});
    } else {
      afterHistory.push({role, content: content.trim()});
    }
  });

  // Author's Note depth injection
  if (preset.authors_note && preset.authors_note.trim()) {
    depthInjections.push({
      role: preset.authors_note_role || 'system',
      content: expandSillyTavernMacros(preset.authors_note.trim(), mCtx),
      depth: preset.authors_note_depth ?? 4,
    });
  }

  // Character Card Depth Prompt
  if (depthPrompt && depthPrompt.prompt) {
    depthInjections.push({
      role: (depthPrompt.role as any) || 'system',
      content: expandSillyTavernMacros(depthPrompt.prompt.trim(), mCtx),
      depth: depthPrompt.depth ?? 4,
    });
  }

  // Build message history
  const history: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = rawMessages.map(m => ({
    role: m.role,
    content: expandSillyTavernMacros(m.text, mCtx),
  }));

  // Splice in depth injections from bottom of history
  depthInjections.forEach(inj => {
    const insertIdx = Math.max(0, history.length - inj.depth);
    history.splice(insertIdx, 0, {
      role: inj.role,
      content: inj.content,
    });
  });

  const finalMessages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }> = [];

  beforeHistory.forEach(m => finalMessages.push(m));
  if (preset.new_chat_prompt && history.length > 0) {
    finalMessages.push({
      role: 'system',
      content: expandSillyTavernMacros(preset.new_chat_prompt, mCtx),
    });
  }
  history.forEach(m => finalMessages.push(m));
  afterHistory.forEach(m => finalMessages.push(m));

  return finalMessages;
};

/**
 * Maps SillyTavern sampler settings to CompletionParams for local llama.rn or remote API
 */
export const applySillyTavernSamplersToCompletionParams = (
  preset: SillyTavernPreset,
  baseParams: CompletionParams,
): CompletionParams => {
  return {
    ...baseParams,
    temperature: preset.temperature ?? baseParams.temperature,
    top_p: preset.top_p ?? baseParams.top_p,
    top_k: preset.top_k ?? baseParams.top_k,
    min_p: preset.min_p ?? baseParams.min_p,
    tfs: preset.tfs ?? baseParams.tfs,
    typical_p: preset.typical_p ?? baseParams.typical_p,
    penalty_repeat: preset.repetition_penalty ?? baseParams.penalty_repeat,
    penalty_freq: preset.frequency_penalty ?? baseParams.penalty_freq,
    penalty_present: preset.presence_penalty ?? baseParams.penalty_present,
    n_predict: preset.max_tokens ?? baseParams.n_predict,
    stop: preset.custom_stopping_strings || baseParams.stop,
    logit_bias: preset.logit_bias || baseParams.logit_bias,
  };
};
