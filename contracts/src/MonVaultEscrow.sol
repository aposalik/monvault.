// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract MonVaultEscrow {
    enum Status {
        NONE,
        PAID,
        SHIPPED,
        COMPLETED,
        DISPUTED
    }

    struct Order {
        bytes32 orderRef;
        address buyer;
        address seller;
        uint256 amount;
        uint256 reviewEndsAt;
        Status status;
    }

    error InvalidPayment();
    error InvalidSeller();
    error InvalidOrderReference();
    error DuplicateOrderReference();
    error OrderNotFound();
    error UnauthorizedBuyer();
    error UnauthorizedSeller();
    error InvalidOrderStatus(Status expected, Status actual);
    error DisputeNotAllowed(Status actual);
    error ReviewWindowActive(uint256 reviewEndsAt);
    error ReviewWindowClosed(uint256 reviewEndsAt);
    error TransferFailed();
    error ReentrantCall();

    event OrderPaid(
        uint256 indexed orderId,
        bytes32 indexed orderRef,
        address indexed buyer,
        address seller,
        uint256 amount
    );
    event OrderShipped(uint256 indexed orderId, address indexed seller, uint256 reviewEndsAt);
    event DeliveryConfirmed(uint256 indexed orderId, address indexed buyer);
    event DisputeOpened(uint256 indexed orderId, address indexed buyer);
    event SellerClaimedAfterTimeout(uint256 indexed orderId, address indexed seller);

    uint256 public constant REVIEW_WINDOW = 5 minutes;

    uint256 private _nextOrderId = 1;
    bool private _entered;

    mapping(uint256 orderId => Order order) private _orders;
    mapping(bytes32 orderRef => bool used) private _usedOrderRefs;

    modifier nonReentrant() {
        if (_entered) revert ReentrantCall();
        _entered = true;
        _;
        _entered = false;
    }

    function createOrder(bytes32 orderRef, address seller)
        external
        payable
        returns (uint256 orderId)
    {
        if (msg.value == 0) revert InvalidPayment();
        if (seller == address(0)) revert InvalidSeller();
        if (orderRef == bytes32(0)) revert InvalidOrderReference();
        if (_usedOrderRefs[orderRef]) revert DuplicateOrderReference();

        orderId = _nextOrderId++;
        _usedOrderRefs[orderRef] = true;
        _orders[orderId] = Order({
            orderRef: orderRef,
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            reviewEndsAt: 0,
            status: Status.PAID
        });

        emit OrderPaid(orderId, orderRef, msg.sender, seller, msg.value);
    }

    function markShipped(uint256 orderId) external {
        Order storage order = _requireOrder(orderId);
        if (msg.sender != order.seller) revert UnauthorizedSeller();
        if (order.status != Status.PAID) {
            revert InvalidOrderStatus(Status.PAID, order.status);
        }

        order.status = Status.SHIPPED;
        order.reviewEndsAt = block.timestamp + REVIEW_WINDOW;

        emit OrderShipped(orderId, msg.sender, order.reviewEndsAt);
    }

    function confirmDelivery(uint256 orderId) external nonReentrant {
        Order storage order = _requireOrder(orderId);
        if (msg.sender != order.buyer) revert UnauthorizedBuyer();
        if (order.status != Status.SHIPPED) {
            revert InvalidOrderStatus(Status.SHIPPED, order.status);
        }

        _completeAndPay(order);

        emit DeliveryConfirmed(orderId, msg.sender);
    }

    function openDispute(uint256 orderId) external {
        Order storage order = _requireOrder(orderId);
        if (msg.sender != order.buyer) revert UnauthorizedBuyer();

        if (order.status == Status.SHIPPED) {
            if (block.timestamp >= order.reviewEndsAt) {
                revert ReviewWindowClosed(order.reviewEndsAt);
            }
        } else if (order.status != Status.PAID) {
            revert DisputeNotAllowed(order.status);
        }

        order.status = Status.DISPUTED;

        emit DisputeOpened(orderId, msg.sender);
    }

    function claimAfterTimeout(uint256 orderId) external nonReentrant {
        Order storage order = _requireOrder(orderId);
        if (msg.sender != order.seller) revert UnauthorizedSeller();
        if (order.status != Status.SHIPPED) {
            revert InvalidOrderStatus(Status.SHIPPED, order.status);
        }
        if (block.timestamp < order.reviewEndsAt) {
            revert ReviewWindowActive(order.reviewEndsAt);
        }

        _completeAndPay(order);

        emit SellerClaimedAfterTimeout(orderId, msg.sender);
    }

    function getOrder(uint256 orderId)
        external
        view
        returns (
            bytes32 orderRef,
            address buyer,
            address seller,
            uint256 amount,
            uint256 reviewEndsAt,
            Status status
        )
    {
        Order storage order = _requireOrder(orderId);

        return (
            order.orderRef,
            order.buyer,
            order.seller,
            order.amount,
            order.reviewEndsAt,
            order.status
        );
    }

    function _requireOrder(uint256 orderId) private view returns (Order storage order) {
        order = _orders[orderId];
        if (order.status == Status.NONE) revert OrderNotFound();
    }

    function _completeAndPay(Order storage order) private {
        order.status = Status.COMPLETED;

        (bool success,) = payable(order.seller).call{ value: order.amount }("");
        if (!success) revert TransferFailed();
    }
}
