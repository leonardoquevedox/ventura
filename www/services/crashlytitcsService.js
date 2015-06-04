starter.factory('crashlyticsService', function() {
    return {
        sendCrashWithData: function(message){
          console.log(crashlyticsPlugin);
          crashlyticsPlugin.setUserIdentifier('Novo Bug');
          crashlyticsPlugin.setUserName('Breadsy Dev');
          crashlyticsPlugin.setUserEmail('contato@welkin.com.br');

          crashlyticsPlugin.setStringValueForKey('80abc35d78814fd0e6da5f9457dbf9f77a0586a6', 'stringkey');
          crashlyticsPlugin.setIntValueForKey(200, 'intkey');
          crashlyticsPlugin.setBoolValueForKey(true, 'boolkey');
          crashlyticsPlugin.setFloatValueForKey(1.5, 'floatkey');

          crashlyticsPlugin.addLog('This my a log message from JS!');
          crashlyticsPlugin.addLog('This is another log message from JS!');
          crashlyticsPlugin.sendCrash();
      }
  }
})