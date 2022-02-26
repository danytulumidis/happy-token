//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract HappyToken {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    string private name;
    string private symbol;
    uint256 private totalSupplyContract;
    uint256 private maxSupply;
    address private owner;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(string memory _name, string memory _symbol, uint256 _maxSupply) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        maxSupply = _maxSupply;

        _mint(msg.sender, 10 * 10 ** 18);
    }

    // Custom Methods

    function _mint(address _account, uint256 _amount) private {
        require(_account != address(0), "Address is 0!");

        totalSupplyContract += _amount;
        balances[_account] += _amount;

        emit Transfer(address(0), _account, _amount);
    }

    // ERC20 Standard

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] < _value, "You dont have enough Tokens!");

        emit Transfer(address(0), _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_from != address(0), "From address is a 0 address!");
        require(_to != address(0), "To address is a 0 address!");
        require(totalSupplyContract + _value <= maxSupply, "Exceeds Contracts Max Token Supply of 100 Tokens!");

        balances[_from] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        address approvedOwner = msg.sender;
        _approve(approvedOwner, _spender, _value);

        return true;
    }

    function _approve(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal {
        require(_owner != address(0), "ERC20: approve from the zero address");
        require(_spender != address(0), "ERC20: approve to the zero address");

        _allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return _allowances[_owner][_spender];
    }

    function totalSupply() public view returns (uint256) {
        return totalSupplyContract;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function getAccountBalance(address account) public view returns (uint256) {
        return balances[account];
    }
}