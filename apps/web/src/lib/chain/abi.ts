export const monVaultEscrowAbi = [
  {
    type: "function",
    name: "createOrder",
    stateMutability: "payable",
    inputs: [
      { name: "orderRef", type: "bytes32" },
      { name: "seller", type: "address" },
    ],
    outputs: [{ name: "orderId", type: "uint256" }],
  },
  {
    type: "function",
    name: "markShipped",
    stateMutability: "nonpayable",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "confirmDelivery",
    stateMutability: "nonpayable",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "openDispute",
    stateMutability: "nonpayable",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "claimAfterTimeout",
    stateMutability: "nonpayable",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getOrder",
    stateMutability: "view",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: [
      { name: "orderRef", type: "bytes32" },
      { name: "buyer", type: "address" },
      { name: "seller", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "reviewEndsAt", type: "uint256" },
      { name: "status", type: "uint8" },
    ],
  },
  {
    type: "function",
    name: "REVIEW_WINDOW",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "OrderPaid",
    inputs: [
      { name: "orderId", type: "uint256", indexed: true },
      { name: "orderRef", type: "bytes32", indexed: true },
      { name: "buyer", type: "address", indexed: true },
      { name: "seller", type: "address", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "OrderShipped",
    inputs: [
      { name: "orderId", type: "uint256", indexed: true },
      { name: "seller", type: "address", indexed: true },
      { name: "reviewEndsAt", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DeliveryConfirmed",
    inputs: [
      { name: "orderId", type: "uint256", indexed: true },
      { name: "buyer", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "DisputeOpened",
    inputs: [
      { name: "orderId", type: "uint256", indexed: true },
      { name: "buyer", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "SellerClaimedAfterTimeout",
    inputs: [
      { name: "orderId", type: "uint256", indexed: true },
      { name: "seller", type: "address", indexed: true },
    ],
  },
] as const;
