pragma solidity ^0.4.24;

contract TopArt {
  address public owner;
  constructor() public {
    owner = msg.sender;
  }
	
  event Set(
    string _message
  );

  struct Data {
    uint id;
    string name;
    string thumbnail;
    string link;
    string description;
    uint upvotes;
    address addr;
  }  

  mapping (uint => Data) dataItems;
	
  bool vip = false; 

  uint public counter = 1;

  function add(string name, string thumbnail, string link, string description) public {
    uint upvotes = 0;
    address addr = msg.sender;
    Data memory data = Data(counter, name, thumbnail, link, description, upvotes, addr);
    data.id = counter;
    data.name = name;
    data.thumbnail = thumbnail;
    data.link = link;
    data.description = description;
    data.upvotes = upvotes;
    data.addr = addr;
    dataItems[counter] = data;
    counter++;
    emit Set("Data pushed successfully!");
  }

  function addVip(string name, string thumbnail, string link, string description) public payable {
    require(msg.value == 1 ether, "Amount should be equal to 1 Ether");
    owner.transfer(1 ether);
    vip = true;
    uint upvotes = 0;
    address addr = msg.sender;
    Data memory data = Data(0, name, thumbnail, link, description, upvotes, addr);
    data.id = 0;
    data.name = name;
    data.thumbnail = thumbnail;
    data.link = link;
    data.description = description;
    data.upvotes = upvotes;
    data.addr = addr;
    dataItems[0] = data;
    emit Set("Data pushed successfully!");
  }

  function getName(uint id) public view returns (string) {
    return (dataItems[id].name);
  }

  function getThumbnail(uint id) public view returns (string) {
    return (dataItems[id].thumbnail);
  }

  function getLink(uint id) public view returns (string) {
    return (dataItems[id].link);
  }

  function getDescription(uint id) public view returns (string) {
    return (dataItems[id].description);
  }

  function getUpvotes(uint id) public view returns (uint) {
    return (dataItems[id].upvotes);
  }

  function getAddress(uint id) public view returns (address) {
    return (dataItems[id].addr);
  }

  function getVip() public view returns (bool) {
    return vip;
  }

  function like(uint id) public returns (uint) {
    dataItems[id].upvotes++;
    return dataItems[id].upvotes;
  } 
}