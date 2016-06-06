chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // If the received message has the expected format...
  if (msg.text === 'report_back') {
    var got = document.getElementsByTagName('meta')
    
    function getDescription(got) {
      var meta = [].slice.call(got)
      if (meta.length)
      for (var i = 0; i < meta.length; i++) {
        if (meta[i].getAttribute("property") == "description") {
          return meta[i].getAttribute("content")
        }
      }
      return ""
    }
    function getImages() {
      var output = []
      if (document.images) {
        images = [].slice.apply(document.images, null)
      } else {
        images = [].slice.apply(document.getElementsByTagName('img'), null)
      }
      if (images.length > 0){
        if (images.length > 9) {
          var gotImages = 0
          for (var i = 0; i < images.length && (gotImages < 5); i++) {
            if (images[i] !== undefined && images[i].src && !images[i].src.endsWith("svg") && ((images[i].width > 130 || images[i].width === 0) || images.length < 10))  {
              output.push( {src: images[i].src,width: images[i].width})
              gotImages++
            }
          }
        } else {
          for (var i = 0; i < images.length; i++) {
            if (images[i] !== undefined && images[i].src && ((images[i].width > 130 || images[i].width === 0) || images.length < 10))  {
              output.push( {src: images[i].src,width: images[i].width})
            }
          }
        }
      }
      return output
    }
    sendResponse({
      meta: got,
      description: getDescription(got), 
      images: getImages(), 
      fav: msg.fav, 
      url: msg.url, 
      title: msg.title 
    })
  }
})
