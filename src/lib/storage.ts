import { crypto } from "@framehq/crypto";
import { GameState } from "~/types";
import { SYSTEM_KEY } from "~/lib/constants";

const GAME_STATE_PREFIX = "gameState_";

export async function saveGameState(id: string, state: GameState): Promise<void> {
  const encryptionKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${SYSTEM_KEY}_${id}`),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedState = new TextEncoder().encode(JSON.stringify(state));
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    encryptionKey,
    encodedState
  );

  const encryptedData = {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(ciphertext)),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24h TTL
  };

  localStorage.setItem(`${GAME_STATE_PREFIX}${id}`, JSON.stringify(encryptedData));
}

export async function loadGameState(id: string): Promise<GameState | null> {
  const storedData = localStorage.getItem(`${GAME_STATE_PREFIX}${id}`);
  if (!storedData) return null;

  const { iv, ciphertext, expiresAt } = JSON.parse(storedData);
  if (Date.now() > expiresAt) {
    deleteGameState(id);
    return null;
  }

  const encryptionKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${SYSTEM_KEY}_${id}`),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    encryptionKey,
    new Uint8Array(ciphertext)
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}

export function deleteGameState(id: string): void {
  localStorage.removeItem(`${GAME_STATE_PREFIX}${id}`);
}
