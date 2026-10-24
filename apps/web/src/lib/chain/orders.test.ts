import { describe, expect, it } from "vitest";
import { getAddress, type Address, type Hex } from "viem";

import { getOrderPermissions, normalizeContractOrder, normalizeOrderStatus } from "./orders";

const buyer = getAddress("0x351debA8041a4359399c5aF0e11F8E66ed300492");
const seller = getAddress("0xc9280175a35A5D3c0B1e7D377eBEf758C71CD754");
const stranger = getAddress("0x28adB09F8Fa95Eb9Af0705F5c7Bc4bfc8F2625ba");
const orderRef =
  "0xd0af8cf291f6ddb7eaa6f912221fc878baac3bbca3f8355f2976924f291c2892" as Hex;

function order(status: number, reviewEndsAt = 0n) {
  return normalizeContractOrder(1n, [
    orderRef,
    buyer,
    seller,
    1_000_000_000_000_000_000n,
    reviewEndsAt,
    status,
  ]);
}

describe("normalizeOrderStatus", () => {
  it.each([
    [1, "paid"],
    [2, "shipped"],
    [3, "completed"],
    [4, "disputed"],
  ] as const)("maps %i to %s", (value, expected) => {
    expect(normalizeOrderStatus(value)).toBe(expected);
  });

  it("rejects NONE and unknown enum values", () => {
    expect(() => normalizeOrderStatus(0)).toThrow("Unsupported");
    expect(() => normalizeOrderStatus(5)).toThrow("Unsupported");
  });
});

describe("normalizeContractOrder", () => {
  it("normalizes the proven Phase 3 paid order", () => {
    expect(order(1)).toEqual({
      id: 1n,
      orderRef,
      buyer,
      seller,
      amountWei: 1_000_000_000_000_000_000n,
      reviewEndsAt: null,
      status: "paid",
    });
  });

  it("converts a non-zero review deadline to a number", () => {
    expect(order(2, 1_792_822_400n).reviewEndsAt).toBe(1_792_822_400);
  });

  it("rejects invalid IDs and zero escrow values", () => {
    expect(() =>
      normalizeContractOrder(0n, [orderRef, buyer, seller, 1n, 0n, 1]),
    ).toThrow("greater than zero");
    expect(() =>
      normalizeContractOrder(1n, [orderRef, buyer, seller, 0n, 0n, 1]),
    ).toThrow("greater than zero");
  });
});

describe("getOrderPermissions", () => {
  const permissions = (status: number, account: Address | undefined, deadline = 0n, now = 100) =>
    getOrderPermissions(order(status, deadline), account, now);

  it("allows only the seller to ship a paid order", () => {
    expect(permissions(1, seller).canMarkShipped).toBe(true);
    expect(permissions(1, buyer).canMarkShipped).toBe(false);
  });

  it("allows the buyer to dispute a paid order", () => {
    expect(permissions(1, buyer).canOpenDispute).toBe(true);
    expect(permissions(1, stranger).canOpenDispute).toBe(false);
  });

  it("allows buyer confirmation while shipped", () => {
    expect(permissions(2, buyer, 200n).canConfirmDelivery).toBe(true);
    expect(permissions(2, seller, 200n).canConfirmDelivery).toBe(false);
  });

  it("closes buyer dispute and opens seller claim exactly at the deadline", () => {
    expect(permissions(2, buyer, 100n, 99).canOpenDispute).toBe(true);
    expect(permissions(2, buyer, 100n, 100).canOpenDispute).toBe(false);
    expect(permissions(2, seller, 100n, 99).canClaimAfterTimeout).toBe(false);
    expect(permissions(2, seller, 100n, 100).canClaimAfterTimeout).toBe(true);
  });

  it("allows no actions in terminal states", () => {
    for (const status of [3, 4]) {
      expect(permissions(status, buyer, 200n)).toEqual({
        canMarkShipped: false,
        canConfirmDelivery: false,
        canOpenDispute: false,
        canClaimAfterTimeout: false,
      });
    }
  });
});
