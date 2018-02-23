/*!
 *  HTML VIDEO HELPER
 *
 *  4.7
 *
 *  author: Carlo J. Santos
 *  email: carlosantos@gmail.com
 *  documentation: https://github.com/nargalzius/HTMLvideo
 *
 *  Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

function VideoPlayer(){}

VideoPlayer.prototype = {
	debug: false,
	autoplay: false,
	startmuted: false,
	replaywithsound: true,
	allowfullscreen: false,
	playonseek: true,
	uniquereplay: false,
	chromeless: false,
	elementtrigger: true,
	elementplayback: true,
	bigbuttons: true,
	controlbar: true,
	loop: false,
	progressive: true,
	inline: true,
	preview: 0,

	initialized: false,
	ismobile: null,
	isfs: false,
	zindex: null,
	proxy: null,
	firsttime: true,
	playhead: 0,
	duration: 0,
	buffered: 0,
	hasposter: false,
	ready: false,
	playing: false,
	started: false,
	completed: false,
	restartOnPlay: false,
	mTypes: {
		'mp4': 'video/mp4',
		'ogv': 'video/ogg',
		'webm': 'video/webm'
	},

	desktopAgents: [
		'desktop'
	],

	isSafari: function() {
		return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
	},

	checkForMobile: function() {

		const SELF = this;

		let mobileFlag = true;

		for (let i = 0; i < SELF.desktopAgents.length; i++) {
			let regex;
				regex = new RegExp(SELF.desktopAgents[i], "i");

			if( window.document.documentElement.className.match(regex) ) {
				mobileFlag = false;
			}
		}

		if( mobileFlag ) {
			SELF.ismobile = true;
			SELF.trace("mobile browser detected");
		} else {
			SELF.ismobile = false;
			SELF.trace("desktop browser detected");
		}
	},

	svg: {
		bigplay: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9.984 16.5v-9l6 4.5z"></path></svg>',
		bigsound: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',
		replay: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 5.016q3.328 0 5.672 2.344t2.344 5.625q0 3.328-2.367 5.672t-5.648 2.344-5.648-2.344-2.367-5.672h2.016q0 2.484 1.758 4.242t4.242 1.758 4.242-1.758 1.758-4.242-1.758-4.242-4.242-1.758v4.031l-5.016-5.016 5.016-5.016v4.031z"></path></svg>',
		mute: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',
		unmute: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.734 1.359-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.25-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q2.484 1.219 2.484 4.031z"></path></svg>',
		play: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path></svg>',
		pause: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path></svg>',
		spin: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"><path d="M16 0c-8.711 0-15.796 6.961-15.995 15.624 0.185-7.558 5.932-13.624 12.995-13.624 7.18 0 13 6.268 13 14 0 1.657 1.343 3 3 3s3-1.343 3-3c0-8.837-7.163-16-16-16zM16 32c8.711 0 15.796-6.961 15.995-15.624-0.185 7.558-5.932 13.624-12.995 13.624-7.18 0-13-6.268-13-14 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 8.837 7.163 16 16 16z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" begin="0" dur="1s" repeatCount="indefinite" /></path></svg>',
		fs: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 32 32"><path fill="#444444" d="M27.414 24.586l-4.586-4.586-2.828 2.828 4.586 4.586-4.586 4.586h12v-12zM12 0h-12v12l4.586-4.586 4.543 4.539 2.828-2.828-4.543-4.539zM12 22.828l-2.828-2.828-4.586 4.586-4.586-4.586v12h12l-4.586-4.586zM32 0h-12l4.586 4.586-4.543 4.539 2.828 2.828 4.543-4.539 4.586 4.586z"></path></svg>'
	},

	centered_controls: [],

	colors_scrubber_bg: '#000',
	colors_scrubber_progress: '#666',
	colors_scrubber_playback: '#FFF',
	colors_play_pause: '#FFF',
	colors_mute_unmute: '#FFF',
	colors_bigplay: '#FFF',
	colors_bigsound: '#FFF',
	colors_replay: '#FFF',
	colors_spinner: '#FFF',
	colors_fs: '#FFF',
	colors_bg: 'rgba(0,0,0,0.4)',

	dom_container: null,
	dom_frame: null,
	dom_debug: null,
	dom_poster: null,
	dom_controller: null,
	dom_bigplay: null,
	dom_preview: null,
	dom_bigsound: null,
	dom_replay: null,
	dom_spinner: null,
	dom_pbar: null,
	dom_phead: null,
	dom_play: null,
	dom_pause: null,
	dom_mute: null,
	dom_unmute: null,
	dom_fs: null,
	dom_template_textshadow: '0px 0px 14px rgba(0, 0, 0, 1)',

	barsize: 27,

	notifications: {
		volume: false,
		start: true,
		preview_start: true,
		play: true,
		pause: true
	},

	loadDelay: 500,
	
	disableNotification: function(str) {
		const SELF = this;

		SELF.notifications[str] = false;
	},	
	enableNotifications: function() {
		
		const SELF = this;
		let n = SELF.notifications;

		setTimeout(function(){
			for(let p in n) { n[p] = true; }
		}, 100);
	},
	dom_template_bigplay: function() {
		const SELF = this;

		SELF.dom_bigplay = document.createElement('div');
		SELF.dom_bigplay.style.backgroundColor = SELF.colors_bg;
		SELF.setVendor(SELF.dom_bigplay, 'borderRadius', '32px');
		SELF.dom_bigplay.innerHTML = SELF.svg.bigplay;
		SELF.dom_bigplay.getElementsByTagName('path')[0].style.fill = SELF.colors_bigplay;
		
	},
	dom_template_bigsound: function() {
		const SELF = this;

		SELF.dom_bigsound = document.createElement('div');
		SELF.dom_bigsound.style.backgroundColor = SELF.colors_bg;
		SELF.setVendor(SELF.dom_bigsound, 'borderRadius', '32px');
		SELF.dom_bigsound.innerHTML = SELF.svg.bigsound;
		SELF.dom_bigsound.getElementsByTagName('path')[0].style.fill = SELF.colors_bigsound;
	},
	dom_template_replay: function() {
		const SELF = this;

		SELF.dom_replay = document.createElement('div');
		SELF.dom_replay.style.backgroundColor = SELF.colors_bg;
		SELF.setVendor(SELF.dom_replay, 'borderRadius', '32px');
		SELF.dom_replay.innerHTML = SELF.svg.replay;
		SELF.dom_replay.getElementsByTagName('path')[0].style.fill = SELF.colors_replay;
		SELF.dom_replay.getElementsByTagName('svg')[0].style.marginTop = '-5px';
	},
	dom_template_spinner: function() {
		const SELF = this;

		SELF.dom_spinner = document.createElement('div');
		SELF.dom_spinner.style.backgroundColor = SELF.colors_bg;
		SELF.setVendor(SELF.dom_spinner, 'borderRadius', '32px');
		SELF.dom_spinner.innerHTML = SELF.svg.spin;
		SELF.dom_spinner.style.padding = '5px';
		SELF.dom_spinner.style.width = '32px';
		SELF.dom_spinner.style.height = '32px';
		SELF.dom_spinner.getElementsByTagName('path')[0].style.fill = SELF.colors_spinner;

	},
	dom_template_play: function() {
		const SELF = this;

		SELF.dom_play = document.createElement('span');
		SELF.dom_play.innerHTML = SELF.svg.play;
		SELF.dom_play.getElementsByTagName('path')[0].style.fill = SELF.colors_play_pause;

	},
	dom_template_pause: function() {
		const SELF = this;

		SELF.dom_pause = document.createElement('span');
		SELF.dom_pause.innerHTML = SELF.svg.pause;
		SELF.dom_pause.getElementsByTagName('path')[0].style.fill = SELF.colors_play_pause;
	},
	dom_template_mute: function() {
		const SELF = this;

		SELF.dom_mute = document.createElement('span');
		SELF.dom_mute.innerHTML = SELF.svg.mute;
		SELF.dom_mute.getElementsByTagName('path')[0].style.fill = SELF.colors_mute_unmute;
	},
	dom_template_unmute: function() {
		const SELF = this;

		SELF.dom_unmute = document.createElement('span');
		SELF.dom_unmute.innerHTML = SELF.svg.unmute;
		SELF.dom_unmute.getElementsByTagName('path')[0].style.fill = SELF.colors_mute_unmute;
	},
	dom_template_fs: function() {
		const SELF = this;

		SELF.dom_fs = document.createElement('span');
		SELF.dom_fs.innerHTML = SELF.svg.fs;
		SELF.dom_fs.getElementsByTagName('path')[0].style.fill = SELF.colors_fs;
	},

	init: function(vc) {

		const SELF = this;

		if(!SELF.initialized)
		{
			if(SELF.ismobile === null) { SELF.checkForMobile(); }

			if(SELF.preview) {
				SELF.autoplay = true;
				SELF.startmuted = true;
				
				if(SELF.ismobile)
					SELF.inline = true;
			}

			if(typeof vc === 'object') {
				if( typeof(jQuery) === 'undefined' ) { 
					SELF.dom_playercontainer = vc; 
				} else {
					SELF.dom_playercontainer = document.getElementById( vc.attr('id') ); 
				}
			} else {
				SELF.dom_container = document.getElementById( vc );
			}

			SELF.dom_container.style.backgroundColor = '#000';
			SELF.dom_container.style.overflow = 'hidden';

			// GET Z-INDEX

			if( !SELF.zindex && document.defaultView && document.defaultView.getComputedStyle ) {
				let s = document.defaultView.getComputedStyle( SELF.dom_container, '' );
				SELF.zindex = parseInt( s.getPropertyValue('z-index'), 10 );
			} else 
			if( !SELF.zindex && SELF.dom_container.currentStyle ) {
				SELF.zindex = parseInt( SELF.dom_container.currentStyle.zIndex, 10 );
			}

			if( !SELF.zindex ) {
				SELF.zindex = 0;
				SELF.trace("z-index for video container element not detected, make sure position property is set.\nzIndex set to 0");
			}

			// SET FULLSCREEN EXIT

			document.addEventListener("fullscreenchange", function () {
				SELF.trace("fullscreen: "+document.fullscreen);

				if(document.fullscreen) {
					SELF.track_enterfs();
					SELF.isfs = true;
				}
				else {
					SELF.track_exitfs();
					SELF.isfs = false;
				}

			}, false);
			document.addEventListener("mozfullscreenchange", function () {
				SELF.trace("fullscreen: "+document.mozFullScreen);

				if(document.mozFullScreen) {
					SELF.track_enterfs();
					SELF.isfs = true;
				}
				else {
					SELF.track_exitfs();
					SELF.isfs = false;
				}

			}, false);
			document.addEventListener("webkitfullscreenchange", function () {
				SELF.trace("fullscreen: "+document.webkitIsFullScreen);

				if(document.webkitIsFullScreen) {
					SELF.track_enterfs();
					SELF.isfs = true;
				}
				else {
					SELF.track_exitfs();
					SELF.isfs = false;
				}

			}, false);

			// PLAYER FRAME

			SELF.dom_frame = document.createElement('div');
			SELF.dom_frame.style.zIndex = SELF.zindex;
			SELF.dom_frame.style.position = 'absolute';
			SELF.dom_container.appendChild(SELF.dom_frame);

			// POSTER

			SELF.dom_poster = document.createElement('div');
			SELF.dom_poster.className = 'poster';
			SELF.dom_poster.style.zIndex = SELF.zindex + 1;
			SELF.dom_poster.style.position = 'absolute';
			SELF.dom_poster.style.backgroundColor = '#000';
			SELF.dom_poster.style.display = 'block';
			SELF.dom_poster.style.width = '100%';
			SELF.dom_poster.style.height = '100%';
			SELF.dom_poster.style.backgroundSize = 'cover';
			SELF.dom_poster.style.backgroundRepeat = 'no-repeat';
			SELF.dom_container.appendChild(SELF.dom_poster);
			if(SELF.elementtrigger) {
				SELF.dom_poster.style.cursor = 'pointer';
			}

			// CONTROL

			SELF.dom_controller = document.createElement('div');
			SELF.dom_controller.style.display = SELF.controlbar ? 'block':'none';
			SELF.dom_controller.style.zIndex = SELF.zindex;
			SELF.dom_controller.style.position = 'relative';
			SELF.dom_controller.style.height = SELF.barsize + 'px';
			SELF.dom_controller.style.width = '100%';
			SELF.dom_controller.style.top = ( SELF.dom_container.offsetHeight - SELF.barsize ) + 'px';
			SELF.dom_controller.style.left = 0;
			SELF.dom_controller.style.display = 'none';
			SELF.dom_controller.className = 'v_control_bar';

			if(!SELF.chromeless) {
				SELF.dom_container.appendChild(SELF.dom_controller);
			}

			let tcbg = document.createElement('div');
				tcbg.style.display = 'block';
				tcbg.style.position = 'absolute';
				tcbg.style.backgroundColor = '#000';
				tcbg.style.opacity = 0.6;
				tcbg.style.width = '100%';
				tcbg.style.height = SELF.barsize + 'px';

			SELF.dom_controller.appendChild(tcbg);

			// PLAYBACK

			let tcppc = document.createElement('div');
				tcppc.style.position = 'relative';
				tcppc.style.float = 'left';
				tcppc.style.top = 1 + 'px';
				tcppc.style.marginLeft = 5 + 'px';
				tcppc.className = 'v_control_pp';

			SELF.dom_controller.appendChild(tcppc);

			SELF.dom_template_play();
			SELF.addClass(SELF.dom_play, 'cbtn');
			SELF.addClass(SELF.dom_play, 'v_control_sb');
			SELF.addClass(SELF.dom_play, 'play');
			SELF.dom_play.style.display = 'block';
			SELF.dom_play.style.position = 'absolute';
			SELF.dom_play.style.cursor = 'pointer';
			tcppc.appendChild(SELF.dom_play);

			SELF.dom_template_pause();
			SELF.addClass(SELF.dom_pause, 'cbtn');
			SELF.addClass(SELF.dom_pause, 'v_control_sb');
			SELF.addClass(SELF.dom_pause, 'pause');
			SELF.dom_pause.style.display = 'block';
			SELF.dom_pause.style.position = 'absolute';
			SELF.dom_pause.style.cursor = 'pointer';
			SELF.dom_pause.style.display = 'none';

			tcppc.appendChild(SELF.dom_pause);

			// FULL SCREEN

			if(SELF.allowfullscreen)
			{
				SELF.dom_template_fs();
				SELF.addClass(SELF.dom_fs, 'cbtn');
				SELF.addClass(SELF.dom_fs, 'v_control_sb');
				SELF.addClass(SELF.dom_fs, 'fs');
				SELF.dom_fs.style.position = 'absolute';
				SELF.dom_fs.style.display = 'block';
				SELF.dom_fs.style.top = 5 + 'px';
				SELF.dom_fs.style.right = 10 + 'px';
				SELF.dom_fs.style.cursor = 'pointer';
				SELF.dom_controller.appendChild(SELF.dom_fs);
			}

			// MUTE UNMUTE

			let tcmmc = document.createElement('div');
				tcmmc.style.position = 'absolute';
				tcmmc.style.top = 0 + 'px';
				tcmmc.className = 'v_control_mu';
				tcmmc.style.textAlign = 'left';
				if(SELF.allowfullscreen) {
					tcmmc.style.right = 58 + 'px';
				}
				else {
					tcmmc.style.right = 30 + 'px';
				}
			SELF.dom_controller.appendChild(tcmmc);

			SELF.dom_template_mute();
			SELF.addClass(SELF.dom_mute, 'cbtn');
			SELF.addClass(SELF.dom_mute, 'v_control_sb');
			SELF.addClass(SELF.dom_mute, 'mute');
			SELF.dom_mute.style.display = 'block';
			SELF.dom_mute.style.position = 'absolute';
			SELF.dom_mute.style.cursor = 'pointer';
			tcmmc.appendChild(SELF.dom_mute);

			SELF.dom_template_unmute();
			SELF.addClass(SELF.dom_unmute, 'cbtn');
			SELF.addClass(SELF.dom_unmute, 'v_control_sb');
			SELF.addClass(SELF.dom_unmute, 'unmute');
			SELF.dom_unmute.style.display = 'block';
			SELF.dom_unmute.style.position = 'absolute';
			SELF.dom_unmute.style.cursor = 'pointer';
			SELF.dom_unmute.style.display = 'none';
			tcmmc.appendChild(SELF.dom_unmute);

			// SCRUBBER

			let ts = document.createElement('div');
				ts.style.position = 'absolute';
				ts.style.display = 'block';
				ts.style.height = 4 + 'px';
				ts.style.width = '100%';
				ts.style.top = -4 + 'px';
				ts.style.cursor = 'pointer';
				ts.style.backgroundColor = SELF.colors_scrubber_bg;
				ts.className = 'scrubber';
			SELF.dom_controller.appendChild(ts);

			SELF.dom_pbar = document.createElement('div');
			SELF.dom_pbar.style.position = 'absolute';
			SELF.dom_pbar.style.display = 'block';
			SELF.dom_pbar.style.height = '100%';
			SELF.dom_pbar.style.width = 0;
			SELF.dom_pbar.style.top = 0;
			SELF.dom_pbar.style.backgroundColor = SELF.colors_scrubber_progress;
			SELF.dom_pbar.className = 'playbar';
			ts.appendChild(SELF.dom_pbar);

			SELF.dom_phead = document.createElement('div');
			SELF.dom_phead.style.position = 'absolute';
			SELF.dom_phead.style.display = 'block';
			SELF.dom_phead.style.height = '100%';
			SELF.dom_phead.style.width = 0;
			SELF.dom_phead.style.top = 0;
			SELF.dom_phead.style.backgroundColor = SELF.colors_scrubber_playback;
			SELF.dom_phead.className = 'playhead';
			ts.appendChild(SELF.dom_phead);

			// BIG BUTTONS

			SELF.dom_template_bigplay();
			SELF.addClass(SELF.dom_bigplay, 'cbtn');
			SELF.addClass(SELF.dom_bigplay, 'v_control_bb');
			SELF.addClass(SELF.dom_bigplay, 'play');
			SELF.dom_bigplay.style.zIndex = SELF.zindex + 2;
			SELF.dom_bigplay.style.display = 'block';
			SELF.dom_bigplay.style.position = 'absolute';
			SELF.dom_bigplay.style.cursor = 'pointer';
			SELF.dom_bigplay.style.textShadow = SELF.dom_template_textshadow;
			if(!SELF.chromeless) {
				SELF.dom_container.appendChild(SELF.dom_bigplay);
			}
			SELF.dom_bigplay.style.display = 'none';
			SELF.centered_controls.push(SELF.dom_bigplay);

			SELF.dom_preview = SELF.dom_bigplay.cloneNode(true);
			SELF.addClass(SELF.dom_preview, 'cbtn');
			SELF.addClass(SELF.dom_preview, 'v_control_bb');
			SELF.addClass(SELF.dom_preview, 'play');
			SELF.dom_preview.style.zIndex = SELF.zindex + 2;
			SELF.dom_preview.style.display = 'block';
			SELF.dom_preview.style.position = 'absolute';
			SELF.dom_preview.style.cursor = 'pointer';
			if(!SELF.chromeless) {
				SELF.dom_container.appendChild(SELF.dom_preview);
			}
			SELF.dom_preview.style.display = 'none';
			SELF.centered_controls.push(SELF.dom_preview);

			if(SELF.uniquereplay) {
				SELF.dom_template_replay();
			} else {
				SELF.dom_replay = SELF.dom_bigplay.cloneNode(true);
				SELF.removeClass(SELF.dom_replay, 'play');
			}
			SELF.addClass(SELF.dom_replay, 'cbtn');
			SELF.addClass(SELF.dom_replay, 'v_control_bb');
			SELF.addClass(SELF.dom_replay, 'replay');
			SELF.dom_replay.style.zIndex = SELF.zindex + 2;
			SELF.dom_replay.style.display = 'block';
			SELF.dom_replay.style.position = 'absolute';
			SELF.dom_replay.style.cursor = 'pointer';
			if(!SELF.chromeless) {
				SELF.dom_container.appendChild(SELF.dom_replay);
			}
			SELF.dom_replay.style.display = 'none';
			SELF.centered_controls.push(SELF.dom_replay);

			SELF.dom_template_bigsound();
			SELF.addClass(SELF.dom_bigsound, 'cbtn');
			SELF.addClass(SELF.dom_bigsound, 'v_control_bb');
			SELF.addClass(SELF.dom_bigsound, 'sound');
			SELF.dom_bigsound.style.zIndex = SELF.zindex + 2;
			SELF.dom_bigsound.style.display = 'block';
			SELF.dom_bigsound.style.position = 'absolute';
			SELF.dom_bigsound.style.cursor = 'pointer';
			if(!SELF.chromeless) {
				SELF.dom_container.appendChild(SELF.dom_bigsound);
			}
			SELF.dom_bigsound.style.display = 'none';
			SELF.centered_controls.push(SELF.dom_bigsound);

			SELF.dom_template_spinner();
			SELF.addClass(SELF.dom_spinner, 'cbtn');
			SELF.addClass(SELF.dom_spinner, 'v_control_bb');
			SELF.addClass(SELF.dom_spinner, 'wait');
			SELF.dom_spinner.style.zIndex = SELF.zindex + 2;
			SELF.dom_spinner.style.display = 'block';
			SELF.dom_spinner.style.position = 'absolute';
			SELF.dom_container.appendChild(SELF.dom_spinner);
			SELF.dom_spinner.style.display = 'none';
			SELF.centered_controls.push(SELF.dom_spinner);

			SELF.reflow(true);

			SELF.initialized = true;
			SELF.trace('video initialized');
			// SELF.setListeners();
		}
		else {
			SELF.trace('already initialized');
		}
	},

	mEnter: function() {
		const SELF = this;

		if(
			!SELF.isfs &&
			!SELF.ismobile &&
			SELF.started &&
			( SELF.dom_bigsound.style.display !== 'block' ) &&
			( SELF.dom_replay.style.display !== 'block' ) &&
			( SELF.dom_bigplay.style.display !== 'block' ) &&
			( SELF.dom_preview.style.display !== 'block' )
		) {
			SELF.dom_controller.style.display = SELF.controlbar ? 'block':'none';
		}
	},
	mLeave: function() {
		const SELF = this;

		SELF.dom_controller.style.display = 'none';
	},
	mClick: function() {
		const SELF = this;

		if(SELF.elementtrigger) {
			if( !SELF.isPlaying() )
			{
				SELF.play(true);
			} 

			if( SELF.dom_bigplay.style.display === 'block' ||
				SELF.dom_replay.style.display === 'block' || 
				SELF.dom_preview.style.display === 'block' ) {
				SELF.play(true);
			
			} 

			if( SELF.dom_bigsound.style.display === 'block' ) {
				SELF.cfs(true);
			}
		
		}
		
	},
	barSeek: function(e) {
		const SELF = this;

		let ro = (e.pageX - SELF.dom_pbar.getBoundingClientRect().left);
		let tp = ( ro / SELF.dom_container.offsetWidth );

		SELF.seek( SELF.duration * tp );

		if( SELF.dom_play.style.display === 'block' && SELF.playonseek ) {
			SELF.proxy.play();
		}
	},
	seek: function(num) {
		const SELF = this;

		SELF.proxy.currentTime = num;
	},

	load: function(vf, vp) {

		const SELF = this;

		SELF.trackReset();

		if(SELF.initialized) {

			SELF.firsttime = true;

			SELF.unload();

			SELF.dom_spinner.style.display = 'block';

			if(vp) {
				SELF.hasposter = true;
				SELF.setPoster(vp);
			} else {
				SELF.hasposter = false;
			}

			SELF.reflow(true);

			setTimeout(function(){

				let tve = document.createElement('video');
					tve.width = SELF.dom_container.offsetWidth;
					tve.height = SELF.dom_container.offsetHeight;

				if( SELF.autoplay ) {

					if( 'autoplay' in tve )
						tve.autoplay = true;

					if( SELF.ismobile || SELF.isSafari ) {
						
						SELF.inline = true;
						SELF.startmuted = true;
					}
				}

				if(SELF.startmuted) {
					tve.muted = true;
				}

				if(SELF.inline) {

					if( "playsInline" in document.createElement('video') ) {
						tve.playsInline = true;
					} else {
						SELF.inline = false;

						if(SELF.ismobile) {

							SELF.autoplay = false;
							SELF.startmuted = false;
							SELF.preview = 0;
							
							tve.muted = false;
							tve.autoplay = false;
							
						}
					}
				}

				if(SELF.progressive) {
					tve.preload = "auto";
				} else {
					tve.preload = "metadata";
				}

				if(SELF.chromeless) {
					SELF.dom_controller.style.display = 'none';
					tve.controls = false;
				} else {
					if(SELF.ismobile) {
						SELF.dom_controller.style.display = 'none';

						if(!SELF.autoplay)
							tve.controls = SELF.controlbar ? true : false;
					}					
				}

				if(typeof vf === 'object') {
					vf.forEach(function(e) {
						let tvs = document.createElement('source');
							tvs.src = e;
							tvs.type = SELF.getMediaType(e);
						tve.appendChild(tvs);
					});
				} else {
					let tvs = document.createElement('source');
						tvs.src = vf;
						tvs.type = SELF.getMediaType(vf);
					tve.appendChild(tvs);
				}

				if(vp) {
					tve.poster = vp;
				}

				if(SELF.elementtrigger) {
					tve.style.cursor = 'pointer';
				}

				SELF.dom_frame.appendChild(tve);

				SELF.proxy = tve;

				SELF.setListeners(); // COME BACK HERE

				if( !SELF.hasposter && SELF.ismobile && !SELF.autoplay ) {
					SELF.dom_spinner.style.display = 'none';
					SELF.dom_bigplay.style.display = 'block';
				}

				if( SELF.ismobile && SELF.autoplay )
					SELF.proxy.style.display = 'block';
				else
					SELF.proxy.style.display = 'none';

				SELF.proxy.addEventListener('click', function(e) {
					SELF.controlHandler(e);
				});

				SELF.reflow(true);

			}, SELF.loadDelay);
		}
		else {
			SELF.trace('initialize video first');
		}
	},

	setPoster: function(str) {

		const SELF = this;

		let newImg = new Image();

			newImg.onload = function() {
				SELF.trace('loaded: '+str);

				SELF.dom_poster.style.backgroundImage = 'url('+str+')';
				SELF.dom_poster.style.display = 'block';

				if(SELF.autoplay) {
					SELF.dom_spinner.style.display = 'block';
					SELF.dom_bigplay.style.display = 'none';
				} else {
					SELF.dom_spinner.style.display = 'none';
					SELF.dom_bigplay.style.display = 'block';
					
				}

				SELF.reflow(true); // NOT SURE

			};

			newImg.src = str;
	},

	unload: function(bool) {

		const SELF = this;

		SELF.started = false;
		SELF.playing = false;
		SELF.isfs = false;
		SELF.ready = false;
		SELF.playhead = 0;
		SELF.firsttime = true;
		SELF.completed = false;
		SELF.restartOnPlay = false;
		SELF.hasposter = false;
		SELF.playhead = 0;
		SELF.duration = 0;
		SELF.buffered = 0;

		if( SELF.proxy ) {
			if(!bool) {
				SELF.trace('unloading player');
			}

			SELF.removeListeners();

			SELF.dom_bigplay.style.display = 'none';
			SELF.dom_bigsound.style.display = 'none';
			SELF.dom_replay.style.display = 'none';
			SELF.dom_poster.style.display = 'none';
			SELF.dom_controller.style.display = 'none';
			SELF.dom_spinner.style.display = 'none';

			// THOROUGHNESS ;P

			SELF.proxy.pause();
			SELF.proxy.src = "";
			SELF.proxy.load();
			SELF.proxy.parentNode.removeChild(SELF.proxy);
			SELF.proxy = null;

			SELF.dom_frame.innerHTML = '';
		}
		// else {
		// 	SELF.trace('Nothing to unload');
		// }

		SELF.trackReset();
	},

	destroy: function() {

		const SELF = this;
		
		if(SELF.initialized) {
			SELF.unload(true);
			SELF.dom_container.innerHTML = '';
			SELF.initialized = false;
			SELF.trace('destroying player');
		}
		else {
			SELF.trace('nothing to destroy');
		}
	},

	setListeners: function() {

		const SELF = this;

		/*
			canplay,
			canplaythrough,
			playing,
			waiting,
			ended,
			durationchange,
			timeupdate,
			play,
			pause,
			volumechange
		*/

		SELF.dom_pbar.addEventListener('click', function(e) {
			SELF.barSeek(e);
		});
		SELF.dom_phead.addEventListener('click', function(e) {
			SELF.barSeek(e);
		});
		SELF.dom_container.addEventListener('mouseenter', function(e) {
			SELF.mEnter(e);
		});
		SELF.dom_container.addEventListener('mouseleave', function(e) {
			SELF.mLeave(e);
		});
		SELF.dom_container.addEventListener('click', function(e) {
			SELF.mClick(e);
		});
		SELF.dom_play.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_pause.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_mute.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_unmute.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});

		if(SELF.allowfullscreen) {
			SELF.dom_fs.addEventListener('click', function(e) {
				SELF.controlHandler(e);
			});
		}

		SELF.dom_bigplay.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_bigsound.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_preview.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_replay.addEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.proxy.addEventListener('ended', function(e) {
			SELF.dlEnded(e);
		});
		SELF.proxy.addEventListener('play', function(e) {
			SELF.dlPlay(e);
		});
		SELF.proxy.addEventListener('pause', function(e) {
			SELF.dlPause(e);
		});
		SELF.proxy.addEventListener('volumechange', function(e) {
			SELF.dlVolumeChange(e);
		});
		SELF.proxy.addEventListener('timeupdate', function(e) {
			SELF.dlTimeUpdate(e);
		});
		SELF.proxy.addEventListener('canplay', function(e) {
			SELF.dlCanPlay(e);
		});
		SELF.proxy.addEventListener('progress', function(e) {
			SELF.dlProgress(e);
		});
	},

	removeListeners: function() {

		const SELF = this;

		SELF.dom_pbar.removeEventListener('click', function(e) {
			SELF.barSeek(e);
		});
		SELF.dom_phead.removeEventListener('click', function(e) {
			SELF.barSeek(e);
		});
		SELF.dom_container.removeEventListener('mouseenter', function(e) {
			SELF.mEnter(e);
		});
		SELF.dom_container.removeEventListener('mouseleave', function(e) {
			SELF.mLeave(e);
		});
		SELF.dom_container.removeEventListener('click', function(e) {
			SELF.mClick(e);
		});
		SELF.dom_play.removeEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_pause.removeEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_mute.removeEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_unmute.removeEventListener('click', function(e) {
			SELF.controlHandler(e);
		});

		if(SELF.allowfullscreen) {
			SELF.dom_fs.removeEventListener('click', function(e) {
				SELF.controlHandler(e);
			});
		}

		SELF.dom_bigplay.removeEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_bigsound.removeEventListener('click', function(e) {
			SELF.controlHandler(e);
		});
		SELF.dom_replay.removeEventListener('click', function(e) {
			SELF.controlHandler(e);
		});

		SELF.proxy.removeEventListener('ended', function(e) {
			SELF.dlEnded(e);
		});
		SELF.proxy.removeEventListener('play', function(e) {
			SELF.dlPlay(e);
		});
		SELF.proxy.removeEventListener('pause', function(e) {
			SELF.dlPause(e);
		});
		SELF.proxy.removeEventListener('volumechange', function(e) {
			SELF.dlVolumeChange(e);
		});
		SELF.proxy.removeEventListener('timeupdate', function(e) {
			SELF.dlTimeUpdate(e);
		});
		SELF.proxy.removeEventListener('canplay', function(e) {
			SELF.dlCanPlay(e);
		});
		SELF.proxy.removeEventListener('progress', function(e) {
			SELF.dlProgress(e);
		});
	},

	dlEnded: function() {

		const SELF = this;

		SELF.completed = true;
		SELF.callback_end();

		if(SELF.loop) {

			SELF.play();
			SELF.trace('looping video...');

		} else {

			if(SELF.replaywithsound) {
				SELF.disableNotification('volume');
				SELF.unmute();
			}

			if(SELF.hasposter) {
				SELF.dom_poster.style.display = 'block';
				
			} else {
				if(!SELF.ismobile) {
					SELF.dom_controller.style.display = 'none';
				}
			}

			if(!SELF.chromeless && !SELF.preview) {
				SELF.dom_replay.style.display = 'block';
			}

			SELF.proxy.style.display = 'none';
			SELF.dom_bigsound.style.display = 'none';

			SELF.disableNotification('volume');

			if(SELF.preview && !SELF.ismobile) {
				SELF.dom_preview.style.display = 'block';
				SELF.preview = 0;
				SELF.completed = false;
				SELF.track_preview_end();
			} else {
				SELF.track_end();
				SELF.trackReset();
				SELF.playing = false;
			}

			SELF.dom_poster.style.cursor = 'pointer';
		}

		SELF.reflow(true);
	},

	dlPlay: function() {

		const SELF = this;

			/* 
			SELF.disableNotification('play');
			SELF.disableNotification('preview_start');
			SELF.disableNotification('replay');
			SELF.disableNotification('start');
			*/

			SELF.dom_pause.style.display = 'block';
			SELF.dom_play.style.display = 'none';

		// if( SELF.startmuted && SELF.autoplay && !SELF.ismobile && SELF.firsttime ) {
		// 	SELF.proxy.muted = true;
		// }

		SELF.callback_play();

		if(!SELF.track.started && !SELF.completed) {
			SELF.track.started = true;

			if(SELF.preview) {
				// PREVIEW
				SELF.disableNotification('start');
				SELF.disableNotification('play');
				SELF.disableNotification('replay');
			}
			else {
				// REGULAR START
				SELF.disableNotification('play');
				SELF.disableNotification('preview_start');
				SELF.disableNotification('replay');
			}
		}
		else {
			if(SELF.completed)
			{
				// REPLAY
				SELF.completed = false;
				SELF.track.started = true;
				SELF.disableNotification('play');
				SELF.disableNotification('preview_start');
				SELF.disableNotification('start');
			} else {
				// UNPAUSE
				SELF.disableNotification('preview_start');
				SELF.disableNotification('replay');
				SELF.disableNotification('start');
			}
		}

		if(SELF.restartOnPlay) {
			SELF.cfs(true);
		}

		if(SELF.notifications.preview_start) {
			SELF.track_preview_start();
		}
		if(SELF.notifications.start) {
			SELF.track_start();
		}
		if(SELF.notifications.play) {
			SELF.track_play();
		}
		if(SELF.notifications.replay && !SELF.loop) {
			SELF.track_replay();
		}

		SELF.enableNotifications();

	},

	dlPause: function() {
		const SELF = this;

			SELF.dom_pause.style.display = 'none';
			SELF.dom_play.style.display = 'block';

		if( SELF.preview < SELF.playhead ) {
			SELF.callback_pause();
			
			if(SELF.preview) {
				SELF.dom_bigsound.style.display = 'none';
				SELF.dom_preview.style.display = 'block';
				SELF.reflow();
				SELF.disableNotification('end');
				SELF.disableNotification('pause');
				SELF.restartOnPlay = true;
				SELF.trackReset();
				SELF.preview = 0;
				SELF.track_preview_end();
			}
			else {
				SELF.disableNotification('end');
				SELF.disableNotification('preview_end');
				if(SELF.notifications.pause) {
					SELF.track_pause();	
				}
			}
		}
	},
	dlVolumeChange: function() {
		const SELF = this;

		if(SELF.proxy.muted) {
			SELF.dom_mute.style.display = 'none';
			SELF.dom_unmute.style.display = 'block';

			if(SELF.notifications.volume) {
				SELF.track_mute();
			}
		} else {
			SELF.dom_mute.style.display = 'block';
			SELF.dom_unmute.style.display = 'none';
			SELF.dom_bigsound.style.display = 'none';
			if(SELF.notifications.volume) {
				SELF.track_unmute();
			}
		}

		SELF.callback_volume();
	},

	dlProgress: function() {
		const SELF = this;

		if(SELF.proxy) {
			for(let i = 0; i < SELF.proxy.buffered.length; i ++) {
				SELF.buffered = ( SELF.proxy.buffered.end(i) / SELF.duration ) * 100;
			}

			SELF.dom_pbar.style.width = SELF.buffered+'%';

			SELF.callback_loading();
		}
	},

	dlTimeUpdate: function() {
		const SELF = this;
			SELF.playing = true;

		if(SELF.proxy && SELF.firsttime) {
			SELF.firsttime = false;
			SELF.started = true;

			if( SELF.startmuted && SELF.autoplay ) {
				// SELF.proxy.muted = true;

				SELF.dom_bigsound.style.display = 'block';
				SELF.dom_controller.style.display = 'none';
				SELF.playing = false;

				SELF.reflow(true);
			}
		}

		if( SELF.dom_controller.style.display === 'block' && SELF.ismobile ) {
			SELF.dom_controller.style.display = 'none';
		}
		if( SELF.dom_bigplay.style.display === 'block' ) {
			SELF.dom_bigplay.style.display = 'none';
		}
		if( SELF.dom_replay.style.display === 'block' ) {
			SELF.dom_replay.style.display = 'none';
		}
		if( SELF.dom_preview.style.display === 'block' ) {
			SELF.dom_preview.style.display = 'none';
		}
		if( SELF.dom_spinner.style.display === 'block' ) {
			SELF.dom_spinner.style.display = 'none';
		}
		if( SELF.dom_poster.style.display === 'block' ) {
			SELF.dom_poster.style.display = 'none';
		}
		if( SELF.proxy && SELF.proxy.style.display === 'none') {
			SELF.proxy.style.display = 'block';
		}
		if( SELF.proxy ) {
			SELF.playhead = SELF.proxy.currentTime;
			SELF.duration = SELF.proxy.duration;
		}

		if( !SELF.elementplayback && 
			SELF.dom_bigsound.style.display === 'none' &&
			SELF.dom_preview.style.display === 'none'
			) {
				SELF.proxy.style.cursor = 'auto';
			}

		let phpercentage = ( SELF.playhead / SELF.duration ) * 100;

		SELF.dom_phead.style.width = phpercentage+'%';

		// QUARTILES
		if(!SELF.preview && !SELF.track.q25 && phpercentage >= 25) {
			SELF.track.q25 = true;
			SELF.track_q25();
		}

		if(!SELF.preview && !SELF.track.q50 && phpercentage >= 50) {
			SELF.track.q50 = true;
			SELF.track_q50();
		}

		if(!SELF.preview && !SELF.track.q75 && phpercentage >= 75) {
			SELF.track.q75 = true;
			SELF.track_q75();
		}

		SELF.callback_progress();

		if(SELF.preview && ( SELF.playhead > SELF.preview ) ) {
			SELF.pause();
		}

	},

	dlCanPlay: function() {

		const SELF = this;

		if(SELF.firsttime) { // NOT SURE ABOUT THIS

			if(!SELF.autoplay) {
				SELF.dom_spinner.style.display = 'none';

				if(!SELF.ismobile) {
					SELF.dom_bigplay.style.display = 'block';
				}

			}

			if(!SELF.hasposter && !SELF.autoplay && !SELF.ismobile) {
				SELF.trace('no poster');
				SELF.dom_bigplay.style.display = 'block';
				SELF.dom_controller.style.display = 'none';
			}

			if(SELF.ismobile) {

				SELF.dom_controller.style.display = 'none';

				if( SELF.autoplay ) {
					SELF.dom_spinner.style.display = 'block';
					SELF.dom_bigplay.style.display = 'none';
					SELF.dom_poster.style.display = 'none';
					SELF.proxy.style.display = 'block';
				} else {
					if(!SELF.chromeless)
						SELF.dom_bigplay.style.display = 'block';
				}
			} else {
				// SAFARI FIX FOR NOT AUTO WITH PREVIEW SET
				if( SELF.isSafari && SELF.autoplay ) SELF.proxy.play();
			}

			SELF.reflow(true);
			SELF.ready = true;
			SELF.callback_ready();

		}
	},

	callback_end: function() {
		const SELF = this;
			SELF.trace('Video Ended');
	},
	callback_play: function() {
		const SELF = this;
			SELF.trace('Video Play');
	},
	callback_playerror: function() {
		const SELF = this;
			SELF.trace('Video Play Error (EXCEPTION)');
	},
	callback_stop: function() {
		const SELF = this;
			SELF.trace('Video Stopped (Manually)');
	},
	callback_pause: function() {
		const SELF = this;
			SELF.trace('Video Paused');
	},
	callback_volume: function() {
		const SELF = this;

		if(SELF.proxy.muted) {
			if(SELF.notifications.volume) { SELF.trace('Video Muted'); }
		}
		else {
			if(SELF.notifications.volume) { SELF.trace('Video Unmuted'); }
		}
	},
	callback_loading: function() {
		const SELF = this;
			// SELF.trace('Video data downloading');
	},
	callback_progress: function() {
		const SELF = this;
			// SELF.trace('Video Time Update');
	},
	callback_ready: function() {
		const SELF = this;
			SELF.trace('Video Ready');
	},

	// TRACKING

	track: {
		started: false,
		q25: false,
		q50: false,
		q75: false
	},

	trackReset: function() {
		const SELF = this;
			SELF.playhead = 0;
			SELF.track.started = false;
			SELF.track.q25 = false;
			SELF.track.q50 = false;
			SELF.track.q75 = false;
	},

	track_start: function() { this.trace('TRACK: Start'); },
	track_end: function() { this.trace('TRACK: End'); },
	track_preview_start: function() { this.trace('TRACK: Preview Start'); },
	track_preview_end: function() { this.trace('TRACK: Preview End'); },
	track_play: function() { this.trace('TRACK: Play'); },
	track_pause: function() { this.trace('TRACK: Pause'); },
	track_stop: function() { this.trace('TRACK: Stop'); },
	track_replay: function() { this.trace('TRACK: Replay'); },
	track_mute: function() { this.trace('TRACK: Mute'); },
	track_unmute: function() { this.trace('TRACK: Unmute'); },
	track_q25: function() { this.trace('TRACK: 1st Quartile'); },
	track_q50: function() { this.trace('TRACK: Midpoint'); },
	track_q75: function() { this.trace('TRACK: 3rd Quartile'); },
	track_enterfs: function() { this.trace('TRACK: Enter Fullscreen'); },
	track_exitfs: function() { this.trace('TRACK: Exit Fullscreen'); },
	track_cfs: function() { this.trace('TRACK: Click for Sound'); },

	controlHandler: function(e) {
		const SELF = this;

		switch(e.currentTarget)
		{
			case SELF.dom_play:
				SELF.proxy.play();
			break;
			case SELF.dom_pause:
				SELF.proxy.pause();
			break;
			case SELF.dom_mute:
				SELF.proxy.muted = true;
			break;
			case SELF.dom_unmute:
				SELF.proxy.muted = false;
			break;
			case SELF.dom_fs:
				SELF.goFS();
			break;
			case SELF.dom_bigplay:
				SELF.proxy.play();
				SELF.dom_spinner.style.display = 'block';
				SELF.dom_bigplay.style.display = 'none';
				SELF.reflow(true);
			break;
			case SELF.dom_replay:

				SELF.replay();

				if(SELF.replaywithsound || SELF.ismobile) {
					SELF.disableNotification('volume');
					SELF.proxy.muted = false;
				}

				if(!SELF.ismobile) {
					SELF.dom_controller.style.display = SELF.controlbar ? 'block':'none';
				} else {
					SELF.dom_controller.style.display = 'none';
				}

				SELF.trackReset();

			break;
			case SELF.dom_preview: 
				SELF.proxy.play();
			break;
			case SELF.dom_bigsound:
				SELF.cfs(true);
			break;
			case SELF.proxy:

				// ELEMENT TRIGGER
				if(
					SELF.elementtrigger &&
					SELF.dom_play.style.display === 'block' &&
					SELF.dom_bigsound.style.display === 'none' &&
					SELF.elementplayback
				) {
					if(!SELF.ismobile || ( SELF.ismobile && SELF.inline && !SELF.controlbar ) )
						SELF.play();
				}

				if( SELF.elementtrigger &&
					SELF.dom_pause.style.display === 'block' &&
					SELF.dom_bigsound.style.display === 'none' &&
					SELF.elementplayback
				) {
					if(!SELF.ismobile || ( SELF.ismobile && SELF.inline && !SELF.controlbar ) ) 
						SELF.pause();
				}
			break;
		}

	},

	play: function(bool) {

		const SELF = this;

		if(SELF.proxy) {

			let promise = SELF.proxy.play();
				
			if ( promise !== undefined ) {
			    promise.catch( function() {
			        SELF.callback_playerror();
			    }).then( function() {
			    	
			        if(bool && !SELF.ismobile) {
						SELF.dom_controller.style.display = SELF.controlbar ? 'block':'none';
					}
					
			    });
			}
		}
	},

	pause: function() {
		const SELF = this;

		if(SELF.proxy) {
			SELF.proxy.pause();
		}
	},

	stop: function(bool) {

		const SELF = this;

		if(SELF.proxy) {
			const SELF = this;

			if(SELF.playing || bool) {
				SELF.callback_stop();
				SELF.track_stop();

				if(SELF.replaywithsound) {
					SELF.disableNotification('volume');
					SELF.unmute();
				}

				SELF.seek(0);
				SELF.disableNotification('pause');
				SELF.pause();
				SELF.trackReset();
				SELF.completed = false;
				setTimeout(function(){
					SELF.playing = false;
					if(SELF.hasposter) {
						SELF.dom_poster.style.display = 'block';
					}
					
					SELF.dom_bigplay.style.display = 'block';
					SELF.reflow();
				}, 500);
			}
		}
	},

	replay: function() {
		const SELF = this;

		SELF.dom_spinner.style.display = 'block';
		SELF.dom_replay.style.display = 'none';
		SELF.reflow(true);
		
		if(SELF.replaywithsound) {
			SELF.disableNotification('volume');
			SELF.unmute();
		}

		SELF.proxy.play();
		SELF.seek(0);

	},

	mute: function() {
		const SELF = this;

		SELF.proxy.muted = true;
	},

	unmute: function() {
		const SELF = this;

		SELF.proxy.muted = false;
	},

	isMuted: function() {
		const SELF = this;

		return SELF.proxy.muted;
	},

	isPlaying: function() {
		const SELF = this;

		return SELF.playing;
	},

	cfsFlag: false,
	cfs: function(bool) {
		const SELF = this;
		
		SELF.proxy.muted = false;
		SELF.seek(0);

		if(!SELF.restartOnPlay && !SELF.cfsFlag) {
			SELF.cfsFlag = true;
			SELF.track_cfs();

			if(SELF.ismobile && !SELF.chromeless)
				SELF.proxy.controls = SELF.controlbar ? true : false;
		}

		SELF.disableNotification('volume');

		setTimeout(function(){
			SELF.preview = 0;
			SELF.restartOnPlay = false;
		}, 50);

		if(bool && !SELF.ismobile) {
			SELF.dom_controller.style.display = SELF.controlbar ? 'block':'none';
		}

		SELF.enableNotifications();
	},
	goFS: function() {
		const SELF = this;

		if (SELF.proxy.requestFullscreen)
			SELF.proxy.requestFullscreen();
		else if (SELF.proxy.mozRequestFullScreen)
			SELF.proxy.mozRequestFullScreen(); // Firefox
		else if (SELF.proxy.webkitRequestFullscreen)
			SELF.proxy.webkitRequestFullscreen(); // Chrome and Safari
	},

	getMediaType: function(str) {
		const SELF = this;

		return SELF.mTypes[str.split('.')[str.split('.').length - 1]];
	},

	reflow: function(passive) {
		const SELF = this;

		if(SELF.initialized) {
			if(SELF.proxy) {
				SELF.proxy.width = SELF.dom_container.offsetWidth;
				SELF.proxy.height = SELF.dom_container.offsetHeight;
			}

			SELF.dom_controller.style.top = ( SELF.dom_container.offsetHeight - SELF.barsize ) + 'px';
			SELF.dom_controller.style.left = 0;

			// CENTER ALL ELEMENTS FOUND IN center_controls ARRAY
			for(let key in SELF.centered_controls) {
				let item = SELF.centered_controls[key];

					item.style.top = '50%';
					item.style.marginTop = ( ( item.offsetHeight / 2 ) * -1 ) + 'px';
					item.style.left = '50%';
					item.style.marginLeft = ( ( item.offsetWidth / 2 ) * -1 ) + 'px';
			}

			if(!passive) {
				SELF.trace('reflow video');
			}
		}
		else if(!passive) {
			SELF.trace("reflow useless: video elements aren't ready");
		}
	},

	trace: function(str) {
		const SELF = this;

		if(SELF.debug) {

			if(window.console) {
				window.console.log(str);
			}

			if( SELF.dom_debug ) {
				SELF.dom_debug.innerHTML += str + '<br>';
			}
		}
	},

	setVendor: function(element, property, value) {
		const SELF = this;

		let styles = window.getComputedStyle(element, '');
		let regexp = new RegExp(property+'$', "i");

		for (let key in styles) {
			if( regexp.test(key) ) {
				element.style[key] = value;
			}
		}
	},

	addClass: function(el, className) {
		const SELF = this;

		if (el.classList) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	},

	removeClass: function(el, className) {
		const SELF = this;

		if (el.classList) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	},

	help: function() {
		window.open('https://github.com/nargalzius/HTMLvideo');
	}
};