// @codekit-prepend "../../device.js"

var video;
var multiSource = [
    'https://joystick.cachefly.net/resources/video/video.mp4',
    'https://joystick.cachefly.net/resources/video/video.webm',
    'https://joystick.cachefly.net/resources/video/video.ogv'];
var poster = 'https://farm9.staticflickr.com/8557/10238331725_b82c75be44_o.jpg';
var singleSource = 'https://joystick.cachefly.net/JMC/v/vid_become_legend.mp4';
var resetVars;

$( document ).ready(init);

function init(){

    video = new VideoPlayer();
    video.dom_debug = document.getElementById('debugField');
    video.debug = true;

    video.checkForMobile();
    video.progressive = false;
    
    video.track_mute = function(){
        setMuteState();
        video.trace('TRACK: Video Mute');
    };
    
    video.track_unmute = function(){
        setMuteState();
        video.trace('TRACK: Video Unmute');
    };
    
    video.callback_play = function(){
        $('#play').removeClass('active');
        $('#pause').addClass('active');
        $('#replay').addClass('active');
        video.trace('callback_play');
    };
    
    video.callback_end = function(){
        $('#play').addClass('active');
        $('#stop').removeClass('active');
        $('#pause').removeClass('active');
        $('#unmute').removeClass('active');
        $('#mute').removeClass('active');
        video.trace('callback_end');
    };
    
    video.callback_pause = function(){
        $('#play').addClass('active');
        $('#pause').removeClass('active');
        video.trace('callback_pause');
    };
    
    video.track_replay = function(){
        setMuteState();
        $('#stop').addClass('active');
        video.trace('TRACK: Video Replay');
    };
    
    video.track_start = function(){
        setMuteState();
        $('#stop').addClass('active');
        video.trace('TRACK: Video Start');
    };

    video.track_end = function(){
        
        video.trace('TRACK: Video End');
    };

    video.track_preview_start = function() {
        video.trace('TRACK: Preview Start');
        video.trace('preview: '+video.preview);
        video.trace('autoplay: '+video.autoplay);
        video.trace('startmuted: '+video.startmuted);
    };

    video.track_preview_end = function() {
        disablePreview();
        video.trace('TRACK: Preview End');
    };

    resetVars = {
        autoplay: video.autoplay,
        startmuted: video.startmuted,
        replaywithsound: video.replaywithsound,
        allowfullscreen: video.allowfullscreen,
        uniquereplay: video.uniquereplay,
        ismobile: video.ismobile,
        playonseek: video.playonseek,
        elementtrigger: video.elementtrigger,
        chromeless: video.chromeless,
        loop: video.loop,
        debug: video.debug,
        progressive: video.progressive,
        inline: video.inline,
        preview: video.preview
    };


    resetVariables();

    $('#debugField').click(function(){
        $(this).html('');
    });

    $('.cb').click(function(e){

        if( !$(this).parent().hasClass('inactive') && ( 
            $(this).attr('id') === 'ismobile' || 
            // $(this).attr('id') === 'allowfullscreen' || 
            $(this).attr('id') === 'autoplay' ||
            $(this).attr('id') === 'startmuted' ||
            $(this).attr('id') === 'chromeless' ||
            $(this).attr('id') === 'uniquereplay' ||
            $(this).attr('id') === 'progressive' ||
            $(this).attr('id') === 'preview' ||
            $(this).attr('id') === 'elementtrigger' ||
            $(this).attr('id') === 'inline'
            ) )
        {
            quickReset(100);
        }

        if(!$(this).parent().hasClass('inactive'))
        {
            var bool = $(this).is(":checked");
            var name = $(this).attr("id");

            if( $(this).attr('id') === 'preview' ) {

                if(bool) {
                    video.preview = Number( ( Number( $('#prevTime').val() ) > 0 ) ? $('#prevTime').val() : $('#prevTime').val('3')  );
                } else {
                    video.preview = 0;
                    disablePreview();
                }
            } else {
                video[name] = bool;
            }

            setExceptions();
        }
        else
            e.preventDefault();
    });

    $('#destroy').click(function(){
        if($(this).hasClass('active')) {
            video.destroy();
            $('#play').removeClass('active');
            $('#stop').removeClass('active');
            $('#replay').removeClass('active');
            $('#pause').removeClass('active');
            $('#mute').removeClass('active');
            $('#load').removeClass('active');
            $('#unload').removeClass('active');
            $('#destroy').removeClass('active');
            $('#initialize').addClass('active');
            $('#unmute').removeClass('active');
        }

    });

    $('#unload').click(function(){
        if($(this).hasClass('active')) {
            video.unload();
            $('#play').removeClass('active');
            $('#pause').removeClass('active');
            $('#mute').removeClass('active');
            $('#unload').removeClass('active');
            $('#unmute').removeClass('active');

        }
    });

    $('#initialize').click(function(){
        if($(this).hasClass('active')) {
            video.init('videoPlayer');
            $('#load').addClass('active');
            $('#destroy').addClass('active');
            $(this).removeClass('active');
        }
    });

    $('#stop').click(function(){
        if($(this).hasClass('active')) {
            video.stop();

            $('#play').addClass('active');
            $('#replay').addClass('active');
            $('#pause').removeClass('active');
            $('#stop').removeClass('active');
            $('#mute').removeClass('active');
            $('#unmute').removeClass('active');
        }
    });

    $('#play').click(function(){
        if($(this).hasClass('active'))
            video.play();
    });

    $('#pause').click(function(){
        if($(this).hasClass('active'))
            video.pause();
    });

    $('#mute').click(function(){
        if($(this).hasClass('active'))
            video.mute();
    });

    $('#unmute').click(function(){
        if($(this).hasClass('active'))
            video.unmute();
    });

    $('#replay').click(function(){
        if($(this).hasClass('active'))
            video.replay();
    });

    $('#load').click(function(){
        if($(this).hasClass('active')) {
            loadVid();
            $('#play').addClass('active');
            $('#unload').addClass('active');
            $('#destroy').addClass('active');
            $('#initialize').removeClass('active');
        }
    });

    $('#defaults').click(resetVariables);

    $('#ppPoster').click(function(){
        $('#poster').val(poster);
    });

    $('#reflow').click(function(){
        $('#videoPlayer').css({
            'height':$('#height').val()+'px',
            'width': $('#width').val()+'px'
        });

        video.reflow();
    });

    $('#ppMulti').click(ppMulti);

    $('#ppSingle').click(function(){
        $('#sources').val(singleSource);
    });

    ppMulti();
    $('#poster').val(poster);
    $('#width').val($('#videoPlayer').width());
    $('#height').val($('#videoPlayer').height());

    $('#prevTime').val('3').keypress(function(e) {
        if(e.which == 13) {
            var pTime = Number( $('#prevTime').val() );
            
            video.preview = pTime;

            if(pTime === 0) {
                $('#prevTime').val('3');
                disablePreview();
            } else {
                $('#prevTime').removeClass('hide');
                $('#preview').prop('checked', true);
                video.autoplay = false;
                $('#autoplay').prop('checked', false).parent().removeClass('inactive');
                video.startmuted = false;
                // $('#startmuted').prop('checked', false).parent().removeClass('inactive');
            }

            // alert(pTime +' - '+ video.preview);

            setTimeout(quickReset, 100);
            
        }
    });

    // video.init('videoPlayer');
    // loadVid();
    
}

