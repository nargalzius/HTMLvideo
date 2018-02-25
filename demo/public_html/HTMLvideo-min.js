"use strict";function VideoPlayer(){}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};VideoPlayer.prototype={debug:!1,autoplay:!1,startmuted:!1,replaywithsound:!0,allowfullscreen:!1,playonseek:!0,uniquereplay:!1,chromeless:!1,elementtrigger:!0,elementplayback:!0,bigbuttons:!0,controlbar:!0,loop:!1,progressive:!0,inline:!0,preview:0,initialized:!1,ismobile:null,isfs:!1,zindex:null,proxy:null,firsttime:!0,playhead:0,duration:0,buffered:0,hasposter:!1,ready:!1,playing:!1,started:!1,completed:!1,restartOnPlay:!1,mTypes:{mp4:"video/mp4",ogv:"video/ogg",webm:"video/webm"},isSafari:function t(){return!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)},checkForMobile:function t(){var e=["desktop"],s=!0;if("undefined"!=typeof device)for(var i=0;i<e.length;i++){var o=void 0;o=new RegExp(e[i],"i"),window.document.documentElement.className.match(o)&&(s=!1)}else s="ontouchstart"in window;s?(this.ismobile=!0,this.trace("mobile browser detected")):(this.ismobile=!1,this.trace("desktop browser detected"))},svg:{bigplay:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9.984 16.5v-9l6 4.5z"></path></svg>',bigsound:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',replay:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 5.016q3.328 0 5.672 2.344t2.344 5.625q0 3.328-2.367 5.672t-5.648 2.344-5.648-2.344-2.367-5.672h2.016q0 2.484 1.758 4.242t4.242 1.758 4.242-1.758 1.758-4.242-1.758-4.242-4.242-1.758v4.031l-5.016-5.016 5.016-5.016v4.031z"></path></svg>',mute:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',unmute:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.734 1.359-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.25-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q2.484 1.219 2.484 4.031z"></path></svg>',play:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path></svg>',pause:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path></svg>',spin:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"><path d="M16 0c-8.711 0-15.796 6.961-15.995 15.624 0.185-7.558 5.932-13.624 12.995-13.624 7.18 0 13 6.268 13 14 0 1.657 1.343 3 3 3s3-1.343 3-3c0-8.837-7.163-16-16-16zM16 32c8.711 0 15.796-6.961 15.995-15.624-0.185 7.558-5.932 13.624-12.995 13.624-7.18 0-13-6.268-13-14 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 8.837 7.163 16 16 16z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" begin="0" dur="1s" repeatCount="indefinite" /></path></svg>',fs:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 32 32"><path fill="#444444" d="M27.414 24.586l-4.586-4.586-2.828 2.828 4.586 4.586-4.586 4.586h12v-12zM12 0h-12v12l4.586-4.586 4.543 4.539 2.828-2.828-4.543-4.539zM12 22.828l-2.828-2.828-4.586 4.586-4.586-4.586v12h12l-4.586-4.586zM32 0h-12l4.586 4.586-4.543 4.539 2.828 2.828 4.543-4.539 4.586 4.586z"></path></svg>'},centered_controls:[],colors_scrubber_bg:"#000",colors_scrubber_progress:"#666",colors_scrubber_playback:"#FFF",colors_play_pause:"#FFF",colors_mute_unmute:"#FFF",colors_bigplay:"#FFF",colors_bigsound:"#FFF",colors_replay:"#FFF",colors_spinner:"#FFF",colors_fs:"#FFF",colors_bg:"rgba(0,0,0,0.4)",dom_container:null,dom_frame:null,dom_debug:null,dom_poster:null,dom_controller:null,dom_bigplay:null,dom_preview:null,dom_bigsound:null,dom_replay:null,dom_spinner:null,dom_pbar:null,dom_phead:null,dom_play:null,dom_pause:null,dom_mute:null,dom_unmute:null,dom_fs:null,dom_template_textshadow:"0px 0px 14px rgba(0, 0, 0, 1)",barsize:27,notifications:{volume:!1,start:!0,preview_start:!0,play:!0,pause:!0},loadDelay:500,disableNotification:function t(e){this.notifications[e]=!1},enableNotifications:function t(){var e=this.notifications;setTimeout(function(){for(var t in e)e[t]=!0},100)},dom_template_bigplay:function t(){this.dom_bigplay=document.createElement("div"),this.dom_bigplay.style.backgroundColor=this.colors_bg,this.setVendor(this.dom_bigplay,"borderRadius","32px"),this.dom_bigplay.innerHTML=this.svg.bigplay,this.dom_bigplay.getElementsByTagName("path")[0].style.fill=this.colors_bigplay},dom_template_bigsound:function t(){this.dom_bigsound=document.createElement("div"),this.dom_bigsound.style.backgroundColor=this.colors_bg,this.setVendor(this.dom_bigsound,"borderRadius","32px"),this.dom_bigsound.innerHTML=this.svg.bigsound,this.dom_bigsound.getElementsByTagName("path")[0].style.fill=this.colors_bigsound},dom_template_replay:function t(){this.dom_replay=document.createElement("div"),this.dom_replay.style.backgroundColor=this.colors_bg,this.setVendor(this.dom_replay,"borderRadius","32px"),this.dom_replay.innerHTML=this.svg.replay,this.dom_replay.getElementsByTagName("path")[0].style.fill=this.colors_replay,this.dom_replay.getElementsByTagName("svg")[0].style.marginTop="-5px"},dom_template_spinner:function t(){this.dom_spinner=document.createElement("div"),this.dom_spinner.style.backgroundColor=this.colors_bg,this.setVendor(this.dom_spinner,"borderRadius","32px"),this.dom_spinner.innerHTML=this.svg.spin,this.dom_spinner.style.padding="5px",this.dom_spinner.style.width="32px",this.dom_spinner.style.height="32px",this.dom_spinner.getElementsByTagName("path")[0].style.fill=this.colors_spinner},dom_template_play:function t(){this.dom_play=document.createElement("span"),this.dom_play.innerHTML=this.svg.play,this.dom_play.getElementsByTagName("path")[0].style.fill=this.colors_play_pause},dom_template_pause:function t(){this.dom_pause=document.createElement("span"),this.dom_pause.innerHTML=this.svg.pause,this.dom_pause.getElementsByTagName("path")[0].style.fill=this.colors_play_pause},dom_template_mute:function t(){this.dom_mute=document.createElement("span"),this.dom_mute.innerHTML=this.svg.mute,this.dom_mute.getElementsByTagName("path")[0].style.fill=this.colors_mute_unmute},dom_template_unmute:function t(){this.dom_unmute=document.createElement("span"),this.dom_unmute.innerHTML=this.svg.unmute,this.dom_unmute.getElementsByTagName("path")[0].style.fill=this.colors_mute_unmute},dom_template_fs:function t(){this.dom_fs=document.createElement("span"),this.dom_fs.innerHTML=this.svg.fs,this.dom_fs.getElementsByTagName("path")[0].style.fill=this.colors_fs},init:function t(e){var s=this;if(this.initialized)this.trace("already initialized");else{if(null===this.ismobile&&this.checkForMobile(),this.preview&&(this.autoplay=!0,this.startmuted=!0,this.ismobile&&(this.inline=!0)),"object"===(void 0===e?"undefined":_typeof(e))?"undefined"==typeof jQuery?this.dom_playercontainer=e:this.dom_playercontainer=document.getElementById(e.attr("id")):this.dom_container=document.getElementById(e),this.dom_container.style.backgroundColor="#000",this.dom_container.style.overflow="hidden",!this.zindex&&document.defaultView&&document.defaultView.getComputedStyle){var i=document.defaultView.getComputedStyle(this.dom_container,"");this.zindex=parseInt(i.getPropertyValue("z-index"),10)}else!this.zindex&&this.dom_container.currentStyle&&(this.zindex=parseInt(this.dom_container.currentStyle.zIndex,10));this.zindex||(this.zindex=0,this.trace("z-index for video container element not detected, make sure position property is set.\nzIndex set to 0")),document.addEventListener("fullscreenchange",function(){s.trace("fullscreen: "+document.fullscreen),document.fullscreen?(s.track_enterfs(),s.isfs=!0):(s.track_exitfs(),s.isfs=!1)},!1),document.addEventListener("mozfullscreenchange",function(){s.trace("fullscreen: "+document.mozFullScreen),document.mozFullScreen?(s.track_enterfs(),s.isfs=!0):(s.track_exitfs(),s.isfs=!1)},!1),document.addEventListener("webkitfullscreenchange",function(){s.trace("fullscreen: "+document.webkitIsFullScreen),document.webkitIsFullScreen?(s.track_enterfs(),s.isfs=!0):(s.track_exitfs(),s.isfs=!1)},!1),this.dom_frame=document.createElement("div"),this.dom_frame.style.zIndex=this.zindex,this.dom_frame.style.position="absolute",this.dom_container.appendChild(this.dom_frame),this.dom_poster=document.createElement("div"),this.dom_poster.className="poster",this.dom_poster.style.zIndex=this.zindex+1,this.dom_poster.style.position="absolute",this.dom_poster.style.backgroundColor="#000",this.dom_poster.style.display="block",this.dom_poster.style.width="100%",this.dom_poster.style.height="100%",this.dom_poster.style.backgroundSize="cover",this.dom_poster.style.backgroundRepeat="no-repeat",this.dom_container.appendChild(this.dom_poster),this.elementtrigger&&(this.dom_poster.style.cursor="pointer"),this.dom_controller=document.createElement("div"),this.dom_controller.style.display=this.controlbar?"block":"none",this.dom_controller.style.zIndex=this.zindex,this.dom_controller.style.position="relative",this.dom_controller.style.height=this.barsize+"px",this.dom_controller.style.width="100%",this.dom_controller.style.top=this.dom_container.offsetHeight-this.barsize+"px",this.dom_controller.style.left=0,this.dom_controller.style.display="none",this.dom_controller.className="v_control_bar",this.chromeless||this.dom_container.appendChild(this.dom_controller);var o=document.createElement("div");o.style.display="block",o.style.position="absolute",o.style.backgroundColor="#000",o.style.opacity=.6,o.style.width="100%",o.style.height=this.barsize+"px",this.dom_controller.appendChild(o);var l=document.createElement("div");l.style.position="relative",l.style.float="left",l.style.top="1px",l.style.marginLeft="5px",l.className="v_control_pp",this.dom_controller.appendChild(l),this.dom_template_play(),this.addClass(this.dom_play,"cbtn"),this.addClass(this.dom_play,"v_control_sb"),this.addClass(this.dom_play,"play"),this.dom_play.style.display="block",this.dom_play.style.position="absolute",this.dom_play.style.cursor="pointer",l.appendChild(this.dom_play),this.dom_template_pause(),this.addClass(this.dom_pause,"cbtn"),this.addClass(this.dom_pause,"v_control_sb"),this.addClass(this.dom_pause,"pause"),this.dom_pause.style.display="block",this.dom_pause.style.position="absolute",this.dom_pause.style.cursor="pointer",this.dom_pause.style.display="none",l.appendChild(this.dom_pause),this.allowfullscreen&&(this.dom_template_fs(),this.addClass(this.dom_fs,"cbtn"),this.addClass(this.dom_fs,"v_control_sb"),this.addClass(this.dom_fs,"fs"),this.dom_fs.style.position="absolute",this.dom_fs.style.display="block",this.dom_fs.style.top="5px",this.dom_fs.style.right="10px",this.dom_fs.style.cursor="pointer",this.dom_controller.appendChild(this.dom_fs));var n=document.createElement("div");n.style.position="absolute",n.style.top="0px",n.className="v_control_mu",n.style.textAlign="left",this.allowfullscreen?n.style.right="58px":n.style.right="30px",this.dom_controller.appendChild(n),this.dom_template_mute(),this.addClass(this.dom_mute,"cbtn"),this.addClass(this.dom_mute,"v_control_sb"),this.addClass(this.dom_mute,"mute"),this.dom_mute.style.display="block",this.dom_mute.style.position="absolute",this.dom_mute.style.cursor="pointer",n.appendChild(this.dom_mute),this.dom_template_unmute(),this.addClass(this.dom_unmute,"cbtn"),this.addClass(this.dom_unmute,"v_control_sb"),this.addClass(this.dom_unmute,"unmute"),this.dom_unmute.style.display="block",this.dom_unmute.style.position="absolute",this.dom_unmute.style.cursor="pointer",this.dom_unmute.style.display="none",n.appendChild(this.dom_unmute);var a=document.createElement("div");a.style.position="absolute",a.style.display="block",a.style.height="4px",a.style.width="100%",a.style.top="-4px",a.style.cursor="pointer",a.style.backgroundColor=this.colors_scrubber_bg,a.className="scrubber",this.dom_controller.appendChild(a),this.dom_pbar=document.createElement("div"),this.dom_pbar.style.position="absolute",this.dom_pbar.style.display="block",this.dom_pbar.style.height="100%",this.dom_pbar.style.width=0,this.dom_pbar.style.top=0,this.dom_pbar.style.backgroundColor=this.colors_scrubber_progress,this.dom_pbar.className="playbar",a.appendChild(this.dom_pbar),this.dom_phead=document.createElement("div"),this.dom_phead.style.position="absolute",this.dom_phead.style.display="block",this.dom_phead.style.height="100%",this.dom_phead.style.width=0,this.dom_phead.style.top=0,this.dom_phead.style.backgroundColor=this.colors_scrubber_playback,this.dom_phead.className="playhead",a.appendChild(this.dom_phead),this.dom_template_bigplay(),this.addClass(this.dom_bigplay,"cbtn"),this.addClass(this.dom_bigplay,"v_control_bb"),this.addClass(this.dom_bigplay,"play"),this.dom_bigplay.style.zIndex=this.zindex+2,this.dom_bigplay.style.display="block",this.dom_bigplay.style.position="absolute",this.dom_bigplay.style.cursor="pointer",this.dom_bigplay.style.textShadow=this.dom_template_textshadow,this.chromeless||this.dom_container.appendChild(this.dom_bigplay),this.dom_bigplay.style.display="none",this.centered_controls.push(this.dom_bigplay),this.dom_preview=this.dom_bigplay.cloneNode(!0),this.addClass(this.dom_preview,"cbtn"),this.addClass(this.dom_preview,"v_control_bb"),this.addClass(this.dom_preview,"play"),this.dom_preview.style.zIndex=this.zindex+2,this.dom_preview.style.display="block",this.dom_preview.style.position="absolute",this.dom_preview.style.cursor="pointer",this.chromeless||this.dom_container.appendChild(this.dom_preview),this.dom_preview.style.display="none",this.centered_controls.push(this.dom_preview),this.uniquereplay?this.dom_template_replay():(this.dom_replay=this.dom_bigplay.cloneNode(!0),this.removeClass(this.dom_replay,"play")),this.addClass(this.dom_replay,"cbtn"),this.addClass(this.dom_replay,"v_control_bb"),this.addClass(this.dom_replay,"replay"),this.dom_replay.style.zIndex=this.zindex+2,this.dom_replay.style.display="block",this.dom_replay.style.position="absolute",this.dom_replay.style.cursor="pointer",this.chromeless||this.dom_container.appendChild(this.dom_replay),this.dom_replay.style.display="none",this.centered_controls.push(this.dom_replay),this.dom_template_bigsound(),this.addClass(this.dom_bigsound,"cbtn"),this.addClass(this.dom_bigsound,"v_control_bb"),this.addClass(this.dom_bigsound,"sound"),this.dom_bigsound.style.zIndex=this.zindex+2,this.dom_bigsound.style.display="block",this.dom_bigsound.style.position="absolute",this.dom_bigsound.style.cursor="pointer",this.chromeless||this.dom_container.appendChild(this.dom_bigsound),this.dom_bigsound.style.display="none",this.centered_controls.push(this.dom_bigsound),this.dom_template_spinner(),this.addClass(this.dom_spinner,"cbtn"),this.addClass(this.dom_spinner,"v_control_bb"),this.addClass(this.dom_spinner,"wait"),this.dom_spinner.style.zIndex=this.zindex+2,this.dom_spinner.style.display="block",this.dom_spinner.style.position="absolute",this.dom_container.appendChild(this.dom_spinner),this.dom_spinner.style.display="none",this.centered_controls.push(this.dom_spinner),this.reflow(!0),this.initialized=!0,this.trace("video initialized")}},mEnter:function t(){!this.started||this.isfs||this.ismobile||"block"===this.dom_bigsound.style.display||"block"===this.dom_replay.style.display||"block"===this.dom_bigplay.style.display||"block"===this.dom_preview.style.display||(this.dom_controller.style.display=this.controlbar?"block":"none")},mLeave:function t(){this.dom_controller.style.display="none"},mClick:function t(){this.elementtrigger&&(this.isPlaying()||this.play(!0),"block"!==this.dom_bigplay.style.display&&"block"!==this.dom_replay.style.display&&"block"!==this.dom_preview.style.display||this.play(!0),"block"===this.dom_bigsound.style.display&&this.cfs(!0))},barSeek:function t(e){var s=e.pageX-this.dom_pbar.getBoundingClientRect().left,i=s/this.dom_container.offsetWidth;this.seek(this.duration*i),"block"===this.dom_play.style.display&&this.playonseek&&this.proxy.play()},seek:function t(e){this.proxy.currentTime=e},load:function t(e,s){var i=this;this.trackReset(),this.initialized?(this.firsttime=!0,this.unload(),this.dom_spinner.style.display="block",s?(this.hasposter=!0,this.setPoster(s)):this.hasposter=!1,this.reflow(!0),setTimeout(function(){var t=document.createElement("video");if(t.width=i.dom_container.offsetWidth,t.height=i.dom_container.offsetHeight,i.autoplay&&("autoplay"in t&&(t.autoplay=!0),(i.ismobile||i.isSafari)&&(i.inline=!0,i.startmuted=!0)),i.startmuted&&(t.muted=!0),i.inline&&("playsInline"in document.createElement("video")?t.playsInline=!0:(i.inline=!1,i.ismobile&&(i.autoplay=!1,i.startmuted=!1,i.preview=0,t.muted=!1,t.autoplay=!1))),i.progressive?t.preload="auto":t.preload="metadata",i.chromeless?(i.dom_controller.style.display="none",t.controls=!1):i.ismobile&&(i.dom_controller.style.display="none",i.autoplay||(t.controls=!!i.controlbar)),"object"===(void 0===e?"undefined":_typeof(e)))e.forEach(function(e){var s=document.createElement("source");s.src=e,s.type=i.getMediaType(e),t.appendChild(s)});else{var o=document.createElement("source");o.src=e,o.type=i.getMediaType(e),t.appendChild(o)}s&&(t.poster=s),i.elementtrigger&&(t.style.cursor="pointer"),i.dom_frame.appendChild(t),i.proxy=t,i.setListeners(),i.hasposter||!i.ismobile||i.autoplay||(i.dom_spinner.style.display="none",i.dom_bigplay.style.display="block"),i.ismobile&&i.autoplay?i.proxy.style.display="block":i.proxy.style.display="none",i.proxy.addEventListener("click",function(t){i.controlHandler(t)}),i.reflow(!0)},this.loadDelay)):this.trace("initialize video first")},setPoster:function t(e){var s=this,i=new Image;i.onload=function(){s.trace("loaded: "+e),s.dom_poster.style.backgroundImage="url("+e+")",s.dom_poster.style.display="block",s.autoplay?(s.dom_spinner.style.display="block",s.dom_bigplay.style.display="none"):(s.dom_spinner.style.display="none",s.dom_bigplay.style.display="block"),s.reflow(!0)},i.src=e},unload:function t(e){this.started=!1,this.playing=!1,this.isfs=!1,this.ready=!1,this.playhead=0,this.firsttime=!0,this.completed=!1,this.restartOnPlay=!1,this.hasposter=!1,this.playhead=0,this.duration=0,this.buffered=0,this.proxy&&(e||this.trace("unloading player"),this.removeListeners(),this.dom_bigplay.style.display="none",this.dom_bigsound.style.display="none",this.dom_replay.style.display="none",this.dom_poster.style.display="none",this.dom_controller.style.display="none",this.dom_spinner.style.display="none",this.proxy.pause(),this.proxy.src="",this.proxy.load(),this.proxy.parentNode.removeChild(this.proxy),this.proxy=null,this.dom_frame.innerHTML=""),this.trackReset()},destroy:function t(){this.initialized?(this.unload(!0),this.dom_container.innerHTML="",this.initialized=!1,this.trace("destroying player")):this.trace("nothing to destroy")},setListeners:function t(){var e=this;this.dom_pbar.addEventListener("click",function(t){e.barSeek(t)}),this.dom_phead.addEventListener("click",function(t){e.barSeek(t)}),this.dom_container.addEventListener("mouseenter",function(t){e.mEnter(t)}),this.dom_container.addEventListener("mouseleave",function(t){e.mLeave(t)}),this.dom_container.addEventListener("click",function(t){e.mClick(t)}),this.dom_play.addEventListener("click",function(t){e.controlHandler(t)}),this.dom_pause.addEventListener("click",function(t){e.controlHandler(t)}),this.dom_mute.addEventListener("click",function(t){e.controlHandler(t)}),this.dom_unmute.addEventListener("click",function(t){e.controlHandler(t)}),this.dom_bigplay.addEventListener("click",function(t){e.controlHandler(t)}),this.dom_bigsound.addEventListener("click",function(t){e.controlHandler(t)}),this.dom_preview.addEventListener("click",function(t){e.controlHandler(t)}),this.dom_replay.addEventListener("click",function(t){e.controlHandler(t)}),this.allowfullscreen&&this.dom_fs.addEventListener("click",function(t){e.controlHandler(t)}),this.proxy.addEventListener("ended",function(t){e.dlEnded(t)}),this.proxy.addEventListener("play",function(t){e.dlPlay(t)}),this.proxy.addEventListener("pause",function(t){e.dlPause(t)}),this.proxy.addEventListener("volumechange",function(t){e.dlVolumeChange(t)}),this.proxy.addEventListener("timeupdate",function(t){e.dlTimeUpdate(t)}),this.proxy.addEventListener("canplay",function(t){e.dlCanPlay(t)}),this.proxy.addEventListener("progress",function(t){e.dlProgress(t)})},removeListeners:function t(){var e=this;this.dom_pbar.removeEventListener("click",function(t){e.barSeek(t)}),this.dom_phead.removeEventListener("click",function(t){e.barSeek(t)}),this.dom_container.removeEventListener("mouseenter",function(t){e.mEnter(t)}),this.dom_container.removeEventListener("mouseleave",function(t){e.mLeave(t)}),this.dom_container.removeEventListener("click",function(t){e.mClick(t)}),this.dom_play.removeEventListener("click",function(t){e.controlHandler(t)}),this.dom_pause.removeEventListener("click",function(t){e.controlHandler(t)}),this.dom_mute.removeEventListener("click",function(t){e.controlHandler(t)}),this.dom_unmute.removeEventListener("click",function(t){e.controlHandler(t)}),this.dom_bigplay.removeEventListener("click",function(t){e.controlHandler(t)}),this.dom_bigsound.removeEventListener("click",function(t){e.controlHandler(t)}),this.dom_replay.removeEventListener("click",function(t){e.controlHandler(t)}),this.allowfullscreen&&this.dom_fs.removeEventListener("click",function(t){e.controlHandler(t)}),this.proxy.removeEventListener("ended",function(t){e.dlEnded(t)}),this.proxy.removeEventListener("play",function(t){e.dlPlay(t)}),this.proxy.removeEventListener("pause",function(t){e.dlPause(t)}),this.proxy.removeEventListener("volumechange",function(t){e.dlVolumeChange(t)}),this.proxy.removeEventListener("timeupdate",function(t){e.dlTimeUpdate(t)}),this.proxy.removeEventListener("canplay",function(t){e.dlCanPlay(t)}),this.proxy.removeEventListener("progress",function(t){e.dlProgress(t)})},dlEnded:function t(){this.completed=!0,this.callback_end(),this.loop?(this.play(),this.trace("looping video...")):(this.replaywithsound&&(this.disableNotification("volume"),this.unmute()),this.hasposter?this.dom_poster.style.display="block":this.ismobile||(this.dom_controller.style.display="none"),this.chromeless||this.preview||(this.dom_replay.style.display="block"),this.proxy.style.display="none",this.dom_bigsound.style.display="none",this.disableNotification("volume"),this.preview&&!this.ismobile?(this.dom_preview.style.display="block",this.preview=0,this.completed=!1,this.track_preview_end()):(this.track_end(),this.trackReset(),this.playing=!1),this.dom_poster.style.cursor="pointer"),this.reflow(!0)},dlPlay:function t(){this.dom_pause.style.display="block",this.dom_play.style.display="none",this.callback_play(),this.track.started||this.completed?this.completed?(this.completed=!1,this.track.started=!0,this.disableNotification("play"),this.disableNotification("preview_start"),this.disableNotification("start")):(this.disableNotification("preview_start"),this.disableNotification("replay"),this.disableNotification("start")):(this.track.started=!0,this.preview?(this.disableNotification("start"),this.disableNotification("play"),this.disableNotification("replay")):(this.disableNotification("play"),this.disableNotification("preview_start"),this.disableNotification("replay"))),this.restartOnPlay&&this.cfs(!0),this.notifications.preview_start&&this.track_preview_start(),this.notifications.start&&this.track_start(),this.notifications.play&&this.track_play(),this.notifications.replay&&!this.loop&&this.track_replay(),this.enableNotifications()},dlPause:function t(){this.dom_pause.style.display="none",this.dom_play.style.display="block",this.preview<this.playhead&&(this.callback_pause(),this.preview?(this.dom_bigsound.style.display="none",this.dom_preview.style.display="block",this.reflow(),this.disableNotification("end"),this.disableNotification("pause"),this.restartOnPlay=!0,this.trackReset(),this.preview=0,this.track_preview_end()):(this.disableNotification("end"),this.disableNotification("preview_end"),this.notifications.pause&&this.track_pause()))},dlVolumeChange:function t(){this.proxy.muted?(this.dom_mute.style.display="none",this.dom_unmute.style.display="block",this.notifications.volume&&this.track_mute()):(this.dom_mute.style.display="block",this.dom_unmute.style.display="none",this.dom_bigsound.style.display="none",this.notifications.volume&&this.track_unmute()),this.callback_volume()},dlProgress:function t(){if(this.proxy){for(var e=0;e<this.proxy.buffered.length;e++)this.buffered=this.proxy.buffered.end(e)/this.duration*100;this.dom_pbar.style.width=this.buffered+"%",this.callback_loading()}},dlTimeUpdate:function t(){this.playing=!0,this.proxy&&this.firsttime&&(this.firsttime=!1,this.started=!0,this.startmuted&&this.autoplay&&(this.dom_bigsound.style.display="block",this.dom_controller.style.display="none",this.playing=!1,this.reflow(!0))),"block"===this.dom_controller.style.display&&this.ismobile&&(this.dom_controller.style.display="none"),"block"===this.dom_bigplay.style.display&&(this.dom_bigplay.style.display="none"),"block"===this.dom_replay.style.display&&(this.dom_replay.style.display="none"),"block"===this.dom_preview.style.display&&(this.dom_preview.style.display="none"),"block"===this.dom_spinner.style.display&&(this.dom_spinner.style.display="none"),"block"===this.dom_poster.style.display&&(this.dom_poster.style.display="none"),this.proxy&&"none"===this.proxy.style.display&&(this.proxy.style.display="block"),this.proxy&&(this.playhead=this.proxy.currentTime,this.duration=this.proxy.duration),this.elementplayback||"none"!==this.dom_bigsound.style.display||"none"!==this.dom_preview.style.display||(this.proxy.style.cursor="auto");var e=this.playhead/this.duration*100;this.dom_phead.style.width=e+"%",!this.preview&&!this.track.q25&&e>=25&&(this.track.q25=!0,this.track_q25()),!this.preview&&!this.track.q50&&e>=50&&(this.track.q50=!0,this.track_q50()),!this.preview&&!this.track.q75&&e>=75&&(this.track.q75=!0,this.track_q75()),this.callback_progress(),this.preview&&this.playhead>this.preview&&this.pause()},dlCanPlay:function t(){this.firsttime&&(this.autoplay||(this.dom_spinner.style.display="none",this.ismobile||(this.dom_bigplay.style.display="block")),this.hasposter||this.autoplay||this.ismobile||(this.trace("no poster"),this.dom_bigplay.style.display="block",this.dom_controller.style.display="none"),this.ismobile?(this.dom_controller.style.display="none",this.autoplay?(this.dom_spinner.style.display="block",this.dom_bigplay.style.display="none",this.dom_poster.style.display="none",this.proxy.style.display="block"):this.chromeless||(this.dom_bigplay.style.display="block")):this.isSafari&&this.autoplay&&this.proxy.play(),this.reflow(!0),this.ready=!0,this.callback_ready())},callback_loading:function t(){},callback_progress:function t(){},callback_ready:function t(){this.trace("------------------ callback_ready")},callback_end:function t(){this.trace("------------------ callback_end")},callback_play:function t(){this.trace("------------------ callback_play")},callback_playerror:function t(){this.trace("------------------ callback_playerror")},callback_stop:function t(){this.trace("------------------ callback_stop")},callback_pause:function t(){this.trace("------------------ callback_pause")},callback_volume:function t(){this.trace("------------------ callback_volume"),this.proxy.muted?this.notifications.volume&&this.trace("Video Muted"):this.notifications.volume&&this.trace("Video Unmuted")},track:{started:!1,q25:!1,q50:!1,q75:!1},trackReset:function t(){this.playhead=0,this.track.started=!1,this.track.q25=!1,this.track.q50=!1,this.track.q75=!1},track_start:function t(){this.trace("------------------ track_start")},track_end:function t(){this.trace("------------------ track_end")},track_preview_start:function t(){this.trace("------------------ track_preview_start")},track_preview_end:function t(){this.trace("------------------ track_preview_end")},track_play:function t(){this.trace("------------------ track_play")},track_pause:function t(){this.trace("------------------ track_pause")},track_stop:function t(){this.trace("------------------ track_stop")},track_replay:function t(){this.trace("------------------ track_replay")},track_mute:function t(){this.trace("------------------ track_mute")},track_unmute:function t(){this.trace("------------------ track_unmute")},track_q25:function t(){this.trace("------------------ track_q25")},track_q50:function t(){this.trace("------------------ track_q50")},track_q75:function t(){this.trace("------------------ track_q75")},track_enterfs:function t(){this.trace("------------------ track_enterfs")},track_exitfs:function t(){this.trace("------------------ track_exitfs")},track_cfs:function t(){this.trace("------------------ track_cfs")},controlHandler:function t(e){switch(e.currentTarget){case this.dom_play:this.proxy.play();break;case this.dom_pause:this.proxy.pause();break;case this.dom_mute:this.proxy.muted=!0;break;case this.dom_unmute:this.proxy.muted=!1;break;case this.dom_fs:this.goFS();break;case this.dom_bigplay:this.proxy.play(),this.dom_spinner.style.display="block",this.dom_bigplay.style.display="none",this.reflow(!0);break;case this.dom_replay:this.replay(),(this.replaywithsound||this.ismobile)&&(this.disableNotification("volume"),this.proxy.muted=!1),this.ismobile?this.dom_controller.style.display="none":this.dom_controller.style.display=this.controlbar?"block":"none",this.trackReset();break;case this.dom_preview:this.proxy.play();break;case this.dom_bigsound:this.cfs(!0);break;case this.proxy:this.elementtrigger&&"block"===this.dom_play.style.display&&"none"===this.dom_bigsound.style.display&&this.elementplayback&&(!this.ismobile||this.ismobile&&this.inline&&!this.controlbar)&&this.play(),this.elementtrigger&&"block"===this.dom_pause.style.display&&"none"===this.dom_bigsound.style.display&&this.elementplayback&&(!this.ismobile||this.ismobile&&this.inline&&!this.controlbar)&&this.pause();break}},play:function t(e){var s=this;if(this.proxy){var i=this.proxy.play();void 0!==i&&i.catch(function(){s.callback_playerror()
}).then(function(){e&&!s.ismobile&&(s.dom_controller.style.display=s.controlbar?"block":"none")})}},pause:function t(){this.proxy&&this.proxy.pause()},mute:function t(){this.proxy.muted=!0},unmute:function t(){this.proxy.muted=!1},isMuted:function t(){return this.proxy.muted},isPlaying:function t(){return this.playing},stop:function t(e){var s=this;this.proxy&&(this.playing||e)&&(this.callback_stop(),this.track_stop(),this.replaywithsound&&(this.disableNotification("volume"),this.unmute()),this.seek(0),this.disableNotification("pause"),this.pause(),this.trackReset(),this.completed=!1,setTimeout(function(){s.playing=!1,s.hasposter&&(s.dom_poster.style.display="block"),s.dom_bigplay.style.display="block",s.reflow()},500))},replay:function t(){this.dom_spinner.style.display="block",this.dom_replay.style.display="none",this.reflow(!0),this.replaywithsound&&(this.disableNotification("volume"),this.unmute()),this.proxy.play(),this.seek(0)},cfsFlag:!1,cfs:function t(e){var s=this;this.proxy.muted=!1,this.seek(0),this.restartOnPlay||this.cfsFlag||(this.cfsFlag=!0,this.track_cfs(),this.ismobile&&!this.chromeless&&(this.proxy.controls=!!this.controlbar)),this.disableNotification("volume"),setTimeout(function(){s.preview=0,s.restartOnPlay=!1},50),e&&!this.ismobile&&(this.dom_controller.style.display=this.controlbar?"block":"none"),this.enableNotifications()},goFS:function t(){this.proxy.requestFullscreen?this.proxy.requestFullscreen():this.proxy.mozRequestFullScreen?this.proxy.mozRequestFullScreen():this.proxy.webkitRequestFullscreen&&this.proxy.webkitRequestFullscreen()},getMediaType:function t(e){return this.mTypes[e.split(".")[e.split(".").length-1]]},reflow:function t(e){if(this.initialized){this.proxy&&(this.proxy.width=this.dom_container.offsetWidth,this.proxy.height=this.dom_container.offsetHeight),this.dom_controller.style.top=this.dom_container.offsetHeight-this.barsize+"px",this.dom_controller.style.left=0;for(var s in this.centered_controls){var i=this.centered_controls[s];i.style.top="50%",i.style.marginTop=i.offsetHeight/2*-1+"px",i.style.left="50%",i.style.marginLeft=i.offsetWidth/2*-1+"px"}e||this.trace("reflow video")}else e||this.trace("reflow useless: video elements aren't ready")},trace:function t(e){this.debug&&(window.console&&window.console.log(e),this.dom_debug&&(this.dom_debug.innerHTML+=e+"<br>"))},setVendor:function t(e,s,i){var o=window.getComputedStyle(e,""),l=new RegExp(s+"$","i");for(var n in o)l.test(n)&&(e.style[n]=i)},addClass:function t(e,s){e.classList?e.classList.add(s):e.className+=" "+s},removeClass:function t(e,s){e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp("(^|\\b)"+s.split(" ").join("|")+"(\\b|$)","gi")," ")},help:function t(){window.open("https://github.com/nargalzius/HTMLvideo")}};