var VideoPlayer=function(){};VideoPlayer.prototype={debug:!1,autoplay:!1,startmuted:!1,replaywithsound:!1,allowfullscreen:!1,playonseek:!0,uniquereplay:!0,chromeless:!1,elementtrigger:!0,loop:!1,progressive:!0,isinitialized:!1,ismobile:null,isfs:!1,zindex:null,proxy:null,firsttime:!0,playhead:0,duration:0,buffered:0,hasposter:!1,isready:!1,isplaying:!1,videostarted:!1,iscompleted:!1,mTypes:{mp4:"video/mp4",ogv:"video/ogg",webm:"video/webm"},svg:{bigplay:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9.984 16.5v-9l6 4.5z"></path></svg>',bigsound:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',replay:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 5.016q3.328 0 5.672 2.344t2.344 5.625q0 3.328-2.367 5.672t-5.648 2.344-5.648-2.344-2.367-5.672h2.016q0 2.484 1.758 4.242t4.242 1.758 4.242-1.758 1.758-4.242-1.758-4.242-4.242-1.758v4.031l-5.016-5.016 5.016-5.016v4.031z"></path></svg>',mute:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',unmute:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.734 1.359-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.25-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q2.484 1.219 2.484 4.031z"></path></svg>',play:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path></svg>',pause:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path></svg>',spin:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"><path d="M16 0c-8.711 0-15.796 6.961-15.995 15.624 0.185-7.558 5.932-13.624 12.995-13.624 7.18 0 13 6.268 13 14 0 1.657 1.343 3 3 3s3-1.343 3-3c0-8.837-7.163-16-16-16zM16 32c8.711 0 15.796-6.961 15.995-15.624-0.185 7.558-5.932 13.624-12.995 13.624-7.18 0-13-6.268-13-14 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 8.837 7.163 16 16 16z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" begin="0" dur="1s" repeatCount="indefinite" /></path></svg>',fs:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 32 32"><path fill="#444444" d="M27.414 24.586l-4.586-4.586-2.828 2.828 4.586 4.586-4.586 4.586h12v-12zM12 0h-12v12l4.586-4.586 4.543 4.539 2.828-2.828-4.543-4.539zM12 22.828l-2.828-2.828-4.586 4.586-4.586-4.586v12h12l-4.586-4.586zM32 0h-12l4.586 4.586-4.543 4.539 2.828 2.828 4.543-4.539 4.586 4.586z"></path></svg>'},colors_scrubber_bg:"#000",colors_scrubber_progress:"#666",colors_scrubber_playback:"#FFF",colors_play_pause:"#FFF",colors_mute_unmute:"#FFF",colors_bigplay:"#FFF",colors_bigsound:"#FFF",colors_replay:"#FFF",colors_spinner:"#FFF",colors_fs:"#FFF",dom_container:null,dom_frame:null,dom_debug:null,dom_poster:null,dom_controller:null,dom_bigplay:null,dom_bigsound:null,dom_replay:null,dom_spinner:null,dom_pbar:null,dom_phead:null,dom_play:null,dom_pause:null,dom_mute:null,dom_unmute:null,dom_fs:null,dom_template_textshadow:"0px 0px 14px rgba(0, 0, 0, 1)",barsize:27,dom_template_bigplay:function(){this.dom_bigplay=document.createElement("div"),this.dom_bigplay.innerHTML=this.svg.bigplay,this.dom_bigplay.getElementsByTagName("path")[0].style.fill=this.colors_bigplay},dom_template_bigsound:function(){this.dom_bigsound=document.createElement("div"),this.dom_bigsound.innerHTML=this.svg.bigsound,this.dom_bigsound.getElementsByTagName("path")[0].style.fill=this.colors_bigsound},dom_template_replay:function(){this.dom_replay=document.createElement("div"),this.dom_replay.innerHTML=this.svg.replay,this.dom_replay.getElementsByTagName("path")[0].style.fill=this.colors_replay},dom_template_spinner:function(){this.dom_spinner=document.createElement("div"),this.dom_spinner.innerHTML=this.svg.spin,this.dom_spinner.getElementsByTagName("path")[0].style.fill=this.colors_spinner},dom_template_play:function(){this.dom_play=document.createElement("span"),this.dom_play.innerHTML=this.svg.play,this.dom_play.getElementsByTagName("path")[0].style.fill=this.colors_play_pause},dom_template_pause:function(){this.dom_pause=document.createElement("span"),this.dom_pause.innerHTML=this.svg.pause,this.dom_pause.getElementsByTagName("path")[0].style.fill=this.colors_play_pause},dom_template_mute:function(){this.dom_mute=document.createElement("span"),this.dom_mute.innerHTML=this.svg.mute,this.dom_mute.getElementsByTagName("path")[0].style.fill=this.colors_mute_unmute},dom_template_unmute:function(){this.dom_unmute=document.createElement("span"),this.dom_unmute.innerHTML=this.svg.unmute,this.dom_unmute.getElementsByTagName("path")[0].style.fill=this.colors_mute_unmute},dom_template_fs:function(){this.dom_fs=document.createElement("span"),this.dom_fs.innerHTML=this.svg.fs,this.dom_fs.getElementsByTagName("path")[0].style.fill=this.colors_fs},userAgent:function(){var t=navigator.userAgent||navigator.vendor||window.opera;/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))?(this.ismobile=!0,this.trace("mobile browser detected")):(this.ismobile=!1,this.trace("desktop browser detected"))},init:function(t){var e=this;if(this.isinitialized)this.trace("already initialized");else{if(null===this.ismobile&&this.userAgent(),"object"==typeof t?$&&(this.dom_container=document.getElementById(t.attr("id"))):this.dom_container=document.getElementById(t),this.dom_container.style.backgroundColor="#000",this.dom_container.style.overflow="hidden",document.defaultView&&document.defaultView.getComputedStyle){var s=document.defaultView.getComputedStyle(this.dom_container,"");this.zindex=parseInt(s.getPropertyValue("z-index"),10)}else this.dom_container.currentStyle&&(this.zindex=parseInt(this.dom_container.currentStyle.zIndex,10));this.zindex||(this.zindex=0,this.trace("z-index for video container element not detected, make sure position property is set\nzIndex set to 0")),document.addEventListener("fullscreenchange",function(){e.trace("fullscreen: "+document.fullscreen),document.fullscreen?(e.track_enterfs(),e.isfs=!0):(e.track_exitfs(),e.isfs=!1)},!1),document.addEventListener("mozfullscreenchange",function(){e.trace("fullscreen: "+document.mozFullScreen),document.mozFullScreen?(e.track_enterfs(),e.isfs=!0):(e.track_exitfs(),e.isfs=!1)},!1),document.addEventListener("webkitfullscreenchange",function(){e.trace("fullscreen: "+document.webkitIsFullScreen),document.webkitIsFullScreen?(e.track_enterfs(),e.isfs=!0):(e.track_exitfs(),e.isfs=!1)},!1),this.dom_frame=document.createElement("div"),this.dom_frame.style.zIndex=this.zindex,this.dom_frame.style.position="absolute",this.dom_container.appendChild(this.dom_frame),this.dom_poster=document.createElement("div"),this.dom_poster.className="poster",this.dom_poster.style.zIndex=this.zindex+2,this.dom_poster.style.position="absolute",this.dom_poster.style.backgroundColor="#000",this.dom_poster.style.display="block",this.dom_poster.style.width="100%",this.dom_poster.style.height="100%",this.dom_poster.style.backgroundSize="cover",this.dom_poster.style.backgroundRepeat="no-repeat",this.dom_container.appendChild(this.dom_poster),this.dom_controller=document.createElement("div"),this.chromeless||(this.dom_controller.style.display="block"),this.dom_controller.style.zIndex=this.zindex+1,this.dom_controller.style.position="relative",this.dom_controller.style.height=this.barsize+"px",this.dom_controller.style.width="100%",this.dom_controller.style.top=this.dom_container.offsetHeight-this.barsize+"px",this.dom_controller.style.left=0,this.dom_controller.style.display="none",this.dom_container.appendChild(this.dom_controller);var i=document.createElement("div");i.style.display="block",i.style.position="absolute",i.style.backgroundColor="#000",i.style.opacity=.6,i.style.width="100%",i.style.height=this.barsize+"px",this.dom_controller.appendChild(i);var o=document.createElement("div");o.style.position="relative",o.style["float"]="left",o.style.top="1px",o.style.marginLeft="5px",this.dom_controller.appendChild(o),this.dom_template_play(),this.addClass(this.dom_play,"cbtn"),this.dom_play.style.display="block",this.dom_play.style.position="absolute",this.dom_play.style.cursor="pointer",o.appendChild(this.dom_play),this.dom_template_pause(),this.addClass(this.dom_pause,"cbtn"),this.dom_pause.style.display="block",this.dom_pause.style.position="absolute",this.dom_pause.style.cursor="pointer",this.dom_pause.style.display="none",o.appendChild(this.dom_pause),this.allowfullscreen&&(this.dom_template_fs(),this.addClass(this.dom_fs,"cbtn"),this.dom_fs.style.display="block",this.dom_fs.style.position="absolute",this.dom_fs.style.top="5px",this.dom_fs.style.right="10px",this.dom_fs.style.cursor="pointer",this.dom_controller.appendChild(this.dom_fs));var l=document.createElement("div");l.style.position="absolute",l.style.top="1px",l.style.textAlign="left",this.allowfullscreen?l.style.right="58px":l.style.right="30px",this.dom_controller.appendChild(l),this.dom_template_mute(),this.addClass(this.dom_mute,"cbtn"),this.dom_mute.style.display="block",this.dom_mute.style.position="absolute",this.dom_mute.style.cursor="pointer",l.appendChild(this.dom_mute),this.dom_template_unmute(),this.addClass(this.dom_unmute,"cbtn"),this.dom_unmute.style.display="block",this.dom_unmute.style.position="absolute",this.dom_unmute.style.cursor="pointer",this.dom_unmute.style.display="none",l.appendChild(this.dom_unmute);var n=document.createElement("div");n.style.position="absolute",n.style.display="block",n.style.height="4px",n.style.width="100%",n.style.top="-4px",n.style.cursor="pointer",n.style.backgroundColor=this.colors_scrubber_bg,this.dom_controller.appendChild(n),this.dom_pbar=document.createElement("div"),this.dom_pbar.style.position="absolute",this.dom_pbar.style.display="block",this.dom_pbar.style.height="100%",this.dom_pbar.style.width=0,this.dom_pbar.style.top=0,this.dom_pbar.style.backgroundColor=this.colors_scrubber_progress,n.appendChild(this.dom_pbar),this.dom_phead=document.createElement("div"),this.dom_phead.style.position="absolute",this.dom_phead.style.display="block",this.dom_phead.style.height="100%",this.dom_phead.style.width=0,this.dom_phead.style.top=0,this.dom_phead.style.backgroundColor=this.colors_scrubber_playback,n.appendChild(this.dom_phead),this.dom_template_bigplay(),this.addClass(this.dom_bigplay,"cbtn"),this.addClass(this.dom_bigplay,"v_controls_bb"),this.addClass(this.dom_bigplay,"play"),this.dom_bigplay.style.zIndex=this.zindex+3,this.dom_bigplay.style.display="block",this.dom_bigplay.style.position="absolute",this.dom_bigplay.style.cursor="pointer",this.dom_bigplay.style.textShadow=this.dom_template_textshadow,this.dom_container.appendChild(this.dom_bigplay),this.dom_bigplay.style.display="none",this.uniquereplay?this.dom_template_replay():(this.dom_replay=this.dom_bigplay.cloneNode(!0),this.removeClass(this.dom_replay,"play")),this.addClass(this.dom_replay,"cbtn"),this.addClass(this.dom_replay,"v_controls_bb"),this.addClass(this.dom_replay,"replay"),this.dom_replay.style.zIndex=this.zindex+3,this.dom_replay.style.display="block",this.dom_replay.style.position="absolute",this.dom_replay.style.cursor="pointer",this.dom_replay.style.textShadow=this.dom_template_textshadow,this.dom_container.appendChild(this.dom_replay),this.dom_replay.style.display="none",this.dom_template_bigsound(),this.addClass(this.dom_bigsound,"cbtn"),this.addClass(this.dom_bigsound,"v_controls_bb"),this.addClass(this.dom_bigsound,"sound"),this.dom_bigsound.style.zIndex=this.zindex+3,this.dom_bigsound.style.display="block",this.dom_bigsound.style.position="absolute",this.dom_bigsound.style.cursor="pointer",this.dom_bigsound.style.textShadow=this.dom_template_textshadow,this.dom_container.appendChild(this.dom_bigsound),this.dom_bigsound.style.display="none",this.dom_template_spinner(),this.addClass(this.dom_spinner,"cbtn"),this.addClass(this.dom_spinner,"v_controls_bb"),this.addClass(this.dom_spinner,"wait"),this.dom_spinner.style.zIndex=this.zindex+3,this.dom_spinner.style.display="block",this.dom_spinner.style.position="absolute",this.dom_spinner.style.textShadow=this.dom_template_textshadow,this.dom_container.appendChild(this.dom_spinner),this.dom_spinner.style.display="none",this.reflow(!0),this.isinitialized=!0,this.trace("video initialized")}},mEnter:function(){this.isfs||this.ismobile||this.chromeless||!this.videostarted||"block"===this.dom_bigsound.style.display||"block"===this.dom_replay.style.display||"block"===this.dom_bigplay.style.display||(this.dom_controller.style.display="block")},mLeave:function(){this.dom_controller.style.display="none"},mClick:function(){this.chromeless&&!this.isPlaying()&&this.play(!0),"block"!==this.dom_bigplay.style.display&&"block"!==this.dom_replay.style.display||!this.elementtrigger&&!this.ismobile||this.play(!0),"block"===this.dom_bigsound.style.display&&this.elementtrigger&&this.cfs(!0)},barSeek:function(t){var e=t.pageX-this.dom_pbar.getBoundingClientRect().left,s=e/this.dom_container.offsetWidth;this.seek(this.duration*s),"block"===this.dom_play.style.display&&this.playonseek&&this.proxy.play()},seek:function(t){this.proxy.currentTime=t},load:function(t,e){var s=this;this.trackReset(),this.isinitialized?(this.firsttime=!0,this.unload(),this.dom_spinner.style.display="block",e?(this.hasposter=!0,this.setPoster(e)):this.hasposter=!1,this.reflow(!0),setTimeout(function(){var e=document.createElement("video");if(e.width=s.dom_container.offsetWidth,e.height=s.dom_container.offsetHeight,s.dom_frame.appendChild(e),s.autoplay&&!s.ismobile&&e.setAttribute("autoplay",!0),s.progressive?e.setAttribute("preload","auto"):e.setAttribute("preload","metadata"),s.ismobile&&(s.chromeless||e.setAttribute("controls",!0),s.dom_controller.style.display="none"),s.chromeless&&(s.dom_controller.style.display="none"),"object"==typeof t)t.forEach(function(t){var i=document.createElement("source");i.src=t,i.type=s.getMediaType(t),e.appendChild(i)});else{var i=document.createElement("source");i.src=t,i.type=s.getMediaType(t),e.appendChild(i)}s.proxy=e,s.setListeners(),!s.hasposter&&s.ismobile&&(s.dom_spinner.style.display="none",s.dom_bigplay.style.display="block"),s.proxy.style.display="none",s.proxy.addEventListener("click",function(t){s.controlHandler(t)}),s.reflow(!0)},500)):this.trace("initialize video first")},setPoster:function(t){var e=this,s=new Image;s.onload=function(){e.trace("loaded: "+t),e.dom_poster.style.backgroundImage="url("+t+")",e.dom_poster.style.display="block",e.ismobile&&(e.dom_spinner.style.display="none",e.dom_bigplay.style.display="block"),e.reflow(!0)},s.src=t},unload:function(t){this.videostarted=!1,this.isplaying=!1,this.isfs=!1,this.isready=!1,this.proxy?(t||this.trace("unloading player"),this.removeListeners(),this.dom_bigplay.style.display="none",this.dom_bigsound.style.display="none",this.dom_replay.style.display="none",this.dom_poster.style.display="none",this.dom_controller.style.display="none",this.dom_spinner.style.display="none",this.proxy.pause(),this.proxy.src="",this.proxy.load(),this.proxy.parentNode.removeChild(this.proxy),this.proxy=null,this.dom_frame.innerHTML=""):this.trace("nothing to unload"),this.trackReset()},destroy:function(){this.isinitialized?(this.unload(!0),this.dom_container.innerHTML="",this.isinitialized=!1,this.trace("destroying player")):this.trace("nothing to destroy")},setListeners:function(){var t=this;this.dom_pbar.addEventListener("click",function(e){t.barSeek(e)}),this.dom_phead.addEventListener("click",function(e){t.barSeek(e)}),this.dom_container.addEventListener("mouseenter",function(e){t.mEnter(e)}),this.dom_container.addEventListener("mouseleave",function(e){t.mLeave(e)}),this.dom_container.addEventListener("click",function(e){t.mClick(e)}),this.dom_play.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_pause.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_mute.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_unmute.addEventListener("click",function(e){t.controlHandler(e)}),this.allowfullscreen&&this.dom_fs.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigplay.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigsound.addEventListener("click",function(e){t.controlHandler(e)}),this.dom_replay.addEventListener("click",function(e){t.controlHandler(e)}),this.proxy.addEventListener("ended",function(e){t.dlEnded(e)}),this.proxy.addEventListener("play",function(e){t.dlPlay(e)}),this.proxy.addEventListener("pause",function(e){t.dlPause(e)}),this.proxy.addEventListener("volumechange",function(e){t.dlVolumeChange(e)}),this.proxy.addEventListener("timeupdate",function(e){t.dlTimeUpdate(e)}),this.proxy.addEventListener("canplay",function(e){t.dlCanPlay(e)}),this.proxy.addEventListener("progress",function(e){t.dlProgress(e)})},removeListeners:function(){var t=this;this.dom_pbar.removeEventListener("click",function(e){t.barSeek(e)}),this.dom_phead.removeEventListener("click",function(e){t.barSeek(e)}),this.dom_container.removeEventListener("mouseenter",function(e){t.mEnter(e)}),this.dom_container.removeEventListener("mouseleave",function(e){t.mLeave(e)}),this.dom_container.removeEventListener("click",function(e){t.mClick(e)}),this.dom_play.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_pause.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_mute.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_unmute.removeEventListener("click",function(e){t.controlHandler(e)}),this.allowfullscreen&&this.dom_fs.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigplay.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_bigsound.removeEventListener("click",function(e){t.controlHandler(e)}),this.dom_replay.removeEventListener("click",function(e){t.controlHandler(e)}),this.proxy.removeEventListener("ended",function(e){t.dlEnded(e)}),this.proxy.removeEventListener("play",function(e){t.dlPlay(e)}),this.proxy.removeEventListener("pause",function(e){t.dlPause(e)}),this.proxy.removeEventListener("volumechange",function(e){t.dlVolumeChange(e)}),this.proxy.removeEventListener("timeupdate",function(e){t.dlTimeUpdate(e)}),this.proxy.removeEventListener("canplay",function(e){t.dlCanPlay(e)}),this.proxy.removeEventListener("progress",function(e){t.dlProgress(e)})},dlEnded:function(){this.iscompleted=!0,this.loop?(this.callback_end(),this.play(),this.trace("looping video...")):(this.hasposter?this.dom_poster.style.display="block":this.ismobile||(this.dom_replay.style.display="block",this.dom_controller.style.display="none"),this.chromeless&&!this.ismobile||(this.dom_replay.style.display="block"),this.proxy.style.display="none",this.dom_bigsound.style.display="none",this.reflow(!0),this.callback_end(),this.track_end(),this.trackReset(),this.isplaying=!1)},dlPlay:function(){this.dom_pause.style.display="block",this.dom_play.style.display="none",this.startmuted&&this.autoplay&&!this.ismobile&&this.firsttime&&(this.proxy.muted=!0),this.callback_play(),this.track.started||this.iscompleted?this.iscompleted?(this.iscompleted=!1,this.track.started=!0,this.track_replay()):this.track_play():(this.track.started=!0,this.track_start())},dlPause:function(){this.dom_pause.style.display="none",this.dom_play.style.display="block",this.duration>this.playhead&&(this.callback_pause(),this.track_pause())},dlVolumeChange:function(){this.proxy.muted?(this.dom_mute.style.display="none",this.dom_unmute.style.display="block",this.track_mute()):(this.dom_mute.style.display="block",this.dom_unmute.style.display="none",this.dom_bigsound.style.display="none",this.track_unmute()),this.callback_volume()},dlProgress:function(){for(var t=0;t<this.proxy.buffered.length;t++)this.buffered=this.proxy.buffered.end(t)/this.duration*100;this.dom_pbar.style.width=this.buffered+"%",this.callback_loading()},dlTimeUpdate:function(){this.isplaying=!0,this.firsttime&&(this.firsttime=!1,this.videostarted=!0,this.startmuted&&this.autoplay&&!this.ismobile&&(this.proxy.muted=!0,this.chromeless||(this.dom_bigsound.style.display="block"),this.dom_controller.style.display="none",this.isplaying=!1,this.reflow(!0))),"block"===this.dom_controller.style.display&&this.ismobile&&(this.dom_controller.style.display="none"),"block"===this.dom_bigplay.style.display&&(this.dom_bigplay.style.display="none"),"block"===this.dom_replay.style.display&&(this.dom_replay.style.display="none"),"block"===this.dom_spinner.style.display&&(this.dom_spinner.style.display="none"),"block"===this.dom_poster.style.display&&(this.dom_poster.style.display="none"),"none"===this.proxy.style.display&&(this.proxy.style.display="block"),this.playhead=this.proxy.currentTime,this.duration=this.proxy.duration;var t=this.playhead/this.duration*100;this.dom_phead.style.width=t+"%",!this.track.q25&&t>=25&&(this.track.q25=!0,this.track_q25()),!this.track.q50&&t>=50&&(this.track.q50=!0,this.track_q50()),!this.track.q75&&t>=75&&(this.track.q75=!0,this.track_q75()),this.callback_progress()},dlCanPlay:function(){this.firsttime&&(this.autoplay||(this.dom_spinner.style.display="none",this.ismobile||this.chromeless||(this.dom_bigplay.style.display="block")),this.hasposter||this.autoplay||this.ismobile||(this.trace("no poster"),this.chromeless||(this.dom_bigplay.style.display="block"),this.dom_controller.style.display="none"),this.reflow(!0),this.isready=!0,this.callback_ready())},callback_end:function(){this.trace("Video Ended")},callback_play:function(){this.trace("Video Play")},callback_pause:function(){this.trace("Video Paused")},callback_volume:function(){this.trace("Video Volume Change")},callback_loading:function(){},callback_progress:function(){},callback_ready:function(){this.trace("Video Ready")},track:{started:!1,q25:!1,q50:!1,q75:!1},trackReset:function(){var t=this;this.track.started=!1,this.track.q25=!1,this.track.q50=!1,this.track.q75=!1},track_start:function(){},track_play:function(){},track_replay:function(){},track_end:function(){},track_pause:function(){},track_mute:function(){},track_unmute:function(){},track_q25:function(){},track_q50:function(){},track_q75:function(){},track_enterfs:function(){},track_exitfs:function(){},controlHandler:function(t){switch(t.currentTarget){case this.dom_play:this.proxy.play();break;case this.dom_pause:this.proxy.pause();break;case this.dom_mute:this.proxy.muted=!0;break;case this.dom_unmute:this.proxy.muted=!1;break;case this.dom_fs:this.goFS();break;case this.dom_bigplay:this.proxy.play(),this.dom_spinner.style.display="block",this.dom_bigplay.style.display="none",this.reflow(!0);break;case this.dom_replay:this.replay(),(this.replaywithsound||this.ismobile)&&(this.proxy.muted=!1),this.ismobile||this.chromeless?this.dom_controller.style.display="none":this.dom_controller.style.display="block",this.trackReset();break;case this.dom_bigsound:this.cfs(!0);break;case this.proxy:this.elementtrigger&&"block"===this.dom_play.style.display&&"none"===this.dom_bigsound.style.display&&!this.ismobile&&this.play(),this.elementtrigger&&"block"===this.dom_pause.style.display&&"none"===this.dom_bigsound.style.display&&!this.ismobile&&this.pause()}},play:function(t){this.proxy.play(),!t||this.ismobile||this.chromeless||(this.dom_controller.style.display="block")},pause:function(){this.proxy.pause()},stop:function(){this.seek(0),this.pause(),this.isplaying=!1,this.trackReset(),this.iscompleted=!1},replay:function(){this.dom_spinner.style.display="block",this.dom_replay.style.display="none",this.reflow(!0),this.proxy.play(),this.seek(0)},mute:function(){this.proxy.muted=!0},unmute:function(){this.proxy.muted=!1},isMuted:function(){return this.proxy.muted},isPlaying:function(){return this.isplaying},cfs:function(t){this.proxy.muted=!1,this.seek(0),!t||this.ismobile||this.chromeless||(this.dom_controller.style.display="block")},goFS:function(){this.proxy.requestFullscreen?this.proxy.requestFullscreen():this.proxy.mozRequestFullScreen?this.proxy.mozRequestFullScreen():this.proxy.webkitRequestFullscreen&&this.proxy.webkitRequestFullscreen()},getMediaType:function(t){return this.mTypes[t.split(".")[t.split(".").length-1]]},reflow:function(t){this.isinitialized?(this.proxy&&(this.proxy.width=this.dom_container.offsetWidth,this.proxy.height=this.dom_container.offsetHeight),this.dom_controller.style.top=this.dom_container.offsetHeight-this.barsize+"px",this.dom_controller.style.left=0,this.dom_bigplay.style.top=(this.dom_container.offsetHeight-this.dom_bigplay.offsetHeight)/2+"px",this.dom_bigplay.style.left=(this.dom_container.offsetWidth-this.dom_bigplay.offsetWidth)/2+"px",this.dom_replay.style.top=(this.dom_container.offsetHeight-this.dom_replay.offsetHeight)/2+"px",this.dom_replay.style.left=(this.dom_container.offsetWidth-this.dom_replay.offsetWidth)/2+"px",this.dom_bigsound.style.top=(this.dom_container.offsetHeight-this.dom_bigsound.offsetHeight)/2+"px",this.dom_bigsound.style.left=(this.dom_container.offsetWidth-this.dom_bigsound.offsetWidth)/2+"px",this.dom_spinner.style.top=(this.dom_container.offsetHeight-this.dom_spinner.offsetHeight)/2+"px",this.dom_spinner.style.left=(this.dom_container.offsetWidth-this.dom_spinner.offsetWidth)/2+"px",t||this.trace("reflow video")):t||this.trace("reflow useless: video elements aren't ready")},trace:function(t){this.debug&&this.dom_debug&&(console&&console.log(t),this.dom_debug.innerHTML+=t+"<br>")},addClass:function(t,e){t.classList?t.classList.add(e):t.className+=" "+e},removeClass:function(t,e){t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")},listMethods:function(){}};