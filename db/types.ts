// Local type definitions (replaces piarch-a-interfaces)

export interface UserCoordinates {
  coords: {
    altitude?: number;
    altitudeAccuracy?: number;
    latitude: number;
    accuracy?: number;
    longitude: number;
    heading?: number;
    speed?: number;
  };
  timestamp?: Date;
}

export interface User {
  username: string;
  password?: string;
  full_name?: string;
  gender?: string;
  birthdate?: Date;
  mail?: string;
  lastLogin?: Date;
  phone?: string;
  locations?: UserCoordinates[];
  languagePreferences?: string[];
  chats?: string[];
}

export interface ChatMessage {
  sender: string;
  recipient: string;
  message: string;
  timestamp: Date;
}

export interface Chats {
  chatId: string;
  messages: ChatMessage[];
}

export type Gender = 'male' | 'female' | 'other';
