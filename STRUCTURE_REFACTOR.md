# Structure Refactor - React Query-like Pattern

## 📊 New Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NEW STRUCTURE                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  src/                                                         │
│  ├── components/                                             │
│  │   ├── Loading.tsx          ← Extracted loading component │
│  │   └── Error.tsx             ← Extracted error component  │
│  │                                                           │
│  ├── hooks/                                                   │
│  │   ├── queries/             ← Data fetching (3 queries)  │
│  │   │   ├── types.ts         ← QueryResult interface      │
│  │   │   ├── useWalletBalance.ts                            │
│  │   │   ├── useNFTs.ts                                     │
│  │   │   ├── useTokenInfo.ts                                │
│  │   │   └── index.ts                                       │
│  │   │                                                       │
│  │   └── mutations/           ← Data modification (4 muts) │
│  │       ├── types.ts         ← MutationResult interface   │
│  │       ├── useRequestAirdrop.ts                           │
│  │       ├── useCreateToken.ts                              │
│  │       ├── useMintNFT.ts                                  │
│  │       ├── useTransferSOL.ts                              │
│  │       └── index.ts                                       │
│  │                                                           │
│  └── app/                                                     │
│      ├── wallet/page.tsx      ← Will use hooks             │
│      ├── token/page.tsx        ← Will use hooks             │
│      └── nft/page.tsx          ← Will use hooks             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Interfaces

### Query Interface (React Query-like)

```typescript
interface QueryResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
```

### Mutation Interface (React Query-like)

```typescript
interface MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
```

---

## 📋 Queries (3)

1. **useWalletBalance(address)** - Get wallet balance
2. **useNFTs(owner)** - Get NFTs for wallet
3. **useTokenInfo(mint)** - Get token information

---

## 🔄 Mutations (4)

1. **useRequestAirdrop()** - Request SOL airdrop
2. **useCreateToken()** - Create new SPL token
3. **useMintNFT()** - Mint new NFT
4. **useTransferSOL()** - Transfer SOL between wallets

---

## ⚙️ Configuration

### Environment Variable

```env
NEXT_PUBLIC_USE_MOCK_SOLANA=true  # Use mock (default)
# or
NEXT_PUBLIC_USE_MOCK_SOLANA=false # Use real blockchain
```

### Behavior

- **Mock Mode (default):** Uses `mockSolana` service + localStorage simulation
- **Real Mode:** Uses `solanaService` with actual blockchain calls

---

## ✅ Completed

- ✅ Created `Loading.tsx` component
- ✅ Created `Error.tsx` component
- ✅ Created `queries/` folder with 3 queries
- ✅ Created `mutations/` folder with 4 mutations
- ✅ React Query-like interfaces
- ✅ Mock/real mode switching via env var
- ✅ localStorage simulation for mocks

---

## 🔄 Next Steps

1. Refactor pages to use new hooks
2. Replace inline loading/error JSX with components
3. Test with mock mode
4. Test with real mode

---

**Status:** Structure created, ready for page refactoring
