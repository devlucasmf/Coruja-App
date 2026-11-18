import type { ChatMessage } from './types';

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface StoredMessage extends ChatMessage {
  id: string;
  conversationId: string;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Armazenamento local. A implementação concreta (passo 3) usa
 * SQLite + SQLCipher via op-sqlite, com chave no Keychain/Keystore.
 */
export interface Storage {
  listConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;
  listMessages(conversationId: string): Promise<StoredMessage[]>;
  addMessage(
    conversationId: string,
    message: ChatMessage,
  ): Promise<StoredMessage>;

  listNotes(): Promise<Note[]>;
  saveNote(note: Omit<Note, 'createdAt' | 'updatedAt'>): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  /** Busca por palavras (FTS5) em notas e mensagens. */
  search(query: string): Promise<Array<Note | StoredMessage>>;

  getPreference<T>(key: string): Promise<T | undefined>;
  setPreference<T>(key: string, value: T): Promise<void>;
}
