'use strict';

var multiSource = ['https://joystick.cachefly.net/resources/video/video.mp4', 'https://joystick.cachefly.net/resources/video/video.webm', 'https://joystick.cachefly.net/resources/video/video.ogv'];
var poster = 'https://farm9.staticflickr.com/8557/10238331725_b82c75be44_o.jpg';
// var singleSource = 'https://joystick.cachefly.net/resources/video/video2009.mp4';
var singleSource = 'https://joystick.cachefly.net/resources/video/joystick2009.mp4';
var resetVars;

var container = document.getElementById('groupwrapper1');

var tooltips = {
    debug: "Trace to console<br>This demo is an exception - default value for <code>debug</code> is <strong>false</strong>",
    id: "containing div",
    src: "video file",
    poster: "video poster file",
    autoplay: "",
    startmuted: "",
    replaywithsound: "Force unmute on replay",
    allowfullscreen: "",
    playonseek: "Force play/resume on scrubber seek",
    uniquereplay: "Use replay icon. Re-uses play icon if set to <strong>false</strong>",
    chromeless: "Remove all control buttons<br><strong>WARNING:</strong> if you set <code>elementtrigger</code> to <strong>false</strong> as well, you'll have to trigger/control the video programatically.",
    elementtrigger: "Enables starting of video by clicking the video element",
    elementplayback: "Enables playback/pause by clicking the video element during normal playback (similar to YouTube, etc.)",
    controlbar: "Enables/Disables the bottom control bar on playback",
    loop: "",
    preload: "Set preload (none, metadata, all)",
    inline: "Set <code>playsinline</code> attribute to video element",
    preview: "Enable timed \"Click For Sound\" behavior",
    continuecfs: "Do not restart video on ClickForSound",
    endfreeze: "Leave video element visible on stop (override poster if present)",
    ismobile: "Disable custom bar controls and use vanilla <code>&lt;video&gt;</code> controls."
};

var video = new VideoPlayer();
video.debug = true;
video.default_params.id = 'videoPlayer';
video.dom_debug = document.getElementById('debugField');
video.init(true);

$(document).ready(init);

function init() {

    // GENERATE PARAMS
    for (var key in video.default_params) {

        if (key !== 'id' || 'src' || 'poster' || 'ismobile') {

            switch (key) {
                case 'id':
                case 'src':
                case 'poster':
                case 'ismobile':
                case 'preload':

                    break;
                default:
                    var el = document.createElement('div');
                    el.className = 'cboxwrapper ' + key;
                    var inp = document.createElement('input');
                    inp.id = key;
                    inp.className = 'cb';
                    inp.type = "checkbox";
                    el.appendChild(inp);
                    var txt = document.createElement('span');
                    txt.innerHTML = 'params.' + key;
                    el.appendChild(txt);

                    if (key === 'preview') {
                        var inp2 = document.createElement('input');
                        inp2.type = "checkbox";
                        inp2.id = 'prevTime';
                        inp2.className = 'hide';
                        inp2.type = 'textfield';
                        inp2.maxlength, 3;
                        // inp2.value = 3;
                        el.appendChild(inp2);
                    }

                    var tt = document.createElement('span');
                    tt.className = 'tooltip';
                    tt.innerHTML = tooltips[key];
                    if (tooltips[key]) el.appendChild(tt);

                    container.appendChild(el);
            }
        }
    }

    // ASSIGN PARAM CLICKS
    paramClicks();

    // INTERFACE CLICKS
    uiClicks();

    // ASSIGN CALLBACKS
    callbacks();

    // DEBUG FIELD CLEAR
    $('#debugField').click(function () {
        $(this).html('');
    });

    // PREPOPULATE MULTI FIELD
    ppMulti();

    $('#poster').val(poster);
    $('#width').val($('#videoPlayer').width());
    $('#height').val($('#videoPlayer').height());

    setCheckboxes();
    $('#startmuted').parent().addClass('inactive');
}

/*



function init(){
    
    

    // resetVars = {
    //     autoplay: video.autoplay,
    //     startmuted: video.startmuted,
    //     replaywithsound: video.replaywithsound,
    //     allowfullscreen: video.allowfullscreen,
    //     uniquereplay: video.uniquereplay,
    //     ismobile: video.ismobile,
    //     playonseek: video.playonseek,
    //     elementtrigger: video.elementtrigger,
    //             elementplayback: video.elementplayback,
    //             controlbar: video.controlbar,
    //     chromeless: video.chromeless,
    //     loop: video.loop,
    //     debug: video.debug,
    //     preload: video.preload,
    //     inline: video.inline,
    //     preview: video.preview,
    //     endfreeze: video.endfreeze,
    //     continuecfs: video.continuecfs,
    // };


    resetVariables();


    

    

    

    // video.init('videoPlayer');
    // loadVid();
    
}

//

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

// $('#tempBTN').click(function(){
//     $('#videoPlayer').detach().appendTo('#videoPlayer2');
//     video.play();
// })

*/

