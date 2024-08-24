// SPDX-License-Identifier: MIT

// pragma solidity 0.8.8;
pragma solidity ^0.8.0; //代表使用大于0.8.0版本也可以

// pragma solidity >=0.8.0 <0.9.0;

/*
    EVM - Etherum Virtual Machine 以太坊虚拟机
    可以部署在任何适配solidity的平台上，如：Avalanche, Fantom, Polygon
*/

contract SimpleStorage {
    /*  
        boolean, uint, int, address, bytes
        属性变量会自动识别成storage，堆变量 
    */
    bool hasFavouriteNumer = true;
    int8 favouriteNumber2 = -100; //可赋值负数
    string favouriteNumberInText = "ten";
    address myAddress = 0xD0c47728Dc490a4485709CA76F12d23cf842AA87;
    bytes32 myBytes = "cat";
    //===================================================================
    uint256 favouriteNumber; //不指定分配空间，默认使用256;默认值0
    People person = People(2, "nick"); //单个People object
    uint256[] numArray; //Array uint256
    People[] public peopleArray; //如果不输入大小，默认动态大小
    mapping(string => uint256) public nameToNum; //map KV
    //===================================================================

    //Constructor 构造器
    struct People {
        uint256 favouriteNumber;
        string name;
    }

    /*  
        memory, calldata代表值只临时保存
        calldata是函数调用栈，标志着函数参数没有使用指针引用，所以不能被修改
        storage代表永久
        ----------------------------------------------------------------
        string算是特殊结构byte[]，但uint不是，所以不用指定memory
    */
    function addPerson(string memory _name, uint _favouriteNumber) public {
        //    //通过生成对象再放进array
        //    People memory newPerson = People({favouriteNumber:_favouriteNumber, name:_name});
        //    peopleArray.push(newPerson);

        //直接放进array
        peopleArray.push(People(_favouriteNumber, _name));
        //赋值mapping
        nameToNum[_name] = _favouriteNumber;
    }

    //保存Number
    function storeNum(uint256 _favouriteNumber) public virtual {
        favouriteNumber = _favouriteNumber;
    }

    /*  
        view pure 不消耗gas
        当一个需要消耗gas的function调用了view/pure方法才会消耗对应的gas
    */
    function getNum() public view returns (uint256) {
        return favouriteNumber;
    }

    //view pure 不消耗gas
    // function add() public pure returns (uint256){
    //     return (1+2);
    // }
}
