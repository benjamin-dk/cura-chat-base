/* This script is called when the connection to the chat server (now.js) has been established */

(function ($) {
  var chatStatus = {};

  // The following callback is called by the server in order to
  // advertise its status.
  now.updateStatus = function (attributes) {
    chatStatus = attributes;
    $(window).trigger('opekaChatStatusUpdate', [attributes]);
  };

  // When the DOM is ready, set up the widget.
  $(function () {
    //var statusText = $('#status'),
    var pairButton = $('#join-pair-chat'),
        pairStatus = $('#join-pair-chat .chat-status'),
        groupButton = $('#join-group-chat'),
        groupStatus = $('#join-group-chat .chat-status'),
        queueList = $("#queue-list");
        
    // Updates the actual status text.
    var updateDisplay = function (attributes) {
      // If there are any active one-to-one rooms.
      if (chatStatus.rooms && chatStatus.rooms.pair.active > 0) {
        //statusText.text("Chat active");

        pairButton.show();
        pairStatus.removeClass().addClass('chat-status open').html('&Aring;ben');

      // If not, check if there are any active group rooms.
      } else if (chatStatus.rooms && chatStatus.rooms.pair.full > 0) {
        //statusText.text("Chat busy");
        //pairButton.hide();
        
        pairStatus.removeClass().addClass('chat-status busy').html('Optaget');
      } else {
        //statusText.text("Chat not active");
        //pairButton.hide();

        pairStatus.removeClass().addClass('chat-status closed').html('Lukket');
      };

  //Check if there are any group rooms andlist them
      if (chatStatus.roomsList && chatStatus.roomsList.length && chatStatus.rooms.group.active > 0) {
        //statusText.text("Chat active");

        groupStatus.removeClass().addClass('chat-status open').html('&Aring;ben');
/*
        var liHtml = '';
        $.each(chatStatus.roomsList, function(i, room) {
          liHtml += '<li>' + room.name + ' (' + room.memberCount + ' &#47; ' + room.maxSize + ')</li>';
        });
        groupRoomList.find('ul').html(liHtml).end().show();
*/      
//Check if there are any group rooms that are FULL and turn the widget to BUSY
      } else if(chatStatus.roomsList && chatStatus.roomsList.length && chatStatus.rooms.group.full > 0){
        
        groupStatus.removeClass().addClass('chat-status busy').html('Optaget');
      
      } else {
        //groupButton.hide();
        groupStatus.removeClass().addClass('chat-status closed').html('Lukket');
      }

      if (chatStatus.queues === false || !chatStatus.queueList) {
        //queueList.hide();
      }
      else {
        /*
        var liHtml = '';
        $.each(chatStatus.queueList, function(i, queue) {
          liHtml += '<li>' + queue.name + ' (' + queue.inQueue + ' in queue) <button class="' + i + '">Join chat</button></li>';
        });
        queueList.find('ul').html(liHtml).end().show();
        */
      }
    };
     
    // When the document is ready, update the status, and bind the event
    // to have it update automatically later.
    $(window).bind('opekaChatStatusUpdate', updateDisplay);
    
    // When the user clicks the button, ask the chat server to join a room.
    pairButton.click(function () {
    	if(!$.browser.opera){
    		var w = open_window('_blank','http://cyberchat.dk/opeka', 1000, 700);
    	}else{
    		window.parent.location = "http://cyberchat.dk/chat-on-opera";
    	}

      now.getDirectSignInURL('pair', function (signInURL) {
        if (!(chatStatus.rooms && chatStatus.rooms.pair.active > 0) && !(chatStatus.rooms && chatStatus.rooms.pair.full > 0)) {
            w.close();
            //window.location ="http://cyberhus.dk/brevkasse";
           }
        else {
			     w.location = signInURL;
           }
      });
    });

    groupButton.click(function() {
      
      /*
        If there are any AVAILABLE group chat rooms, when group chat widget is clicked,
        send the user to the chat page
      */
      if(chatStatus.roomsList && chatStatus.roomsList.length && chatStatus.rooms.group.active > 0){
        
        if(!$.browser.opera){

          var w = open_window('_blank',chatStatus.chatPageURL, 1000, 700);
       
        }else{
          
          window.parent.location = "http://cyberchat.dk/chat-on-opera";
        
        }
      /*
        If all the group chat rooms are FULL send everyone 
        who clicks the group chat widget to a specific page
      */      
      } else if(chatStatus.roomsList && chatStatus.roomsList.length && chatStatus.rooms.group.full > 0){
      
        if(!$.browser.opera){

          var w = open_window('_blank','http://chat.cyberhus.dk/yellow.php', 1000, 700);
       
        }else{
          
          window.parent.location = "http://cyberchat.dk/chat-on-opera";
        
        }
      /*
        If there are NO group chat rooms, clicking the group chat widget
        will do nothing.
      */
      } else{
        return;
      } 
      //window.location = chatStatus.chatPageURL;
    });
/*
    queueList.delegate('ul button', 'click', function() {
      var queueId = $(this).attr('class');
      window.location = chatStatus.chatPageURL + '#signIn/queues/' + queueId;
    });
*/
    // Run updateDisplay once manually so we have the initial text
    // nailed down.
    updateDisplay();
  });
}(jQuery));

// Build pop-up window
function open_window(window_name,file_name,width,height) {
  parameters = "width=" + width;
  parameters = parameters + ",height=" + height;
  parameters = parameters + ",status=no";
  parameters = parameters + ",resizable=no";
  parameters = parameters + ",scrollbars=no";
  parameters = parameters + ",menubar=no";
  parameters = parameters + ",toolbar=no";
  parameters = parameters + ",directories=no";
  parameters = parameters + ",location=no";

  vindue = window.open(file_name,window_name,parameters);
  return vindue;
}