function callbacks() {
    video.track_mute = function () {
        setMuteState();
        video.trace('track_mute');
    };

    video.track_unmute = function () {
        setMuteState();
        video.trace('track_unmute');
    };

    video.callback_play = function () {
        $('#play').removeClass('active');
        $('#pause').addClass('active');
        $('#replay').addClass('active');
        $('#stop').addClass('active');
        video.trace('callback_play');
    };

    video.callback_end = function () {
        $('#play').addClass('active');
        $('#stop').removeClass('active');
        $('#pause').removeClass('active');
        $('#unmute').removeClass('active');
        $('#mute').removeClass('active');
        video.trace('callback_end');
    };

    video.callback_pause = function () {
        $('#play').addClass('active');
        $('#pause').removeClass('active');
        video.trace('callback_pause');
    };

    video.track_replay = function () {
        setMuteState();
        $('#stop').addClass('active');
        video.trace('track_replay');
    };

    video.track_cfs = function () {
        setMuteState();
        if (video.params.preview) disablePreview();
        video.trace('track_cfs');
    };

    video.track_start = function () {
        setMuteState();
        $('#stop').addClass('active');
        video.trace('track_start');
    };

    video.track_end = function () {

        video.trace('track_end');
    };

    video.track_preview_start = function () {
        video.trace('track_preview_start');
        video.trace('preview: ' + video.params.preview);
        video.trace('autoplay: ' + video.params.autoplay);
        video.trace('startmuted: ' + video.params.startmuted);
    };

    video.track_preview_end = function () {
        disablePreview();
        video.trace('track_preview_end');
    };
}

function paramClicks() {
    $('.cb').click(function (e) {

        if (!$(this).parent().hasClass('inactive')) {
            var bool = $(this).is(":checked");
            var name = $(this).attr("id");

            if ($(this).attr('id') === 'preview') {

                var tnum;

                if (bool) {
                    tnum = Number(Number($('#prevTime').val()) > 0 ? $('#prevTime').val() : $('#prevTime').val('3'));
                    $('#autoplay').prop('checked', true).parent().addClass('inactive');
                    $('#startmuted').prop('checked', true).parent().addClass('inactive');
                } else {
                    tnum = 0;
                    disablePreview();
                }

                var tobj = {};
                tobj[name] = tnum;

                video.unload();
                // setTimeout(function(){
                video.load(tobj);
                // }, 1000);

            } else {
                video.params[name] = bool;

                // RESET TO REFLECT
                if (!$(this).parent().hasClass('inactive')) {
                    var tobj = {};
                    tobj[name] = bool;

                    video.unload();
                    // setTimeout(function(){
                    video.load(tobj);
                    // }, 1000);
                }
            }

            setExceptions();
        } else e.preventDefault();
    });

    $('#prevTime').val('3').keypress(function (e) {
        if (e.which == 13) {
            var pTime = Number($('#prevTime').val());

            // video.preview = pTime;

            if (pTime === 0) {
                $('#prevTime').val('3');
                disablePreview();
            } else {
                $('#prevTime').removeClass('hide');
                $('#preview').prop('checked', true);
                $('#autoplay').prop('checked', true).parent().addClass('inactive');
                $('#startmuted').prop('checked', true).parent().addClass('inactive');
                video.params.autoplay = true;
                video.params.startmuted = true;
                // $('#startmuted').prop('checked', false).parent().removeClass('inactive');
            }

            // alert(pTime +' - '+ video.preview);

            video.load({ preview: pTime });
        }
    });
}

function disablePreview() {
    $('#prevTime').addClass('hide');
    $('#preview').prop('checked', false);
    video.params.autoplay = false;
    $('#autoplay').prop('checked', false).parent().removeClass('inactive');
    video.params.startmuted = false;
    $('#startmuted').prop('checked', false).parent().addClass('inactive');
}

