pragma solidity ^0.4.24;

contract TopArt {
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

  function getName(uint id) public view returns (string) {
    return (dataItems[id].name);
  }

  function getThumbnail(uint id) public view returns (string) {
    return (dataItems[id].thumbnail);
  }

  function getLink(uint id) public view returns (string) {
    return (dataItems[id].link);
  }

  function getCounter() public view returns (uint) {
    return counter;
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

  function like(uint id) public returns (uint) {
    dataItems[id].upvotes++;
    return dataItems[id].upvotes;
  } 

}