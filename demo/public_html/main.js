function init(){video=new VideoPlayer,video.userAgent(),video.progressive=!1,resetVars={autoplay:video.autoplay,startmuted:video.startmuted,replaywithsound:video.replaywithsound,allowfullscreen:video.allowfullscreen,uniquereplay:video.uniquereplay,ismobile:video.ismobile,playonseek:video.playonseek,elementtrigger:video.elementtrigger,chromeless:video.chromeless,loop:video.loop,debug:video.debug},resetVariables(),video.dom_debug=document.getElementById("debugField"),video.init("videoPlayer"),$("#debugField").click(function(){$(this).html("")}),$(".cb").click(function(e){if($(this).parent().hasClass("inactive")||"ismobile"!==$(this).attr("id")&&"allowfullscreen"!==$(this).attr("id")&&"autoplay"!==$(this).attr("id")&&"startmuted"!==$(this).attr("id")&&"chromeless"!==$(this).attr("id")&&"uniquereplay"!==$(this).attr("id")||(video.destroy(),setTimeout(function(){video.init("videoPlayer"),loadVid()},500)),$(this).parent().hasClass("inactive"))e.preventDefault();else{var t=$(this).is(":checked"),i=$(this).attr("id");video[i]=t,setExceptions()}}),$("#defaults").click(resetVariables),$("#ppMulti").click(ppMulti),$("#ppSingle").click(function(){$("#sources").val(singleSource)}),$("#load").click(loadVid),$("#ppPoster").click(function(){$("#poster").val(poster)}),$("#reflow").click(function(){$("#videoPlayer").css({height:$("#height").val()+"px",width:$("#width").val()+"px"}),video.reflow()}),$("#obliterate").click(function(){video.destroy()}),$("#destroy").click(function(){video.unload()}),$("#initialize").click(function(){video.init("videoPlayer")}),ppMulti(),$("#poster").val(poster),$("#width").val($("#videoPlayer").width()),$("#height").val($("#videoPlayer").height()),loadVid()}function ppMulti(){$("#sources").val("");for(var e=0;e<multiSource.length;e++){var t=multiSource[e];e<multiSource.length-1&&(t+=",\r\n"),$("#sources").val($("#sources").val()+t)}}function loadVid(){var e=$.trim($("#sources").val()),t;t=e.match(/,/)?e.replace("\n","").replace("\r","").split(","):e.trim(),$("#height").val()&&$("#width").val()&&$("#videoPlayer").css({height:$("#height").val()+"px",width:$("#width").val()+"px"}),$("#poster").val()?video.load(t,$.trim($("#poster").val())):video.load(t)}function resetVariables(){video.autoplay=resetVars.autoplay,video.startmuted=resetVars.startmuted,video.replaywithsound=resetVars.replaywithsound,video.allowfullscreen=resetVars.allowfullscreen,video.uniquereplay=resetVars.uniquereplay,video.ismobile=resetVars.ismobile,video.playonseek=resetVars.playonseek,video.chromeless=resetVars.chromeless,video.elementtrigger=resetVars.elementtrigger,video.loop=resetVars.loop,video.debug=resetVars.debug,$("#autoplay").prop("checked",resetVars.autoplay),$("#startmuted").prop("checked",resetVars.startmuted),$("#replaywithsound").prop("checked",resetVars.replaywithsound),$("#allowfullscreen").prop("checked",resetVars.allowfullscreen),$("#uniquereplay").prop("checked",resetVars.uniquereplay),$("#ismobile").prop("checked",resetVars.ismobile),$("#chromeless").prop("checked",resetVars.chromeless),$("#elementtrigger").prop("checked",resetVars.elementtrigger),$("#loop").prop("checked",resetVars.loop),$("#debug").prop("checked",resetVars.debug),setExceptions()}function setExceptions(){$(".cboxwrapper").removeClass("inactive"),video.autoplay||$("#startmuted").parent().addClass("inactive"),video.ismobile&&($("#autoplay").parent().addClass("inactive"),$("#startmuted").parent().addClass("inactive"),$("#allowfullscreen").parent().addClass("inactive"),$("#playonseek").parent().addClass("inactive"),$("#replaywithsound").parent().addClass("inactive"),$("#chromeless").parent().addClass("inactive"),$("#elementtrigger").parent().addClass("inactive"))}function loadSecondaryVideo(){video2=new VideoPlayer,video2.init("videoPlayer2"),video2.autoplay=!0,video2.startmuted=!0,video2.load(["http://joystick.cachefly.net/JMC/v/vid_become_legend.mp4","http://joystick.cachefly.net/JMC/v/vid_become_legend.ogv","http://joystick.cachefly.net/JMC/v/vid_become_legend.webm"])}var video,multiSource=["https://joystick.cachefly.net/resources/video/video.mp4","https://joystick.cachefly.net/resources/video/video.webm","https://joystick.cachefly.net/resources/video/video.ogv"],poster="https://joystick.cachefly.net/JMC/v/vid_become_legend.jpg",singleSource="https://joystick.cachefly.net/JMC/v/vid_become_legend.mp4";$(document).ready(init);