function uiClicks() {
    $('#destroy').click(function () {
        if ($(this).hasClass('active')) {
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

    $('#unload').click(function () {
        if ($(this).hasClass('active')) {
            video.unload();
            $('#play').removeClass('active');
            $('#pause').removeClass('active');
            $('#stop').removeClass('active');
            $('#replay').removeClass('active');
            $('#mute').removeClass('active');
            $('#unload').removeClass('active');
            $('#unmute').removeClass('active');
        }
    });

    $('#initialize').click(function () {
        if ($(this).hasClass('active')) {
            video.init();
            $('#load').addClass('active');
            $('#destroy').addClass('active');
            $(this).removeClass('active');
        }
    });

    $('#stop').click(function () {
        if ($(this).hasClass('active')) {
            video.stop();

            $('#play').addClass('active');
            $('#replay').addClass('active');
            $('#pause').removeClass('active');
            $('#stop').removeClass('active');
            $('#mute').removeClass('active');
            $('#unmute').removeClass('active');
        }
    });

    $('#play').click(function () {
        if ($(this).hasClass('active')) video.play();
    });

    $('#pause').click(function () {
        if ($(this).hasClass('active')) video.pause();
    });

    $('#mute').click(function () {
        if ($(this).hasClass('active')) video.mute();
    });

    $('#unmute').click(function () {
        if ($(this).hasClass('active')) video.unmute();
    });

    $('#replay').click(function () {
        if ($(this).hasClass('active')) video.replay();
    });

    $('#load').click(function () {
        if ($(this).hasClass('active')) {
            loadVid();
            $('#play').addClass('active');
            $('#unload').addClass('active');
            $('#destroy').addClass('active');
            $('#initialize').removeClass('active');
        }
    });

    $('#defaults').click(resetVariables);

    $('#ppPoster').click(function () {
        $('#poster').val(poster);
    });

    $('#reflow').click(function () {
        $('#videoPlayer').css({
            'height': $('#height').val() + 'px',
            'width': $('#width').val() + 'px'
        });

        video.reflow();
    });

    $('#ppMulti').click(ppMulti);

    $('#ppSingle').click(function () {
        $('#sources').val(singleSource);
    });
}

function setMuteState() {
    if (!video.proxy.muted) {
        $('#mute').addClass('active');
        $('#unmute').removeClass('active');
    } else {
        $('#mute').removeClass('active');
        $('#unmute').addClass('active');
    }
}

function ppMulti() {
    $('#sources').val('');

    for (var i = 0; i < multiSource.length; i++) {
        var tstr = multiSource[i];

        if (i < multiSource.length - 1) tstr += ",\r\n";

        $('#sources').val($('#sources').val() + tstr);
    }
}

function resetVariables() {

    for (var p in video.default_params) {
        video.params[p] = video.default_params[p];
    }

    setCheckboxes();
    setExceptions();
    video.load({});
}

function loadVid() {
    var tstr = $.trim($('#sources').val());
    var tsource;
    if (tstr.match(/,/)) tsource = tstr.replace("\n", "").replace("\r", "").split(',');else tsource = tstr.trim();
    if ($('#height').val() && $('#width').val()) {
        $('#videoPlayer').css({
            'height': $('#height').val() + 'px',
            'width': $('#width').val() + 'px'
        });
    }
    if ($('#poster').val()) {
        video.load({
            src: tsource,
            poster: $.trim($('#poster').val())
        });
    } else {
        video.load({ src: tsource });
    }
}

function setCheckboxes() {
    for (var p in video.params) {
        // console.log(p+': '+video.params[p]);
        $('#' + p).prop('checked', video.params[p]);
    }
    // console.log('');
}

function setExceptions() {

    $('.cboxwrapper').removeClass('inactive');

    if (video.params.preview) {
        // video.params.autoplay = true;
        // video.params.startmuted = true;
        $('#autoplay').parent().addClass('inactive');
        $('#startmuted').parent().addClass('inactive');
        $('#prevTime').removeClass('hide');
    }

    if (video.params.preview === 0) {
        $('#prevTime').addClass('hide').val('3');
    }

    if (video.ismobile) {
        $('#allowfullscreen').parent().addClass('inactive');
        $('#playonseek').parent().addClass('inactive');
        $('#replaywithsound').parent().addClass('inactive');
    }

    if (!video.params.autoplay) {
        video.params.startmuted = false;
        $('#startmuted').parent().addClass('inactive');
    }

    if (video.params.loop) {
        $('#replaywithsound').parent().addClass('inactive');
        $('#uniquereplay').parent().addClass('inactive');
    }

    if (video.params.chromeless) {
        $('#controlbar').parent().addClass('inactive');
    }
}
