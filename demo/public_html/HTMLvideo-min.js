var VideoPlayer=function(){};VideoPlayer.prototype={debug:!1,autoplay:!1,startmuted:!1,replaywithsound:!0,allowfullscreen:!1,playonseek:!0,uniquereplay:!0,chromeless:!1,elementtrigger:!0,loop:!1,progressive:!0,inline:!1,preview:0,initialized:!1,ismobile:null,isfs:!1,zindex:null,proxy:null,firsttime:!0,playhead:0,duration:0,buffered:0,hasposter:!1,ready:!1,playing:!1,started:!1,completed:!1,restartOnPlay:!1,mTypes:{mp4:"video/mp4",ogv:"video/ogg",webm:"video/webm"},desktopAgents:["desktop"],checkForMobile:function(){for(var t=!0,e=0;e<this.desktopAgents.length;e++){var i;i=new RegExp(this.desktopAgents[e],"i"),window.document.documentElement.className.match(i)&&(t=!1)}t?(this.ismobile=!0,this.trace("mobile browser detected")):(this.ismobile=!1,this.trace("desktop browser detected"))},svg:{bigplay:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9.984 16.5v-9l6 4.5z"></path></svg>',bigsound:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',replay:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 5.016q3.328 0 5.672 2.344t2.344 5.625q0 3.328-2.367 5.672t-5.648 2.344-5.648-2.344-2.367-5.672h2.016q0 2.484 1.758 4.242t4.242 1.758 4.242-1.758 1.758-4.242-1.758-4.242-4.242-1.758v4.031l-5.016-5.016 5.016-5.016v4.031z"></path></svg>',mute:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',unmute:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.734 1.359-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.25-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q2.484 1.219 2.484 4.031z"></path></svg>',play:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path></svg>',pause:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path></svg>',spin:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"><path d="M16 0c-8.711 0-15.796 6.961-15.995 15.624 0.185-7.558 5.932-13.624 12.995-13.624 7.18 0 13 6.268 13 14 0 1.657 1.343 3 3 3s3-1.343 3-3c0-8.837-7.163-16-16-16zM16 32c8.711 0 15.796-6.961 15.995-15.624-0.185 7.558-5.932 13.624-12.995 13.624-7.18 0-13-6.268-13-14 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 8.837 7.163 16 16 16z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" begin="0" dur="1s" repeatCount="indefinite" /></path></svg>',fs:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 32 32"><path fill="#444444" d="M27.414 24.586l-4.586-4.586-2.828 2.828 4.586 4.586-4.586 4.586h12v-12zM12 0h-12v12l4.586-4.586 4.543 4.539 2.828-2.828-4.543-4.539zM12 22.828l-2.828-2.828-4.586 4.586-4.586-4.586v12h12l-4.586-4.586zM32 0h-12l4.586 4.586-4.543 4.539 2.828 2.828 4.543-4.539 4.586 4.586z"></path></svg>'},centered_controls:[],colors_scrubber_bg:"#000",colors_scrubber_progress:"#666",colors_scrubber_playback:"#FFF",colors_play_pause:"#FFF",colors_mute_unmute:"#FFF",colors_bigplay:"#FFF",colors_bigsound:"#FFF",colors_replay:"#FFF",colors_spinner:"#FFF",colors_fs:"#FFF",dom_container:null,dom_frame:null,dom_debug:null,dom_poster:null,dom_controller:null,dom_bigplay:null,dom_preview:null,dom_bigsound:null,dom_replay:null,dom_spinner:null,dom_pbar:null,dom_phead:null,dom_play:null,dom_pause:null,dom_mute:null,dom_unmute:null,dom_fs:null,dom_template_textshadow:"0px 0px 14px rgba(0, 0, 0, 1)",barsize:27,notifications:{volume:!1,start:!0,preview_start:!0,play:!0,pause:!0},disableNotification:function(t){this.notifications[t]=!1},enableNotifications:function(){var t=this,e=t.notifications;setTimeout(function(){for(var t in e)e[t]=!0},100)},dom_template_bigplay:function(){this.dom_bigplay=document.createElement("div"),this.dom_bigplay.innerHTML=this.svg.bigplay,this.dom_bigplay.getElementsByTagName("path")[0].style.fill=this.colors_bigplay},dom_template_bigsound:function(){this.dom_bigsound=document.createElement("div"),this.dom_bigsound.innerHTML=this.svg.bigsound,this.dom_bigsound.getElementsByTagName("path")[0].style.fill=this.colors_bigsound},dom_template_replay:function(){this.dom_replay=document.createElement("div"),this.dom_replay.innerHTML=this.svg.replay,this.dom_replay.getElementsByTagName("path")[0].style.fill=this.colors_replay},dom_template_spinner:function(){this.dom_spinner=document.createElement("div"),this.dom_spinner.innerHTML=this.svg.spin,this.dom_spinner.getElementsByTagName("path")[0].style.fill=this.colors_spinner},dom_template_play:function(){this.dom_play=document.createElement("span"),this.dom_play.innerHTML=this.svg.play,this.dom_play.getElementsByTagName("path")[0].style.fill=this.colors_play_pause},dom_template_pause:function(){this.dom_pause=document.createElement("span"),this.dom_pause.innerHTML=this.svg.pause,this.dom_pause.getElementsByTagName("path")[0].style.fill=this.colors_play_pause},dom_template_mute:function(){this.dom_mute=document.createElement("span"),this.dom_mute.innerHTML=this.svg.mute,this.dom_mute.getElementsByTagName("path")[0].style.fill=this.colors_mute_unmute},dom_template_unmute:function(){this.dom_unmute=document.createElement("span"),this.dom_unmute.innerHTML=this.svg.unmute,this.dom_unmute.getElementsByTagName("path")[0].style.fill=this.colors_mute_unmute},dom_template_fs:function(){this.dom_fs=document.createElement("span"),this.dom_fs.innerHTML=this.svg.fs,this.dom_fs.getElementsByTagName("path")[0].style.fill=this.colors_fs},init:function(t){var e=this;if(this.initialized)this.trace("already initialized");else{if(null===this.ismobile&&this.checkForMobile(),this.preview&&!this.ismobile&&(this.autoplay=!0,this.startmuted=!0),this.ismobile&&(this.autoplay=!1,this.startmuted=!1,this.preview=0),"object"==typeof t?$&&(this.dom_container=document.getElementById(t.attr("id"))):this.dom_container=document.getElementById(t),this.dom_container.style.backgroundColor="#000",this.dom_container.style.overflow="hidden",document.defaultView&&document.defaultView.getComputedStyle){var i=document.defaultView.getComputedStyle(this.dom_container,"");this.zindex=parseInt(i.getPropertyValue("z-index"),10)}else this.dom_container.currentStyle&&(this.zindex=parseInt(this.dom_container.currentStyle.zIndex,10));this.zindex||(this.zindex=0,this.trace("z-index for video container element not detected, make sure position property is set.\nzIndex set to 0")),document.addEventListener("fullscreenchange",function(){e.trace("fullscreen: "+document.fullscreen),document.fullscreen?(e.track_enterfs(),e.isfs=!0):(e.track_exitfs(),e.isfs=!1)},!1),document.addEventListener("mozfullscreenchange",function(){e.trace("fullscreen: "+document.mozFullScreen),document.mozFullScreen?(e.track_enterfs(),e.isfs=!0):(e.track_exitfs(),e.isfs=!1)},!1),document.addEventListener("webkitfullscreenchange",function(){e.trace("fullscreen: "+document.webkitIsFullScreen),document.webkitIsFullScreen?(e.track_enterfs(),e.isfs=!0):(e.track_exitfs(),e.isfs=!1)},!1),this.dom_frame=document.createElement("div"),this.dom_frame.style.zIndex=this.zindex,this.dom_frame.style.position="absolute",this.dom_container.appendChild(this.dom_frame),this.dom_poster=document.createElement("div"),this.dom_poster.className="poster",this.dom_poster.style.zIndex=this.zindex+2,this.dom_poster.style.position="absolute",this.dom_poster.style.backgroundColor="#000",this.dom_poster.style.display="block",this.dom_poster.style.width="100%",this.dom_poster.style.height="100%",this.dom_poster.style.backgroundSize="cover",this.dom_poster.style.backgroundRepeat="no-repeat",this.dom_container.appendChild(this.dom_poster),this.elementtrigger&&(this.dom_poster.style.cursor="pointer"),this.dom_controller=document.createElement("div"),this.dom_controller.style.display="block",this.dom_controller.style.zIndex=this.zindex+1,this.dom_controller.style.position="relative",this.dom_controller.style.height=this.barsize+"px",this.dom_controller.style.width="100%",this.dom_controller.style.top=this.dom_container.offsetHeight-this.barsize+"px",this.dom_controller.style.left=0,this.dom_controller.style.display="none",this.chromeless||this.dom_container.appendChild(this.dom_controller);var s=document.createElement("div");s.style.display="block",s.style.position="absolute",s.style.backgroundColor="#000",s.style.opacity=.6,s.style.width="100%",s.style.height=this.barsize+"px",this.dom_controller.appendChild(s);var o=document.createElement("div");o.style.position="relative",o.style.float="left",o.style.top="1px",o.style.marginLeft="5px",this.dom_controller.appendChild(o),this.dom_template_play(),this.addClass(this.dom_play,"cbtn"),this.dom_play.style.display="block",this.dom_play.style.position="absolute",this.dom_play.style.cursor="pointer",o.appendChild(this.dom_play),this.dom_template_pause(),this.addClass(this.dom_pause,"cbtn"),this.dom_pause.style.display="block",this.dom_pause.style.position="absolute",this.dom_pause.style.cursor="pointer",this.dom_pause.style.display="none",o.appendChild(this.dom_pause),this.allowfullscreen&&(this.dom_template_fs(),this.addClass(this.dom_fs,"cbtn"),this.dom_fs.style.position="absolute",this.dom_fs.style.display="block",this.dom_fs.style.top="5px",this.dom_fs.style.right="10px",this.dom_fs.style.cursor="pointer",this.dom_controller.appendChild(this.dom_fs));var l=document.createElement("div");l.style.position="absolute",l.style.top="1px",l.style.textAlign="left",this.allowfullscreen?l.style.right="58px":l.style.right="30px",this.dom_controller.appendChild(l),this.dom_template_mute(),this.addClass(this.dom_mute,"cbtn"),this.dom_mute.style.display="block",this.dom_mute.style.position="absolute",this.dom_mute.style.cursor="pointer",l.appendChild(this.dom_mute),this.dom_template_unmute(),this.addClass(this.dom_unmute,"cbtn"),this.dom_unmute.style.display="block",this.dom_unmute.style.position="absolute",this.dom_unmute.style.cursor="pointer",this.dom_unmute.style.display="none",l.appendChild(this.dom_unmute);var n=document.createElement("div");n.style.position="absolute",n.style.display="block",n.style.height="4px",n.style.width="100%",n.style.top="-4px",n.style.cursor="pointer",n.style.backgroundColor=this.colors_scrubber_bg,this.dom_controller.appendChild(n),this.dom_pbar=document.createElement("div"),this.dom_pbar.style.position="absolute",this.dom_pbar.style.display="block",this.dom_pbar.style.height="100%",this.dom_pbar.style.width=0,this.dom_pbar.style.top=0,this.dom_pbar.style.backgroundColor=this.colors_scrubber_progress,n.appendChild(this.dom_pbar),this.dom_phead=document.createElement("div"),this.dom_phead.style.position="absolute",this.dom_phead.style.display="block",this.dom_phead.style.height="100%",this.dom_phead.style.width=0,this.dom_phead.style.top=0,this.dom_phead.style.backgroundColor=this.colors_scrubber_playback,n.appendChild(this.dom_phead),this.dom_template_bigplay(),this.addClass(this.dom_bigplay,"cbtn"),this.addClass(this.dom_bigplay,"v_controls_bb"),this.addClass(this.dom_bigplay,"play"),this.dom_bigplay.style.zIndex=this.zindex+3,this.dom_bigplay.style.display="block",this.dom_bigplay.style.position="absolute",this.dom_bigplay.style.cursor="pointer",this.dom_bigplay.style.textShadow=this.dom_template_textshadow,this.chromeless||this.dom_container.appendChild(this.dom_bigplay),this.dom_bigplay.style.display="none",this.centered_controls.push(this.dom_bigplay),this.dom_preview=this.dom_bigplay.cloneNode(!0),this.addClass(this.dom_preview,"cbtn"),this.addClass(this.dom_preview,"v_controls_bb"),this.addClass(this.dom_preview,"play"),this.dom_preview.style.zIndex=this.zindex+3,this.dom_preview.style.display="block",this.dom_preview.style.position="absolute",this.dom_preview.style.cursor="pointer",this.dom_preview.style.textShadow=this.dom_template_textshadow,this.chromeless||this.dom_container.appendChild(this.dom_preview),this.dom_preview.style.display="none",this.centered_controls.push(this.dom_preview),this.uniquereplay?this.dom_template_replay():(this.dom_replay=this.dom_bigplay.cloneNode(!0),this.removeClass(this.dom_replay,"play")),this.addClass(this.dom_replay,"cbtn"),this.addClass(this.dom_replay,"v_controls_bb"),this.addClass(this.dom_replay,"replay"),this.dom_replay.style.zIndex=this.zindex+3,this.dom_replay.style.display="block",this.dom_replay.style.position="absolute",this.dom_replay.style.cursor="pointer",this.dom_replay.style.textShadow=this.dom_template_textshadow,this.chromeless||this.dom_container.appendChild(this.dom_replay),this.dom_replay.style.display="none",this.centered_controls.push(this.dom_replay),this.dom_template_bigsound(),this.addClass(this.dom_bigsound,"cbtn"),this.addClass(this.dom_bigsound,"v_controls_bb"),this.addClass(this.dom_bigsound,"sound"),this.dom_bigsound.style.zIndex=this.zindex+3,this.dom_bigsound.style.display="block",this.dom_bigsound.style.position="absolute",this.dom_bigsound.style.cursor="pointer",this.dom_bigsound.style.textShadow=this.dom_template_textshadow,this.chromeless||this.dom_container.appendChild(this.dom_bigsound),this.dom_bigsound.style.display="none",this.centered_controls.push(this.dom_bigsound),this.dom_template_spinner(),this.addClass(this.dom_spinner,"cbtn"),this.addClass(this.dom_spinner,"v_controls_bb"),this.addClass(this.dom_spinner,"wait"),this.dom_spinner.style.zIndex=this.zindex+3,this.dom_spinner.style.display="block",this.dom_spinner.style.position="absolute",this.dom_spinner.style.textShadow=this.dom_template_textshadow,this.dom_container.appendChild(this.dom_spinner),this.dom_spinner.style.display="none",this.centered_controls.push(this.dom_spinner),this.reflow(!0),this.initialized=!0,this.trace("video initialized")}},mEnter:function(){this.isfs||this.ismobile||!this.started||"block"===this.dom_bigsound.style.display||"block"===this.dom_replay.style.display||"block"===this.dom_bigplay.style.display||"block"===this.dom_preview.style.display||(this.dom_controller.style.display="block")},mLeave:function(){this.dom_controller.style.display="none"},mClick:function(){this.elementtrigger&&!this.isPlaying()&&this.play(!0),"block"!==this.dom_bigplay.style.display&&"block"!==this.dom_replay.style.display||!(this.elementtrigger||this.ismobile&&this.elementtrigger)||this.play(!0),"block"===this.dom_bigsound.style.display&&this.elementtrigger&&this.cfs(!0)},barSeek:function(t){var e=t.pageX-this.dom_pbar.getBoundingClientRect().left,i=e/this.dom_container.offsetWidth;this.seek(this.duration*i),"block"===this.dom_play.style.display&&this.playonseek&&this.proxy.play()},seek:function(t){this.proxy.currentTime=t},load:function(t,e){var i=this;this.trackReset(),this.initialized?(this.firsttime=!0,this.unload(),this.dom_spinner.style.display="block",e?(this.hasposter=!0,this.setPoster(e)):this.hasposter=!1,this.reflow(!0),setTimeout(function(){var e=document.createElement("video");if(e.width=i.dom_container.offsetWidth,e.height=i.dom_container.offsetHeight,i.elementtrigger&&(e.style.cursor="pointer"),i.dom_frame.appendChild(e),i.autoplay&&!i.ismobile&&e.setAttribute("autoplay",!0),i.inline&&(e.setAttribute("playsinline",""),e.setAttribute("webkit-playsinline","")),i.progressive?e.setAttribute("preload","auto"):e.setAttribute("preload","metadata"),i.ismobile&&(i.chromeless||e.setAttribute("controls",""),i.dom_controller.style.display="none"),i.chromeless&&(i.dom_controller.style.display="none"),"object"==typeof t)t.forEach(function(t){var s=document.createElement("source");s.src=t,s.type=i.getMediaType(t),e.appendChild(s)});else{var s=document.createElement("source");s.src=t,s.type=i.getMediaType(t),e.appendChild(s)}i.proxy=e,i.setListeners(),!i.hasposter&&i.ismobile&&(i.dom_spinner.style.display="none",i.dom_bigplay.style.display="block"),i.proxy.style.display="none",i.proxy.addEventListener("click",function(t){i.controlHandler(t)}),i.reflow(!0)},500)):this.trace("initialize video first")},setPoster:function(t){var e=this,i=new Image;i.onload=function(){e.trace("loaded: "+t),e.dom_poster.style.backgroundImage="url("+t+")",e.dom_poster.style.display="block",e.ismobile&&(e.dom_spinner.style.display="none",e.dom_bigplay.style.display="block"),e.reflow(!0)},i.src=t},unload:function(t){this.started=!1,this.playing=!1,this.isfs=!1,this.ready=!1,this.playhead=0,this.firsttime=!0,this.completed=!1,this.restartOnPlay=!1,this.hasposter=!1,this.playhead=0,this.duration=0,this.buffered=0,this.proxy&&(t||this.trace("unloading player"),this.removeListeners(),this.dom_bigplay.style.display="none",this.dom_bigsound.style.display="none",this.dom_replay.style.display="none",this.dom_poster.style.display="none",this.dom_controller.style.display="none",this.dom_spinner.style.display="none",this.proxy.pause(),this.proxy.src="",this.proxy.load(),this.proxy.parentNode.removeChild(this.proxy),this.proxy=null,this.dom_frame.innerHTML=""),this.trackReset()},destroy:function(){this.initialized?(this.unload(!0),this.dom_container.innerHTML="",this.initialized=!1,this.trace("destroying player")):this.trace("nothing to destroy")},setListeners:function(){var t=this;this.dom_pbar.addEventListener("click",function(e){t.barSeek(e)}),this.dom_phead.addEventListener("click",function(e){t.barSeek(e)}),this.dom_container.addEventListener("mouseenter",function(e){t.mEnter(e)}),this.dom_container.addEventListener("mouseleave",function(e){t.mLeave(e)}),this.dom_container.addEventListener("click",function(e){t.mClick(e)}),this.dom_play.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_pause.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_mute.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_unmute.addEventListener("click",function(e){t.controlHandler(e)}),this.allowfullscreen&&this.dom_fs.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigplay.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigsound.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_preview.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_replay.addEventListener("click",function(e){t.controlHandler(e)}),this.proxy.addEventListener("ended",function(e){t.dlEnded(e)}),this.proxy.addEventListener("play",function(e){t.dlPlay(e)}),this.proxy.addEventListener("pause",function(e){t.dlPause(e)}),this.proxy.addEventListener("volumechange",function(e){t.dlVolumeChange(e)}),this.proxy.addEventListener("timeupdate",function(e){t.dlTimeUpdate(e)}),this.proxy.addEventListener("canplay",function(e){t.dlCanPlay(e)}),this.proxy.addEventListener("progress",function(e){t.dlProgress(e)})},removeListeners:function(){var t=this;this.dom_pbar.removeEventListener("click",function(e){t.barSeek(e)}),this.dom_phead.removeEventListener("click",function(e){t.barSeek(e)}),this.dom_container.removeEventListener("mouseenter",function(e){t.mEnter(e)}),this.dom_container.removeEventListener("mouseleave",function(e){t.mLeave(e)}),this.dom_container.removeEventListener("click",function(e){t.mClick(e)}),this.dom_play.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_pause.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_mute.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_unmute.removeEventListener("click",function(e){t.controlHandler(e)}),this.allowfullscreen&&this.dom_fs.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigplay.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigsound.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_replay.removeEventListener("click",function(e){t.controlHandler(e)}),this.proxy.removeEventListener("ended",function(e){t.dlEnded(e)}),this.proxy.removeEventListener("play",function(e){t.dlPlay(e)}),this.proxy.removeEventListener("pause",function(e){t.dlPause(e)}),this.proxy.removeEventListener("volumechange",function(e){t.dlVolumeChange(e)}),this.proxy.removeEventListener("timeupdate",function(e){t.dlTimeUpdate(e)}),this.proxy.removeEventListener("canplay",function(e){t.dlCanPlay(e)}),this.proxy.removeEventListener("progress",function(e){t.dlProgress(e)})},dlEnded:function(){this.completed=!0,this.loop?(this.callback_end(),this.play(),this.trace("looping video...")):(this.replaywithsound&&(this.disableNotification("volume"),this.unmute()),this.hasposter?this.dom_poster.style.display="block":this.ismobile||(this.dom_replay.style.display="block",this.dom_controller.style.display="none"),this.ismobile&&(this.dom_replay.style.display="block"),this.proxy.style.display="none",this.dom_bigsound.style.display="none",this.disableNotification("volume"),this.callback_end(),this.preview&&!this.ismobile?(this.dom_preview.display="block",this.dom_replay.display="none",this.preview=0,this.completed=!1,this.track_preview_end()):(this.track_end(),this.trackReset(),this.playing=!1)),this.reflow(!0)},dlPlay:function(){this.dom_pause.style.display="block",this.dom_play.style.display="none",this.startmuted&&this.autoplay&&!this.ismobile&&this.firsttime&&(this.proxy.muted=!0),this.callback_play(),this.track.started||this.completed?this.completed?(this.completed=!1,this.track.started=!0,this.disableNotification("play"),this.disableNotification("preview_start"),this.disableNotification("start")):(this.disableNotification("preview_start"),this.disableNotification("replay"),this.disableNotification("start")):(this.track.started=!0,this.preview&&!this.ismobile?(this.disableNotification("start"),this.disableNotification("play"),this.disableNotification("replay")):(this.disableNotification("play"),this.disableNotification("preview_start"),this.disableNotification("replay"))),this.restartOnPlay&&this.cfs(!0),this.notifications.preview_start&&this.track_preview_start(),this.notifications.start&&this.track_start(),this.notifications.play&&this.track_play(),this.notifications.replay&&!this.loop&&this.track_replay(),this.enableNotifications()},dlPause:function(){this.dom_pause.style.display="none",this.dom_play.style.display="block",this.duration>this.playhead&&(this.callback_pause(),this.preview&&!this.ismobile?(this.dom_bigsound.style.display="none",this.dom_preview.style.display="block",this.reflow(),this.disableNotification("end"),this.disableNotification("pause"),this.restartOnPlay=!0,this.trackReset(),this.preview=0,this.track_preview_end()):(this.disableNotification("end"),this.disableNotification("preview_end"),this.notifications.pause&&this.track_pause()))},dlVolumeChange:function(){this.proxy.muted?(this.dom_mute.style.display="none",this.dom_unmute.style.display="block",this.notifications.volume&&this.track_mute()):(this.dom_mute.style.display="block",this.dom_unmute.style.display="none",this.dom_bigsound.style.display="none",this.notifications.volume&&this.track_unmute()),this.callback_volume()},dlProgress:function(){if(this.proxy){for(var t=0;t<this.proxy.buffered.length;t++)this.buffered=this.proxy.buffered.end(t)/this.duration*100;this.dom_pbar.style.width=this.buffered+"%",this.callback_loading()}},dlTimeUpdate:function(){this.playing=!0,this.proxy&&this.firsttime&&(this.firsttime=!1,this.started=!0,this.startmuted&&this.autoplay&&!this.ismobile&&(this.proxy.muted=!0,this.dom_bigsound.style.display="block",this.dom_controller.style.display="none",this.playing=!1,this.reflow(!0))),"block"===this.dom_controller.style.display&&this.ismobile&&(this.dom_controller.style.display="none"),"block"===this.dom_bigplay.style.display&&(this.dom_bigplay.style.display="none"),"block"===this.dom_replay.style.display&&(this.dom_replay.style.display="none"),"block"===this.dom_preview.style.display&&(this.dom_preview.style.display="none"),"block"===this.dom_spinner.style.display&&(this.dom_spinner.style.display="none"),"block"===this.dom_poster.style.display&&(this.dom_poster.style.display="none"),this.proxy&&"none"===this.proxy.style.display&&(this.proxy.style.display="block"),this.proxy&&(this.playhead=this.proxy.currentTime,this.duration=this.proxy.duration);var t=this.playhead/this.duration*100;this.dom_phead.style.width=t+"%",!this.preview&&!this.track.q25&&t>=25&&(this.track.q25=!0,this.track_q25()),!this.preview&&!this.track.q50&&t>=50&&(this.track.q50=!0,this.track_q50()),!this.preview&&!this.track.q75&&t>=75&&(this.track.q75=!0,this.track_q75()),this.callback_progress(),this.preview&&!this.ismobile&&this.playhead>this.preview&&this.pause()},dlCanPlay:function(){this.firsttime&&(this.autoplay||(this.dom_spinner.style.display="none",this.ismobile||(this.dom_bigplay.style.display="block")),this.hasposter||this.autoplay||this.ismobile||(this.trace("no poster"),this.dom_bigplay.style.display="block",this.dom_controller.style.display="none"),this.reflow(!0),this.ready=!0,this.callback_ready())},callback_end:function(){this.trace("Video Ended")},callback_play:function(){this.trace("Video Play")},callback_stop:function(){this.trace("Video Stopped (Manually)")},callback_pause:function(){this.trace("Video Paused")},callback_volume:function(){this.proxy.muted?this.notifications.volume&&this.trace("Video Muted"):this.notifications.volume&&this.trace("Video Unmuted")},callback_loading:function(){},callback_progress:function(){},callback_ready:function(){this.trace("Video Ready")},track:{started:!1,q25:!1,q50:!1,q75:!1},trackReset:function(){this.playhead=0,this.track.started=!1,this.track.q25=!1,this.track.q50=!1,this.track.q75=!1},track_start:function(){this.trace("TRACK: Start")},track_end:function(){this.trace("TRACK: End")},track_preview_start:function(){this.trace("TRACK: Preview Start")},track_preview_end:function(){this.trace("TRACK: Preview End")},track_play:function(){this.trace("TRACK: Play")},track_pause:function(){this.trace("TRACK: Pause")},track_stop:function(){this.trace("TRACK: Stop")},track_replay:function(){this.trace("TRACK: Replay")},track_mute:function(){this.trace("TRACK: Mute")},track_unmute:function(){this.trace("TRACK: Unmute")},track_q25:function(){this.trace("TRACK: 1st Quartile")},track_q50:function(){this.trace("TRACK: Midpoint")},track_q75:function(){this.trace("TRACK: 3rd Quartile")},track_enterfs:function(){this.trace("TRACK: Enter Fullscreen")},track_exitfs:function(){this.trace("TRACK: Exit Fullscreen")},track_cfs:function(){this.trace("TRACK: Click for Sound")},controlHandler:function(t){switch(t.currentTarget){case this.dom_play:this.proxy.play();break;case this.dom_pause:this.proxy.pause();break;case this.dom_mute:this.proxy.muted=!0;break;case this.dom_unmute:this.proxy.muted=!1;break;case this.dom_fs:this.goFS();break;case this.dom_bigplay:this.proxy.play(),this.dom_spinner.style.display="block",this.dom_bigplay.style.display="none",this.reflow(!0);break;case this.dom_replay:this.replay(),(this.replaywithsound||this.ismobile)&&(this.disableNotification("volume"),this.proxy.muted=!1),this.ismobile?this.dom_controller.style.display="none":this.dom_controller.style.display="block",this.trackReset();break;case this.dom_preview:this.proxy.play();break;case this.dom_bigsound:this.cfs(!0);break;case this.proxy:this.elementtrigger&&"block"===this.dom_play.style.display&&"none"===this.dom_bigsound.style.display&&!this.ismobile&&this.play(),this.elementtrigger&&"block"===this.dom_pause.style.display&&"none"===this.dom_bigsound.style.display&&!this.ismobile&&this.pause()}},play:function(t){this.proxy.play(),t&&!this.ismobile&&(this.dom_controller.style.display="block")},pause:function(){this.proxy.pause()},stop:function(t){var e=this;(this.playing||t)&&(this.callback_stop(),this.track_stop(),this.replaywithsound&&(this.disableNotification("volume"),this.unmute()),this.seek(0),this.disableNotification("pause"),this.pause(),this.trackReset(),this.completed=!1,setTimeout(function(){e.playing=!1,e.hasposter&&(e.dom_poster.style.display="block"),e.dom_bigplay.style.display="block",e.reflow()},500))},replay:function(){this.dom_spinner.style.display="block",this.dom_replay.style.display="none",this.reflow(!0),this.replaywithsound&&(this.disableNotification("volume"),this.unmute()),this.proxy.play(),this.seek(0)},mute:function(){this.proxy.muted=!0},unmute:function(){this.proxy.muted=!1},isMuted:function(){return this.proxy.muted},isPlaying:function(){return this.playing},cfsFlag:!1,cfs:function(t){var e=this;this.proxy.muted=!1,this.seek(0),this.restartOnPlay||this.cfsFlag||(this.cfsFlag=!0,this.track_cfs()),this.disableNotification("volume"),setTimeout(function(){e.preview=0,e.restartOnPlay=!1},50),t&&!this.ismobile&&(this.dom_controller.style.display="block"),this.enableNotifications()},goFS:function(){this.proxy.requestFullscreen?this.proxy.requestFullscreen():this.proxy.mozRequestFullScreen?this.proxy.mozRequestFullScreen():this.proxy.webkitRequestFullscreen&&this.proxy.webkitRequestFullscreen()},getMediaType:function(t){return this.mTypes[t.split(".")[t.split(".").length-1]]},reflow:function(t){if(this.initialized){this.proxy&&(this.proxy.width=this.dom_container.offsetWidth,this.proxy.height=this.dom_container.offsetHeight),this.dom_controller.style.top=this.dom_container.offsetHeight-this.barsize+"px",this.dom_controller.style.left=0;for(var e in this.centered_controls){var i=this.centered_controls[e];i.style.top="50%",i.style.marginTop=i.offsetHeight/2*-1+"px",i.style.left="50%",i.style.marginLeft=i.offsetWidth/2*-1+"px"}t||this.trace("reflow video")}else t||this.trace("reflow useless: video elements aren't ready")},trace:function(t){this.debug&&(window.console&&window.console.log(t),this.dom_debug&&(this.dom_debug.innerHTML+=t+"<br>"))},addClass:function(t,e){t.classList?t.classList.add(e):t.className+=" "+e},removeClass:function(t,e){t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")},listMethods:function(){}};