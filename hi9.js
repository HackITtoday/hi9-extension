var urlsToList = ['https://hi9.uk/', 'https://github.com/', 'chrome-devtools://devtools']
var idle = []
var userInfo
var myFirebaseRef = new Firebase('https://hi9site.firebaseio.com/testing')
var authData = myFirebaseRef.getAuth()
var db = new PouchDB('hi9')

function authHandler (error, authData) {
  if (error) {
    console.log('Login Failed!', error)
  } else {
    console.log('Authenticated successfully with payload:', authData)
  }
}

if (authData) {

  console.log('User ' + authData.uid + ' is logged in with ' + authData.provider)
  var data = {}
  data[authData.uid] = authData.google.email
  myFirebaseRef.set(data)

} else {

  console.log('User is logged out')

  myFirebaseRef.authWithOAuthPopup('google', authHandler, {
    remember: 'sessionOnly',
    scope: 'email'
  })
}

chrome.idle.onStateChanged.addListener(function (v) {
  var d = new Date()
  var n = d.getTime()

  db.post({onStateChanged: [n, v]})
  console.log('idle ', v)
  var d = new Date()
  var n = d.getTime()

  db.post({idle: [n, v]})

  if (v === "idle") {
    function logThis(element, index, array) {
      var loggingThis = {}
      var onStateChanged = [] 
      if (element.doc.hasOwnProperty("idle")) {
        onStateChanged.push(element.doc.idle)
      }
      console.log(element.doc)
    
    }
    console.log('idle ', v)
    db.allDocs({
      include_docs: true
    }).then(function(doc) {
      doc.rows.forEach(logThis)
      console.log(doc)
    })
  }
  // compial data 
    // get data
    // time on facebook/github/hi9/other
    //  
  // try to save data to hi9site
    // firebaseio post 
  // if good del local data
})

chrome.tabs.onDetached.addListener(function (v) {
  var d = new Date()
  var n = d.getTime()

  db.post({onDetached: [n, v]})
  console.log('onDetached tab', v)
})

chrome.tabs.onHighlighted.addListener(function (v) {
  var d = new Date()
  var n = d.getTime()

  db.post({onHighlighted: [n, v]})
  console.log('onHighlighted tab', v)
})

chrome.tabs.onActivated.addListener(function (v) {
  var d = new Date()
  var n = d.getTime()

  db.post({onActivated: [n, v]})
  console.log('Activated tab', v)
})

chrome.tabs.onUpdated.addListener(function (id, o, t) {
  chrome.tabs.getSelected(null, function (tab) {
    for (var i = 0; i < urlsToList.length; ++i) {
      if (tab.url.substring(0, urlsToList[i].length) === urlsToList[i]) {
        console.log('logging this one', urlsToList[i])
        db.post({onUpdated: [id, o, t]})
      }
    }
  })
})

chrome.identity.getProfileUserInfo(function (user) {
  userInfo = user
  db.get(userInfo.id).then(function(doc) {
    return db.put({
      _id: userInfo.id,
      _rev: doc._rev,
      user: userInfo
    });
  }).then(function(response) {
    console.log("response",response)
    // handle response
  }).catch(function (err) {
    console.log("err",err)
    db.put({
      _id: userInfo.id,
      user: userInfo
    })
  })
})


