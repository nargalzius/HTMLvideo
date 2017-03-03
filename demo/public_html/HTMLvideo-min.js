/*!
 *  HTML VIDEO HELPER
 *
 *  3.4
 *
 *  author: Carlo J. Santos
 *  email: carlosantos@gmail.com
 *  documentation: https://github.com/nargalzius/HTMLvideo
 *
 *  Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

var VideoPlayer = function(){};

VideoPlayer.prototype = {
	debug: false,
	autoplay: false,
	startmuted: false,
	replaywithsound: true,
	allowfullscreen: false,
	playonseek: true,
	uniquereplay: true,
	chromeless: false,
	elementtrigger: true,
	loop: false,
	progressive: true,
	inline: false,
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

	checkForMobile: function() {

		var mobileFlag = true;

		for (var i = 0; i < this.desktopAgents.length; i++) {
			var regex;
				regex = new RegExp(this.desktopAgents[i], "i");

			if( window.document.documentElement.className.match(regex) ) {
				mobileFlag = false;
			}
		}

		if( mobileFlag ) {
			this.ismobile = true;
			this.trace("mobile browser detected");
		} else {
			this.ismobile = false;
			this.trace("desktop browser detected");
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
	disableNotification: function(str) {
		this.notifications[str] = false;
	},	
	enableNotifications: function() {
		
		var self = this;
		var n = self.notifications;

		setTimeout(function(){
			for(var p in n) { n[p] = true; }
		}, 100);
	},
	dom_template_bigplay: function() {
		this.dom_bigplay = document.createElement('div');
		this.dom_bigplay.innerHTML = this.svg.bigplay;
		this.dom_bigplay.getElementsByTagName('path')[0].style.fill = this.colors_bigplay;
	},
	dom_template_bigsound: function() {
		this.dom_bigsound = document.createElement('div');
		this.dom_bigsound.innerHTML = this.svg.bigsound;
		this.dom_bigsound.getElementsByTagName('path')[0].style.fill = this.colors_bigsound;
	},
	dom_template_replay: function() {
		this.dom_replay = document.createElement('div');
		this.dom_replay.innerHTML = this.svg.replay;
		this.dom_replay.getElementsByTagName('path')[0].style.fill = this.colors_replay;
	},
	dom_template_spinner: function() {
		this.dom_spinner = document.createElement('div');
		this.dom_spinner.innerHTML = this.svg.spin;
		this.dom_spinner.getElementsByTagName('path')[0].style.fill = this.colors_spinner;

	},
	dom_template_play: function() {
		this.dom_play = document.createElement('span');
		this.dom_play.innerHTML = this.svg.play;
		this.dom_play.getElementsByTagName('path')[0].style.fill = this.colors_play_pause;

	},
	dom_template_pause: function() {
		this.dom_pause = document.createElement('span');
		this.dom_pause.innerHTML = this.svg.pause;
		this.dom_pause.getElementsByTagName('path')[0].style.fill = this.colors_play_pause;
	},
	dom_template_mute: function() {
		this.dom_mute = document.createElement('span');
		this.dom_mute.innerHTML = this.svg.mute;
		this.dom_mute.getElementsByTagName('path')[0].style.fill = this.colors_mute_unmute;
	},
	dom_template_unmute: function() {
		this.dom_unmute = document.createElement('span');
		this.dom_unmute.innerHTML = this.svg.unmute;
		this.dom_unmute.getElementsByTagName('path')[0].style.fill = this.colors_mute_unmute;
	},
	dom_template_fs: function() {
		this.dom_fs = document.createElement('span');
		this.dom_fs.innerHTML = this.svg.fs;
		this.dom_fs.getElementsByTagName('path')[0].style.fill = this.colors_fs;
	},

	init: function(vc) {

		var self = this;

		if(!this.initialized)
		{

			if(this.ismobile === null) { this.checkForMobile(); }

			if(this.preview && !this.ismobile) {
				this.autoplay = true;
				this.startmuted = true;
			}

			if(this.ismobile) {
				this.autoplay = false;
				this.startmuted = false;
				this.preview = 0;	
			}

			if(typeof vc === 'object') {
				if($) { this.dom_container = document.getElementById( vc.attr('id') ); }
			} else {
				this.dom_container = document.getElementById( vc );
			}

			this.dom_container.style.backgroundColor = '#000';
			this.dom_container.style.overflow = 'hidden';

			// GET Z-INDEX

			if( document.defaultView && document.defaultView.getComputedStyle ) {
				var s = document.defaultView.getComputedStyle( this.dom_container, '' );
				this.zindex = parseInt( s.getPropertyValue('z-index'), 10 );
			} else if( this.dom_container.currentStyle ) {
				this.zindex = parseInt( this.dom_container.currentStyle.zIndex, 10 );
			}

			if(!this.zindex) {
				this.zindex = 0;
				this.trace("z-index for video container element not detected, make sure position property is set.\nzIndex set to 0");
			}

			// SET FULLSCREEN EXIT

			document.addEventListener("fullscreenchange", function () {
				self.trace("fullscreen: "+document.fullscreen);

				if(document.fullscreen) {
					self.track_enterfs();
					self.isfs = true;
				}
				else {
					self.track_exitfs();
					self.isfs = false;
				}

			}, false);
			document.addEventListener("mozfullscreenchange", function () {
				self.trace("fullscreen: "+document.mozFullScreen);

				if(document.mozFullScreen) {
					self.track_enterfs();
					self.isfs = true;
				}
				else {
					self.track_exitfs();
					self.isfs = false;
				}

			}, false);
			document.addEventListener("webkitfullscreenchange", function () {
				self.trace("fullscreen: "+document.webkitIsFullScreen);

				if(document.webkitIsFullScreen) {
					self.track_enterfs();
					self.isfs = true;
				}
				else {
					self.track_exitfs();
					self.isfs = false;
				}

			}, false);

			// PLAYER FRAME

			this.dom_frame = document.createElement('div');
			this.dom_frame.style.zIndex = this.zindex;
			this.dom_frame.style.position = 'absolute';
			this.dom_container.appendChild(this.dom_frame);

			// POSTER

			this.dom_poster = document.createElement('div');
			this.dom_poster.className = 'poster';
			this.dom_poster.style.zIndex = this.zindex + 2;
			this.dom_poster.style.position = 'absolute';
			this.dom_poster.style.backgroundColor = '#000';
			this.dom_poster.style.display = 'block';
			this.dom_poster.style.width = '100%';
			this.dom_poster.style.height = '100%';
			this.dom_poster.style.backgroundSize = 'cover';
			this.dom_poster.style.backgroundRepeat = 'no-repeat';
			this.dom_container.appendChild(this.dom_poster);
			if(this.elementtrigger) {
				this.dom_poster.style.cursor = 'pointer';
			}


			// CONTROL

			this.dom_controller = document.createElement('div');

			if(!this.chromeless) {
				this.dom_controller.style.display = 'block';
			}

			this.dom_controller.style.zIndex = this.zindex+1;
			this.dom_controller.style.position = 'relative';
			this.dom_controller.style.height = this.barsize + 'px';
			this.dom_controller.style.width = '100%';
			this.dom_controller.style.top = ( this.dom_container.offsetHeight - this.barsize ) + 'px';
			this.dom_controller.style.left = 0;
			this.dom_controller.style.display = 'none';
			this.dom_container.appendChild(this.dom_controller);

			var tcbg = document.createElement('div');
				tcbg.style.display = 'block';
				tcbg.style.position = 'absolute';
				tcbg.style.backgroundColor = '#000';
				tcbg.style.opacity = 0.6;
				tcbg.style.width = '100%';
				tcbg.style.height = this.barsize + 'px';

			this.dom_controller.appendChild(tcbg);

			// PLAYBACK

			var tcppc = document.createElement('div');
				tcppc.style.position = 'relative';
				tcppc.style.float = 'left';
				tcppc.style.top = 1 + 'px';
				tcppc.style.marginLeft = 5 + 'px';

			this.dom_controller.appendChild(tcppc);

			this.dom_template_play();
			this.addClass(this.dom_play, 'cbtn');
			this.dom_play.style.display = 'block';
			this.dom_play.style.position = 'absolute';
			this.dom_play.style.cursor = 'pointer';
			tcppc.appendChild(this.dom_play);

			this.dom_template_pause();
			this.addClass(this.dom_pause, 'cbtn');
			this.dom_pause.style.display = 'block';
			this.dom_pause.style.position = 'absolute';
			this.dom_pause.style.cursor = 'pointer';
			this.dom_pause.style.display = 'none';

			tcppc.appendChild(this.dom_pause);

			// FULL SCREEN

			if(this.allowfullscreen)
			{
				this.dom_template_fs();
				this.addClass(this.dom_fs, 'cbtn');
				this.dom_fs.style.position = 'absolute';
				this.dom_fs.style.display = 'block';
				this.dom_fs.style.top = 5 + 'px';
				this.dom_fs.style.right = 10 + 'px';
				this.dom_fs.style.cursor = 'pointer';
				this.dom_controller.appendChild(this.dom_fs);
			}

			// MUTE UNMUTE

			var tcmmc = document.createElement('div');
				tcmmc.style.position = 'absolute';
				tcmmc.style.top = 1 + 'px';
				// tcmmc.style.height = 15 + 'px';
				// tcmmc.style.width = 15 + 'px';
				tcmmc.style.textAlign = 'left';
				if(this.allowfullscreen) {
					tcmmc.style.right = 58 + 'px';
				}
				else {
					tcmmc.style.right = 30 + 'px';
				}
			this.dom_controller.appendChild(tcmmc);


			this.dom_template_mute();
			this.addClass(this.dom_mute, 'cbtn');
			this.dom_mute.style.display = 'block';
			this.dom_mute.style.position = 'absolute';
			this.dom_mute.style.cursor = 'pointer';
			tcmmc.appendChild(this.dom_mute);

			this.dom_template_unmute();
			this.addClass(this.dom_unmute, 'cbtn');
			this.dom_unmute.style.display = 'block';
			this.dom_unmute.style.position = 'absolute';
			this.dom_unmute.style.cursor = 'pointer';
			this.dom_unmute.style.display = 'none';
			tcmmc.appendChild(this.dom_unmute);

			// SCRUBBER

			var ts = document.createElement('div');
				ts.style.position = 'absolute';
				ts.style.display = 'block';
				ts.style.height = 4 + 'px';
				ts.style.width = '100%';
				ts.style.top = -4 + 'px';
				ts.style.cursor = 'pointer';
				ts.style.backgroundColor = this.colors_scrubber_bg;
			this.dom_controller.appendChild(ts);

			this.dom_pbar = document.createElement('div');
			this.dom_pbar.style.position = 'absolute';
			this.dom_pbar.style.display = 'block';
			this.dom_pbar.style.height = '100%';
			this.dom_pbar.style.width = 0;
			this.dom_pbar.style.top = 0;
			this.dom_pbar.style.backgroundColor = this.colors_scrubber_progress;
			ts.appendChild(this.dom_pbar);

			this.dom_phead = document.createElement('div');
			this.dom_phead.style.position = 'absolute';
			this.dom_phead.style.display = 'block';
			this.dom_phead.style.height = '100%';
			this.dom_phead.style.width = 0;
			this.dom_phead.style.top = 0;
			this.dom_phead.style.backgroundColor = this.colors_scrubber_playback;
			ts.appendChild(this.dom_phead);

			// BIG BUTTONS

			this.dom_template_bigplay();
			this.addClass(this.dom_bigplay, 'cbtn');
			this.addClass(this.dom_bigplay, 'v_controls_bb');
			this.addClass(this.dom_bigplay, 'play');
			this.dom_bigplay.style.zIndex = this.zindex + 3;
			this.dom_bigplay.style.display = 'block';
			this.dom_bigplay.style.position = 'absolute';
			this.dom_bigplay.style.cursor = 'pointer';
			this.dom_bigplay.style.textShadow = this.dom_template_textshadow;
			this.dom_container.appendChild(this.dom_bigplay);
			this.dom_bigplay.style.display = 'none';
			this.centered_controls.push(this.dom_bigplay);

			this.dom_preview = this.dom_bigplay.cloneNode(true);
			this.addClass(this.dom_preview, 'cbtn');
			this.addClass(this.dom_preview, 'v_controls_bb');
			this.addClass(this.dom_preview, 'play');
			this.dom_preview.style.zIndex = this.zindex + 3;
			this.dom_preview.style.display = 'block';
			this.dom_preview.style.position = 'absolute';
			this.dom_preview.style.cursor = 'pointer';
			this.dom_preview.style.textShadow = this.dom_template_textshadow;		
			this.dom_container.appendChild(this.dom_preview);
			this.dom_preview.style.display = 'none';
			this.centered_controls.push(this.dom_preview);

			if(this.uniquereplay) {
				this.dom_template_replay();
			} else {
				this.dom_replay = this.dom_bigplay.cloneNode(true);
				this.removeClass(this.dom_replay, 'play');
			}
			this.addClass(this.dom_replay, 'cbtn');
			this.addClass(this.dom_replay, 'v_controls_bb');
			this.addClass(this.dom_replay, 'replay');
			this.dom_replay.style.zIndex = this.zindex + 3;
			this.dom_replay.style.display = 'block';
			this.dom_replay.style.position = 'absolute';
			this.dom_replay.style.cursor = 'pointer';
			this.dom_replay.style.textShadow = this.dom_template_textshadow;
			this.dom_container.appendChild(this.dom_replay);
			this.dom_replay.style.display = 'none';
			this.centered_controls.push(this.dom_replay);

			this.dom_template_bigsound();
			this.addClass(this.dom_bigsound, 'cbtn');
			this.addClass(this.dom_bigsound, 'v_controls_bb');
			this.addClass(this.dom_bigsound, 'sound');
			this.dom_bigsound.style.zIndex = this.zindex + 3;
			this.dom_bigsound.style.display = 'block';
			this.dom_bigsound.style.position = 'absolute';
			this.dom_bigsound.style.cursor = 'pointer';
			this.dom_bigsound.style.textShadow = this.dom_template_textshadow;
			this.dom_container.appendChild(this.dom_bigsound);
			this.dom_bigsound.style.display = 'none';
			this.centered_controls.push(this.dom_bigsound);

			this.dom_template_spinner();
			this.addClass(this.dom_spinner, 'cbtn');
			this.addClass(this.dom_spinner, 'v_controls_bb');
			this.addClass(this.dom_spinner, 'wait');
			this.dom_spinner.style.zIndex = this.zindex + 3;
			this.dom_spinner.style.display = 'block';
			this.dom_spinner.style.position = 'absolute';
			this.dom_spinner.style.textShadow = this.dom_template_textshadow;
			this.dom_container.appendChild(this.dom_spinner);
			this.dom_spinner.style.display = 'none';
			this.centered_controls.push(this.dom_spinner);

			this.reflow(true);

			this.initialized = true;
			this.trace('video initialized');
			// this.setListeners();
		}
		else {
			this.trace('already initialized');
		}
	},

	mEnter: function() {
		if(
			!this.isfs &&
			!this.ismobile &&
			!this.chromeless &&
			this.started &&
			( this.dom_bigsound.style.display !== 'block' ) &&
			( this.dom_replay.style.display !== 'block' ) &&
			( this.dom_bigplay.style.display !== 'block' ) &&
			( this.dom_preview.style.display !== 'block' )
		) {
			this.dom_controller.style.display = 'block';
		}
	},
	mLeave: function() {
		this.dom_controller.style.display = 'none';
	},
	mClick: function() {

		if( this.elementtrigger && this.chromeless && !this.isPlaying() )
		{
			this.play(true);
		}

		if( ( this.dom_bigplay.style.display === 'block' ||
			this.dom_replay.style.display === 'block' ) &&
			( this.elementtrigger || ( this.ismobile && this.elementtrigger ) ) ) {
			this.play(true);
		}

		if( this.dom_bigsound.style.display === 'block' &&
			this.elementtrigger ) {
			this.cfs(true);
		}

	},
	barSeek: function(e) {
		var ro = (e.pageX - this.dom_pbar.getBoundingClientRect().left);
		var tp = ( ro / this.dom_container.offsetWidth );

		this.seek( this.duration * tp );

		if( this.dom_play.style.display === 'block' && this.playonseek ) {
			this.proxy.play();
		}
	},
	seek: function(num) {
		this.proxy.currentTime = num;
	},

	load: function(vf, vp) {

		var self = this;

		this.trackReset();

		if(this.initialized) {

			this.firsttime = true;

			this.unload();

			this.dom_spinner.style.display = 'block';
			if(vp) {
				this.hasposter = true;
				this.setPoster(vp);
			} else {
				this.hasposter = false;
			}

			this.reflow(true);

			setTimeout(function(){

				var tve = document.createElement('video');
					tve.width = self.dom_container.offsetWidth;
					tve.height = self.dom_container.offsetHeight;

				if(self.elementtrigger) {
					tve.style.cursor = 'pointer';
				}

				self.dom_frame.appendChild(tve);

				if(self.autoplay && !self.ismobile) {
					tve.setAttribute('autoplay', true);
				}

				if(self.inline) {
					tve.setAttribute('playsinline', '');
					tve.setAttribute('webkit-playsinline', '');
				}

				if(self.progressive) {
					tve.setAttribute('preload', "auto");
				}
				else
				{
					tve.setAttribute('preload', "metadata");
				}

				if(self.ismobile) {
					if(!self.chromeless) {
						tve.setAttribute('controls', '');
					}

					self.dom_controller.style.display = 'none';
				}

				if(self.chromeless) {
					self.dom_controller.style.display = 'none';
				}

				if(typeof vf === 'object') {
					vf.forEach(function(e) {
						var tvs = document.createElement('source');
							tvs.src = e;
							tvs.type = self.getMediaType(e);
						tve.appendChild(tvs);
					});
				} else {
					var tvs = document.createElement('source');
						tvs.src = vf;
						tvs.type = self.getMediaType(vf);
					tve.appendChild(tvs);
				}

				self.proxy = tve;

				self.setListeners(); // COME BACK HERE

				if( !self.hasposter && self.ismobile ) {
					self.dom_spinner.style.display = 'none';

					if(!self.chromeless) {
						self.dom_bigplay.style.display = 'block';
					}
				}

				self.proxy.style.display = 'none';

				self.proxy.addEventListener('click', function(e) {
					self.controlHandler(e);
				});

				self.reflow(true);

			}, 500);
		}
		else {
			this.trace('initialize video first');
		}
	},

	setPoster: function(str) {

		var self = this;

		var newImg = new Image();

			newImg.onload = function() {
				self.trace('loaded: '+str);

				self.dom_poster.style.backgroundImage = 'url('+str+')';
				self.dom_poster.style.display = 'block';

				if(self.ismobile) {
					self.dom_spinner.style.display = 'none';
					
					if(!self.chromeless) {
						self.dom_bigplay.style.display = 'block';
					}
				}

				self.reflow(true); // NOT SURE

			};

			newImg.src = str;
	},

	unload: function(bool) {

		// var self = this;

		this.started = false;
		this.playing = false;
		this.isfs = false;
		this.ready = false;
		this.playhead = 0;

		if( this.proxy ) {
			if(!bool) {
				this.trace('unloading player');
			}

			this.removeListeners();

			this.dom_bigplay.style.display = 'none';
			this.dom_bigsound.style.display = 'none';
			this.dom_replay.style.display = 'none';
			this.dom_poster.style.display = 'none';
			this.dom_controller.style.display = 'none';
			this.dom_spinner.style.display = 'none';

			// THOROUGHNESS ;P

			this.proxy.pause();
			this.proxy.src = "";
			this.proxy.load();
			this.proxy.parentNode.removeChild(this.proxy);
			this.proxy = null;

			this.dom_frame.innerHTML = '';
		}
		else {
			this.trace('nothing to unload');
		}

		this.trackReset();
	},

	destroy: function() {
		
		if(this.initialized) {
			this.unload(true);
			this.dom_container.innerHTML = '';
			this.initialized = false;
			this.trace('destroying player');
		}
		else {
			this.trace('nothing to destroy');
		}
	},

	setListeners: function() {

		var self = this;

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

		this.dom_pbar.addEventListener('click', function(e) {
			self.barSeek(e);
		});
		this.dom_phead.addEventListener('click', function(e) {
			self.barSeek(e);
		});
		this.dom_container.addEventListener('mouseenter', function(e) {
			self.mEnter(e);
		});
		this.dom_container.addEventListener('mouseleave', function(e) {
			self.mLeave(e);
		});
		this.dom_container.addEventListener('click', function(e) {
			self.mClick(e);
		});
		this.dom_play.addEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_pause.addEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_mute.addEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_unmute.addEventListener('click', function(e) {
			self.controlHandler(e);
		});

		if(this.allowfullscreen) {
			this.dom_fs.addEventListener('click', function(e) {
				self.controlHandler(e);
			});
		}

		this.dom_bigplay.addEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_bigsound.addEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_preview.addEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_replay.addEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.proxy.addEventListener('ended', function(e) {
			self.dlEnded(e);
		});
		this.proxy.addEventListener('play', function(e) {
			self.dlPlay(e);
		});
		this.proxy.addEventListener('pause', function(e) {
			self.dlPause(e);
		});
		this.proxy.addEventListener('volumechange', function(e) {
			self.dlVolumeChange(e);
		});
		this.proxy.addEventListener('timeupdate', function(e) {
			self.dlTimeUpdate(e);
		});
		this.proxy.addEventListener('canplay', function(e) {
			self.dlCanPlay(e);
		});
		this.proxy.addEventListener('progress', function(e) {
			self.dlProgress(e);
		});
	},

	removeListeners: function() {

		var self = this;

		this.dom_pbar.removeEventListener('click', function(e) {
			self.barSeek(e);
		});
		this.dom_phead.removeEventListener('click', function(e) {
			self.barSeek(e);
		});
		this.dom_container.removeEventListener('mouseenter', function(e) {
			self.mEnter(e);
		});
		this.dom_container.removeEventListener('mouseleave', function(e) {
			self.mLeave(e);
		});
		this.dom_container.removeEventListener('click', function(e) {
			self.mClick(e);
		});
		this.dom_play.removeEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_pause.removeEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_mute.removeEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_unmute.removeEventListener('click', function(e) {
			self.controlHandler(e);
		});

		if(this.allowfullscreen) {
			this.dom_fs.removeEventListener('click', function(e) {
				self.controlHandler(e);
			});
		}

		this.dom_bigplay.removeEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_bigsound.removeEventListener('click', function(e) {
			self.controlHandler(e);
		});
		this.dom_replay.removeEventListener('click', function(e) {
			self.controlHandler(e);
		});

		this.proxy.removeEventListener('ended', function(e) {
			self.dlEnded(e);
		});
		this.proxy.removeEventListener('play', function(e) {
			self.dlPlay(e);
		});
		this.proxy.removeEventListener('pause', function(e) {
			self.dlPause(e);
		});
		this.proxy.removeEventListener('volumechange', function(e) {
			self.dlVolumeChange(e);
		});
		this.proxy.removeEventListener('timeupdate', function(e) {
			self.dlTimeUpdate(e);
		});
		this.proxy.removeEventListener('canplay', function(e) {
			self.dlCanPlay(e);
		});
		this.proxy.removeEventListener('progress', function(e) {
			self.dlProgress(e);
		});
	},

	dlEnded: function() {

		this.completed = true;

		if(this.loop) {
			this.callback_end();
			this.play();
			this.trace('looping video...');

		} else {

			if(this.replaywithsound) {
				this.disableNotification('volume');
				this.unmute();
			}

			if(this.hasposter) {
				this.dom_poster.style.display = 'block';
			} else {
				if(!this.ismobile) {
					this.dom_replay.style.display = 'block';
					this.dom_controller.style.display = 'none';
				}
			}

			if(!this.chromeless || this.ismobile) {
				this.dom_replay.style.display = 'block';
			}

			this.proxy.style.display = 'none';
			this.dom_bigsound.style.display = 'none';

			this.disableNotification('volume');
			
			this.callback_end();
			

			if(this.preview && !this.ismobile) {
				this.dom_preview.display = 'block';
				this.dom_replay.display = 'none';
				this.preview = 0;
				this.completed = false;
				this.track_preview_end();
			} else {
				this.track_end();
				this.trackReset();
				this.playing = false;
			}
		}

		this.reflow(true);
	},

	dlPlay: function() {

		// var self = this;

		/* 
		this.disableNotification('play');
		this.disableNotification('preview_start');
		this.disableNotification('replay');
		this.disableNotification('start');
		*/

		this.dom_pause.style.display = 'block';
		this.dom_play.style.display = 'none';

		if( this.startmuted && this.autoplay && !this.ismobile && this.firsttime ) {
			this.proxy.muted = true;
		}

		this.callback_play();

		if(!this.track.started && !this.completed) {
			this.track.started = true;

			if(this.preview && !this.ismobile) {
				// PREVIEW
				this.disableNotification('start');
				this.disableNotification('play');
				this.disableNotification('replay');
			}
			else {
				// REGULAR START
				this.disableNotification('play');
				this.disableNotification('preview_start');
				this.disableNotification('replay');
			}
		}
		else {
			if(this.completed)
			{
				// REPLAY
				this.completed = false;
				this.track.started = true;
				this.disableNotification('play');
				this.disableNotification('preview_start');
				this.disableNotification('start');
			} else {
				// UNPAUSE
				this.disableNotification('preview_start');
				this.disableNotification('replay');
				this.disableNotification('start');
			}
		}

		if(this.restartOnPlay) {
			this.cfs(true);
		}

		if(this.notifications.preview_start) {
			this.track_preview_start();
		}
		if(this.notifications.start) {
			this.track_start();
		}
		if(this.notifications.play) {
			this.track_play();
		}
		if(this.notifications.replay && !this.loop) {
			this.track_replay();
		}

		this.enableNotifications();

	},

	dlPause: function() {

		this.dom_pause.style.display = 'none';
		this.dom_play.style.display = 'block';

		if( this.duration > this.playhead ) {
			this.callback_pause();

			if(this.preview && !this.ismobile) {
				this.dom_bigsound.style.display = 'none';
				this.dom_preview.style.display = 'block';
				this.reflow();
				this.disableNotification('end');
				this.disableNotification('pause');
				this.restartOnPlay = true;
				this.trackReset();
				this.preview = 0;
				this.track_preview_end(); // **** TODO
			}
			else {
				this.disableNotification('end');
				this.disableNotification('preview_end');
				if(this.notifications.pause) {
					this.track_pause();	
				}
			}
		}
	},
	dlVolumeChange: function() {
		if(this.proxy.muted) {
			this.dom_mute.style.display = 'none';
			this.dom_unmute.style.display = 'block';

			if(this.notifications.volume) {
				this.track_mute();
			}
		} else {
			this.dom_mute.style.display = 'block';
			this.dom_unmute.style.display = 'none';
			this.dom_bigsound.style.display = 'none';
			if(this.notifications.volume) {
				this.track_unmute();
			}
		}

		this.callback_volume();
	},

	dlProgress: function() {

		if(this.proxy) {
			for(var i = 0; i < this.proxy.buffered.length; i ++) {
				this.buffered = ( this.proxy.buffered.end(i) / this.duration ) * 100;
			}

			this.dom_pbar.style.width = this.buffered+'%';

			this.callback_loading();
		}
	},

	dlTimeUpdate: function() {

		this.playing = true;

		if(this.proxy && this.firsttime) {
			this.firsttime = false;
			this.started = true;

			if( this.startmuted && this.autoplay && !this.ismobile ) {
				this.proxy.muted = true;

				if(!this.chromeless) {
					this.dom_bigsound.style.display = 'block';
				}
				this.dom_controller.style.display = 'none';
				this.playing = false;

				this.reflow(true);
			}
		}

		if( this.dom_controller.style.display === 'block' && this.ismobile ) {
			this.dom_controller.style.display = 'none';
		}
		if( this.dom_bigplay.style.display === 'block' ) {
			this.dom_bigplay.style.display = 'none';
		}
		if( this.dom_replay.style.display === 'block' ) {
			this.dom_replay.style.display = 'none';
		}
		if( this.dom_preview.style.display === 'block' ) {
			this.dom_preview.style.display = 'none';
		}
		if( this.dom_spinner.style.display === 'block' ) {
			this.dom_spinner.style.display = 'none';
		}
		if( this.dom_poster.style.display === 'block' ) {
			this.dom_poster.style.display = 'none';
		}
		if( this.proxy && this.proxy.style.display === 'none') {
			this.proxy.style.display = 'block';
		}
		if( this.proxy ) {
			this.playhead = this.proxy.currentTime;
			this.duration = this.proxy.duration;
		}

		var phpercentage = ( this.playhead / this.duration ) * 100;

		this.dom_phead.style.width = phpercentage+'%';

		// QUARTILES
		if(!this.preview && !this.track.q25 && phpercentage >= 25) {
			this.track.q25 = true;
			this.track_q25();
		}

		if(!this.preview && !this.track.q50 && phpercentage >= 50) {
			this.track.q50 = true;
			this.track_q50();
		}

		if(!this.preview && !this.track.q75 && phpercentage >= 75) {
			this.track.q75 = true;
			this.track_q75();
		}

		this.callback_progress();

		if(this.preview && !this.ismobile && this.playhead > this.preview) {
			this.pause();
		}

	},

	dlCanPlay: function() {

		if(this.firsttime) { // NOT SURE ABOUT THIS

			if(!this.autoplay) {
				this.dom_spinner.style.display = 'none';

				if(!this.ismobile && !this.chromeless) {
					this.dom_bigplay.style.display = 'block';
				}

			}

			if(!this.hasposter && !this.autoplay && !this.ismobile) {
				this.trace('no poster');

				if(!this.chromeless) {
					this.dom_bigplay.style.display = 'block';
				}
				this.dom_controller.style.display = 'none';
			}

			this.reflow(true);
			this.ready = true;
			this.callback_ready();

		}
	},

	callback_end: function() {
		this.trace('Video Ended');
	},
	callback_play: function() {
		this.trace('Video Play');
	},
	callback_stop: function() {
		this.trace('Video Stopped (Manually)');
	},
	callback_pause: function() {
		this.trace('Video Paused');
	},
	callback_volume: function() {
		if(this.proxy.muted) {
			if(this.notifications.volume) { this.trace('Video Muted'); }
		}
		else {
			if(this.notifications.volume) { this.trace('Video Unmuted'); }
		}
	},
	callback_loading: function() {
		// this.trace('Video data downloading');
	},
	callback_progress: function() {
		// this.trace('Video Time Update');
	},
	callback_ready: function() {
		this.trace('Video Ready');
	},

	// TRACKING

	track: {
		started: false,
		q25: false,
		q50: false,
		q75: false
	},

	trackReset: function() {

		// var self = this;
		this.playhead = 0;
		this.track.started = false;
		this.track.q25 = false;
		this.track.q50 = false;
		this.track.q75 = false;
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

		switch(e.currentTarget)
		{
			case this.dom_play:
				this.proxy.play();
			break;
			case this.dom_pause:
				this.proxy.pause();
			break;
			case this.dom_mute:
				this.proxy.muted = true;
			break;
			case this.dom_unmute:
				this.proxy.muted = false;
			break;
			case this.dom_fs:
				this.goFS();
			break;
			case this.dom_bigplay:
				this.proxy.play();
				this.dom_spinner.style.display = 'block';
				this.dom_bigplay.style.display = 'none';
				this.reflow(true);
			break;
			case this.dom_replay:

				this.replay();

				if(this.replaywithsound || this.ismobile) {
					this.disableNotification('volume');
					this.proxy.muted = false;
				}

				if(!this.ismobile && !this.chromeless) {
					this.dom_controller.style.display = 'block';
				} else {
					this.dom_controller.style.display = 'none';
				}

				this.trackReset();

			break;
			case this.dom_preview: 
				this.proxy.play();
			break;
			case this.dom_bigsound:
				this.cfs(true);
			break;
			case this.proxy:

				if(
					this.elementtrigger &&
					this.dom_play.style.display === 'block' &&
					this.dom_bigsound.style.display === 'none' &&
					!this.ismobile
				) {
					this.play();
				}

				if( this.elementtrigger &&
					this.dom_pause.style.display === 'block' &&
					this.dom_bigsound.style.display === 'none' &&
					!this.ismobile
				) {
					this.pause();
				}
			break;
		}

	},

	play: function(bool) {
		this.proxy.play();

		if(bool && !this.ismobile && !this.chromeless) {
			this.dom_controller.style.display = 'block';
		}
	},

	pause: function() {
		this.proxy.pause();
	},

	stop: function(bool) {
		var self = this;

		if(this.playing || bool) {
			this.callback_stop();
			this.track_stop();

			if(this.replaywithsound) {
				this.disableNotification('volume');
				this.unmute();
			}

			this.seek(0);
			this.disableNotification('pause');
			this.pause();
			this.trackReset();
			this.completed = false;
			setTimeout(function(){
				self.playing = false;
				if(self.hasposter) {
					self.dom_poster.style.display = 'block';
				}
				self.dom_bigplay.style.display = 'block';
				self.reflow();
			}, 500);
		}

	},

	replay: function() {
		this.dom_spinner.style.display = 'block';
		this.dom_replay.style.display = 'none';
		this.reflow(true);
		
		if(this.replaywithsound) {
			this.disableNotification('volume');
			this.unmute();
		}

		this.proxy.play();
		this.seek(0);

	},

	mute: function() {
		this.proxy.muted = true;
	},

	unmute: function() {
		this.proxy.muted = false;
	},

	isMuted: function() {
		return this.proxy.muted;
	},

	isPlaying: function() {
		return this.playing;
	},

	cfsFlag: false,
	cfs: function(bool) {

		var self = this;
		
		this.proxy.muted = false;
		this.seek(0);

		if(!this.restartOnPlay && !this.cfsFlag) {
			this.cfsFlag = true;
			this.track_cfs();
		}

		this.disableNotification('volume');

		setTimeout(function(){
			self.preview = 0;
			self.restartOnPlay = false;
		}, 50);

		if(bool && !this.ismobile && !this.chromeless) {
			this.dom_controller.style.display = 'block';
		}

		this.enableNotifications();
	},
	goFS: function() {

		if (this.proxy.requestFullscreen) {
			this.proxy.requestFullscreen();
			// this.isfs = true;
			// this.track_enterfs();
		} else if (this.proxy.mozRequestFullScreen) {
			this.proxy.mozRequestFullScreen(); // Firefox
			// this.isfs = true;
			// this.track_enterfs();
		} else if (this.proxy.webkitRequestFullscreen) {
			this.proxy.webkitRequestFullscreen(); // Chrome and Safari
			// this.isfs = true;
			// this.track_enterfs();
		}
	},

	getMediaType: function(str) {
		return this.mTypes[str.split('.')[str.split('.').length - 1]];
	},

	centered_controls: [],

	reflow: function(passive) {
		if(this.initialized) {
			if(this.proxy) {
				this.proxy.width = this.dom_container.offsetWidth;
				this.proxy.height = this.dom_container.offsetHeight;
			}

			this.dom_controller.style.top = ( this.dom_container.offsetHeight - this.barsize ) + 'px';
			this.dom_controller.style.left = 0;

			// CENTER ALL ELEMENTS FOUND IN center_controls ARRAY
			for(var key in this.centered_controls) {
				var item = this.centered_controls[key];

					item.style.top = '50%';
					item.style.marginTop = ( ( item.offsetHeight / 2 ) * -1 ) + 'px';
					item.style.left = '50%';
					item.style.marginLeft = ( ( item.offsetWidth / 2 ) * -1 ) + 'px';
			}

			if(!passive) {
				this.trace('reflow video');
			}
		}
		else if(!passive) {
			this.trace("reflow useless: video elements aren't ready");
		}
	},

	trace: function(str) {

		if(this.debug) {

			if(window.console) {
				window.console.log(str);
			}

			if( this.dom_debug ) {
				this.dom_debug.innerHTML += str + '<br>';
			}
		}
	},

	addClass: function(el, className) {
		if (el.classList) {
			el.classList.add(className);
		} else {
			el.className += ' ' + className;
		}
	},

	removeClass: function(el, className) {
		if (el.classList) {
			el.classList.remove(className);
		} else {
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	},

	listMethods: function() {

	}
};

