var socket = io();

            socket.on('connect', function() {
                console.log('connected to server');

                // socket.emit('createMessage', {
                //     from:"andrew",
                //     text: "yup..it works"
                // });
            });

            socket.on('disconnect', function() {
                console.log('disconnected from server');
            });

socket.on('newMessage', function(message){
    console.log('newMessage',message);
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formatedTime}: ${message.text}`);
    jQuery('#messages').append(li);
    });
    

socket.on('newLocationMessage', function(message){
    var formatedTime = moment(message.createdAt).format('h:mm a');
    
    var li = jQuery(`<li></li>`);
    var a = jQuery(`<a target="_blank">My Current Location</a>`)


    li.text(`${message.from} ${formatedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();

    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage',{
        from:'user',
        text: messageTextBox.val()
    },function(){
        messageTextBox.val('')
    });
});


var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert("Geolocation is not supported");
    }

    locationButton.attr('disabled','disabled').text('sending location');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('send location');
        console.log('position: ',position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },function(){
        locationButton.removeAttr('disabled').text('send location');
        alert('Unable to fetch location');
    });
});