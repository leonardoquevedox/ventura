  starter.service('pushNotificationService', function($rootScope, $cordovaPush, $http, alertService, $cordovaMedia, $cordovaToast, $ionicPlatform, $window, httpService, credentialsService, mapsService) {

    $rootScope.closeWindow = function(){
      window.close();
    }

    $rootScope.notifications = [];

  // Register
  $rootScope.register = function () {
    var config = null;

    var platformIsMobile = ionic.Platform.isAndroid() || ionic.Platform.isIOS();

    if(!platformIsMobile)
      return;

    if (ionic.Platform.isAndroid()) {
      config = {
  "senderID": "952790881235", // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/952790881235
  "ecb":"window.onAndroidNotification"
};
}
else if (ionic.Platform.isIOS()) {
  config = {
    "badge": "true",
    "sound": "true",
    "alert": "true",
    "ecb":"onIOSNotification"
  }
}

$cordovaPush.register(config).then(function (result) {
  console.log("Register success " + result);

  $rootScope.registerDisabled=true;
  // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
  if (ionic.Platform.isIOS()) {
    $rootScope.regId = result;
    storeDeviceToken("ios");
  }
}, function (err) {
  console.log("Register error " + err)
});
}

  // Notification Received
  $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
    if (ionic.Platform.isAndroid()) {
      handleAndroid(notification);
    }
    else if (ionic.Platform.isIOS()) {
      handleIOS(notification);
      $rootScope.$apply(function () {
        $rootScope.notifications.push(JSON.stringify(notification.alert));
      })
    }
  });

  window.onAndroidNotification = handleAndroid;
  window.onIOSNotification = handleIOS;

  function removeFromOutTheOvenList(snackId){
    var indexOfSnack = $rootScope.outOfTheOvenSnacks.indexOf(snackId);
    $rootScope.outOfTheOvenSnacks.splice(indexOfSnack);
    $rootScope.$apply();
  }

  function addToOutTheOvenList(snackId){

    //In order to avoid putting the same snackId on the list twice.
    var snackIsAlreadyOnTheOutOfTheOvenList = $rootScope.outOfTheOvenSnacks.indexOf(snackId) !== -1;
    if(snackIsAlreadyOnTheOutOfTheOvenList)
      return;

    //The snack must be added to the out of the oven's list
    $rootScope.outOfTheOvenSnacks.push(snackId);

    //The snack must be on the "Out of the oven" list for 15 minutes, and then be removed from it.
    setTimeout(function(){
      removeFromOutTheOvenList(snackId);
    }, 900000);

  }

  function redirectToBakeryDetailsPage(snackId){
    var bakeryId = snackId.split('_')[0];
    var bakeryToLoadIsAlreadyOnScreen = $rootScope.bakery && $rootScope.bakery.place_id === bakeryId;
    if(bakeryToLoadIsAlreadyOnScreen){
      return;
    }
    mapsService.getBakeryInfo($rootScope.map, bakeryId, function(bakeryInfo){
      $rootScope.bakery = bakeryInfo;
      $rootScope.redirectTo('#/bakeryDetails');
    })
  } 

  // Android Notification Received Handler
  function handleAndroid(notification) {
    console.log(notification);
    if(notification.event !== "registered" && !notification.message)
      return;
  // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
  //             via the console fields as shown.
  console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
  if (notification.event == "registered") {
    $rootScope.regId = notification.regid;
    storeDeviceToken("android");
  }
  else if (notification.event == "message") {
    var snackId = notification.payload.snackId;    
    addToOutTheOvenList(snackId);
    alertService.confirm(notification.payload.title, notification.payload.message+"\nVocê gostaria de visualizar este item?", function(){
      redirectToBakeryDetailsPage(snackId);
    });
    $rootScope.$apply(function() {
      $rootScope.notifications.push(JSON.stringify(notification.message));
    })
  }
  else if (notification.event == "error")
    alertService.alert(notification.msg, "Push notification error event");
  else alertService.alert(notification.event, "Push notification handler - Unprocessed Event");
}

  // IOS Notification Received Handler
  function handleIOS(notification) {
  // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
  // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
  // the notification when this code runs (weird).
  if (notification.foreground == "1") {
  // Play custom audio if a sound specified.
  if (notification.sound) {
    var mediaSrc = $cordovaMedia.newMedia(notification.sound);
    mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
  }

  if (notification.body && notification.messageFrom) {
    alertService.alert(notification.body, notification.messageFrom);
  }
  else alertService.alert(notification.alert, "Push Notification Received");

  if (notification.badge) {
    $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
      console.log("Set badge success " + result)
    }, function (err) {
      console.log("Set badge error " + err)
    });
  }
}
  // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
  // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
  // the data in this situation.
  else {
    if (notification.body && notification.messageFrom) {
      alertService.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
    }
    else alertService.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
  }
}

  // Stores the device token in a db using node-pushserver (running locally in this case)
  //
  // type:  Platform type (ios, android etc)
  function storeDeviceToken(type) {
  // Create a random userid to store with it
  var user = { user: credentialsService.getLoggedInUser() + device.uuid, type: type, token: $rootScope.regId };
  console.log("Post token for registered device with data " + JSON.stringify(user));

  $http.post('http://breadsypushserver-breadsy.rhcloud.com/subscribe', JSON.stringify(user))
  .success(function (data, status) {
    console.log("Token stored, device is successfully subscribed to receive push notifications.");
  })
  .error(function (data, status) {
    console.log('Verifique a conectividade do servidor de push.');
  }
  );
}

  // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
  // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
  // time the app opens which this currently does. However in many cases you will always receive the same device token as
  // previously so multiple userids will be created with the same token unless you add code to check).
  function removeDeviceToken() {
    var tkn = {"token": $rootScope.regId};
    $http.post('http://breadsypushserver-breadsy.rhcloud.com/unsubscribe', JSON.stringify(tkn))
    .success(function (data, status) {
      console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
    })
    .error(function (data, status) {
      console.log("Error removing device token." + data + " " + status)
    }
    );
  }

  // Unregister - Unregister your device token from APNS or GCM
  // Not recommended:  See http://developer.android.com/google/gcm/adv.html#unreg-why
  //                   and https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/index.html#//apple_ref/occ/instm/UIApplication/unregisterForRemoteNotifications
  //
  // ** Instead, just remove the device token from your db and stop sending notifications **
  $rootScope.unregister = function () {
    console.log("Unregister called");
    removeDeviceToken();
    $rootScope.registerDisabled=false;
  }


  $rootScope.askUserForPermissionToPush = function(){
    alertService.confirm('Notificações', 'Você aceita receber notificações de lanches saindo do forno?', function(){
      window.localStorage['BREADSY_PUSH_PERMISSION'] = true;
      $rootScope.register();
    });
  }

})