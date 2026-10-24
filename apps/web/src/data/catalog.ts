export type ProductCategory =
  | "Audio"
  | "Keyboards"
  | "Security"
  | "Hardware"
  | "Wearables";

export type DemoProduct = {
  id: string;
  dbId: number;
  slug: string;
  sku: string;
  category: ProductCategory;
  name: string;
  title: string;
  tagline: string;
  description: string;
  priceMon: string;
  priceNumeric: number;
  sellerName: string;
  sellerAddress: `0x${string}`;
  imageSrc: string;
  imageAlt: string;
  gallery: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  badge: string | null;
  specs: Array<{ label: string; value: string }>;
  specsRecord: Record<string, string>;
  dispatchNote: string;
  reviewWindowMinutes: number;
};

export const DEMO_SELLER = {
  name: "Ankara Precision Lab",
  address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" as `0x${string}`,
  badge: "VERIFIED ESCROW MERCHANT",
} as const;

export const MARKETPLACE_CATEGORIES: Array<"All" | ProductCategory> = [
  "All",
  "Hardware",
  "Audio",
  "Keyboards",
  "Security",
  "Wearables",
];

export const demoProducts: DemoProduct[] = [
  {
    id: "prod-001",
    dbId: 1,
    slug: "studio-headphones",
    sku: "MV-AUDIO-01",
    category: "Audio",
    name: "Reference Planar Studio Headphones",
    title: "Reference Planar Studio Headphones",
    tagline: "Open-back planar magnetic studio monitors with magnesium yokes.",
    description:
      "Open-back planar magnetic studio monitor headphones with CNC-machined magnesium earcups, detachable balanced 4.4mm Pentaconn cable, and low-distortion acoustic tuning for mastering engineers.",
    priceMon: "45.00",
    priceNumeric: 45.0,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/studio-headphones.svg",
    imageAlt: "Reference Planar Studio Headphones",
    gallery: [
      "/visuals/products/studio-headphones.svg",
      "/visuals/products/studio-condenser-mic.svg",
    ],
    stock: 14,
    rating: 4.92,
    reviewCount: 128,
    badge: "BEST SELLER",
    specs: [
      { label: "Driver Type", value: "106mm Planar Magnetic" },
      { label: "Impedance", value: "32 Ohms" },
      { label: "Frequency Response", value: "10 Hz – 50 kHz" },
      { label: "Chassis", value: "CNC Anodized Magnesium" },
      { label: "Cable", value: "2m Braided OFC (4.4mm + 6.35mm)" },
      { label: "Weight", value: "380g" },
    ],
    specsRecord: {
      "Driver Type": "106mm Planar Magnetic",
      Impedance: "32 Ohms",
      "Frequency Response": "10 Hz – 50 kHz",
      Chassis: "CNC Anodized Magnesium",
      Cable: "2m Braided OFC (4.4mm + 6.35mm)",
      Weight: "380g",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
  {
    id: "prod-002",
    dbId: 2,
    slug: "wireless-custom-keyboard",
    sku: "MV-KEY-02",
    category: "Keyboards",
    name: "Aether 75% CNC Aluminum Mechanical Keyboard",
    title: "Aether 75% CNC Aluminum Mechanical Keyboard",
    tagline: "Gasket-mounted 6063 aluminum custom mechanical keyboard with QMK/VIA.",
    description:
      "Gasket-mounted 75% custom mechanical keyboard machined from solid 6063 aluminum billet. Features hot-swappable PCB, QMK/VIA firmware, programmable brass rotary encoder, and PBT double-shot keycaps.",
    priceMon: "62.50",
    priceNumeric: 62.5,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/wireless-custom-keyboard.svg",
    imageAlt: "Aether 75% CNC Aluminum Mechanical Keyboard",
    gallery: [
      "/visuals/products/wireless-custom-keyboard.svg",
      "/visuals/products/mechanical-keypad.svg",
    ],
    stock: 9,
    rating: 4.96,
    reviewCount: 214,
    badge: "TOP RATED",
    specs: [
      { label: "Layout", value: "75% Compact (81 Keys + Knob)" },
      { label: "Case Material", value: "6063 CNC Aluminum + Brass Weight" },
      { label: "Mounting Style", value: "Poron Gasket Mount" },
      { label: "Switches", value: "Pre-lubed Linear Tactile (Hot-Swap)" },
      { label: "Connectivity", value: "USB-C / 2.4GHz / Bluetooth 5.3" },
      { label: "Firmware", value: "Open-Source QMK & VIA" },
    ],
    specsRecord: {
      Layout: "75% Compact (81 Keys + Knob)",
      "Case Material": "6063 CNC Aluminum + Brass Weight",
      "Mounting Style": "Poron Gasket Mount",
      Switches: "Pre-lubed Linear Tactile (Hot-Swap)",
      Connectivity: "USB-C / 2.4GHz / Bluetooth 5.3",
      Firmware: "Open-Source QMK & VIA",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
  {
    id: "prod-003",
    dbId: 3,
    slug: "cold-storage-signer",
    sku: "MV-SEC-03",
    category: "Security",
    name: "VaultAir QR Cold-Storage Hardware Signer",
    title: "VaultAir QR Cold-Storage Hardware Signer",
    tagline: "Air-gapped optical QR hardware wallet with dual EAL6+ secure elements.",
    description:
      "Completely air-gapped hardware wallet and transaction signer with a 2.8-inch gorilla-glass OLED display, EAL6+ dual secure element chips, and optical QR calldata verification for zero-trust EVM signing.",
    priceMon: "54.00",
    priceNumeric: 54.0,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/cold-storage-signer.svg",
    imageAlt: "VaultAir QR Cold-Storage Hardware Signer",
    gallery: [
      "/visuals/products/cold-storage-signer.svg",
      "/visuals/products/usb-hardware-key.svg",
    ],
    stock: 18,
    rating: 4.95,
    reviewCount: 96,
    badge: "ESCROW CHOICE",
    specs: [
      { label: "Security Element", value: "Dual EAL6+ Secure Enclave" },
      { label: "Air-Gap Interface", value: "High-Speed Optical QR Camera" },
      { label: "Display", value: "2.8-inch IPS Touch + Physical Confirm" },
      { label: "EVM Support", value: "EIP-1559, EIP-712 Typed Data, Monad" },
      { label: "Chassis", value: "Unibody Milled Aluminum" },
      { label: "Battery", value: "Removable 1200mAh Li-Ion" },
    ],
    specsRecord: {
      "Security Element": "Dual EAL6+ Secure Enclave",
      "Air-Gap Interface": "High-Speed Optical QR Camera",
      Display: "2.8-inch IPS Touch + Physical Confirm",
      "EVM Support": "EIP-1559, EIP-712 Typed Data, Monad",
      Chassis: "Unibody Milled Aluminum",
      Battery: "Removable 1200mAh Li-Ion",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
  {
    id: "prod-004",
    dbId: 4,
    slug: "thunderbolt-nvme-dock",
    sku: "MV-HW-04",
    category: "Hardware",
    name: "ProStation Thunderbolt 4 NVMe Studio Dock",
    title: "ProStation Thunderbolt 4 NVMe Studio Dock",
    tagline: "12-in-1 40Gbps workstation hub with integrated M.2 NVMe bay and 2.5GbE.",
    description:
      "12-in-1 desktop Thunderbolt 4 workstation dock with integrated tool-free PCIe 4.0 M.2 NVMe enclosure, 2.5Gb Ethernet, UHS-II SD 4.0 card reader, and 96W upstream host power delivery.",
    priceMon: "78.00",
    priceNumeric: 78.0,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/thunderbolt-nvme-dock.svg",
    imageAlt: "ProStation Thunderbolt 4 NVMe Studio Dock",
    gallery: [
      "/visuals/products/thunderbolt-nvme-dock.svg",
      "/visuals/products/wireless-custom-keyboard.svg",
    ],
    stock: 7,
    rating: 4.88,
    reviewCount: 74,
    badge: "PRO HARDWARE",
    specs: [
      { label: "Host Interface", value: "Thunderbolt 4 (40Gbps, 96W PD)" },
      { label: "Internal Storage", value: "M.2 NVMe PCIe 4.0 Slot (Up to 8TB)" },
      { label: "Network", value: "2.5GbE RJ45 Ethernet Port" },
      { label: "Display Output", value: "Dual 4K 60Hz or Single 8K 30Hz" },
      { label: "Card Reader", value: "SD 4.0 UHS-II (312 MB/s)" },
      { label: "Enclosure", value: "Finned Heatsink Extruded Aluminum" },
    ],
    specsRecord: {
      "Host Interface": "Thunderbolt 4 (40Gbps, 96W PD)",
      "Internal Storage": "M.2 NVMe PCIe 4.0 Slot (Up to 8TB)",
      Network: "2.5GbE RJ45 Ethernet Port",
      "Display Output": "Dual 4K 60Hz or Single 8K 30Hz",
      "Card Reader": "SD 4.0 UHS-II (312 MB/s)",
      Enclosure: "Finned Heatsink Extruded Aluminum",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
  {
    id: "prod-005",
    dbId: 5,
    slug: "tactile-macro-keypad",
    sku: "MV-KEY-05",
    category: "Keyboards",
    name: "Tactile 6-Key Studio Macro Pad & Rotary Controller",
    title: "Tactile 6-Key Studio Macro Pad & Rotary Controller",
    tagline: "Six hot-swap mechanical keys plus stepped aluminum rotary dial.",
    description:
      "Compact CNC-milled macro controller with six hot-swappable mechanical switches, high-resolution stepped aluminum rotary encoder, and per-key QMK/VIA layer profiles for creators and developers.",
    priceMon: "24.50",
    priceNumeric: 24.5,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/mechanical-keypad.svg",
    imageAlt: "Tactile 6-Key Studio Macro Pad & Rotary Controller",
    gallery: [
      "/visuals/products/mechanical-keypad.svg",
      "/visuals/products/wireless-custom-keyboard.svg",
    ],
    stock: 22,
    rating: 4.85,
    reviewCount: 163,
    badge: "POPULAR",
    specs: [
      { label: "Keys", value: "6 Hot-Swap Mechanical Switches + Clickable Knob" },
      { label: "Controller", value: "RP2040 ARM Cortex-M0+" },
      { label: "Firmware", value: "QMK / VIA / VIAL Compatible" },
      { label: "Keycaps", value: "PBT Dye-Sublimated DSA Profile" },
      { label: "Interface", value: "Detachable Braided USB-C" },
      { label: "Dimensions", value: "108 × 72 × 31 mm" },
    ],
    specsRecord: {
      Keys: "6 Hot-Swap Mechanical Switches + Clickable Knob",
      Controller: "RP2040 ARM Cortex-M0+",
      Firmware: "QMK / VIA / VIAL Compatible",
      Keycaps: "PBT Dye-Sublimated DSA Profile",
      Interface: "Detachable Braided USB-C",
      Dimensions: "108 × 72 × 31 mm",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
  {
    id: "prod-006",
    dbId: 6,
    slug: "smart-titanium-ring",
    sku: "MV-WEAR-06",
    category: "Wearables",
    name: "ChronoRing Gen-3 Biometric Titanium Smart Ring",
    title: "ChronoRing Gen-3 Biometric Titanium Smart Ring",
    tagline: "Grade-5 titanium biometric ring with HRV, SpO2, NFC, and 7-day battery.",
    description:
      "Featherweight Grade-5 brushed titanium wearable ring with continuous heart-rate variability (HRV), blood oxygen (SpO2), skin temperature tracking, NFC tap-to-auth, and 7-day battery life.",
    priceMon: "49.00",
    priceNumeric: 49.0,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/smart-titanium-ring.svg",
    imageAlt: "ChronoRing Gen-3 Biometric Titanium Smart Ring",
    gallery: [
      "/visuals/products/smart-titanium-ring.svg",
      "/visuals/products/usb-hardware-key.svg",
    ],
    stock: 11,
    rating: 4.81,
    reviewCount: 89,
    badge: "NEW ARRIVAL",
    specs: [
      { label: "Material", value: "DLC-Coated Grade-5 Titanium" },
      { label: "Sensors", value: "Dual-Wavelength PPG, NTC Temp, 3D Accelerometer" },
      { label: "Water Resistance", value: "100m (10 ATM)" },
      { label: "Battery Life", value: "Up to 7 Days + USB-C Charging Dock" },
      { label: "Weight", value: "3.2g" },
      { label: "Connectivity", value: "BLE 5.2 + NFC Secure Element" },
    ],
    specsRecord: {
      Material: "DLC-Coated Grade-5 Titanium",
      Sensors: "Dual-Wavelength PPG, NTC Temp, 3D Accelerometer",
      "Water Resistance": "100m (10 ATM)",
      "Battery Life": "Up to 7 Days + USB-C Charging Dock",
      Weight: "3.2g",
      Connectivity: "BLE 5.2 + NFC Secure Element",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
  {
    id: "prod-007",
    dbId: 7,
    slug: "studio-condenser-mic",
    sku: "MV-AUDIO-07",
    category: "Audio",
    name: "VocalPro XLR & USB-C Broadcast Dynamic Microphone",
    title: "VocalPro XLR & USB-C Broadcast Dynamic Microphone",
    tagline: "Dual XLR/USB-C studio dynamic microphone with 24-bit/96kHz DSP.",
    description:
      "Dual-output broadcast dynamic microphone with built-in ultra-low-noise 24-bit/96kHz DSP preamp, internal shock mount, capacitive mute ring, and cardioid ambient rejection for studio recording.",
    priceMon: "38.00",
    priceNumeric: 38.0,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/studio-condenser-mic.svg",
    imageAlt: "VocalPro XLR & USB-C Broadcast Dynamic Microphone",
    gallery: [
      "/visuals/products/studio-condenser-mic.svg",
      "/visuals/products/studio-headphones.svg",
    ],
    stock: 16,
    rating: 4.89,
    reviewCount: 112,
    badge: "STUDIO PICK",
    specs: [
      { label: "Capsule", value: "Dynamic Neodymium Cardioid" },
      { label: "Outputs", value: "Balanced XLR + USB-C (24-bit / 96kHz)" },
      { label: "Onboard DSP", value: "High-Pass Filter, De-Esser & Limiter" },
      { label: "Sensitivity", value: "-54 dBV/Pa" },
      { label: "Mount", value: "Integrated Swivel Yoke + Weighted Base" },
      { label: "Monitor", value: "Zero-Latency 3.5mm Headphone Out" },
    ],
    specsRecord: {
      Capsule: "Dynamic Neodymium Cardioid",
      Outputs: "Balanced XLR + USB-C (24-bit / 96kHz)",
      "Onboard DSP": "High-Pass Filter, De-Esser & Limiter",
      Sensitivity: "-54 dBV/Pa",
      Mount: "Integrated Swivel Yoke + Weighted Base",
      Monitor: "Zero-Latency 3.5mm Headphone Out",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
  {
    id: "prod-008",
    dbId: 8,
    slug: "vaultkey-security-token",
    sku: "MV-SEC-08",
    category: "Security",
    name: "VaultKey FIDO2 USB-C Hardware Security Key",
    title: "VaultKey FIDO2 USB-C Hardware Security Key",
    tagline: "Tamper-resistant FIDO2/WebAuthn & SSH hardware security token.",
    description:
      "Tamper-resistant FIDO2/WebAuthn and SSH hardware authentication token with capacitive gold touch pads, waterproof epoxy-sealed internals, and resident passkey storage.",
    priceMon: "15.00",
    priceNumeric: 15.0,
    sellerName: DEMO_SELLER.name,
    sellerAddress: DEMO_SELLER.address,
    imageSrc: "/visuals/products/usb-hardware-key.svg",
    imageAlt: "VaultKey FIDO2 USB-C Hardware Security Key",
    gallery: [
      "/visuals/products/usb-hardware-key.svg",
      "/visuals/products/cold-storage-signer.svg",
    ],
    stock: 31,
    rating: 4.94,
    reviewCount: 245,
    badge: "ESSENTIAL",
    specs: [
      { label: "Protocols", value: "FIDO2 / WebAuthn, U2F, OpenPGP, PIV, OATH-TOTP" },
      { label: "Connector", value: "Reversible USB-C with Capacitive Touch" },
      { label: "Crypto", value: "ECC P-256, Ed25519, RSA-4096" },
      { label: "Durability", value: "IP68 Waterproof & Crush-Resistant" },
      { label: "Origin", value: "Hardware Attested Firmware" },
      { label: "Weight", value: "4.5g" },
    ],
    specsRecord: {
      Protocols: "FIDO2 / WebAuthn, U2F, OpenPGP, PIV, OATH-TOTP",
      Connector: "Reversible USB-C with Capacitive Touch",
      Crypto: "ECC P-256, Ed25519, RSA-4096",
      Durability: "IP68 Waterproof & Crush-Resistant",
      Origin: "Hardware Attested Firmware",
      Weight: "4.5g",
    },
    dispatchNote: "Protected by MonVaultEscrow until delivery confirmation.",
    reviewWindowMinutes: 5,
  },
];

export function getProductBySlug(slug: string): DemoProduct | undefined {
  return demoProducts.find((product) => product.slug === slug);
}

export function getDefaultProduct(): DemoProduct {
  return demoProducts[0];
}
