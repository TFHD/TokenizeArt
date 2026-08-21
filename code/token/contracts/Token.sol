// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SabarthoNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId = 1;
    string private _baseTokenURI = "ipfs://bafybeif7pcyhivbgxeu4gtmy3fdkocq2ra7fayzxmtvlkqhpjwqh7iycoe/";

    constructor() ERC721("42 Sabartho NFT", "SBNFT") Ownable(msg.sender) {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}