interface Message {
  role: 'user' | 'assistant';
  content: string;
  field?: string;
  timestamp: number;
}

// In-memory store for conversation histories
const conversationStore = new Map<string, Message[]>();

/**
 * Get conversation history for a word
 */
export function getConversationHistory(word: string): Message[] {
  return conversationStore.get(word) || [];
}

/**
 * Add a message to the conversation history
 */
export function addMessage(word: string, message: Message): void {
  const history = conversationStore.get(word) || [];
  history.push(message);
  conversationStore.set(word, history);
}

/**
 * Initialize conversation with the initial word generation
 */
export function initializeConversation(word: string, initialData: any): void {
  const messages: Message[] = [
    {
      role: 'user',
      content: `Provide structured information about the word "${word}".`,
      timestamp: Date.now(),
    },
    {
      role: 'assistant',
      content: JSON.stringify(initialData),
      timestamp: Date.now(),
    },
  ];
  conversationStore.set(word, messages);
}

/**
 * Clear conversation history for a word
 */
export function clearConversation(word: string): void {
  conversationStore.delete(word);
}

/**
 * Clear all conversation histories (useful for testing)
 */
export function clearAllConversations(): void {
  conversationStore.clear();
}