function disablePreview() {
    $('#prevTime').addClass('hide');
    $('#preview').prop('checked', false);
    video.autoplay = false;
    $('#autoplay').prop('checked', false).parent().removeClass('inactive');
    video.startmuted = false;
    $('#startmuted').prop('checked', false).parent().addClass('inactive');
}

function setMuteState() {
    if(!video.proxy.muted) {
        $('#mute').addClass('active');
        $('#unmute').removeClass('active');
    } else {
        $('#mute').removeClass('active');
        $('#unmute').addClass('active');
    }
}

function quickReset(num) {
    
    video.destroy();
    
    setTimeout(function(){
        video.init('videoPlayer');
        loadVid();
        $('#debugField').html('');
    }, num);

    $('#play').addClass('active');
    $('#stop').removeClass('active');
    $('#replay').removeClass('active');
    $('#pause').removeClass('active');
    $('#mute').removeClass('active');
    $('#unmute').removeClass('active');

    $('#load').addClass('active');
    $('#unload').addClass('active');
    $('#destroy').addClass('active');
    $('#play').addClass('active');
    $('#stop').removeClass('active');
    $('#pause').removeClass('active');
    $('#unmute').removeClass('active');
    $('#mute').removeClass('active');
    $('#replay').removeClass('active');
    $('#initialize').removeClass('active');
}

