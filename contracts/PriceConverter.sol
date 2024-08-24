// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/*
    可以理解成工具类
*/
library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //ABI
        //ConversionRate    0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        // Sepolia ETH / USD Address
        // https://docs.chain.link/data-feeds/price-feeds/addresses#Sepolia%20Testnet
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        // );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // ETH in terms of USD
        //3000.00000000
        //这里会获取到后面有8位小数的0，需要补齐到18位
        return uint256(price * 1e10);
    }

    //转化数字再对比
    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}
