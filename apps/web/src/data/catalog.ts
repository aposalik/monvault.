export type DemoProduct = {
  id: string;
  slug: string;
  sku: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  priceMon: string;
  sellerName: string;
  sellerAddress: `0x${string}`;
  imageSrc: string;
  imageAlt: string;
  specs: Array<{ label: string; value: string }>;
  dispatchNote: string;
  reviewWindowMinutes: number;
};

export const DEMO_SELLER = {
  name: "monvault. Demo Shop",
  address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`,
  badge: "VERIFIED DEMO MERCHANT",
} as const;

export const demoProducts: DemoProduct[] = [
  {
    id: "headphones-001",
    slug: "studio-headphones",
    sku: "MV-AUDIO-01",
    category: "STUDIO AUDIO",
    name: "Studio Headphones",
    tagline: "Closed-back reference monitors for critical listening.",
    description:
      "Flagship demo item used in the 60-second monvault. runbook. Built with 45 mm planar-magnetic drivers, replaceable braided cable, and machined aluminum yokes.",
    priceMon: "1.00",
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/studio-headphones.svg",
    imageAlt:
      "Illustration of monvault. Studio Headphones with dark ink ear cups and solid violet headband accent",
    specs: [
      { label: "Acoustic design", value: "Closed-back circumaural" },
      { label: "Impedance", value: "32 Ohms (desktop & mobile)" },
      { label: "Included cable", value: "2.0 m detachable OFC 3.5 mm" },
      { label: "Escrow settlement", value: "1.00 native test MON" },
    ],
    dispatchNote: "Ships with an off-chain demo tracking reference.",
    reviewWindowMinutes: 5,
  },
  {
    id: "keypad-002",
    slug: "tactile-macro-keypad",
    sku: "MV-DESK-02",
    category: "DESK HARDWARE",
    name: "Tactile Macro Keypad",
    tagline: "Six hot-swap mechanical keys plus stepped rotary encoder.",
    description:
      "Compact programmable desktop controller with an integrated status readout and CNC-milled chassis. Ideal for testing sub-1 MON escrow orders on Monad testnet.",
    priceMon: "0.45",
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/mechanical-keypad.svg",
    imageAlt:
      "Illustration of a six-key mechanical macro pad with a solid violet rotary encoder knob",
    specs: [
      { label: "Switch sockets", value: "6× hot-swap 5-pin MX tactile" },
      { label: "Encoder", value: "Detented aluminum rotary dial" },
      { label: "Host interface", value: "USB-C QMK/VIA compatible" },
      { label: "Escrow settlement", value: "0.45 native test MON" },
    ],
    dispatchNote: "Ships with an off-chain demo tracking reference.",
    reviewWindowMinutes: 5,
  },
  {
    id: "vaultkey-003",
    slug: "vaultkey-security-token",
    sku: "MV-SEC-03",
    category: "HARDWARE SECURITY",
    name: "VaultKey USB-C Token",
    tagline: "Capacitive-touch FIDO2 hardware key for developer workstations.",
    description:
      "Pocket-sized USB-C hardware authenticator with a recessed capacitive confirmation ring and reinforced keyring loop. Configured as a low-value testnet escrow item.",
    priceMon: "0.25",
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/usb-hardware-key.svg",
    imageAlt:
      "Illustration of a compact USB-C hardware security token with a violet touch ring",
    specs: [
      { label: "Form factor", value: "USB-C reversible blade" },
      { label: "Verification", value: "Physical capacitive touch sensor" },
      { label: "Enclosure", value: "Crush-resistant polycarbonate" },
      { label: "Escrow settlement", value: "0.25 native test MON" },
    ],
    dispatchNote: "Ships with an off-chain demo tracking reference.",
    reviewWindowMinutes: 5,
  },
];

export function getProductBySlug(slug: string): DemoProduct | undefined {
  return demoProducts.find((product) => product.slug === slug);
}

export function getDefaultProduct(): DemoProduct {
  return demoProducts[0];
}
