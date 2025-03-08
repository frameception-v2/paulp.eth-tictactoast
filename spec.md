```markdown
# Tic Tac Toe Frame v2 Specification

## 1. OVERVIEW

### Core Functionality
- **Multiplayer Game Logic**: Turn-based 3x3 grid interactions with win/draw detection
- **USDC Wager System**: 1 USDC entry fee per player via wallet integration, 75% payout to winner
- **Cross-Player Invites**: Frame-generated deep links for opponent engagement
- **State Management**: Local game persistence between turns
- **Payment Resolution**: Automatic prize distribution through wallet operations

### UX Flow
1. **Player 1 Initiation**: 
   - Create new game & stake 1 USDC
   - Generate shareable game link
2. **Player 2 Engagement**:
   - Accept invite via frame link
   - Confirm USDC wager
3. **Game Execution**:
   - Alternate turns with visual board updates
   - Cryptographic move validation
4. **Conclusion**:
   - Automatic win/draw detection
   - Instant prize distribution
   - Shareable result cards

## 2. TECHNICAL REQUIREMENTS

### Core Stack
- **Frame v2 SDK**: Native wallet operations and cross-frame communication
- **Frog Framework**: Frame scaffolding and hub interactions
- **Wagmi/viem**: Ethereum wallet transaction management
- **USDC ERC-20**: Base token for wagers via existing contract interactions

### Critical Path
1. Frame-to-wallet connection handshake
2. Bidirectional state synchronization
3. Transaction signing for wager escrow
4. Turn validation via message signatures

## 3. FRAMES v2 IMPLEMENTATION

### Interactive Elements
- **Canvas Board**: SVG-based grid with touch coordinates mapping
- **Dynamic Meta Tags**: State encoding in frame URLs for turn persistence
- **Signature Capture**: Move validation through message signing

### State Management
- **LocalStorage**: Device-specific game state caching
- **URL Parameters**: Cross-player state transmission via deeplinks
- **Hub Validation**: Move conflict resolution through frame messages

### Payment Flow
1. Pre-authorize USDC spend via ERC-20 approve()
2. Escrow lock using transferFrom() to neutral address
3. Prize release through batch transfer transactions

## 4. MOBILE CONSIDERATIONS

### Layout Strategy
- **Aspect Ratio Lock**: 1:1 game board maintained across viewports
- **Touch-first Design**: 9x9 grid with 48px minimum touch targets
- **Viewport Meta**: Prevent zooming during gameplay

### Interaction Patterns
- **Swipe Detection**: Secondary navigation controls
- **Haptic Feedback**: Tactile response for move confirmation
- **Connection Resiliency**: Offline-first state management

## 5. CONSTRAINTS COMPLIANCE

### Architecture Boundaries
- **State Isolation**: LocalStorage per device without sync requirements
- **Stateless Backend**: Pure client-side logic with no DB dependencies
- **Contract Abstinence**: Existing USDC contract interactions only
- **Wallet Integration**: Native Farcaster wallet via Frame SDK
- **Complexity Ceiling**: No AI, matchmaking, or social features

### Protocol Limitations
- 5s Frame Response SLA for turn actions
- 2KB State Encoding Limit in URL parameters
- Ethereum Mainnet Only for USDC transfers
```