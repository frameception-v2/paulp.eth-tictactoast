export const PROJECT_ID = process.env.PROJECT_ID || 'farcaster-frames-template';
export const PROJECT_TITLE = "Tic Tac Toe Wager";
export const PROJECT_DESCRIPTION = "Decentralized Tic Tac Toe with USDC Wagers"; 
export const USDC_MAINNET = "0x833589fCD6eDb6E08B4DFDC2B6b64C2f94aC1cD9"; // Correct Base Mainnet USDC
export const NEXT_AUTH_SECRET = process.env.NEXT_AUTH_SECRET || "development-secret";
export const WALLET_CONNECT_ID = process.env.WALLET_CONNECT_ID || "";
if (!WALLET_CONNECT_ID) console.warn("Missing WALLET_CONNECT_ID env variable - wallet features will be disabled");
export const SYSTEM_KEY = process.env.SYSTEM_KEY || "dev-only-insecure-key"; // Override in production
