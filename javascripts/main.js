$(function() {
	var FBOPEN_URI = 'http://api.data.gov/gsa/fbopen/v0/opps';
	var request;

  $('#fbopen-widget-demo').submit(function(e) {
  	if (request) request.abort();

  	var $form = $(this);
  	var $inputs = $form.find("input, select, button, textarea");
  	var $results = $('#fbopen-widget-results-demo');
    var $dataStore = $('#fbopen-widget-data');
    var $widget = $('#widget');
    var _q = $form.find('#q').val();
  	var serializedData = $form.serialize();
    // set values for widget snippet
    $dataStore.val(serializedData);

  	$inputs.prop("disabled", true);
    $results.html('<h4>Loading...</h4>');
    $widget.fadeIn();

    $('#fbopen-widget-output').find('script').each(function() {
      if ($(this).attr('class') == 'embed') {
      } else {
        $(this).remove();
      }
    });
    $('#fbopen-widget-output').find('link').each(function() {
      $(this).remove();
    });
    elm = document.getElementById('fbopen-widget-placeholder');
    $widget_html = elm.outerHTML;
    $('#widget-textarea').val($widget_html)


  	request = $.ajax({
  		url: FBOPEN_URI,
  		type: "get",
  		data: serializedData
  	});

  	request.done(function (response, textStatus, jqXHR){
      $results.html('<h2>FBOpen</h2>');
      var num = addCommas(response.numFound);
      var _title = "";
      if (_q.length > 0) {
        _title = "<h3>" + num + " opportunities found matching <i>" + _q + "<i></h3>";
      } else {
        _title = '<h3>' + num + ' opportunities found</h3>';
      }
      $results.append(_title);
      for (var i = 0; i < response.docs.length; i++) {
        var title = response.docs[i].title;
        var uri = response.docs[i].listing_url;
        var agency = response.docs[i].agency;
        var description = "No description available."
        var posted = response.docs[i].posted_dt;
        if (response.docs[i].description)
          description = preview(response.docs[i].description);
        var html = '<div class="fbopen-opp"><a href="'+uri+'" target="_blank"><h4>'+title+'</h4></a>'
          html += '<h5>'+agency+'</h5>';
          html += '<p>'+description+'</p>';
          html += '</div>';

        $results.append(html);
      }
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
      console.error(
        "The following error occured: "+
        textStatus, errorThrown
      );
    });

    request.always(function () {
      $inputs.prop("disabled", false);
    });

    e.preventDefault();
  });

  $('#widget-textarea').mouseenter(function() {
    ctrlA($(this));
  })

});


// HTML to JavaScript converter
// By John Krutsch (http://asp.xcentrixlc.com/john)
// Moderator of the JavaScript Kit Help Forum: http://freewarejava.com/cgi-bin/Ultimate.cgi
function scriptIt(val){
  val.value=val.value.replace(/"/gi,"&#34;")
  val.value=val.value.replace(/'/gi,"&#39;")
  valArr=escape(val.value).split("%0D%0A")
  val.value=""
  for (i=0; i<valArr.length; i++){
    val.value+= (i==0) ? "<script>\ninfo=" : ""
    val.value+= "\"" + unescape(valArr[i])
    val.value+= (i!=valArr.length-1) ? "\" + \n" : "\"\n" 
  }
  // val.value+="\ndocument.write(info)\n<\/script>"
  val.value+="\nconsole.log(info)\n<\/script>"
}

function ctrlA(el) {
  with(el){
  focus(); select() 
  }
  if(document.all){
  txt=el.createTextRange()
  txt.execCommand("Copy") 
  window.status='Selected and copied to clipboard!'
  }
  else window.status='Press ctrl-c to copy the text to the clipboard'
  setTimeout("window.status=''",3000)
} 

function addCommas(nStr) {
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
function preview(str) {
  rtnstr = str.substring(0,255);
  if (str.length > 255)
    rtnstr += "..."
  return rtnstr
}


