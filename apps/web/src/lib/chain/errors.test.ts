import { describe, expect, it } from "vitest";

import { isMissingOrderError, normalizeChainError } from "./errors";

describe("normalizeChainError", () => {
  it("maps a wallet rejection without claiming a transaction exists", () => {
    expect(normalizeChainError({ code: 4001 })).toBe(
      "The wallet request was cancelled. No transaction was submitted.",
    );
  });

  it("maps known contract custom errors", () => {
    expect(
      normalizeChainError({
        cause: { data: { errorName: "DuplicateOrderReference" } },
      }),
    ).toBe("This order reference has already been used.");
  });

  it("uses a concise viem message when available", () => {
    expect(normalizeChainError({ shortMessage: "HTTP request failed." })).toBe(
      "HTTP request failed.",
    );
  });

  it("returns a safe fallback for unknown errors", () => {
    expect(normalizeChainError(new Error("secret internal detail"))).toBe(
      "The wallet or Monad RPC could not complete this request. No success was recorded.",
    );
  });
});

describe("isMissingOrderError", () => {
  it("finds OrderNotFound through nested causes", () => {
    expect(
      isMissingOrderError({
        cause: { cause: { data: { errorName: "OrderNotFound" } } },
      }),
    ).toBe(true);
  });

  it("does not classify unrelated failures as missing orders", () => {
    expect(isMissingOrderError({ data: { errorName: "UnauthorizedBuyer" } })).toBe(false);
  });
});
