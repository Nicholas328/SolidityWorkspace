// SPDX-License-Identifier: MIT
//pragma
pragma solidity ^0.8.0;
//import
import "./PriceConverter.sol";
//error codes
error FundMe__NotOwner();

//Interfact, Libraries, Contracts

/**
 * @title A contract crow funded
 * @author Nicholas Chen
 * @notice This contract is to demo a sample funding contract
 * @dev The implements price feeds as our Libary
 */
contract FundMe {
    //Type Declarations
    using PriceConverter for uint256;

    //State variables
    uint256 public constant MINIMUM_USD = 1 * 10 ** 18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface private s_priceFeed;
    /**
     * immutable变量值在编译时就已经决定，所以在运行时无需像普通对象一样
     * 对其进行存储和读写操作(减少gas)
     */
    address private immutable i_owner;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @notice This function funds the contract
     * @dev This implements price feed as our Libary
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        ); // 1e18 == 1*10*18 == 1000000000000000000
        s_funders.push(msg.sender); //Put address into array
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        //重置mapping
        for (uint256 index = 0; index < s_funders.length; index++) {
            address funder = s_funders[index];
            s_addressToAmountFunded[funder] = 0;
        }
        //Reset the array
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_addressToAmountFunded[funder] = 0;
        }
        //Reset the array
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
