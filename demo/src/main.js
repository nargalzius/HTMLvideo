// @codekit-prepend "../../device.js"

var video;
var multiSource = [
    'https://joystick.cachefly.net/resources/video/video.mp4',
    'https://joystick.cachefly.net/resources/video/video.webm',
    'https://joystick.cachefly.net/resources/video/video.ogv'];
var poster = 'https://joystick.cachefly.net/JMC/v/vid_become_legend.jpg';
var singleSource = 'https://joystick.cachefly.net/JMC/v/vid_become_legend.mp4';
var resetVars;

$( document ).ready(init);

function init(){

    video = new VideoPlayer();

    video.checkForMobile();
    video.progressive = false;

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

    //video.dom_debug = document.getElementById('debug');

    resetVariables();

    //video.debug = true;
    video.dom_debug = document.getElementById('debugField');

    video.init('videoPlayer');

    $('#debugField').click(function(){
        $(this).html('');
    });

    $('.cb').click(function(e){

        if( !$(this).parent().hasClass('inactive') && ( 
            $(this).attr('id') === 'ismobile' || 
            $(this).attr('id') === 'allowfullscreen' || 
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
            quickReset(50);
        }

        if(!$(this).parent().hasClass('inactive'))
        {
            var bool = $(this).is(":checked");
            var name = $(this).attr("id");

            video[name] = bool;

            setExceptions();
        }
        else
            e.preventDefault();
    });

    $('#defaults').click(resetVariables);

    $('#ppMulti').click(ppMulti);

    $('#ppSingle').click(function(){
        $('#sources').val(singleSource);
    });

    $('#load').click(loadVid);

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

    $('#obliterate').click(function(){
        video.destroy();
    });

    $('#destroy').click(function(){
        video.unload();
    });

    $('#initialize').click(function(){
        video.init('videoPlayer');
    });

    $('#stop').click(function(){
        video.stop();
    });

    ppMulti();
    $('#poster').val(poster);
    $('#width').val($('#videoPlayer').width());
    $('#height').val($('#videoPlayer').height());

    loadVid();
    // loadSecondaryVideo();
}

function quickReset(num) {
    
    video.destroy();
    
    setTimeout(function(){
        video.init('videoPlayer');
        loadVid();
    }, num);
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

    if(!video.autoplay) {
        video.startmuted = false;
        $('#startmuted').parent().addClass('inactive');
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
        $('#chromeless').parent().addClass('inactive');
        $('#elementtrigger').parent().addClass('inactive');
        $('#preview').parent().addClass('inactive');
    }

    if(video.preview) {
        video.preview = 7;
        video.autoplay = true;
        video.startmuted = true;
        $('#autoplay').parent().addClass('inactive');
        $('#startmuted').parent().addClass('inactive');
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