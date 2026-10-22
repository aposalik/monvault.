// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { ProofCartEscrow } from "../src/ProofCartEscrow.sol";

interface Vm {
    function deal(address account, uint256 balance) external;
    function warp(uint256 newTimestamp) external;
}

contract UserActor {
    function createOrder(ProofCartEscrow escrow, bytes32 orderRef, address seller)
        external
        payable
        returns (uint256 orderId)
    {
        return escrow.createOrder{ value: msg.value }(orderRef, seller);
    }

    function markShipped(ProofCartEscrow escrow, uint256 orderId) external {
        escrow.markShipped(orderId);
    }

    function confirmDelivery(ProofCartEscrow escrow, uint256 orderId) external {
        escrow.confirmDelivery(orderId);
    }

    function openDispute(ProofCartEscrow escrow, uint256 orderId) external {
        escrow.openDispute(orderId);
    }

    function claimAfterTimeout(ProofCartEscrow escrow, uint256 orderId) external {
        escrow.claimAfterTimeout(orderId);
    }

    receive() external payable { }
}

contract ReentrantSeller {
    ProofCartEscrow private _escrow;
    uint256 private _orderId;
    bool private _attack;

    bool public reentrySucceeded;

    function configure(ProofCartEscrow escrow, uint256 orderId) external {
        _escrow = escrow;
        _orderId = orderId;
    }

    function markShipped() external {
        _escrow.markShipped(_orderId);
    }

    function claimAfterTimeout() external {
        _attack = true;
        _escrow.claimAfterTimeout(_orderId);
        _attack = false;
    }

    receive() external payable {
        if (_attack) {
            (reentrySucceeded,) = address(_escrow)
                .call(abi.encodeCall(ProofCartEscrow.claimAfterTimeout, (_orderId)));
        }
    }
}

