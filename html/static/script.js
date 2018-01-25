$(function(){
    var socket = io();

    var green = '#a5c956 ',
        startRunning = false;
    socket.on('info', function(data){
       if(data[1]){
           $('div#installDetails').append('<div class="detail">' + data[0] + ' <div class="detailImage"><img class="loader" src="loader.gif"></div></div>')
       } else {
           $('div#installDetails').append('<div class="detail">' + data[0] + '</div>')
       }
    })
    .on('infoDone', function(data){
        var success = data[0],
            name = data[1];
        if (success) {
            $('div#installDetails .detail:nth-last-child(1) img').attr('src', 'loaderDone.gif')
        } else {
            $('div#installDetails .detail:nth-last-child(1) img').attr('src', 'loaderError.gif').data('name', name).parent().hover(function(){$(this).css({'cursor': 'pointer'})}).click(function(){
                $(this).parent().remove();
                socket.emit('reinstall', name)
            })
        }

    })

    .on('progress', function(data){
        $('#progress').animate({'width': data + '%'});
        $('#progressCount').html(data + '%');
    })
    .on('goButton', function(data){
        if (data){
            $('#goButton').removeClass('disabled')
        } else {
            $('#extrasButton, .setting').fadeOut();
            $('#goButton').addClass('noClick').html('').animate({'width': '80%', 'height': 20, 'background-color': 'white', 'border': '1px solid black', 'border-radius': 2}, 500, function(){
                $(this).hide();
                $('#progressBar').show()
            })

        }
    })
    .on('rebootShow', function(data){
        if (data){
            $('#rebootSection').fadeIn();
        } else {
            $('#rebootSection').fadeOut();
        }
    })
    .on('setContinueSwitches', function(data){
        $('#goButton').removeClass('disabled').html('Continue');
        if (data[0]){
            $('#laptop').attr('checked', true);
            $('#laptopSlider').animate({'background-color': green});
            $('#laptopSliderButton').animate({'left': 20}, 200)
        } else {
            $('#laptop').attr('checked', false);
            $('#laptopSlider').animate({'background-color': '#a99e9e'});
            $('#laptopSliderButton').animate({'left': 1}, 200)
        }

        if(data[1]){
            $('#popo').attr('checked', true);
            $('#popoSlider').animate({'background-color': green});
            $('#popoSliderButton').animate({'left': 20}, 200)
        } else {
            $('#popo').attr('checked', false);
            $('#popoSlider').animate({'background-color': '#a99e9e'});
            $('#popoSliderButton').animate({'left': 1}, 200)
        }

        if(data[2]){
            $('#popoCamerasQuestion, #popoCamChecker').fadeTo(400, 1);
            $('#popoCameras').attr('checked', true);
            $('#popoCamSlider').animate({'background-color': green});
            $('#popoCamSliderButton').animate({'left': 20}, 200)
        } else {
            $('#popoCamerasQuestion, #popoCamChecker').fadeTo(400, 0);
            $('#popoCameras').attr('checked', false);
            $('#popoCamSlider').animate({'background-color': '#a99e9e'});
            $('#popoCamSliderButton').animate({'left': 1}, 200)
        }
    });

    $('#laptopSlider').click(function(){
        var $laptop = $('#laptop');
        $laptop.attr('checked', !($laptop.is(':checked')));
        if($laptop.is(':checked')){
            $('#laptopSlider').animate({'background-color': green});
            $('#laptopSliderButton').animate({'left': 20}, 200)
        } else {
            $('#laptopSlider').animate({'background-color': '#a99e9e'});
            $('#laptopSliderButton').animate({'left': 1}, 200)
        }
    });

    $('#popoSlider').click(function(){
        var $popo = $('#popo');
        $popo.attr('checked', !($popo.is(':checked')));
        if($popo.is(':checked')){
            $('#popoSlider').animate({'background-color': green});
            $('#popoSliderButton').animate({'left': 20}, 200);
            $('#popoCamerasQuestion, #popoCamChecker').fadeTo(400, 1)
        } else {
            $('#popoSlider').animate({'background-color': '#a99e9e'});
            $('#popoSliderButton').animate({'left': 1}, 200);
            $('#popoCamerasQuestion, #popoCamChecker').fadeTo(400, 0)
        }
    });

    $('#popoCamSlider').click(function(){
        var $popoCam = $('#popoCameras');
        $popoCam.attr('checked', !($popoCam.is(':checked')));
        if($popoCam.is(':checked')){
            $('#popoCamSlider').animate({'background-color': green});
            $('#popoCamSliderButton').animate({'left': 20}, 200);
        } else {
            $('#popoCamSlider').animate({'background-color': '#a99e9e'});
            $('#popoCamSliderButton').animate({'left': 1}, 200);
        }
    });

    $('#goButton').one('click', function(){
        var obj = {
            laptop: $('#laptop').is(':checked'),
            popo: $('#popo').is(':checked'),
            popoCameras: $('#popoCameras').is(':checked'),
            caselle: $('#extrasCaselle').is(':checked'),
            vlc: $('#extrasVLC').is(':checked'),
            xprotect: $('#extrasXprotect').is(':checked'),
            dropbox: $('#extrasDropbox').is(':checked'),
            eFileCabinet: $('#extrasEfilecabinet').is(':checked'),
            googleEarth: $('#extrasGoogleEarth').is(':checked')
        };
        socket.emit('goButton', obj)
    });

    $('#rebootButton').click(function(){
        $(this).addClass('disabled');
        socket.emit('reboot', true)
    });

    $('#laptop').change(function(){
        if($(this).is(':checked')){
            $('#laptopSlider').css({'background-color': 'green'})
        } else {
            $('#laptopSlider').css({'background-color': '#b22e25'})
        }
    });

    var extraOpen = false;
    $('#extrasButtonText').click(function() {
        if(extraOpen){
            $('#extrasButton').animate({width: 60, height: 30, "backgroundColor": "#d3d3d3"});
            extraOpen = false
        } else {
            $('#extrasButton').animate({width: 200, height: 300, "backgroundColor": "white"});
            extraOpen = true
        }

    });

    socket.emit('init', true);
});