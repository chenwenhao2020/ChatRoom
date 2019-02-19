var http = require('http');
var fs = require('fs');
var ws = require('socket.io');

var server = http.createServer(function(req, res){
    // //每一个用户连接进来之后做的初始化处理
    // console.log('有新用户连接进来了');
    var html = fs.readFileSync('./index.html');//同步读取文件内容

    res.end(html);
});//创建web服务器实例

server.listen('3000');

//创建Socket服务器
var user = 0;
var io = ws(server);//创建一个socket服务实例

io.on('connection', function(obj){
    //连接进入socket之后 要做事情
    user++;
    console.log(`当前聊天室用户为${user}个`);

    io.emit('userJoin', user);//客户端加入聊天室,传送user至客户端显示

    //用户断开连接
    obj.on('disconnect', function(){
        user--;
        io.emit('userQuit', user);
        // console.log(`有用户退出聊天室, 当前聊天室用户为${user}个`);
    })

    // var clientIp = obj.request.connection.remoteAddress;//获取客户端IP
    // console.log(clientIp)

    obj.on('message', function(mes){
        //对监听到的客户端消息进行处理
        io.emit('message', mes);//主动触发message事件
        
        // io.emit('userIp', clientIp);//发送客户端IP
    })
})


