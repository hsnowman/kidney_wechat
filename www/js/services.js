angular.module('kidney.services', ['ionic','ngResource'])

// 本地存储函数
.factory('Storage', ['$window', function ($window) {
  return {
    set: function(key, value) {
      $window.localStorage.setItem(key, value);
    },
    get: function(key) {
      return $window.localStorage.getItem(key);
    },
    rm: function(key) {
      $window.localStorage.removeItem(key);
    },
    clear: function() {
      $window.localStorage.clear();
    }
  };
}])
.constant('CONFIG', {
    crossKey:'fe7b9ba069b80316653274e4',
    appKey: 'cf32b94444c4eaacef86903e',
    baseUrl: 'http://121.43.107.106:4050/',
    cameraOptions: {
        cam: {
            quality: 60,
            destinationType: 1,
            sourceType: 1,
            allowEdit: true,
            encodingType: 0,
            targetWidth: 1000,
            targetHeight: 1000,
            popoverOptions: false,
            saveToPhotoAlbum: false
        },
        gallery: {
            quality: 60,
            destinationType: 1,
            sourceType: 0,
            allowEdit: true,
            encodingType: 0,
            targetWidth: 1000,
            targetHeight: 1000
        }
    }
})

//自定义函数
//登录
.service("loginFactory",function(Storage){
  var service={};
  var flag=false;
  var userid;//用户ID
  
  this.isLogin=function(user,pwd){
    //账户写死
    if(user=="13709553333"&&pwd=="123") 
    {
      userid="D201703240001";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(user=="13709553334"&&pwd=="123") 
    {
      userid="D201703240002";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(user=="18868800021"&&pwd=="123") 
    {
      userid="D201703240091";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(user=="18868800022"&&pwd=="123") 
    {
      userid="D201703240092";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(window.jmessage)
    {
        window.JMessage.login(user, user,
        function(response) {
            window.JMessage.username = user
            //gotoConversation();
        },
        function(err) {
            console.log(err);
            // JM.register($scope.useruserID, $scope.passwd);
        });
    }
    return flag;
  }
  
  //return service;
})

//media文件操作 XJZ
.factory('fs',['$q','$cordovaFile','$filter',function($q,$cordovaFile,$filter){
    return {
        mvMedia:function(type,fileName,ext){
            return $q(function(resolve, reject) {
                if(type=='voice') var path=cordova.file.externalRootDirectory;
                else if(type=='image') var path=cordova.file.externalCacheDirectory;
                else reject("type must be voice or image");
                var time=new Date();
                var newName= $filter('date')(time,'yyyyMMddHHmmss')+ext;
                $cordovaFile.moveFile(path, fileName, cordova.file.dataDirectory,newName)
                  .then(function (success) {
                    // console.log(success);
                    resolve(success.nativeURL);
                  }, function (error) {
                    console.log(error);
                    reject(error);
                  });
              });
        }
    }

}])
//voice recorder XJZ
.factory('voice', ['$filter', '$q', '$ionicLoading', '$cordovaFile', 'CONFIG', 'Storage', 'fs', function($filter, $q, $ionicLoading, $cordovaFile, CONFIG, Storage, fs) {
    //funtion audio(){};
    var audio = {};
    audio.src = '';
    audio.media = {};

    audio.record = function(receiver, onSuccess, onError) {
        return $q(function(resolve, reject) {
            if (audio.media.src) audio.media.release();
            var time = new Date();
            audio.src = $filter('date')(time, 'yyyyMMddHHmmss') + '.amr';
            audio.media = new Media(audio.src,
                function() {
                    console.info("recordAudio():Audio Success");
                    console.log(audio.media);
                    $ionicLoading.hide();

                    fs.mvMedia('voice', audio.src, '.amr')
                        .then(function(fileUrl) {
                            console.log(fileUrl);
                            resolve(fileUrl);
                            // window.JMessage.sendSingleVoiceMessage(receiver, fileUrl, CONFIG.appKey,
                            //     function(res) {
                            //         resolve(res);
                            //     },
                            //     function(err) {
                            //         reject(err)
                            //     });
                            // resolve(fileUrl.substr(fileUrl.lastIndexOf('/')+1));
                        }, function(err) {
                            console.log(err);
                            reject(err);
                        });
                },
                function(err) {
                    console.error("recordAudio():Audio Error");
                    console.log(err);
                    reject(err);
                });
            audio.media.startRecord();
            $ionicLoading.show({ template: '开始说话',noBackdrop:true});
        });
    }
    audio.stopRec = function() {
        audio.media.stopRecord();
    }
    audio.open = function(fileUrl) {
        if(audio.media.src)audio.media.release();
        return $q(function(resolve, reject) {
            audio.media = new Media(fileUrl,
                function(success) {
                    resolve(audio.media)
                },
                function(err) {
                    reject(err);
                })
        });

    }
    audio.play = function(src) {
        audio.media.play();
    }
    audio.stop = function() {
        audio.media.stop();
    }
    audio.sendAudio = function(fileUrl, receiver) {
        // return $q(function(resolve, reject) {
        window.JMessage.sendSingleVoiceMessage(receiver, cordova.file.externalRootDirectory + fileUrl, CONFIG.appKey,
            function(response) {
                console.log("audio.send():OK");
                console.log(response);
                //$ionicLoading.show({ template: 'audio.send():[OK] '+response,duration:1500});
                // resolve(response);
            },
            function(err) {
                //$ionicLoading.show({ template: 'audio.send():[failed] '+err,duration:1500});
                console.log("audio.send():failed");
                console.log(err);
                // reject(err);
            });
        // });
    }
    return audio;
}])

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 'user001',
        name: 'user001',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 'user002',
        name: 'user002',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 'user003',
        name: 'user003',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 'user004',
        name: 'user004',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 'user005',
        name: 'user005',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})
//jmessage XJZ
.factory('JM', ['Storage','$q','Doctor', function(Storage,$q,Doctor) {
    var ConversationList = [];
    var messageLIsts = {};
    function pGen(u){
        return md5(u,"kidney").substr(4,10);
    }

    function checkIsLogin() {
        return $q(function(resolve,reject){
            window.JMessage.getMyInfo(function(response) {
                console.log("user is login" + response);
                var myInfo = JSON.parse(response);
                window.JMessage.username = myInfo.userName;
                // window.JMessage.nickname = myInfo.nickname;
                // window.JMessage.gender = myInfo.mGender;
                // usernameForConversation = myInfo.userName;
                resolve(myInfo.userName);
            }, function(response) {

                console.log("User is not login.");
                window.JMessage.username = "";
                window.JMessage.nickname = "";
                window.JMessage.gender = "unknown";
                reject('not login')
            });
        });
        // console.log("checkIsLogin...");
        
    }

    // function getPushRegistrationID() {
    //     try {
    //         window.JPush.getRegistrationID(onGetRegistrationID);
    //         if (device.platform != "Android") {
    //             window.JPush.setDebugModeFromIos();
    //             window.JPush.setApplicationIconBadgeNumber(0);
    //         } else {
    //             window.JPush.setDebugMode(true);
    //         }
    //     } catch (exception) {
    //         console.log(exception);
    //     }
    // }

    // function updateUserInfo() {
    //     window.JMessage.getMyInfo(
    //         function(response) {
    //             var myInfo = JSON.parse(response);
    //             console.log("user is login" + response);
    //             window.JMessage.username = myInfo.userName;
    //             window.JMessage.nickname = myInfo.nickname;
    //             window.JMessage.gender = myInfo.mGender;
    //             $('#myInfoUsername').val(myInfo.userName);
    //             $('#myInfoNickname').val(myInfo.nickname);
    //             $('#myInfoGender').val(myInfo.gender);
    //         }, null);
    // }

    // function getUserDisplayName() {
    //     if (window.JMessage.nickname.length == 0) {
    //         return window.JMessage.username;
    //     } else {
    //         return window.JMessage.nickname;
    //     }
    // }

    function login(user,nick) {
        return $q(function(resolve,reject){
            Doctor.getDoctorInfo({userId:user})
            .then(function(data){
                console.log(user);
                console.log(pGen(user));
                if(window.JMessage){
                    window.JMessage.login(user, pGen(user),
                        function(response) {
                            window.JMessage.updateMyInfo('nickname',data.results.name);
                            window.JMessage.nickname = data.results.name;
                            window.JMessage.username = user;
                            resolve(user);
                        }, function(err){
                            console.log(err);
                            register(user,data.results.name);
                            // reject(err);
                        });


                }
            },function(err){
                reject(err);
            })
            

            // console.log(ionic.Platform)
            // console.log(ionic.Platform.platforms[0]=="browser")
            // if(ionic.Platform.platforms[0]!="browser")
            // if(window.JMessage){
            //     window.JMessage.login(user, pGen(user),
            //         function(response) {
            //             window.JMessage.updateMyInfo('nickname',nick)
            //             window.JMessage.nickname = nick;
            //             window.JMessage.username = user;
            //             resolve(user);
            //         }, function(err){
            //             console.log(err);
            //             register(user,nick);
            //             // reject(err);
            //         });


            // }

        });
    }

    function register(user,nick) {
        return $q(function(resolve,reject){
            window.JMessage.register(user, pGen(user),
                function(response) {
                    window.JMessage.login(user, pGen(user),
                    function(response) {
                        window.JMessage.updateMyInfo('nickname',nick)
                        window.JMessage.username = user;
                        window.JMessage.nickname = nick;
                        resolve(user);
                    }, function(err){
                        console.log(err);
                        reject(err);
                    });
                    // console.log("login callback success" + response);
                    // resolve(user);
                },
                function(response) {
                    console.log("login callback fail" + response);
                    reject(response)
                }
            );
        });
        
    }
    // nickname：昵称。
    // birthday：生日。
    // signature：个性签名。
    // gender：性别。
    // region：地区。
    // function updateMyInfo(field,value){
    //     window.JMessage.updateMyInfo(field,value,null,null)
    // }
    // function updateConversationList() {
    //     $('#conversationList').empty().listview('refresh');
    //     console.log("updateConversationList");
    //     window.JMessage.getConversationList(
    //         function(response) {
    //             conversationList = JSON.parse(response);
    //         },
    //         function(response) {
    //             alert("Get conversation list failed.");
    //             console.log(response);
    //         });
    // }

    // function onReceiveMessage(message) {
    //     console.log("onReceiveSingleMessage");
    //     if (device.platform == "Android") {
    //         message = window.JMessage.message;
    //         console.log(JSON.stringify(message));
    //     }
    //     // messageArray.unshift(message);
    //     //refreshConversation();
    // }
    // function getMessageHistory(username) {
    //     $('#messageList').empty().listview('refresh');
    //     //读取的是从 0 开始的 50 条聊天记录，可按实现需求传不同的值。
    //     window.JMessage.getHistoryMessages("single", username,
    //         '', 0, 50, function (response) {
    //             console.log("getMessageHistory ok: " + response);
    //             messageArray = JSON.parse(response);
    //             refreshConversation();
    //         }, function (response) {
    //             alert("getMessageHistory failed");
    //             console.log("getMessageHistory fail" + response);
    //         }
    //     );
    // }
    // function sendMessage() {
    //     var messageContentString = $("#messageContent").val();
    //     window.JMessage.sendSingleTextMessage(
    //         usernameForConversation, messageContentString, null,
    //         function (response) {
    //             var msg = JSON.parse(response);
    //             messageArray.unshift(msg);
    //             refreshConversation();
    //         }, function (response) {
    //             console.log("send message fail" + response);
    //             alert("send message fail" + response);
    //         });
    // }
    function onGetRegistrationID(response) {
        console.log("registrationID is " + response);
        Storage.set('jid', response);
        //$("#registrationId").html(response);
    }

    function getPushRegistrationID() {
        try {
            window.JPush.getRegistrationID(onGetRegistrationID);
            if (device.platform != "Android") {
                window.JPush.setDebugModeFromIos();
                window.JPush.setApplicationIconBadgeNumber(0);
            } else {
                window.JPush.setDebugMode(true);
            }
        } catch (exception) {
            console.log(exception);
        }
    }

    function onOpenNotification(event) {
        console.log("index onOpenNotification");
        try {
            var alertContent;
            if (device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            alert("open Notification:" + alertContent);
        } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
        }
    }

    function onReceiveNotification(event) {
        console.log("index onReceiveNotification");
        try {
            var alertContent;
            if (device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            $("#notificationResult").html(alertContent);
        } catch (exception) {
            console.log(exception)
        }
    }

    function onReceivePushMessage(event) {
        try {
            var message;
            if (device.platform == "Android") {
                message = event.message;
            } else {
                message = event.content;
            }
            console.log(message);
            $("#messageResult").html(message);
        } catch (exception) {
            console.log("JPushPlugin:onReceivePushMessage-->" + exception);
        }
    }

    // function onSetTagsWithAlias(event) {
    //     try {
    //         console.log("onSetTagsWithAlias");
    //         var result = "result code:" + event.resultCode + " ";
    //         result += "tags:" + event.tags + " ";
    //         result += "alias:" + event.alias + " ";
    //         $("#tagAliasResult").html(result);
    //     } catch (exception) {
    //         console.log(exception)
    //     }
    // }

    // function setTagWithAlias() {
    //     try {
    //         var username = $("#loginUsername").val();
    //         var tag1 = $("#tagText1").val();
    //         var tag2 = $("#tagText2").val();
    //         var tag3 = $("#tagText3").val();
    //         var alias = $("#aliasText").val();
    //         var dd = [];
    //         if (tag1 != "") {
    //             dd.push(tag1);
    //         }
    //         if (tag2 != "") {
    //             dd.push(tag2);
    //         }
    //         if (tag3 != "") {
    //             dd.push(tag3);
    //         }
    //         window.JPush.setTagsWithAlias(dd, alias);
    //     } catch (exception) {
    //         console.log(exception);
    //     }
    // }
    function newGroup(name,des,members,type){
        return $q(function(resolve,reject){
            window.JMessage.createGroup('abcde','fg','',
            // window.JMessage.createGroup(name,des,
                function(data){
                    console.log(data);
                    // members=$rootScope.newMember;
                    var idStr=[];
                    for(var i in members) idStr.push(members[i].userId);
                    idStr.join(',');
                    // window.JMessage.addGroupMembers(groupId,idStr,
                    window.JMessage.addGroupMembers('22818577','user004,',
                        function(data){
                            console.log(data);
                            upload();
                        },function(err){
                            $ionicLoading.show({ template: '失败addGroupMembers', duration: 1500 });
                            console.log(err);
                        })
                },function(err){
                    $ionicLoading.show({ template: '失败createGroup', duration: 1500 });
                    console.log(err);
                })
        })
    }
    function sendCustom(type,toUser,key,data){
        return $q(function(resolve,reject){
            if(type='single'){
                window.JMessage.sendSingleCustomMessage(toUser,data,key,
                    function(data){
                        resolve(data);
                    },function(err){
                        reject(err);
                    });
            }else if(type='group'){
                window.JMessage.sendGroupCustomMessage(toUser,data,key,
                    function(data){
                        resolve(data);
                    },function(err){
                        reject(err);
                    });
            }else{
                reject('wrong type')
            }
        })
    }
    function sendContact(type,toUser,data){
        return $q(function(resolve,reject){
            if(type='single'){
                window.JMessage.sendSingleCustomMessage(toUser,data,key,
                    function(data){
                        resolve(data);
                    },function(err){
                        reject(err);
                    });
            }else if(type='group'){
                window.JMessage.sendGroupCustomMessage(toUser,data,key,
                    function(data){
                        resolve(data);
                    },function(err){
                        reject(err);
                    });
            }else{
                reject('wrong type')
            }
        })
    }
    function sendEndl(type,toUser,data){
        return $q(function(resolve,reject){
            if(type='single'){
                window.JMessage.sendSingleCustomMessage(toUser,data,key,
                    function(data){
                        resolve(data);
                    },function(err){
                        reject(err);
                    });
            }else if(type='group'){
                window.JMessage.sendGroupCustomMessage(toUser,data,key,
                    function(data){
                        resolve(data);
                    },function(err){
                        reject(err);
                    });
            }else{
                reject('wrong type')
            }
        })
    }
    return {
        init: function() {
            window.JPush.init();
            // checkIsLogin()
            // .then(function(data){

            // },function(err){
            //     if(Storage.get('UID')) login(Storage.get('UID'));
            // })
            getPushRegistrationID();
            // document.addEventListener("jmessage.onReceiveMessage", onReceiveMessage, false);
            // document.addEventListener("deviceready", onDeviceReady, false);
            // document.addEventListener("jpush.setTagsWithAlias",
            //     onSetTagsWithAlias, false);
            // document.addEventListener("jpush.openNotification",
            //     onOpenNotification, false);
            // document.addEventListener("jpush.receiveNotification",
            //     onReceiveNotification, false);
            // document.addEventListener("jpush.receiveMessage",
            //     onReceivePushMessage, false);
        },
        login:login,
        sendCustom:sendCustom,
        newGroup:newGroup,
        register: register,
        pGen:pGen,
        checkIsLogin: checkIsLogin,
        getPushRegistrationID: getPushRegistrationID,
    }
}])
//获取图片，拍照or相册，见CONFIG.cameraOptions。return promise。xjz
.factory('Camera', ['$q','$cordovaCamera','CONFIG','fs',function($q,$cordovaCamera,CONFIG,fs) { 
  return {
    getPicture: function(type){
        return $q(function(resolve, reject) {
            $cordovaCamera.getPicture(CONFIG.cameraOptions[type]).then(function(imageUrl) {
              // file manipulation
              var tail=imageUrl.lastIndexOf('?');
              if(tail!=-1) var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1,tail);
              else var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1);
              fs.mvMedia('image',fileName,'.jpg')
              .then(function(res){
                console.log(res);
                //res: file URL
                resolve(res);
              },function(err){
                console.log(err);
                reject(err);
              })
          }, function(err) {
            console.log(err);
              reject('fail to get image');
          });
      })
    }
  }
}])

.factory('Data',['$resource', '$q','$interval' ,'CONFIG' , function($resource,$q,$interval ,CONFIG){
    var serve={};
    var abort = $q.defer();

    var Dict = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'dict'},{
            getDiseaseType:{method:'GET', params:{route: 'typeTWO'}, timeout: 100000},
            getDistrict:{method:'GET', params:{route: 'district'}, timeout: 100000},
            getHospital:{method:'GET', params:{route: 'hospital'}, timeout: 100000}
        });
    };

    var Task1 = function(){
        return $resource(CONFIG.baseUrl + ':path',{path:'tasks'},{
            getTask:{method:'GET', params:{}, timeout: 100000}
        });
    };

    var Task2 = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'tasks'},{
            changeTaskstatus:{method:'GET', params:{route: 'status'}, timeout: 100000},
            changeTasktime:{method:'GET', params:{route: 'time'}, timeout: 100000}
        });
    };

    var Compliance = function(){
        return $resource(CONFIG.baseUrl + ':path',{path:'compliance'},{
            postcompliance:{method:'POST', params:{}, timeout: 100000},
            getcompliance:{method:'GET', params:{}, timeout: 100000}
        });
    };

    var Counsel = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'counsel'},{
            getCounsel:{method:'GET', params:{route: 'getCounsels'}, timeout: 100000},
            questionaire:{method:'POST', params:{route: 'questionaire'}, timeout: 100000}
        });
    };

    var Patient =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'patient'},{
            getPatientDetail:{method:'GET', params:{route: 'getPatientDetail'}, timeout: 100000},
            getMyDoctors:{method:'GET',params:{route:'getMyDoctors'},timeout:10000},
            getDoctorLists:{method:'GET',params:{route:'getDoctorLists'},timeout:10000},
            getCounselRecords:{method:'GET',params:{route:'getCounselRecords'},timeout:10000},
            insertDiagnosis:{method:'POST',params:{route:'insertDiagnosis'},timeout:10000},
            newPatientDetail:{method:'POST',params:{route:'newPatientDetail'},timeout:10000},
            editPatientDetail:{method:'POST',params:{route:'editPatientDetail'},timeout:10000}
        });
    }

    var Doctor =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'doctor'},{
            postDocBasic:{method:'POST', params:{route: 'postDocBasic'}, timeout: 100000},
            getPatientList:{method:'GET', params:{route: 'getPatientList'}, timeout: 100000},
            getDoctorInfo:{method:'GET', params:{route: 'getDoctorInfo'}, timeout: 100000},
            getMyGroupList:{method:'GET', params:{route: 'getMyGroupList'}, timeout: 100000},
            getGroupPatientList:{method:'GET', params:{route: 'getGroupPatientList'}, timeout: 100000},
            getRecentDoctorList:{method:'GET', params:{route: 'getRecentDoctorList'}, timeout: 100000},
            editDoctorDetail:{method:'POST',params:{route:'editDoctorDetail'},timeout:10000}
        });
    }

    var User = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'user'},{
            register:{method:'POST', params:{route: 'register',phoneNo:'@phoneNo',password:'@password',role:'@role'}, timeout: 100000},
            changePassword:{method:'POST', params:{route: 'reset',phoneNo:'@phoneNo',password:'@password'}, timeout: 100000},
            logIn:{method:'POST', params:{route: 'login'}, timeout: 100000},
            logOut:{method:'POST', params:{route: 'logout',userId:'@userId'}, timeout: 100000},
            getUserId:{method:'GET', params:{route: 'getUserID',phoneNo:'@phoneNo'}, timeout: 100000},
            sendSMS:{method:'POST', params:{route: 'sendSMS',mobile:'@mobile',smsType:'@smsType'}, timeout: 100000},//第一次验证码发送成功返回结果为”User doesn't exist“，如果再次发送才返回”验证码成功发送“
            verifySMS:{method:'GET', params:{route: 'verifySMS',mobile:'@mobile',smsType:'@smsType',smsCode:'@smsCode'}, timeout: 100000},

        });
    }

    var Health = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'healthInfo'},{
            createHealth:{method:'POST', params:{route: 'insertHealthInfo',userId:'@userId',type:'@type',time:'@time',url:'@url',label:'@label',description:'@description',comments:'@comments'}, timeout: 100000},
            modifyHealth:{method:'POST', params:{route:'modifyHealthDetail',userId:'@userId',type:'@type',time:'@time',url:'@url',label:'@label',description:'@description',comments:'@comments',insertTime:'@insertTime'},timeout:100000},
            getHealthDetail:{method:'GET', params:{route:'getHealthDetail',userId:'@userId',insertTime:'@insertTime'},timeout:100000},
            getAllHealths:{method:'GET', params:{route:'getAllHealthInfo',userId:'@userId'},timeout:100000},
            deleteHealth:{method:'POST', params:{route:'deleteHealthDetail',userId:'@userId',insertTime:'@insertTime'},timeout:100000}

        });
    }

    var Comment =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'comment'},{
            getComments:{method:'GET', params:{route: 'getComments'}, timeout: 100000}
        });
    }

    var VitalSign =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'vitalSign'},{
            getVitalSigns:{method:'GET', params:{route: 'getVitalSigns'}, timeout: 100000}
        });
    }

    var Account =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'account'},{
            getAccountInfo:{method:'GET', params:{route: 'getAccountInfo'}, timeout: 100000}
        });
    }

    var Message =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'message'},{
            getMessages:{method:'GET', params:{route: 'getMessages'}, timeout: 100000}
        });
    }

    var Communication =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'communication'},{
            getCounselReport:{method:'GET', params:{route: 'getCounselReport'}, timeout: 100000},
            getTeam:{method:'GET', params:{route: 'getTeam'}, timeout: 100000},
            newConsultation:{method:'POST', params:{route: 'newConsultation'}, timeout: 100000},
            newTeam:{method:'POST', params:{route: 'newTeam'}, timeout: 100000},
            insertMember:{method:'POST', params:{route: 'insertMember'}, timeout: 100000},
            removeMember:{method:'POST', params:{route: 'removeMember'}, timeout: 100000}
        });
    }

    serve.abort = function ($scope) {
        abort.resolve();
        $interval(function () {
            abort = $q.defer();
            serve.Dict = Dict();
            serve.Task1 = Task1();
            serve.Task2 = Task2();
            serve.Compliance = Compliance();
            serve.Counsel = Counsel();
            serve.Patient = Patient();
            serve.Doctor = Doctor();
            serve.Health = Health();
            serve.Comment = Comment();
            serve.VitalSign = VitalSign();
            serve.Account = Account();
            serve.Message = Message();
            serve.Communication = Communication();
            serve.User = User();
        }, 0, 1);
    };
    serve.Dict = Dict();
    serve.Task1 = Task1();
    serve.Task2 = Task2();
    serve.Compliance = Compliance();
    serve.Counsel = Counsel();
    serve.Patient = Patient();
    serve.Doctor = Doctor();
    serve.Health = Health();
    serve.Comment = Comment();
    serve.VitalSign = VitalSign();
    serve.Account = Account();
    serve.Message = Message();
    serve.Communication = Communication();
    serve.User = User();
    return serve;
}])
.factory('Dict', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            //  category:'patient_class'
           // }
    self.getDiseaseType = function(params){
        var deferred = $q.defer();
        Data.Dict.getDiseaseType(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  level:'3',//1获取省份，2获取城市，3获取区县
            //  province:"33", //定位到某个具体省份时需要输入
            //  city:'01',  //定位到某个具体城市时需要输入
            //  district:'02' //定位到某个具体区县时需要输入
           // }
    self.getDistrict = function(params){
        var deferred = $q.defer();
        Data.Dict.getDistrict(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  locationCode:'330103',//输入全部为空时获取全部医院信息，需要定位到某个具体地区时需要输入locationCode，定位到某个具体医院时需要输入hospitalCode
            //  hostipalCode:"001"
           // }
    self.getHospital = function(params){
        var deferred = $q.defer();
        Data.Dict.getHospital(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    return self;
}])
.factory('Task', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            //  userId:'U201704050002',//usderId="Admin"，sortNo为空时获取系统全部任务模板，sortNo="1"时获取指定任务模板，userId为用户ID时获取指定用户的任务信息
            //  sortNo:'1'
           // }
    self.getTask = function(params){
        var deferred = $q.defer();
        Data.Task1.getTask(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  userId:'U201704050002',//unique
            //  sortNo:1,
            //  type:'Measure',
            //  code:'BloodPressure',
            //  status:'0'
           // }
    self.changeTaskstatus = function(params){
        var deferred = $q.defer();
        Data.Task2.changeTaskstatus(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  userId:'U201704050002',//unique
            //  sortNo:1,
            //  type:'Measure',
            //  code:'BloodPressure',
            //  startTime:'2017-12-12'
           // }
    self.changeTasktime = function(params){
        var deferred = $q.defer();
        Data.Task2.changeTasktime(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Compliance', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            // "userId": "U201704050002",
            // "type": "Measure",
            // "code": "Weight",
            // "date": "2017-12-13",
            // "status": 0,
            // "description": ""
           // }
    self.postcompliance = function(params){
        var deferred = $q.defer();
        Data.Compliance.postcompliance(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  userId:'U201704050002',//date为空时获取指定用户的全部任务执行记录，date不为空时获取指定用户某一天的任务执行记录
            //  date:'2017-12-13'
           // }
    self.getcompliance = function(params){
        var deferred = $q.defer();
        Data.Compliance.getcompliance(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Communication', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{
            //      teamId:'teampost2',
            //      name:'id1',
            //      sponsorId:'id'
            //      sponsorName:'DOCname'
            //      description:''
            //  }
    self.newTeam = function(params){
        var deferred = $q.defer();
        Data.Communication.newTeam(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{counselId:'counsel01'}
    self.getCounselReport = function(params){
        var deferred = $q.defer();
        Data.Communication.getCounselReport(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{teamId:'team1'}
    self.getTeam = function(params){
        var deferred = $q.defer();
        Data.Communication.getTeam(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //      teamId:'teampost2',
            //      membersuserId:'id1',
            //      membersname:'name2'
            //  }
    self.insertMember = function(params){
        var deferred = $q.defer();
        Data.Communication.insertMember(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //      teamId:'teampost2',
            //      membersuserId:'id2'
            //  }
    self.removeMember = function(params){
        var deferred = $q.defer();
        Data.Communication.removeMember(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.newConsultation = function(params){
        var deferred = $q.defer();
        Data.Communication.newConsultation(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    return self;
}])
.factory('User', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
        // phoneNo:"18768113669",
        // password:"123456",
        // role:"patient"
        //}
        //000
    self.register = function(params){
        var deferred = $q.defer();
        Data.User.register(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    //params->{
        // phoneNo:"18768113669",
        // password:"123",
        //}
        //001
    self.changePassword = function(params){
        var deferred = $q.defer();
        Data.User.changePassword(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        // username:"18768113669",
        // password:"123456",
        // role:"patient"
        //}
        //002
    self.logIn = function(params){
        var deferred = $q.defer();
        Data.User.logIn(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }


    //params->{userId:"U201704010002"}
    //003
    self.logOut = function(params){
        var deferred = $q.defer();
        Data.User.logOut(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{phoneNo:"18768113668"}
    //004
    self.getUserId = function(params){
        var deferred = $q.defer();
        Data.User.getUserId(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        //mobile:"18768113660",
        //smsType:1}
    //005
    self.sendSMS = function(params){
        var deferred = $q.defer();
        Data.User.sendSMS(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        //mobile:"18868186038",
        //smsType:1
        //smsCode:234523}
    //006
    self.verifySMS = function(params){
        var deferred = $q.defer();
        Data.User.verifySMS(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }


    
    return self;
}])

.factory('Health', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            //  userId:'U201704010003',//unique
            //  type:1,
            //  time:'2014/02/22 11:03:37',
            //  url:'c:/wf/img.jpg',
            //  label:'abc',
            //  description:'wf',
            //  comments:''
           // }
    self.createHealth = function(params){
        var deferred = $q.defer();
        Data.Health.createHealth(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
        // userId:"U201704010003",
        //}
        //011
    self.getAllHealths = function(params){
        var deferred = $q.defer();
        Data.Health.getAllHealths(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    //params->{
        // userId:"U201704010003",
        // insertTime:"2017-04-11T05:43:36.965Z",
        //}
        //012
    self.getHealthDetail = function(params){
        var deferred = $q.defer();
        Data.Health.getHealthDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    //params->{
        // userId:"U201704010003",
        // insertTime:"2017-04-11T05:43:36.965Z",
        // type:3,
        // time:"2014/02/22",
        // url:"c:/wf/img.jpg",
        // description:"修改晕厥入院，在医院住了3天，双侧颈动脉无异常搏动，双侧颈静脉怒张，肝颈静脉回流征阳性，气管居中，甲状腺不肿大，未触及结节无压痛、震颤，上下均为闻及血管杂音。",
        // }
        //014
    self.modifyHealth = function(params){
    var deferred = $q.defer();
        Data.Health.modifyHealth(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        // userId:"U201704010003",
        // insertTime:"2017-04-11T05:43:36.965Z",
        //}
        //015
    self. deleteHealth = function(params){
        var deferred = $q.defer();
        Data.Health. deleteHealth(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    return self;
}])
.factory('Message', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{type:1}
    self.getMessages = function(params){
        var deferred = $q.defer();
        Data.Message.getMessages(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Account', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'p01'}
    self.getAccountInfo = function(params){
        var deferred = $q.defer();
        Data.Account.getAccountInfo(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('VitalSign', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'p01',type:'type1'}
    self.getVitalSigns = function(params){
        var deferred = $q.defer();
        Data.VitalSign.getVitalSigns(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Comment', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'doc01'}
    self.getComments = function(params){
        var deferred = $q.defer();
        Data.Comment.getComments(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Patient', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'p01'}
    self.getPatientDetail = function(params){
        var deferred = $q.defer();
        Data.Patient.getPatientDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{userId:'p01'}
    self.getMyDoctors = function(params){
        var deferred = $q.defer();
        Data.Patient.getMyDoctors(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{workUnit:'浙江省人民医院'}
    //        1:{workUnit:'浙江省人民医院',name:'医生01'}
    self.getDoctorLists = function(params){
        var deferred = $q.defer();
        Data.Patient.getDoctorLists(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{userId:'p01'}
    self.getCounselRecords = function(params){
        var deferred = $q.defer();
        Data.Patient.getCounselRecords(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //     patientId:'ppost01',
            //     doctorId:'doc01',
            //     diagname:'慢性肾炎',
            //     diagtime:'2017-04-06',
            //     diagprogress:'吃药',
            //     diagcontent:'blabla啥啥啥的'
            // }
    self.insertDiagnosis = function(params){
        var deferred = $q.defer();
        Data.Patient.insertDiagnosis(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //     userId:'ppost01',
            //     name:'患者xx',
            //     birthday:'1987-03-25',
            //     gender:2,
            //     IDNo:123456123456781234,
            //     height:183,
            //     weight:70,
            //     bloodType:2,
            //     class:'class1',
            //     class_info:'info_1',
            //     operationTime:'2017-04-05',
            //     hypertension:1,
            //     photoUrl:'http://photo/ppost01.jpg'
            // }
    self.newPatientDetail = function(params){
        var deferred = $q.defer();
        Data.Patient.newPatientDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
                // userId:'ppost01',
                // name:'新名字2',
                // birthday:1987-03-03,
                // gender:1,
                // IDNo:123456123456781234,
                // height:183,
                // weight:70,
                // bloodType:2,
                // class:'class1',
                // class_info:'info3',
                // hypertension:1,
                // photoUrl:'http://photo/ppost01.jpg'
            // }
    self.editPatientDetail = function(params){
        var deferred = $q.defer();
        Data.Patient.editPatientDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    return self;
}])
.factory('Doctor', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{
           //   userId:'docpostTest',//unique
           //   name:'姓名',
           //   birthday:'1956-05-22',
           //   gender:1,
           //   workUnit:'浙江省人民医院',
           //   department:'肾内科',
           //   title:'副主任医师',
           //   major:'慢性肾炎',
           //   description:'经验丰富',
           //   photoUrl:'http://photo/docpost3.jpg',
           //   charge1:150,
           //   charge2:50
           // }
    self.postDocBasic = function(params){
        var deferred = $q.defer();
        Data.Doctor.postDocBasic(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
       //   userId:'doc01'
       // }
    self.getPatientList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getPatientList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
       //   userId:'doc01'
       // }
    self.getRecentDoctorList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getRecentDoctorList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    
    //params->0:{
           //   userId:'doc01'
           // }
    self.getDoctorInfo = function(params){
        var deferred = $q.defer();
        Data.Doctor.getDoctorInfo(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->0:{
           //   userId:'doc01'
           // }
    self.getMyGroupList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getMyGroupList(
            params,
            function(data, headers){

                deferred.resolve(data.results);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
           //   userId:'doc01'
           // }
    self.getRecentDoctorList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getRecentDoctorList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };



    //params->0:{
           //   teamId:'team1',
           //   status:1
           // }
    self.getGroupPatientList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getGroupPatientList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.editDoctorDetail = function(params){
        var deferred = $q.defer();
        Data.Doctor.editDoctorDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
  
    return self;
}])
.factory('Counsel', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'doc01',status:1}
    //        1:{userId:'doc01'}
    //        2:{userId:'doc01',type:1}
    //        3:{userId:'doc01',status:1,type:1}
    self.getCounsels = function(params){
        var deferred = $q.defer();
        Data.Counsel.getCounsel(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->0:{
    //              counselId:'counselpost02',
    //              patientId:'p01',
    //              doctorId:'doc01',
    //              sickTime:'3天',
    //              symptom:'腹痛',
    //              symptomPhotoUrl:'http://photo/symptom1',
    //              help:'帮助'
    //          }
    self.questionaire = function(params){
        var deferred = $q.defer();
        Data.Counsel.questionaire(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('QRScan', ['$cordovaBarcodeScanner', '$ionicLoading', '$q', function($cordovaBarcodeScanner, $ionicLoading, $q) {
    return {
        getCode: function() {
            return $q(function(resolve, reject) {
                $cordovaBarcodeScanner
                .scan()
                .then(function(data) {
                    // Success! Barcode data is here
                    // var s = "Result: " + data.text + "<br/>" +
                    // "Format: " + data.format + "<br/>" +
                    // "Cancelled: " + data.cancelled;
                    if (data.cancelled != true) {
                        //返回code
                        resolve(data.text);
                    } else {
                        $ionicLoading.show({ template: '请重试', duration: 1500 });
                        reject('cancel');
                    }
                }, function(error) {
                    $ionicLoading.show({ template: '请重试', duration: 1500 });
                    reject('fail');
                });
            });
        }
    }

}])
.factory('arrTool',function(){
    return {
        indexOf:function(arr,key,val,binary){
            if(binary){
                //已排序，二分,用于消息
                // var first=0,last=arr.length,mid=(first+last)/2;
                // while(arr[mid][key]!=val){
                //     if(arr[mid])
                // }
            }else{
                for(var i=0, len=arr.length;i<len;i++){
                    if(arr[i][key]==val) return i;
                }
                return -1;
            }
        }
    }
})
