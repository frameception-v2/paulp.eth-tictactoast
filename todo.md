Here's a focused todo list following your requirements:

**Foundation**
- [ ] Initialize Next.js 14 project with Frog Framework and TypeScript template (base setup)
- [ ] Install required dependencies: Frog, Viem, Wagmi, @framehq/crypto (dependency management)
- [x] Create `/app/api/frame/route.ts` with initial /start route and FrameState type (route scaffolding)
- [x] Configure environment variables for USDC_MAINNET and WALLET_CONNECT_ID (env setup)

**State Management**
- [x] Define GameState interface with players, board, payments in `/types.ts` (type safety)
- [ ] Implement encrypted localStorage persistence in `/lib/storage.ts` (state security)
- [ ] Create API route `/api/game/[id].ts` for state validation (state API)

**Payments Core**
- [ ] Setup Viem USDC client with mainnet config in `/lib/usdc.ts` (contract interaction)
- [ ] Implement balance check and approval flow functions (payment safeguards)

**Game UI**
- [ ] Create SVG board component with touch mapping in `/components/Board.tsx` (interactive grid)
- [ ] Add win detection algorithm in `/lib/game-logic.ts` (game rules)

**Validation**
- [ ] Implement move signature verification in API route (attack prevention)
- [ ] Add turn timeout handling in game state updates (game pacing)

**Social Features**
- [ ] Create QR code generation utility in `/lib/qr.ts` (mobile sharing)
- [ ] Implement deep link validation middleware in API (invite security)

**Payment Resolution**
- [ ] Create batch transfer function with error recovery in `/lib/escrow.ts` (prize distribution)

**Mobile UX**
- [ ] Configure viewport meta tags in `/app/layout.tsx` (mobile rendering)
- [ ] Add touch target CSS rules in `/app/globals.css` (accessibility)

**Integration**
- [ ] Connect board component click handler to move validation (gameplay loop)
- [ ] Sync localStorage state with URL params in frame routes (state hydration)
- [ ] Add loading states between transactions in frame UI (user feedback)

**Final Checks**
- [ ] Implement automatic state expiration cron job in `/lib/cleanup.ts` (storage management)
- [ ] Add error boundaries to all frame routes (failure recovery)

This list follows strict dependency order (can't implement payments before state management) while covering all required features. Each task corresponds to a specific technical implementation that can be marked complete when the functionality is verified.
