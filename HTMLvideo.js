/*!
 *  HTML VIDEO HELPER
 *
 *  4.12
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
    preload: false,
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

    isSafari() {
        return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    },

    checkForMobile() {
        const DESKTOP_AGENTS = [
            'desktop'
        ];

        let mobileFlag = true;

        if(typeof device !== 'undefined') {
            // USE DEVICEJS IF AVAILABLE
            for (let i = 0; i < DESKTOP_AGENTS.length; i++) {
                let regex;
                    regex = new RegExp(DESKTOP_AGENTS[i], 'i');

                if( window.document.documentElement.className.match(regex) ) {
                    mobileFlag = false;
                }
            }
        } else {
            // BACKUP [RUDIMENTARY] DETECTION
            mobileFlag = 'ontouchstart' in window;
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
    
    disableNotification(str) {
        this.notifications[str] = false;
    },  
    enableNotifications() {
        let n = this.notifications;

        setTimeout( () => {
            for(let p in n) { n[p] = true; }
        }, 100);
    },
    dom_template_bigplay() {
        this.dom_bigplay = document.createElement('div');
        this.dom_bigplay.style.backgroundColor = this.colors_bg;
        this.setVendor(this.dom_bigplay, 'borderRadius', '32px');
        this.dom_bigplay.innerHTML = this.svg.bigplay;
        this.dom_bigplay.getElementsByTagName('path')[0].style.fill = this.colors_bigplay;
        
    },
    dom_template_bigsound() {
        this.dom_bigsound = document.createElement('div');
        this.dom_bigsound.style.backgroundColor = this.colors_bg;
        this.setVendor(this.dom_bigsound, 'borderRadius', '32px');
        this.dom_bigsound.innerHTML = this.svg.bigsound;
        this.dom_bigsound.getElementsByTagName('path')[0].style.fill = this.colors_bigsound;
    },
    dom_template_replay() {
        this.dom_replay = document.createElement('div');
        this.dom_replay.style.backgroundColor = this.colors_bg;
        this.setVendor(this.dom_replay, 'borderRadius', '32px');
        this.dom_replay.innerHTML = this.svg.replay;
        this.dom_replay.getElementsByTagName('path')[0].style.fill = this.colors_replay;
        this.dom_replay.getElementsByTagName('svg')[0].style.marginTop = '-5px';
    },
    dom_template_spinner() {
        this.dom_spinner = document.createElement('div');
        this.dom_spinner.style.backgroundColor = this.colors_bg;
        this.setVendor(this.dom_spinner, 'borderRadius', '32px');
        this.dom_spinner.innerHTML = this.svg.spin;
        this.dom_spinner.style.padding = '5px';
        this.dom_spinner.style.width = '32px';
        this.dom_spinner.style.height = '32px';
        this.dom_spinner.getElementsByTagName('path')[0].style.fill = this.colors_spinner;
    },
    dom_template_play() {
        this.dom_play = document.createElement('span');
        this.dom_play.innerHTML = this.svg.play;
        this.dom_play.getElementsByTagName('path')[0].style.fill = this.colors_play_pause;
    },
    dom_template_pause() {
        this.dom_pause = document.createElement('span');
        this.dom_pause.innerHTML = this.svg.pause;
        this.dom_pause.getElementsByTagName('path')[0].style.fill = this.colors_play_pause;
    },
    dom_template_mute() {
        this.dom_mute = document.createElement('span');
        this.dom_mute.innerHTML = this.svg.mute;
        this.dom_mute.getElementsByTagName('path')[0].style.fill = this.colors_mute_unmute;
    },
    dom_template_unmute() {
        this.dom_unmute = document.createElement('span');
        this.dom_unmute.innerHTML = this.svg.unmute;
        this.dom_unmute.getElementsByTagName('path')[0].style.fill = this.colors_mute_unmute;
    },
    dom_template_fs() {
        this.dom_fs = document.createElement('span');
        this.dom_fs.innerHTML = this.svg.fs;
        this.dom_fs.getElementsByTagName('path')[0].style.fill = this.colors_fs;
    },

    init(vc) {
        if(!this.initialized)
        {
            if(this.ismobile === null) { this.checkForMobile(); }

            if(this.preview) {
                this.autoplay = true;
                this.startmuted = true;
                
                if(this.ismobile)
                    this.inline = true;
            }

            if(typeof vc === 'object') {
                if( typeof(jQuery) === 'undefined' ) { 
                    this.dom_playercontainer = vc; 
                } else {
                    this.dom_playercontainer = document.getElementById( vc.attr('id') ); 
                }
            } else {
                this.dom_container = document.getElementById( vc );
            }

            this.dom_container.style.backgroundColor = '#000';
            this.dom_container.style.overflow = 'hidden';

            // GET Z-INDEX

            if( !this.zindex && document.defaultView && document.defaultView.getComputedStyle ) {
                let s = document.defaultView.getComputedStyle( this.dom_container, '' );
                this.zindex = parseInt( s.getPropertyValue('z-index'), 10 );
            } else 
            if( !this.zindex && this.dom_container.currentStyle ) {
                this.zindex = parseInt( this.dom_container.currentStyle.zIndex, 10 );
            }

            if( !this.zindex ) {
                this.zindex = 0;
                this.trace("z-index for video container element not detected, make sure position property is set.\nzIndex set to 0");
            }

            // SET FULLSCREEN EXIT

            document.addEventListener("fullscreenchange", () => {
                this.trace("fullscreen: "+document.fullscreen);

                if(document.fullscreen) {
                    this.track_enterfs();
                    this.isfs = true;
                }
                else {
                    this.track_exitfs();
                    this.isfs = false;
                }

            }, false);
            document.addEventListener("mozfullscreenchange", () => {
                this.trace("fullscreen: "+document.mozFullScreen);

                if(document.mozFullScreen) {
                    this.track_enterfs();
                    this.isfs = true;
                }
                else {
                    this.track_exitfs();
                    this.isfs = false;
                }

            }, false);
            document.addEventListener("webkitfullscreenchange", () => {
                this.trace("fullscreen: "+document.webkitIsFullScreen);

                if(document.webkitIsFullScreen) {
                    this.track_enterfs();
                    this.isfs = true;
                }
                else {
                    this.track_exitfs();
                    this.isfs = false;
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
            this.dom_poster.style.zIndex = this.zindex + 1;
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
            this.dom_controller.style.display = this.controlbar ? 'block':'none';
            this.dom_controller.style.zIndex = this.zindex;
            this.dom_controller.style.position = 'relative';
            this.dom_controller.style.height = this.barsize + 'px';
            this.dom_controller.style.width = '100%';
            this.dom_controller.style.top = ( this.dom_container.offsetHeight - this.barsize ) + 'px';
            this.dom_controller.style.left = 0;
            this.dom_controller.style.display = 'none';
            this.dom_controller.className = 'v_control_bar';

            if(!this.chromeless) {
                this.dom_container.appendChild(this.dom_controller);
            }

            let tcbg = document.createElement('div');
                tcbg.style.display = 'block';
                tcbg.style.position = 'absolute';
                tcbg.style.backgroundColor = '#000';
                tcbg.style.opacity = 0.6;
                tcbg.style.width = '100%';
                tcbg.style.height = this.barsize + 'px';

            this.dom_controller.appendChild(tcbg);

            // PLAYBACK

            let tcppc = document.createElement('div');
                tcppc.style.position = 'relative';
                tcppc.style.float = 'left';
                tcppc.style.top = 1 + 'px';
                tcppc.style.marginLeft = 5 + 'px';
                tcppc.className = 'v_control_pp';

            this.dom_controller.appendChild(tcppc);

            this.dom_template_play();
            this.addClass(this.dom_play, 'cbtn');
            this.addClass(this.dom_play, 'v_control_sb');
            this.addClass(this.dom_play, 'play');
            this.dom_play.style.display = 'block';
            this.dom_play.style.position = 'absolute';
            this.dom_play.style.cursor = 'pointer';
            tcppc.appendChild(this.dom_play);

            this.dom_template_pause();
            this.addClass(this.dom_pause, 'cbtn');
            this.addClass(this.dom_pause, 'v_control_sb');
            this.addClass(this.dom_pause, 'pause');
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
                this.addClass(this.dom_fs, 'v_control_sb');
                this.addClass(this.dom_fs, 'fs');
                this.dom_fs.style.position = 'absolute';
                this.dom_fs.style.display = 'block';
                this.dom_fs.style.top = 5 + 'px';
                this.dom_fs.style.right = 10 + 'px';
                this.dom_fs.style.cursor = 'pointer';
                this.dom_controller.appendChild(this.dom_fs);
            }

            // MUTE UNMUTE

            let tcmmc = document.createElement('div');
                tcmmc.style.position = 'absolute';
                tcmmc.style.top = 0 + 'px';
                tcmmc.className = 'v_control_mu';
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
            this.addClass(this.dom_mute, 'v_control_sb');
            this.addClass(this.dom_mute, 'mute');
            this.dom_mute.style.display = 'block';
            this.dom_mute.style.position = 'absolute';
            this.dom_mute.style.cursor = 'pointer';
            tcmmc.appendChild(this.dom_mute);

            this.dom_template_unmute();
            this.addClass(this.dom_unmute, 'cbtn');
            this.addClass(this.dom_unmute, 'v_control_sb');
            this.addClass(this.dom_unmute, 'unmute');
            this.dom_unmute.style.display = 'block';
            this.dom_unmute.style.position = 'absolute';
            this.dom_unmute.style.cursor = 'pointer';
            this.dom_unmute.style.display = 'none';
            tcmmc.appendChild(this.dom_unmute);

            // SCRUBBER

            let ts = document.createElement('div');
                ts.style.position = 'absolute';
                ts.style.display = 'block';
                ts.style.height = 4 + 'px';
                ts.style.width = '100%';
                ts.style.top = -4 + 'px';
                ts.style.cursor = 'pointer';
                ts.style.backgroundColor = this.colors_scrubber_bg;
                ts.className = 'scrubber';
            this.dom_controller.appendChild(ts);

            this.dom_pbar = document.createElement('div');
            this.dom_pbar.style.position = 'absolute';
            this.dom_pbar.style.display = 'block';
            this.dom_pbar.style.height = '100%';
            this.dom_pbar.style.width = 0;
            this.dom_pbar.style.top = 0;
            this.dom_pbar.style.backgroundColor = this.colors_scrubber_progress;
            this.dom_pbar.className = 'playbar';
            ts.appendChild(this.dom_pbar);

            this.dom_phead = document.createElement('div');
            this.dom_phead.style.position = 'absolute';
            this.dom_phead.style.display = 'block';
            this.dom_phead.style.height = '100%';
            this.dom_phead.style.width = 0;
            this.dom_phead.style.top = 0;
            this.dom_phead.style.backgroundColor = this.colors_scrubber_playback;
            this.dom_phead.className = 'playhead';
            ts.appendChild(this.dom_phead);

            // BIG BUTTONS

            this.dom_template_bigplay();
            this.addClass(this.dom_bigplay, 'cbtn');
            this.addClass(this.dom_bigplay, 'v_control_bb');
            this.addClass(this.dom_bigplay, 'play');
            this.dom_bigplay.style.zIndex = this.zindex + 2;
            this.dom_bigplay.style.display = 'block';
            this.dom_bigplay.style.position = 'absolute';
            this.dom_bigplay.style.cursor = 'pointer';
            this.dom_bigplay.style.textShadow = this.dom_template_textshadow;
            if(!this.chromeless) {
                this.dom_container.appendChild(this.dom_bigplay);
            }
            this.dom_bigplay.style.display = 'none';
            this.centered_controls.push(this.dom_bigplay);

            this.dom_preview = this.dom_bigplay.cloneNode(true);
            this.addClass(this.dom_preview, 'cbtn');
            this.addClass(this.dom_preview, 'v_control_bb');
            this.addClass(this.dom_preview, 'play');
            this.dom_preview.style.zIndex = this.zindex + 2;
            this.dom_preview.style.display = 'block';
            this.dom_preview.style.position = 'absolute';
            this.dom_preview.style.cursor = 'pointer';
            if(!this.chromeless) {
                this.dom_container.appendChild(this.dom_preview);
            }
            this.dom_preview.style.display = 'none';
            this.centered_controls.push(this.dom_preview);

            if(this.uniquereplay) {
                this.dom_template_replay();
            } else {
                this.dom_replay = this.dom_bigplay.cloneNode(true);
                this.removeClass(this.dom_replay, 'play');
            }
            this.addClass(this.dom_replay, 'cbtn');
            this.addClass(this.dom_replay, 'v_control_bb');
            this.addClass(this.dom_replay, 'replay');
            this.dom_replay.style.zIndex = this.zindex + 2;
            this.dom_replay.style.display = 'block';
            this.dom_replay.style.position = 'absolute';
            this.dom_replay.style.cursor = 'pointer';
            if(!this.chromeless) {
                this.dom_container.appendChild(this.dom_replay);
            }
            this.dom_replay.style.display = 'none';
            this.centered_controls.push(this.dom_replay);

            this.dom_template_bigsound();
            this.addClass(this.dom_bigsound, 'cbtn');
            this.addClass(this.dom_bigsound, 'v_control_bb');
            this.addClass(this.dom_bigsound, 'sound');
            this.dom_bigsound.style.zIndex = this.zindex + 2;
            this.dom_bigsound.style.display = 'block';
            this.dom_bigsound.style.position = 'absolute';
            this.dom_bigsound.style.cursor = 'pointer';
            if(!this.chromeless) {
                this.dom_container.appendChild(this.dom_bigsound);
            }
            this.dom_bigsound.style.display = 'none';
            this.centered_controls.push(this.dom_bigsound);

            this.dom_template_spinner();
            this.addClass(this.dom_spinner, 'cbtn');
            this.addClass(this.dom_spinner, 'v_control_bb');
            this.addClass(this.dom_spinner, 'wait');
            this.dom_spinner.style.zIndex = this.zindex + 2;
            this.dom_spinner.style.display = 'block';
            this.dom_spinner.style.position = 'absolute';
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

    mEnter() {
        if( this.started &&
            !this.isfs &&
            !this.ismobile &&
            ( this.dom_bigsound.style.display !== 'block' ) &&
            ( this.dom_replay.style.display !== 'block' ) &&
            ( this.dom_bigplay.style.display !== 'block' ) &&
            ( this.dom_preview.style.display !== 'block' )
        ) {
            this.dom_controller.style.display = this.controlbar ? 'block':'none';
        }
    },
    mLeave() {
        this.dom_controller.style.display = 'none';
    },
    mClick() {
        if(this.elementtrigger) {
            if( !this.isPlaying() )
            {
                this.play(true);
            } 

            if( this.dom_bigplay.style.display === 'block' ||
                this.dom_replay.style.display === 'block' || 
                this.dom_preview.style.display === 'block' ) {
                this.play(true);
            
            } 

            if( this.dom_bigsound.style.display === 'block' ) {
                this.cfs(true);
            }
        
        }
        
    },
    barSeek(e) {
        let ro = (e.pageX - this.dom_pbar.getBoundingClientRect().left);
        let tp = ( ro / this.dom_container.offsetWidth );

        this.seek( this.duration * tp );

        if( this.dom_play.style.display === 'block' && this.playonseek ) {
            this.proxy.play();
        }
    },
    seek(num) {
        this.proxy.currentTime = num;
    },

    load(vf, vp) {
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

            setTimeout( () => {

                let tve = document.createElement('video');
                    tve.width = this.dom_container.offsetWidth;
                    tve.height = this.dom_container.offsetHeight;

                if( this.autoplay ) {

                    if( 'autoplay' in tve )
                        tve.autoplay = true;

                    if( this.ismobile || this.isSafari() ) {
                        
                        this.inline = true;
                        this.startmuted = true;
                    }
                }

                if(this.startmuted) {
                    tve.muted = true;
                }

                if(this.inline) {

                    if( "playsInline" in document.createElement('video') ) {
                        tve.playsInline = true;
                    } else {
                        this.inline = false;

                        if(this.ismobile) {

                            this.autoplay = false;
                            this.startmuted = false;
                            this.preview = 0;
                            
                            tve.muted = false;
                            tve.autoplay = false;
                            
                        }
                    }
                }

                if(this.preload) {
                    tve.preload = "metadata";
                } else {
                    tve.preload = "none";
                }

                if(this.chromeless) {
                    this.dom_controller.style.display = 'none';
                    tve.controls = false;
                } else {
                    if(this.ismobile) {
                        this.dom_controller.style.display = 'none';

                        if(!this.autoplay)
                            tve.controls = this.controlbar ? true : false;
                    }                   
                }

                if(typeof vf === 'object') {
                    vf.forEach( (e) => {
                        let tvs = document.createElement('source');
                            tvs.src = e;
                            tvs.type = this.getMediaType(e);
                        tve.appendChild(tvs);
                    });
                } else {
                    let tvs = document.createElement('source');
                        tvs.src = vf;
                        tvs.type = this.getMediaType(vf);
                    tve.appendChild(tvs);
                }

                if(vp) {
                    tve.poster = vp;
                }

                if(this.elementtrigger) {
                    tve.style.cursor = 'pointer';
                }

                this.dom_frame.appendChild(tve);

                this.proxy = tve;

                this.setListeners(); // COME BACK HERE

                if( !this.hasposter && this.ismobile && !this.autoplay ) {
                    this.dom_spinner.style.display = 'none';
                    this.dom_bigplay.style.display = 'block';
                }

                if( this.ismobile && this.autoplay )
                    this.proxy.style.display = 'block';
                else
                    this.proxy.style.display = 'none';

                this.proxy.addEventListener('click', (e) => {
                    this.controlHandler(e);
                });

                this.reflow(true);

            }, this.loadDelay);
        }
        else {
            this.trace('initialize video first');
        }
    },

    setPoster(str) {
        let newImg = new Image();
            newImg.onload = () => {
                this.trace('loaded: '+str);

                this.dom_poster.style.backgroundImage = 'url('+str+')';
                this.dom_poster.style.display = 'block';

                if(this.autoplay) {
                    this.dom_spinner.style.display = 'block';
                    this.dom_bigplay.style.display = 'none';
                } else {
                    this.dom_spinner.style.display = 'none';
                    this.dom_bigplay.style.display = 'block';
                    
                }

                this.reflow(true); // NOT SURE

            };
            newImg.src = str;
    },

    unload(bool) {
        this.started = false;
        this.playing = false;
        this.isfs = false;
        this.ready = false;
        this.playhead = 0;
        this.firsttime = true;
        this.completed = false;
        this.restartOnPlay = false;
        this.hasposter = false;
        this.playhead = 0;
        this.duration = 0;
        this.buffered = 0;

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

        this.trackReset();
    },

    destroy() {
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

    setListeners() {
        this.dom_pbar.addEventListener(         'click',        (e) => { this.barSeek(e); });
        this.dom_phead.addEventListener(        'click',        (e) => { this.barSeek(e); });
        this.dom_container.addEventListener(    'mouseenter',   (e) => { this.mEnter(e); });
        this.dom_container.addEventListener(    'mouseleave',   (e) => { this.mLeave(e); });
        this.dom_container.addEventListener(    'click',        (e) => { this.mClick(e); });
        this.dom_play.addEventListener(         'click',        (e) => { this.controlHandler(e); });
        this.dom_pause.addEventListener(        'click',        (e) => { this.controlHandler(e); });
        this.dom_mute.addEventListener(         'click',        (e) => { this.controlHandler(e); });
        this.dom_unmute.addEventListener(       'click',        (e) => { this.controlHandler(e); });
        this.dom_bigplay.addEventListener(      'click',        (e) => { this.controlHandler(e); });
        this.dom_bigsound.addEventListener(     'click',        (e) => { this.controlHandler(e); });
        this.dom_preview.addEventListener(      'click',        (e) => { this.controlHandler(e); });
        this.dom_replay.addEventListener(       'click',        (e) => { this.controlHandler(e); });
        if(this.allowfullscreen) {
            this.dom_fs.addEventListener(       'click',        (e) => { this.controlHandler(e); });
        }
        this.proxy.addEventListener(            'ended',        (e) => { this.dlEnded(e); });
        this.proxy.addEventListener(            'play',         (e) => { this.dlPlay(e); });
        this.proxy.addEventListener(            'pause',        (e) => { this.dlPause(e); });
        this.proxy.addEventListener(            'volumechange', (e) => { this.dlVolumeChange(e); });
        this.proxy.addEventListener(            'timeupdate',   (e) => { this.dlTimeUpdate(e); });
        this.proxy.addEventListener(            'canplay',      (e) => { this.dlCanPlay(e); });
        this.proxy.addEventListener(            'progress',     (e) => { this.dlProgress(e); });
    },

    removeListeners() {
        this.dom_pbar.removeEventListener(      'click',        (e) => { this.barSeek(e); });
        this.dom_phead.removeEventListener(     'click',        (e) => { this.barSeek(e); });
        this.dom_container.removeEventListener( 'mouseenter',   (e) => { this.mEnter(e); });
        this.dom_container.removeEventListener( 'mouseleave',   (e) => { this.mLeave(e); });
        this.dom_container.removeEventListener( 'click',        (e) => { this.mClick(e); });
        this.dom_play.removeEventListener(      'click',        (e) => { this.controlHandler(e); });
        this.dom_pause.removeEventListener(     'click',        (e) => { this.controlHandler(e); });
        this.dom_mute.removeEventListener(      'click',        (e) => { this.controlHandler(e); });
        this.dom_unmute.removeEventListener(    'click',        (e) => { this.controlHandler(e); });
        this.dom_bigplay.removeEventListener(   'click',        (e) => { this.controlHandler(e); });
        this.dom_bigsound.removeEventListener(  'click',        (e) => { this.controlHandler(e); });
        this.dom_replay.removeEventListener(    'click',        (e) => { this.controlHandler(e); });
        if(this.allowfullscreen) {
            this.dom_fs.removeEventListener(    'click',        (e) => { this.controlHandler(e); });
        }
        this.proxy.removeEventListener(         'ended',        (e) => { this.dlEnded(e); });
        this.proxy.removeEventListener(         'play',         (e) => { this.dlPlay(e); });
        this.proxy.removeEventListener(         'pause',        (e) => { this.dlPause(e); });
        this.proxy.removeEventListener(         'volumechange', (e) => { this.dlVolumeChange(e); });
        this.proxy.removeEventListener(         'timeupdate',   (e) => { this.dlTimeUpdate(e); });
        this.proxy.removeEventListener(         'canplay',      (e) => { this.dlCanPlay(e); });
        this.proxy.removeEventListener(         'progress',     (e) => { this.dlProgress(e); });
    },

    dlEnded() {
        this.completed = true;
        this.callback_end();

        if(this.loop) {

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
                    this.dom_controller.style.display = 'none';
                }
            }

            if(!this.chromeless && !this.preview) {
                this.dom_replay.style.display = 'block';
            }

            this.proxy.style.display = 'none';
            this.dom_bigsound.style.display = 'none';

            this.disableNotification('volume');

            if(this.preview && !this.ismobile) {
                this.dom_preview.style.display = 'block';
                this.preview = 0;
                this.completed = false;
                this.track_preview_stop();
            } else {
                this.track_end();
                this.trackReset();
                this.playing = false;
            }

            this.dom_poster.style.cursor = 'pointer';
        }

        this.reflow(true);
    },

    dlPlay() {
        this.dom_pause.style.display = 'block';
        this.dom_play.style.display = 'none';

        this.callback_play();

        if(!this.track.started && !this.completed) {
            this.track.started = true;

            if(this.preview) {
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

    dlPause() {
        this.dom_pause.style.display = 'none';
        this.dom_play.style.display = 'block';

        if( this.preview < this.playhead ) {
            this.callback_pause();
            
            if(this.preview) {
                this.dom_bigsound.style.display = 'none';
                this.dom_preview.style.display = 'block';
                this.reflow();
                this.disableNotification('end');
                this.disableNotification('pause');
                this.restartOnPlay = true;
                this.trackReset();
                this.preview = 0;
                this.track_preview_stop();
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
    dlVolumeChange() {
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

    dlProgress() {
        if(this.proxy) {
            for(let i = 0; i < this.proxy.buffered.length; i ++) {
                this.buffered = ( this.proxy.buffered.end(i) / this.duration ) * 100;
            }

            this.dom_pbar.style.width = this.buffered+'%';

            this.callback_loading();
        }
    },

    dlTimeUpdate() {
        this.playing = true;
        if(this.proxy && this.firsttime) {
            this.firsttime = false;
            this.started = true;

            if( this.startmuted && this.autoplay ) {
                // this.proxy.muted = true;

                this.dom_bigsound.style.display = 'block';
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

        if( !this.elementplayback && 
            this.dom_bigsound.style.display === 'none' &&
            this.dom_preview.style.display === 'none'
            ) {
                this.proxy.style.cursor = 'auto';
            }

        let phpercentage = ( this.playhead / this.duration ) * 100;

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

        if(this.preview && ( this.playhead > this.preview ) ) {
            this.pause();
        }

    },

    dlCanPlay() {
        if(this.firsttime) { // NOT SURE ABOUT THIS

            if(!this.autoplay) {
                this.dom_spinner.style.display = 'none';

                if(!this.ismobile) {
                    this.dom_bigplay.style.display = 'block';
                }

            }

            if(!this.hasposter && !this.autoplay && !this.ismobile) {
                this.trace('no poster');
                this.dom_bigplay.style.display = 'block';
                this.dom_controller.style.display = 'none';
            }

            if(this.ismobile) {

                this.dom_controller.style.display = 'none';

                if( this.autoplay ) {
                    this.dom_spinner.style.display = 'block';
                    this.dom_bigplay.style.display = 'none';
                    this.dom_poster.style.display = 'none';
                    this.proxy.style.display = 'block';
                } else {
                    if(!this.chromeless)
                        this.dom_bigplay.style.display = 'block';
                }
            } else {
                // SAFARI FIX FOR NOT AUTO WITH PREVIEW SET
                if( this.isSafari() && this.autoplay ) this.proxy.play();
            }

            this.reflow(true);
            this.ready = true;
            this.callback_ready();

        }
    },
    callback_loading()      { /* this.trace('------------------ callback_loading'); */ },
    callback_progress()     { /* this.trace('------------------ callback_progress'); */ },
    callback_ready()        { this.trace('------------------ callback_ready'); },
    callback_end()          { this.trace('------------------ callback_end'); },
    callback_play()         { this.trace('------------------ callback_play'); },
    callback_playerror()    { this.trace('------------------ callback_playerror'); },
    callback_stop()         { this.trace('------------------ callback_stop'); },
    callback_pause()        { this.trace('------------------ callback_pause'); },
    callback_volume()       { this.trace('------------------ callback_volume');
        if(this.proxy.muted) {
            if(this.notifications.volume) { this.trace('Video Muted'); }
        }
        else {
            if(this.notifications.volume) { this.trace('Video Unmuted'); }
        }
    },

    // TRACKING

    track: {
        started: false,
        q25: false,
        q50: false,
        q75: false
    },

    trackReset() {
        this.playhead = 0;
        this.track.started = false;
        this.track.q25 = false;
        this.track.q50 = false;
        this.track.q75 = false;
    },

    track_start()           { this.trace('------------------ track_start'); },
    track_end()             { this.trace('------------------ track_end'); },
    track_preview_start()   { this.trace('------------------ track_preview_start'); },
    track_preview_stop()     { this.trace('------------------ track_preview_stop'); },
    track_play()            { this.trace('------------------ track_play'); },
    track_pause()           { this.trace('------------------ track_pause'); },
    track_stop()            { this.trace('------------------ track_stop'); },
    track_replay()          { this.trace('------------------ track_replay'); },
    track_mute()            { this.trace('------------------ track_mute'); },
    track_unmute()          { this.trace('------------------ track_unmute'); },
    track_q25()             { this.trace('------------------ track_q25'); },
    track_q50()             { this.trace('------------------ track_q50'); },
    track_q75()             { this.trace('------------------ track_q75'); },
    track_enterfs()         { this.trace('------------------ track_enterfs'); },
    track_exitfs()          { this.trace('------------------ track_exitfs'); },
    track_cfs()             { this.trace('------------------ track_cfs'); },

    controlHandler(e) {
        switch(e.currentTarget) {
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

                if(!this.ismobile) {
                    this.dom_controller.style.display = this.controlbar ? 'block':'none';
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

                // ELEMENT TRIGGER
                if(
                    this.elementtrigger &&
                    this.dom_play.style.display === 'block' &&
                    this.dom_bigsound.style.display === 'none' &&
                    this.elementplayback
                ) {
                    if(!this.ismobile || ( this.ismobile && this.inline && !this.controlbar ) )
                        this.play();
                }

                if( this.elementtrigger &&
                    this.dom_pause.style.display === 'block' &&
                    this.dom_bigsound.style.display === 'none' &&
                    this.elementplayback
                ) {
                    if(!this.ismobile || ( this.ismobile && this.inline && !this.controlbar ) ) 
                        this.pause();
                }
            break;
        }
    },

    play(bool) {
        if(this.proxy) {

            let promise = this.proxy.play();
                
            if ( promise !== undefined ) {
                      promise.catch( () => {
                      this.callback_playerror();
                      }).then( () => {
                      
                      if(bool && !this.ismobile) {
                        this.dom_controller.style.display = this.controlbar ? 'block':'none';
                    }
                    
                      });
            }
        }
    },

    pause() { 
        if( this.proxy ) 
            this.proxy.pause(); 
    },

    mute() { 
        this.proxy.muted = true; 
    },

    unmute() { 
        this.proxy.muted = false; 
    },

    isMuted() { 
        return this.proxy.muted; 
    },

    isPlaying() { 
        return this.playing; 
    },

    stop(bool) {
        if(this.proxy) {

            if(this.playing || bool) {
                this.callback_stop();
                
                if(this.preview > 0) {
                    this.preview = 0;
                    this.completed = false;
                    this.track_preview_stop();
                } else {
                    this.track_stop();
                }

                if(this.replaywithsound) {
                    this.disableNotification('volume');
                    this.unmute();
                }

                this.seek(0);
                this.disableNotification('pause');
                this.pause();
                this.trackReset();
                this.completed = false;
                setTimeout( () => {
                    this.playing = false;
                    if(this.hasposter) {
                        this.dom_poster.style.display = 'block';
                    }
                    
                    this.dom_bigplay.style.display = 'block';
                    this.reflow();
                }, 500);
            }
        }
    },

    replay() {
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

    cfsFlag: false,
    cfs(bool) {
        this.proxy.muted = false;
        this.seek(0);

        if(!this.restartOnPlay && !this.cfsFlag) {
            this.cfsFlag = true;
            this.track_cfs();

            if(this.ismobile && !this.chromeless)
                this.proxy.controls = this.controlbar ? true : false;
        }

        this.disableNotification('volume');

        setTimeout( () => {
            this.preview = 0;
            this.restartOnPlay = false;
        }, 50);

        if(bool && !this.ismobile) {
            this.dom_controller.style.display = this.controlbar ? 'block':'none';
        }

        this.enableNotifications();
    },
    goFS() {
        if (this.proxy.requestFullscreen)
            this.proxy.requestFullscreen();
        else if (this.proxy.mozRequestFullScreen)
            this.proxy.mozRequestFullScreen(); // Firefox
        else if (this.proxy.webkitRequestFullscreen)
            this.proxy.webkitRequestFullscreen(); // Chrome and Safari
    },

    getMediaType(str) {
        return this.mTypes[str.split('.')[str.split('.').length - 1]];
    },

    reflow(passive) {
        if(this.initialized) {
            if(this.proxy) {
                this.proxy.width = this.dom_container.offsetWidth;
                this.proxy.height = this.dom_container.offsetHeight;
            }

            this.dom_controller.style.top = ( this.dom_container.offsetHeight - this.barsize ) + 'px';
            this.dom_controller.style.left = 0;

            // CENTER ALL ELEMENTS FOUND IN center_controls ARRAY
            for(let key in this.centered_controls) {
                let item = this.centered_controls[key];

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

    trace(str) {
        if(this.debug) {

            if(window.console) {
                window.console.log(str);
            }

            if( this.dom_debug ) {
                this.dom_debug.innerHTML += str + '<br>';
            }
        }
    },

    setVendor(element, property, value) {
        let styles = window.getComputedStyle(element, '');
        let regexp = new RegExp(property+'$', "i");

        for (let key in styles) {
            if( regexp.test(key) ) {
                element.style[key] = value;
            }
        }
    },

    addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    },

    removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },

    help() {
        window.open('https://github.com/nargalzius/HTMLvideo');
    }
};