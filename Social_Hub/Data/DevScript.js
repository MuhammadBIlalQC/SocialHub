/*
    Small script to test out functionality
*/


const database = require('./Database');
const User = require('./Entities/User');
const Message = require('./Entities/Message');


const listOfDummyUsers = ['DummyUser1', 'DummyUser2', 'd3', 'd4', 'd5', 'd6'];

async function resetDummies()
{
    for (var i = 0; i < listOfDummyUsers.length; i++) {
        await database.deleteUser(listOfDummyUsers[i]);
    }
    for (var i = 0; i < listOfDummyUsers.length; i++) {
        await database.addUser(listOfDummyUsers[i], 'abc123');
    }

    var d3 = await database.getUser('d3').catch(err => console.log('error'));
    var d4 = await database.getUser('d4').catch(err => console.log('error'));
    var d5 = await database.getUser('d5').catch(err => console.log('error'));
    var d6 = await database.getUser('d6').catch(err => console.log('error'));

    d3.sendFriendRequest(d4);
    d3.sendFriendRequest(d5);
    d3.sendFriendRequest(d6);

    d4.acceptFriendRequest(d3);
    d5.acceptFriendRequest(d3);
    d6.acceptFriendRequest(d3);

    database.saveUser(d3);
    database.saveUser(d4);
    database.saveUser(d5);
    database.saveUser(d6);

}

async function test()
{
    var user = await database.getUser('d3').catch(err => console.log('error'));
    var friendUser = await database.getUser('d4').catch(err => console.log('error'));
    user = User.MakeUserInstance(user);
    friendUser = User.MakeUserInstance(friendUser);
    user.sendFriendRequest(friendUser);
    friendUser.acceptFriendRequest(user);
    console.log(friendUser);
    console.log(user);
}


async function test2()
{
    //const user = new User('example', 'mypw');
    //console.log(user);
    //console.log('isPassword: ' + user.isPassword('mypw'));
    //database.addUser('example', 'mypw');
    const user = await database.getUser('example');
    console.log(user.isPassword('mypw3'));
}


//database.postMessage('d3', 'd4', 'Hello d4');
//database.getMessages('d3', 'd4').then(res => console.log(res));
resetDummies();

//var users = database.getAllUsers().then(users => console.log(users)).catch(e => console.log('error has occurred'));

