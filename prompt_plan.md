# Code Generation Prompts

## 1. Frame Scaffolding
```text
Create a Next.js 14 frame handler using Frog Framework with:
- Basic frame structure matching template
- Custom title "Tic Tac Toe Wager"
- Initial "/start" route showing game creation CTA
- TypeScript types for FrameState { players: Address[], board: number[], status }
- Wallet connection via Frame v2 SDK
- Environment setup for Viem + Wagmi
- USDC contract address (mainnet)
- Mobile viewport meta tags
```

## 2. Game State Management
```text
Implement localStorage game persistence with:
- GameState interface (players, board, currentPlayer, payments)
- createNewGame() function storing state with unique ID
- getGameState() loader with signature validation
- URL param serialization/deserialization utilities
- State encryption using Frame's crypto package
- Automatic state expiration (24h TTL)
- Next.js API route /api/game/[id] for state validation
```

## 3. Payment Escrow System
```text
Create USDC wagering module with:
- ERC-20 approval flow using viem writeContract
- Escrow deposit function (transferFrom both players)
- Prize distribution calculator (1.5 USDC to winner)
- Transaction status tracking in game state
- Error handling for insufficient approvals
- Wallet balance checks before starting
- Chain enforcement (mainnet only)
```

## 4. Board Rendering
```text
Build SVG game board component with:
- Responsive 3x3 grid (1:1 aspect ratio)
- Touch coordinate mapping (x,y → cell 0-8)
- Animated X/O markers using <path>
- Win line detection rendering
- Mobile viewport meta tags
- Frame v2 HTML/CSS template integration
- State-derived props (board, current player)
```

## 5. Move Validation
```text
Implement turn logic with:
- Signature-protected moves (signMessage with cell index)
- Board state update validation
- Win/draw detection algorithm
- Turn timeout handling (5s limit)
- Conflict resolution via frame messages
- Move history in game state
- Opponent turn notifications
```

## 6. Invite System
```text
Create deep linking system with:
- Frame share URL generation (/play?gameId=)
- QR code rendering for mobile shares
- Player presence validation
- Opponent connection status
- Invite state tracking
- Link copying via window.clipboard
- Signature-gated game joins
```

## 7. Payment Resolution
```text
Build prize distribution flow:
- Batch USDC transfers on game end
- Transaction receipt handling
- Error recovery for failed payments
- Balance verification pre-transfer
- Winner/loser status display
- Shareable result card generation
- Escrow release authorization
```

## 8. Mobile UX
```text
Add mobile optimizations:
- 48px minimum touch targets
- viewport meta tag config
- Haptic feedback via Frame.vibrate()
- Offline state recovery
- Connection status indicators
- Mobile-first CSS media queries
- Swipe gestures for navigation
```

## 9. Integration Flow
```text
Wire all components together:
- Connect board clicks to move validation
- Link payment status to game state
- Add loading states between actions
- Handle frame message callbacks
- Sync localStorage with URL params
- Add error boundary components
- Finalize transaction flows
```

Each prompt builds on previous implementations. Start with scaffolding (#1), add state (#2), then payments (#3), followed by UI (#4), validation (#5), social (#6), payments (#7), mobile (#8), and finally integration (#9). Each step uses existing template components where possible and maintains strict protocol constraints.