contract ProofCartEscrowTest {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    address private constant SELLER_ADDRESS = address(0xBEEF);
    bytes32 private constant ORDER_REF = keccak256("private-order-001");

    ProofCartEscrow private escrow;
    UserActor private buyer;
    UserActor private seller;
    UserActor private stranger;

    function setUp() public {
        escrow = new ProofCartEscrow();
        buyer = new UserActor();
        seller = new UserActor();
        stranger = new UserActor();
        vm.deal(address(this), 100 ether);
        vm.warp(1_000_000);
    }

    function testCreateOrderLocksBuyerPayment() public {
        buyer.createOrder{ value: 1 ether }(escrow, ORDER_REF, SELLER_ADDRESS);

        require(address(escrow).balance == 1 ether, "escrow should hold the payment");
    }

    function testCreateOrderStoresPaidOrderAndReturnsSequentialIds() public {
        uint256 firstOrderId =
            buyer.createOrder{ value: 1 ether }(escrow, ORDER_REF, SELLER_ADDRESS);
        uint256 secondOrderId = buyer.createOrder{ value: 2 ether }(
            escrow, keccak256("private-order-002"), SELLER_ADDRESS
        );

        require(firstOrderId == 1, "first order ID should be 1");
        require(secondOrderId == 2, "order IDs should increment");

        (
            bytes32 storedRef,
            address storedBuyer,
            address storedSeller,
            uint256 storedAmount,
            uint256 reviewEndsAt,
            ProofCartEscrow.Status status
        ) = escrow.getOrder(firstOrderId);

        require(storedRef == ORDER_REF, "order reference should match");
        require(storedBuyer == address(buyer), "buyer should be transaction caller");
        require(storedSeller == SELLER_ADDRESS, "seller should match checkout seller");
        require(storedAmount == 1 ether, "amount should match deposited MON");
        require(reviewEndsAt == 0, "review timer should not start before shipping");
        require(status == ProofCartEscrow.Status.PAID, "new order should be paid");
    }

    function testCreateOrderRejectsZeroPayment() public {
        (bool success,) = address(buyer)
            .call(abi.encodeCall(UserActor.createOrder, (escrow, ORDER_REF, SELLER_ADDRESS)));

        require(!success, "zero-value order should revert");
    }

    function testCreateOrderRejectsInvalidSeller() public {
        (bool success,) = address(buyer).call{ value: 1 ether }(
            abi.encodeCall(UserActor.createOrder, (escrow, ORDER_REF, address(0)))
        );

        require(!success, "zero-address seller should revert");
    }

    function testCreateOrderRejectsDuplicateOrderReference() public {
        buyer.createOrder{ value: 1 ether }(escrow, ORDER_REF, SELLER_ADDRESS);

        (bool success,) = address(buyer).call{ value: 1 ether }(
            abi.encodeCall(UserActor.createOrder, (escrow, ORDER_REF, SELLER_ADDRESS))
        );

        require(!success, "duplicate private-order reference should revert");
    }

    function testSellerMarksOrderShippedAndStartsFiveMinuteReviewWindow() public {
        uint256 orderId = _createOrder(address(seller));

        seller.markShipped(escrow, orderId);

        (,,,, uint256 reviewEndsAt, ProofCartEscrow.Status status) = escrow.getOrder(orderId);
        require(status == ProofCartEscrow.Status.SHIPPED, "order should be shipped");
        require(reviewEndsAt == block.timestamp + 5 minutes, "review window should be five minutes");
    }

    function testNonSellerCannotMarkOrderShipped() public {
        uint256 orderId = _createOrder(address(seller));

        (bool success,) =
            address(buyer).call(abi.encodeCall(UserActor.markShipped, (escrow, orderId)));

        require(!success, "only the recorded seller may mark shipped");
    }

    function testOrderCannotBeMarkedShippedTwice() public {
        uint256 orderId = _createOrder(address(seller));
        seller.markShipped(escrow, orderId);

        (bool success,) =
            address(seller).call(abi.encodeCall(UserActor.markShipped, (escrow, orderId)));

        require(!success, "shipped order cannot be shipped twice");
    }

    function testBuyerConfirmsDeliveryAndPaysSeller() public {
        uint256 orderId = _createShippedOrder(address(seller));
        uint256 sellerBalanceBefore = address(seller).balance;

        buyer.confirmDelivery(escrow, orderId);

        (,,,,, ProofCartEscrow.Status status) = escrow.getOrder(orderId);
        require(status == ProofCartEscrow.Status.COMPLETED, "order should be completed");
        require(address(escrow).balance == 0, "escrow should release payment");
        require(address(seller).balance == sellerBalanceBefore + 1 ether, "seller should be paid");
    }

    function testNonBuyerCannotConfirmDelivery() public {
        uint256 orderId = _createShippedOrder(address(seller));

        (bool success,) =
            address(stranger).call(abi.encodeCall(UserActor.confirmDelivery, (escrow, orderId)));

        require(!success, "only buyer may confirm delivery");
    }

    function testBuyerCannotConfirmBeforeShipment() public {
        uint256 orderId = _createOrder(address(seller));

        (bool success,) =
            address(buyer).call(abi.encodeCall(UserActor.confirmDelivery, (escrow, orderId)));

        require(!success, "paid order cannot be confirmed before shipping");
    }

    function testBuyerCanDisputePaidOrderBeforeShipping() public {
        uint256 orderId = _createOrder(address(seller));

        buyer.openDispute(escrow, orderId);

        (,,,,, ProofCartEscrow.Status status) = escrow.getOrder(orderId);
        require(status == ProofCartEscrow.Status.DISPUTED, "paid order should become disputed");
        require(address(escrow).balance == 1 ether, "dispute should keep funds locked");
    }

    function testBuyerCanDisputeShippedOrderAndBlockTimeoutClaim() public {
        uint256 orderId = _createShippedOrder(address(seller));
        buyer.openDispute(escrow, orderId);
        vm.warp(block.timestamp + 5 minutes);

        (bool success,) =
            address(seller).call(abi.encodeCall(UserActor.claimAfterTimeout, (escrow, orderId)));

        require(!success, "disputed order cannot be claimed");
        require(address(escrow).balance == 1 ether, "disputed funds should stay locked");
    }

    function testSellerCannotClaimBeforeTimeout() public {
        uint256 orderId = _createShippedOrder(address(seller));

        (bool success,) =
            address(seller).call(abi.encodeCall(UserActor.claimAfterTimeout, (escrow, orderId)));

        require(!success, "seller must wait for review window");
    }

    function testSellerClaimsAfterTimeout() public {
        uint256 orderId = _createShippedOrder(address(seller));
        uint256 sellerBalanceBefore = address(seller).balance;
        vm.warp(block.timestamp + 5 minutes);

        seller.claimAfterTimeout(escrow, orderId);

        (,,,,, ProofCartEscrow.Status status) = escrow.getOrder(orderId);
        require(status == ProofCartEscrow.Status.COMPLETED, "claimed order should complete");
        require(address(escrow).balance == 0, "escrow should release timeout payment");
        require(address(seller).balance == sellerBalanceBefore + 1 ether, "seller should be paid");
    }

    function testNonSellerCannotClaimAfterTimeout() public {
        uint256 orderId = _createShippedOrder(address(seller));
        vm.warp(block.timestamp + 5 minutes);

        (bool success,) =
            address(stranger).call(abi.encodeCall(UserActor.claimAfterTimeout, (escrow, orderId)));

        require(!success, "only seller may claim after timeout");
    }

    function testBuyerCannotOpenDisputeAfterReviewWindow() public {
        uint256 orderId = _createShippedOrder(address(seller));
        vm.warp(block.timestamp + 5 minutes);

        (bool success,) =
            address(buyer).call(abi.encodeCall(UserActor.openDispute, (escrow, orderId)));

        require(!success, "buyer must dispute before review window closes");
    }

    function testTimeoutPayoutRejectsReentrantSecondClaim() public {
        ReentrantSeller maliciousSeller = new ReentrantSeller();
        uint256 orderId = _createOrder(address(maliciousSeller));
        maliciousSeller.configure(escrow, orderId);
        maliciousSeller.markShipped();
        vm.warp(block.timestamp + 5 minutes);

        maliciousSeller.claimAfterTimeout();

        require(!maliciousSeller.reentrySucceeded(), "reentrant claim should fail");
        require(address(maliciousSeller).balance == 1 ether, "seller should receive payment once");
        require(address(escrow).balance == 0, "escrow should not retain completed payment");
    }

    function _createOrder(address sellerAddress) private returns (uint256 orderId) {
        return buyer.createOrder{ value: 1 ether }(escrow, ORDER_REF, sellerAddress);
    }

    function _createShippedOrder(address sellerAddress) private returns (uint256 orderId) {
        orderId = _createOrder(sellerAddress);
        seller.markShipped(escrow, orderId);
    }
}
