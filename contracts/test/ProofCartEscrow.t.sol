// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { ProofCartEscrow } from "../src/ProofCartEscrow.sol";

interface IProofCartEscrow {
    function createOrder(bytes32 orderRef, address seller) external payable returns (uint256 orderId);
}

contract ProofCartEscrowTest {
    address private constant SELLER = address(0xBEEF);

    function testCreateOrderLocksBuyerPayment() public {
        ProofCartEscrow escrow = new ProofCartEscrow();

        (bool success, ) = address(escrow).call{ value: 1 ether }(
            abi.encodeCall(IProofCartEscrow.createOrder, (keccak256("order-001"), SELLER))
        );

        require(success, "createOrder should accept buyer payment");
        require(address(escrow).balance == 1 ether, "escrow should hold the payment");
    }
}
