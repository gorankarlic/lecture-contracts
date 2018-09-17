pragma solidity ^0.4.25;

/**
 * Voting contract.
 *
 * Any address can place a yes/no vote.
 */
contract Voting
{
    /**
     * Number of Yes vs. No votes.
     */
    int public count;

    /**
     * Indicates if a voter has voted.
     */
    mapping(address => bool) public voted;

    /**
     * Initializes the contract.
     */
    constructor() public
    {
    }

    /**
     * Counts the number of Yes vs. No votes.
     *
     * @return the number of Yes vs. No votes.
     */
    function count() public view returns(int) 
    {
        return count;
    }

    /**
     * Submits a vote.
     *
     * @param yes the Yes or No vote.
     */
    function vote(bool yes) public
    {
        require(voted[msg.sender] != true);
        voted[msg.sender] = true;
        if(yes)
        {
            count++;
        }
        else
        {
            count--;
        }
    }
}