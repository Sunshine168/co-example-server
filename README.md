# co-example-server by egg

a simple chat room application.

[online](http://139.199.152.83:7001/) 

  [font- mobx+react+react-routerv4+socket.io+styled-components+flow](https://github.com/Sunshine168/co-example-font)
 [server](https://github.com/Sunshine168/co-example-server)

test 
account:123456789@qq.com password:123123123

account:12345678@qq.com password:123123123



## preview

![](http://orscxqn8h.bkt.clouddn.com/18-3-11/57831346.jpg)
![](http://orscxqn8h.bkt.clouddn.com/18-3-12/38365908.jpg)
![](http://orscxqn8h.bkt.clouddn.com/18-3-11/90578656.jpg)
![](http://orscxqn8h.bkt.clouddn.com/18-3-11/18045408.jpg)


## egg skill
### basic cover

* [x] controller
* [x] service
* [x] model
* [x] plugin
* [x] extend
* [x] logger 
* [ ] validate params
* [ ] test


###  Advanced

* [x] middleware --check(not)Login and spa redirect
* [x] socket.io
* [x] custom plugin --[egg-mongolass](https://github.com/Sunshine168/egg-mongolass)
* [x] deploy
* [ ] err-handler


### dev or deploy 

ensure node eng > 8.9
redis and mango db  are installed

```git clone https://github.com/Sunshine168/co-example-server.git```

and run

```npm install``` or ```yarn install```

#### **before run!!**
 create count  schema in mongodb ,and insert 
 
 ```js
 {
        _id: 'room',
        sequenceValue: 1000,
 }
 ```   
 
 or in **dev** mode ,use postman or other utils to post
 
 ```host:port/helper/init-counter```
 
 eg: ```http://localhost:7001/helper/ini-counter```

#### deploy

```npm run dev // or yarn dev``` default run in 7001 port

#### prod

``` npm run start --env=prod //or yarn start --env=prod ``` default run in 7001 port



