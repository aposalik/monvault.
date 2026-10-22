export type DemoProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceMon: string;
  sellerName: string;
};

export const demoProducts: DemoProduct[] = [
  {
    id: "headphones-001",
    slug: "studio-headphones",
    name: "Studio Headphones",
    description: "A demo product used to show monvault.'s delivery-protected checkout.",
    priceMon: "1",
    sellerName: "monvault. Demo Shop",
  },
];