function ppMulti()
{

    $('#sources').val('')

    for(var i = 0; i < multiSource.length; i++)
    {
        var tstr = multiSource[i];

        if(i < multiSource.length - 1)
            tstr += ",\r\n";

        $('#sources').val($('#sources').val()+tstr);
    }
}

function loadVid()
{
    var tstr = $.trim( $('#sources').val() );
    var tsource;
    if(tstr.match(/,/))
        tsource = tstr.replace("\n", "").replace("\r", "").split(',');
    else
        tsource = tstr.trim();
    if($('#height').val() && $('#width').val())
    {
        $('#videoPlayer').css({
            'height':$('#height').val()+'px',
            'width': $('#width').val()+'px'
        });
    }
    if($('#poster').val())
        video.load(tsource, $.trim($('#poster').val()));
    else
        video.load(tsource);
}

//

function resetVariables() {

    for(var p in resetVars) {
        video[p] = resetVars[p];

    }

    video.autoplay = resetVars.autoplay;
    video.startmuted = resetVars.startmuted;
    video.replaywithsound = resetVars.replaywithsound;
    video.allowfullscreen = resetVars.allowfullscreen;
    video.uniquereplay = resetVars.uniquereplay;
    video.ismobile = resetVars.ismobile;
    video.playonseek = resetVars.playonseek;
    video.chromeless = resetVars.chromeless;
    video.elementtrigger = resetVars.elementtrigger;
    video.loop = resetVars.loop;
    video.debug = resetVars.debug;
    video.progressive = resetVars.progressive;
    video.inline = resetVars.inline;
    video.preview = resetVars.preview;

    setExceptions();

    quickReset(100);

}

function setExceptions() {

    $('.cboxwrapper').removeClass('inactive');

    if(video.preview) {
        // video.preview = Number( ( $('#prevTime').val() );
        video.autoplay = true;
        video.startmuted = true;
        $('#autoplay').parent().addClass('inactive');
        $('#startmuted').parent().addClass('inactive');
        $('#prevTime').removeClass('hide');

    } 


    if(video.preview == 0) {
        // $('#prevTime').addClass('hide').val('3');
    }


    if(video.ismobile)
    {
        video.preview = 0;
        video.autoplay = false;
        video.startmuted = false;
        $('#autoplay').parent().addClass('inactive');
        $('#startmuted').parent().addClass('inactive');
        $('#allowfullscreen').parent().addClass('inactive');
        $('#playonseek').parent().addClass('inactive');
        $('#replaywithsound').parent().addClass('inactive');
        $('#preview').parent().addClass('inactive');
    }

    if(!video.autoplay) {
        video.startmuted = false;
        $('#startmuted').parent().addClass('inactive');
    }

    if(video.loop) {
        $('#replaywithsound').parent().addClass('inactive');
        $('#uniquereplay').parent().addClass('inactive');
    }

    setCheckboxes();

}

function setCheckboxes() {
    // console.log('');
    for(var p in resetVars) {
        // console.log(p+': '+video[p]);
        $('#'+p).prop('checked', video[p]);
    }
    // console.log('');
}

function loadSecondaryVideo()
{
    video2 = new VideoPlayer();
    video2.init('videoPlayer2');
    video2.autoplay = true;
    video2.startmuted = true;
    video2.load([
        'http://joystick.cachefly.net/JMC/v/vid_become_legend.mp4',
        'http://joystick.cachefly.net/JMC/v/vid_become_legend.ogv',
        'http://joystick.cachefly.net/JMC/v/vid_become_legend.webm'
    ]);
}