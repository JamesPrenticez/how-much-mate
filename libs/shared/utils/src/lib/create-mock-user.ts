import { UserGameSettings } from '@shared/models';
import { v4 as uuidv4 } from 'uuid';

interface CreateMockUserOptions {
  username?: string;
  balance?: number;
  currency?: string;
  sessionId: string;
  nicknamePrompt?: boolean;
}

export interface GameUser {
  id: string;
  username: string;
  balance: number;
  currency: string;
  sessionId: string;
  nicknamePrompt: boolean;
  gameUuid: string;
  createdAt: number;
}

export const createMockUser = (
  options: CreateMockUserOptions,
  gameUuid: string,
  settings: UserGameSettings
): GameUser => {
  return {
    id: uuidv4(),
    username: options.username || 'Guest',
    balance: 1000, // options.balance ?? settings.defaultCredits ?? 1000,
    currency: 'USD', // options.currency ?? settings.defaultCurrency ?? 'USD',
    sessionId: options.sessionId,
    nicknamePrompt: options.nicknamePrompt ?? false,
    gameUuid,
    createdAt: Date.now(),
  };
};
