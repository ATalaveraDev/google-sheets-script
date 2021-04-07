function onOpen() {
  console.log('On Open');
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('events', '[]');
}

function atEdit(e) {
  if (e.oldValue !== undefined && e.value !== undefined && e.triggerUid) {
    addEventToBuffer(e);
    const events = JSON.parse(PropertiesService.getScriptProperties().getProperty('events'));

    if (events.length > 1) {
      var questions = [];
      var examples = [];
      
      var values = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getDataRange().getValues();
      for (var i = 0; i < values.length; i++) {
        for (var j = 0; j < values[i].length; j++) {
          if (values[i][j].indexOf(' ') > -1) {
            questions.push(values[i][j]);
          } else {
            events.map(event => {
              if (event.newValue == values[i][j]) {
                examples.push([event.value, event.newValue]);
              }
            }); 
          }
        }
      }
      var body = {
        'examples': examples,
        'questions': questions
      };

      var options = {
        'method' : 'post',
        'contentType': 'application/json',
        'payload' : JSON.stringify(body)
      };

      var response = UrlFetchApp.fetch(' https://ers-addon.herokuapp.com/process', options);
      console.log('Response: ', response.getContentText());
    }
  }
}

function addEventToBuffer(e) {
  var events = JSON.parse(PropertiesService.getScriptProperties().getProperty('events'));
  var event = {
    cell: e.range,
    value: e.oldValue,
    newValue: e.value
  };
  events.push(event);
  var jarray = JSON.stringify(events);
  PropertiesService.getScriptProperties().setProperty('events', jarray);
}
