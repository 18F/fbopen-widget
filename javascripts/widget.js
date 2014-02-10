var fbopenWidget = {};
fbopenWidget.helpers = {};
fbopenWidget.helpers.preview = function(str) {
  rtnstr = str.substring(0,255);
  if (str.length > 255)
    rtnstr += "..."
  return rtnstr
};
fbopenWidget.helpers.addCommas = function(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}
fbopenWidget.helpers.api_uri = function() { return 'http://api.data.gov/gsa/fbopen-dev/v0/opps'; }
fbopenWidget.models = {};


$(function() {
  var getFbopen = function() {
    var serializedData = $('#fbopen-widget-data').val()
    var $results = $('#fbopen-widget-results');
    $results.html('<h4>Loading...</h4>')
    var request = $.ajax({
      url: 'http://api.data.gov/gsa/fbopen-dev/v0/opps',
      type: "get",
      data: serializedData
    });
    request.done(function (response, textStatus, jqXHR){
      $('#fbopen-widget-placeholder').fadeIn();
      $results.html('<h2>FBOpen</h2>');
      var num = fbopenWidget.helpers.addCommas(response.numFound);
      $results.append('<h3>'+num+' Opportunities Found</h3>')
      for (var i = 0; i < response.docs.length; i++) {
        var title = response.docs[i].title;
        var uri = response.docs[i].listing_url;
        var agency = response.docs[i].agency;
        var description = "No description available."
        var posted = response.docs[i].posted_dt;
        if (response.docs[i].description)
          description = fbopenWidget.helpers.preview(response.docs[i].description);
        var html = '<div class="fbopen-opp"><a href="'+uri+'" target="_blank"><h4>'+title+'</h4></a>'
          html += '<h5>'+agency+'</h5>';
          html += '<p>'+description+'</p>';
          html += '</div>';

        $results.append(html)
      }
    });
  }

  getFbopen();

});