/*!
 *  HTML VIDEO HELPER
 *
 *  5.6
 *
 *  author: Carlo J. Santos
 *  email: carlosantos@gmail.com
 *  documentation: https://github.com/nargalzius/HTMLvideo
 *  demo: https://codepen.io/nargalzius/full/KmbROq
 *
 *  Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

/* eslint-disable no-console */
/* eslint comma-dangle: ["error", "only-multiline"] */

function VideoPlayer(){}

VideoPlayer.prototype = {
    // USER ACCESSIBLE
    debug: false,
    params: {},
    default_params: {
        id: 'video',
        src: [
            'https://joystick.cachefly.net/resources/video/video.mp4',
            'https://joystick.cachefly.net/resources/video/video.webm',
            'https://joystick.cachefly.net/resources/video/video.ogv'
        ],
        poster: "https://farm9.staticflickr.com/8557/10238331725_b82c75be44_o.jpg",
        autoplay: false,
        startmuted: false,
        replaywithsound: true,
        allowfullscreen: false,
        playonseek: true,
        uniquereplay: false,
        chromeless: false,
        elementtrigger: true,
        elementplayback: true,
        controlbar: true,
        loop: false,
        preload: 'none',
        inline: true,
        preview: 0,
        continuecfs: true,
        endfreeze: false
    },

    // DON'T MESS WITH THESE UNLESS YOU REALLY KNOW WHAT YOU'RE DOING
    proxy: null,
    ismobile: null,
    issafari: null,
    zindex: null,
    playhead: 0,
    duration: 0,
    buffered: 0,
    
    flag_started: false,
    flag_playing: false,
    flag_paused: false,
    flag_isfs: false,
    flag_first: true,
    flag_buffering: false,
    flag_loaded: false,
    flag_ap_nonce: false,
    flag_listener: false,
    flag_restartplay: false,
    flag_hasposter: false,
    flag_cfs: false,
    flag_nonce: true,
    flag_progress: false,
    flag_completed: false,
    flag_stopped: false,

    api: false,
    load_int: null,

    mTypes: {
        'mp4': 'video/mp4',
        'ogv': 'video/ogg',
        'webm': 'video/webm'
    },

    svg: {
        bigplay: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM9.984 16.5v-9l6 4.5z"></path></svg>',
        bigsound: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',
        replay: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 24 24"><path fill="#444444" d="M12 5.016q3.328 0 5.672 2.344t2.344 5.625q0 3.328-2.367 5.672t-5.648 2.344-5.648-2.344-2.367-5.672h2.016q0 2.484 1.758 4.242t4.242 1.758 4.242-1.758 1.758-4.242-1.758-4.242-4.242-1.758v4.031l-5.016-5.016 5.016-5.016v4.031z"></path></svg>',
        mute: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q2.484 1.219 2.484 4.031zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z"></path></svg>',
        unmute: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.734 1.359-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.25-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q2.484 1.219 2.484 4.031z"></path></svg>',
        play: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path></svg>',
        pause: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path></svg>',
        spinner: '<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg>',
        fs: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 32 32"><path fill="#444444" d="M27.414 24.586l-4.586-4.586-2.828 2.828 4.586 4.586-4.586 4.586h12v-12zM12 0h-12v12l4.586-4.586 4.543 4.539 2.828-2.828-4.543-4.539zM12 22.828l-2.828-2.828-4.586 4.586-4.586-4.586v12h12l-4.586-4.586zM32 0h-12l4.586 4.586-4.543 4.539 2.828 2.828 4.543-4.539 4.586 4.586z"></path></svg>'
    },

    centered_controls: {},
    temp_storage: {},

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

    eventList: [
        // 'abort',
        'canplay',
        // 'canplaythrough',
        'durationchange',
        // 'emptied',
        'ended',
        // 'error',
        // 'loadeddata',
        // 'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        // 'ratechange',
        // 'seeked',
        // 'seeking',
        // 'stalled',
        // 'suspend',
        'timeupdate',
        'volumechange',
        'waiting'
    ],

    notifications: {
        volume: false,
        start: true,
        preview_start: true,
        play: true,
        pause: true
    },

    listeners: [],
    
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
        this.dom_spinner.innerHTML = this.svg.spinner;
        this.dom_spinner.style.width = '38px';
        this.dom_spinner.style.height = '38px';
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

    evaluate(params) {

        if(this.ismobile === null) { this.checkForMobile(); }
        if(this.issafari === null) { this.checkForSafari(); }

        if(Object.keys(this.params).length === 0)
            for( let key in this.default_params )
                this.params[key] = this.default_params[key]

        if( params && params.constructor === Object ) {
            for( let key in params ) {
                switch(key) {
                    case 'preload':
                        switch(params[key]) {
                            case false:
                            case 0:
                            case 'none':
                                this.params[key] = 'none';        
                            break;
                            
                            case true:
                            case 1:
                            case 'metadata':
                                this.params[key] = 'metadata';
                            break;

                            case 2:
                            case 'all':
                            case 'auto':
                                this.params[key] = 'auto';
                            break;
                        }
                    break;
                    case 'chromeless':
                        this.params[key] = params[key];

                        if(params[key] === true)
                            this.params.controlbar = false;
                    break;
                    case 'preview':
                        if(params[key]) {
                            this.params[key] = params[key];
                            this.params.autoplay = true;
                            this.params.startmuted = true;
                        }
                    break;
                    default:
                        this.params[key] = params[key];
                }
            }
        } else
        if( params && params.constructor === String ) {
            this.params.id = params;
        } else
        if( params && params.constructor === Boolean ) {
            // INTENTIONALLY EMPTY
        } else
            delete this.params['src'];


        // RESOLVE AUTOPLAY
        if( this.params.autoplay && "autoplay" in document.createElement('video') ) {
            if( this.ismobile || this.issafari ) {
                if(!this.params.startmuted)
                    this.params.startmuted = true; 
            }
        } else {
            this.params.autoplay = false;
        }

        if( this.params.autoplay && this.issafari) {
            this.flag_ap_nonce = true;
        }

        // DEAL WITH INLINE
        if( this.params.inline ) {
            if( "playsInline" in document.createElement('video') ) {
                this.params.inline = true;
            } else {
                this.params.inline = false;
            }
        }


    },

    init(params) {
        if(!this.api)
        {

            this.evaluate(params);

            this.dom_container = document.getElementById( this.params.id );
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
                    this.flag_isfs = true;
                }
                else {
                    this.track_exitfs();
                    this.flag_isfs = false;
                }

            }, false);
            document.addEventListener("mozfullscreenchange", () => {
                this.trace("fullscreen: "+document.mozFullScreen);

                if(document.mozFullScreen) {
                    this.track_enterfs();
                    this.flag_isfs = true;
                }
                else {
                    this.track_exitfs();
                    this.flag_isfs = false;
                }

            }, false);
            document.addEventListener("webkitfullscreenchange", () => {
                this.trace("fullscreen: "+document.webkitIsFullScreen);

                if(document.webkitIsFullScreen) {
                    this.track_enterfs();
                    this.flag_isfs = true;
                }
                else {
                    this.track_exitfs();
                    this.flag_isfs = false;
                }

            }, false);
            document.addEventListener("MSFullscreenChange", () => {
                this.trace("fullscreen: "+document.msFullscreenElement);

                if(document.msFullscreenElement) {
                    this.track_enterfs();
                    this.flag_isfs = true;
                }
                else {
                    this.track_exitfs();
                    this.flag_isfs = false;
                }

            }, false);

            // PLAYER FRAME

            this.dom_frame = document.createElement('div');
            this.dom_frame.style.zIndex = this.zindex;
            this.dom_frame.style.position = 'absolute';
            this.dom_frame.style.width = '100%';
            this.dom_frame.style.height = '100%';
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
            this.dom_frame.appendChild(this.dom_poster);
            if(this.params.elementtrigger) {
                this.dom_poster.style.cursor = 'pointer';
            }

            // CONTROL

            this.dom_controller = document.createElement('div');
            this.dom_controller.style.display = this.params.controlbar ? 'block':'none';
            this.dom_controller.style.zIndex = this.zindex;
            this.dom_controller.style.position = 'relative';
            this.dom_controller.style.height = this.barsize + 'px';
            this.dom_controller.style.width = '100%';
            this.dom_controller.style.top = ( this.dom_container.offsetHeight - this.barsize ) + 'px';
            this.dom_controller.style.left = 0;
            this.dom_controller.style.display = 'none';
            this.dom_controller.className = 'v_control_bar';

            if(!this.params.chromeless) {
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

            // MUTE UNMUTE

            let tcmmc = document.createElement('div');
                tcmmc.style.position = 'absolute';
                tcmmc.style.top = 0 + 'px';
                tcmmc.className = 'v_control_mu';
                tcmmc.style.textAlign = 'left';
            this.dom_controller.appendChild(tcmmc);
            this.temp_storage.muteunmute = tcmmc;

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
            if(!this.params.chromeless) {
                this.dom_container.appendChild(this.dom_bigplay);
            }
            this.dom_bigplay.style.display = 'none';
            this.centered_controls.play = this.dom_bigplay;

            this.dom_preview = this.dom_bigplay.cloneNode(true);
            this.addClass(this.dom_preview, 'cbtn');
            this.addClass(this.dom_preview, 'v_control_bb');
            this.addClass(this.dom_preview, 'play');
            this.dom_preview.style.zIndex = this.zindex + 2;
            this.dom_preview.style.display = 'block';
            this.dom_preview.style.position = 'absolute';
            this.dom_preview.style.cursor = 'pointer';
            if(!this.params.chromeless) {
                this.dom_container.appendChild(this.dom_preview);
            }
            this.dom_preview.style.display = 'none';
            this.centered_controls.preview = this.dom_preview;

            this.dom_template_bigsound();
            this.addClass(this.dom_bigsound, 'cbtn');
            this.addClass(this.dom_bigsound, 'v_control_bb');
            this.addClass(this.dom_bigsound, 'sound');
            this.dom_bigsound.style.zIndex = this.zindex + 2;
            this.dom_bigsound.style.display = 'block';
            this.dom_bigsound.style.position = 'absolute';
            this.dom_bigsound.style.cursor = 'pointer';
            if(!this.params.chromeless) {
                this.dom_container.appendChild(this.dom_bigsound);
            }
            this.dom_bigsound.style.display = 'none';
            this.centered_controls.sound = this.dom_bigsound;

            this.dom_template_spinner();
            this.addClass(this.dom_spinner, 'cbtn');
            this.addClass(this.dom_spinner, 'v_control_bb');
            this.addClass(this.dom_spinner, 'wait');
            this.dom_spinner.style.zIndex = this.zindex + 2;
            this.dom_spinner.style.display = 'block';
            this.dom_spinner.style.position = 'absolute';
            this.dom_container.appendChild(this.dom_spinner);
            this.dom_spinner.style.display = 'none';
            this.centered_controls.wait = this.dom_spinner;
            
            this.reflow(true);

            this.api = true;
            this.trace('HTML Video Player Class Ready');

            if(this.params.src) {
                // setTimeout(()=>{
                this.load(this.params);
                // }, 10);
            } else
                this.trace(this.params, 'params (init)');
        } else {
            this.trace('HTML Video Player Class Already Initialized');
        }
    },

    load(params) {
        
        if(this.api) {

            clearInterval(this.load_int);
            // this.resetTracking();

            if(this.flag_loaded)
                this.unload();

            this.evaluate(params);
            this.trace(this.params, 'params (load)');

            this.flag_first = true;

            this.dom_spinner.style.display = 'block';

            if(this.params.poster) this.setPoster(this.params.poster);

            // REPLAY AND FULLSCREEN

            this.dom_template_fs();
            this.addClass(this.dom_fs, 'cbtn');
            this.addClass(this.dom_fs, 'v_control_sb');
            this.addClass(this.dom_fs, 'fs');
            this.dom_fs.id = 'fullscreen_btn'
            this.dom_fs.style.position = 'absolute';
            this.dom_fs.style.display = 'block';
            this.dom_fs.style.top = 5 + 'px';
            this.dom_fs.style.right = 10 + 'px';
            this.dom_fs.style.cursor = 'pointer';            
            if(this.params.allowfullscreen)
                this.dom_controller.appendChild(this.dom_fs);

            if(this.params.allowfullscreen) {
                this.temp_storage.muteunmute.style.right = 58 + 'px';
            }
            else {
                this.temp_storage.muteunmute.style.right = 30 + 'px';
            }

            if(this.params.uniquereplay) {
                this.dom_template_replay();
            } else {
                this.dom_replay = this.dom_bigplay.cloneNode(true);
                this.removeClass(this.dom_replay, 'play');
            }
            this.addClass(this.dom_replay, 'cbtn');
            this.addClass(this.dom_replay, 'v_control_bb');
            this.addClass(this.dom_replay, 'replay');
            this.dom_replay.id = 'replay_btn'
            this.dom_replay.style.zIndex = this.zindex + 2;
            this.dom_replay.style.display = 'block';
            this.dom_replay.style.position = 'absolute';
            this.dom_replay.style.cursor = 'pointer';
            if(!this.params.chromeless) {
                this.dom_container.appendChild(this.dom_replay);
            }
            this.dom_replay.style.display = 'none';
            this.centered_controls.replay = this.dom_replay;

            // RESUME
            
            this.reflow(true);

            let tve = document.createElement('video');
                tve.width = this.dom_container.offsetWidth;
                tve.height = this.dom_container.offsetHeight;

            if(this.params.startmuted)
                tve.muted = true;

            if(this.params.poster)
                tve.poster = this.params.poster;

            tve.preload = this.params.preload;

            if(this.params.chromeless) {
                this.dom_controller.style.display = 'none';
                tve.controls = false;
            } else {

                if(this.ismobile) {
                    this.dom_controller.style.display = 'none';

                    if(!this.params.autoplay)
                        tve.controls = this.params.controlbar ? true : false;
                }                   
            }

            if(typeof this.params.src === 'object') {
                this.params.src.forEach( (e) => {
                    let tvs = document.createElement('source');
                        tvs.src = e;
                        tvs.type = this.getMediaType(e);
                    tve.appendChild(tvs);
                });
            } else {
                let tvs = document.createElement('source');
                    tvs.src = this.params.src;
                    tvs.type = this.getMediaType(this.params.src);
                tve.appendChild(tvs);
            }

            if( this.params.elementtrigger ) {
                this.dom_frame.style.cursor = 'pointer';
            } else {
                this.dom_frame.style.cursor = 'auto';
            }

            if(this.params.inline) {
                tve.playsInline = true;
            }

            this.proxy = tve;

            this.setListeners();
            
            this.reflow(true);

            this.dom_frame.appendChild(tve);
            this.flag_loaded = true;

            // FIRST LINE OF DEFENSE
            if( this.params.autoplay && !this.flag_ap_nonce ) {
                this.play();
            }

        }
        else {
            setInterval(()=>{ this.load(params) }, 500);
        }
    },

    mEnter() {
        if( this.flag_started &&
            !this.flag_isfs &&
            !this.ismobile &&
            ( this.dom_bigsound.style.display !== 'block' ) &&
            ( this.dom_replay.style.display !== 'block' ) &&
            ( this.dom_bigplay.style.display !== 'block' ) &&
            ( this.dom_preview.style.display !== 'block' )
        ) {
            this.dom_controller.style.display = this.params.controlbar ? 'block' : 'none';
        }
    },
    mLeave() {
        this.dom_controller.style.display = 'none';
    },

    barSeek(e) {
        let ro = e.pageX - this.dom_pbar.getBoundingClientRect().left;
        let tp = ro / this.dom_container.offsetWidth;

        this.seek( this.duration * tp );

        if( this.dom_play.style.display === 'block' && this.params.playonseek ) {
            this.play();
        }
    },
    seek(num) {
        this.proxy.currentTime = num;
    },

    setPoster(str) {
        let newImg = new Image();
            newImg.onload = () => {
                this.trace('poster loaded: '+str);

                this.dom_poster.style.backgroundImage = 'url('+str+')';

                if(this.playhead === 0)
                    this.dom_poster.style.display = 'block';
            };
            newImg.src = str;

        this.flag_hasposter = true;
    },

    resetPlayback(bool) {
        if(!this.params.endfreeze || bool)
            this.resetTracking();
        this.flag_completed = false;
        this.flag_playing = false;
        this.flag_nonce = true;
    },

    resetVariables() {
        this.playhead = 0;
        this.duration = 0;
        this.buffered = 0;
        this.flag_started = false;
        this.flag_paused = false;
        this.flag_isfs = false;
        this.flag_first = true;
        this.flag_buffering = false;
        this.flag_loaded = false;
        this.flag_ap_nonce = false;
        this.flag_restartplay = false;
        this.flag_hasposter = true;
        this.flag_cfs = false;
        this.flag_progress = false;
        this.flag_stopped = false;
    },

    unload() {

        if(this.flag_loaded) {

            this.removeListeners();

            if( this.proxy ) {

                if (document.getElementById('replay_btn')) this.dom_container.removeChild(this.dom_replay);
                if (document.getElementById('fullscreen_btn')) this.dom_controller.removeChild(this.dom_fs);

                this.dom_poster.style.backgroundImage = 'none';
                this.dom_controller.style.display = 'none';
                
                for (var el in this.centered_controls )
                    this.centered_controls[el].style.display = 'none';

                // // THOROUGHNESS ;P

                // this.pause();
                // this.proxy.src = "";
                // this.proxy.load();
                this.dom_frame.removeChild(this.proxy);
                this.dom_frame.style.cursor = 'auto';
                this.proxy = null;
            }

            this.resetPlayback(true);
            this.resetVariables();
        }
    },

    destroy() {
        if(this.api) {
            this.unload();
            this.dom_container.innerHTML = '';
            this.api = false;
            this.trace('destroying player');
        }
        else {
            this.trace('nothing to destroy');
        }
    },

    setListeners() {

        this.trace('SET LISTENERS');

        if(!this.flag_listener) {
            this.dom_container.addEventListener( 'mouseenter', (e) => { this.mEnter(e);         }, false);
            this.dom_container.addEventListener( 'mouseleave', (e) => { this.mLeave(e);         }, false);
            this.dom_pbar.addEventListener(      'click',      (e) => { this.barSeek(e);        }, false);
            this.dom_phead.addEventListener(     'click',      (e) => { this.barSeek(e);        }, false);
            this.dom_play.addEventListener(      'click',      (e) => { this.controlHandler(e); }, false);
            this.dom_pause.addEventListener(     'click',      (e) => { this.controlHandler(e); }, false);
            this.dom_mute.addEventListener(      'click',      (e) => { this.controlHandler(e); }, false);
            this.dom_unmute.addEventListener(    'click',      (e) => { this.controlHandler(e); }, false);
            this.dom_bigplay.addEventListener(   'click',      (e) => { this.controlHandler(e); }, false);
            this.dom_bigsound.addEventListener(  'click',      (e) => { this.controlHandler(e); }, false);
            this.dom_preview.addEventListener(   'click',      (e) => { this.controlHandler(e); }, false);
            this.dom_frame.addEventListener(     'click',      (e) => { this.controlHandler(e); }, false);
        }

        this.dom_fs.addEventListener(        'click',      (e) => { this.controlHandler(e); }, false);
        this.dom_replay.addEventListener(    'click',      (e) => { this.controlHandler(e); }, false);

        for (let i = 0; i < this.eventList.length; i++ )
            this.proxy.addEventListener( this.eventList[i], (e) => { this.eventHandler(e); }, false );

        this.flag_listener = true;
    },

    removeListeners() {
        this.trace('UNSET LISTENERS');

        this.dom_fs.removeEventListener(     'click', (e) => { this.controlHandler(e); }, false);
        this.dom_replay.removeEventListener( 'click', (e) => { this.controlHandler(e); }, false);

        for (let i = 0; i < this.eventList.length; i++ )
            this.proxy.removeEventListener( this.eventList[i], (e) => { this.eventHandler(e); }, false );
        
    },

    controlHandler(e) {
        switch(e.currentTarget) {
            case this.dom_frame:
                // for (let dom in this.centered_controls )
                //     this.trace(this.centered_controls[dom].style.display, dom)

                if ( this.dom_bigplay.style.display === 'block' ){
                    if( this.params.elementtrigger ) this.bigPlay();
                }
                else if ( this.dom_replay.style.display === 'block' ) {
                    if( this.params.elementtrigger ) this.bigReplay();
                }
                else if ( this.dom_bigsound.style.display === 'block' ) {
                    if( this.params.elementplayback ) this.cfs(true);
                }
                else if ( this.dom_preview.style.display === 'block' ) {
                    if( this.params.elementplayback ) this.play();
                }
                else if ( this.params.elementplayback && this.flag_playing ) {
                    this.playPause();
                }
                else {
                    if( this.params.elementtrigger && this.flag_loaded ) {

                        if( !this.flag_playing ||
                            this.dom_bigplay.style.display === 'block' ||
                            this.dom_replay.style.display === 'block' || 
                            this.dom_preview.style.display === 'block' ) {

                            this.dom_bigplay.style.display = 'none';
                            this.dom_replay.style.display = 'none';

                            this.dom_spinner.style.display = 'block';

                            this.play(true);
                        
                        }

                        if( this.dom_bigsound.style.display === 'block' && !this.params.elementplayback) {
                            this.cfs(true);
                        }        
                    }

                    this.reflow(true);
                }
            break;
            case this.dom_play:
            case this.dom_pause:
                this.playPause();
            break;
            case this.dom_mute:
                this.mute();
            break;
            case this.dom_unmute:
                this.unmute();
            break;
            case this.dom_fs:
                this.goFS();
            break;
            case this.dom_bigplay:
                this.bigPlay();
            break;
            case this.dom_replay:
                this.bigReplay();
            break;
            case this.dom_preview: 
                this.play();
            break;
            case this.dom_bigsound:
                this.cfs(true);
            break;
        }
    },

    bigPlay() {
        this.play();
        this.dom_bigplay.style.display = 'none';
        this.dom_spinner.style.display = 'block';
        this.reflow(true);
    },

    bigReplay() {
        this.replay();

        if(this.params.replaywithsound || this.ismobile) {
            this.disableNotification('volume');
            this.unmute();
        }

        if(!this.ismobile) {
            this.dom_controller.style.display = this.params.controlbar ? 'block':'none';
        } else {
            this.dom_controller.style.display = 'none';
        }

        this.resetTracking();
    },

    playPause() {
        if(this.flag_paused) {
            this.flag_paused = false;
            this.play();
        } else {
            this.flag_paused = true;
            this.pause();
        }
    },

    eventHandler(e) {

        // this.trace(e.type);

        switch(e.type) {

            case 'canplay':
                if(this.flag_first) { // NOT SURE ABOUT THIS

                    if(this.ismobile) {
                        this.dom_controller.style.display = 'none';

                        if( this.params.autoplay ) {
                            this.dom_spinner.style.display = 'block';
                            this.dom_bigplay.style.display = 'none';
                            this.dom_poster.style.display = 'none';
                            this.proxy.style.display = 'block';
                        } 
                    }

                    this.reflow(true);
                }
            break;
            case 'play':

                // SET PLAYBACK CONTROLLER PLAY/PAUSE ICON
                this.dom_pause.style.display = 'block';
                this.dom_play.style.display = 'none';

                if(!this.track.started && !this.flag_completed) {
                    this.track.started = true;

                    if(this.params.preview) {
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

                    if(this.flag_completed)
                    {
                        // REPLAY
                        this.flag_completed = false;
                        this.track.started = true;
                        this.disableNotification('play');
                        this.disableNotification('preview_start');
                        this.disableNotification('start');
                    } else {
                        // UNPAUSE
                        this.disableNotification('preview_start');
                        this.disableNotification('replay');

                        if(this.playhead !== this.duration) // ACCOUNT FOR "FULL PREVIEW"
                            this.disableNotification('start');
                    }
                }

                if(this.flag_restartplay) {
                    this.cfs(true);
                }

                if(!this.flag_nonce) {

                    // PREVIEW STOPPED
                    if(!this.flag_stopped) {

                        if(this.params.continuecfs)
                            this.track_cfs();
                        else {
                            this.track_start();
                            this.callback_start();
                        }

                        this.callback_play();

                        if(this.notifications.play) {
                            this.track_play();
                        }

                        this.enableNotifications();

                    }
                }

                this.flag_progress = true;
            break;
            case 'pause':
                // SET PLAYBACK CONTROLLER PLAY/PAUSE ICON
                this.dom_pause.style.display = 'none';
                this.dom_play.style.display = 'block';

                if( this.params.preview < this.playhead ) {
                    this.callback_pause();
                    
                    if(this.params.preview) {
                        this.dom_bigsound.style.display = 'none';
                        this.dom_preview.style.display = 'block';
                        this.reflow();
                        this.disableNotification('end');
                        this.disableNotification('pause');
                        this.flag_restartplay = true;
                        this.resetTracking();
                        this.params.preview = 0;
                        this.track_preview_end();
                    }
                    else {
                        this.disableNotification('end');
                        this.disableNotification('preview_end');
                        if(this.notifications.pause && 
                          (this.playhead !== this.duration) 
                        ) {
                            this.track_pause(); 
                        }
                    }
                }

                this.flag_progress = false;
            break;
            case 'ended': 

                this.flag_completed = true;

                if( !this.params.loop ) this.flag_nonce = true;
                this.callback_end();

                if(this.params.loop) {
                    this.play();
                    this.trace('looping video...');
                } else {

                    // FORCE UNMUTE ON REPLAY IF APPLICABLE
                    if(this.params.replaywithsound) {
                        this.disableNotification('volume');
                        this.unmute();
                    }

                    // ENDFRAME LOGIC

                    if(!this.params.endfreeze) {
                        this.proxy.style.display = 'none';
                    }

                    if(this.flag_hasposter && !this.params.endfreeze) {
                        this.dom_poster.style.display = 'block';
                    } 

                    // HIDE CONTROLLER FOR DESKTOP
                    if(!this.ismobile) {
                        this.dom_controller.style.display = 'none';
                    }


                    // SHOW REPLAY ICON
                    if(!this.params.chromeless && !this.params.preview) {
                        this.dom_replay.style.display = 'block';
                    }
        
                    // HIDE CFS ICON
                    this.dom_bigsound.style.display = 'none';

                    this.disableNotification('volume');

                    if(this.params.preview) {
                        this.dom_preview.style.display = 'block';
                        this.params.preview = 0;
                        this.flag_completed = false;
                        this.track_preview_end();
                    } else {
                        this.track_end();
                        this.resetTracking();
                        this.flag_playing = false;
                    }

                    if( this.params.elementtrigger )
                        this.dom_frame.style.cursor = 'pointer';
                    else
                        this.dom_frame.style.cursor = 'auto';
                        
                }

                this.reflow(true);

            break;
            case 'timeupdate':

                if(this.flag_progress) {

                    if( this.proxy ) this.playhead = this.proxy.currentTime;

                    if( this.playhead > 0 ) {

                        if(this.proxy && this.flag_first) {
                            this.flag_first = false;
                            this.flag_started = true;

                            if( this.params.startmuted && this.params.autoplay && !this.params.chromeless ) {
                            
                                this.dom_bigsound.style.display = 'block';
                                this.dom_controller.style.display = 'none';
                                this.flag_playing = false;

                                this.reflow(true);
                            } else
                                this.flag_playing = true;
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

                        this.flag_playing = true;
                        // this.trace(this.flag_playing, 'flag_playing')

                        // HIDE SPINNER
                        if(!this.flag_buffering) {
                            if( this.dom_spinner.style.display === 'block' ) {
                                this.dom_spinner.style.display = 'none';
                            }
                        }

                        // HIDE POSTER
                        if( this.dom_poster.style.display === 'block' ) {
                            this.dom_poster.style.display = 'none';
                        }

                        // SHOW VIDEO
                        if( this.proxy && this.proxy.style.display === 'none') {
                            this.proxy.style.display = 'block';
                        }

                        if(this.flag_nonce) {

                            // SET BACKGROUND CURSOR
                            if( this.params.elementplayback )
                                this.dom_frame.style.cursor = 'pointer';
                            else
                                this.dom_frame.style.cursor = 'auto';

                            this.flag_nonce = false;

                            if(this.notifications.preview_start) {
                                this.track_preview_start();
                            }
                            if(this.notifications.start) {
                                this.track_start();
                            }
                            if(this.notifications.replay && !this.params.loop) {
                                this.track_replay();
                            }

                            this.callback_play();
                            this.callback_start();

                            this.enableNotifications();
                        }
                    }

                    let phpercentage = ( this.playhead / this.duration ) * 100;

                    this.dom_phead.style.width = phpercentage+'%';

                    // QUARTILES

                    if(!this.params.preview && this.track.q25 !== true && phpercentage >= 25) {
                        this.track.q25 = true;
                        this.track_q25();
                    }

                    if(!this.params.preview && this.track.q50 !== true && phpercentage >= 50) {
                        this.track.q50 = true;
                        this.track_q50();
                    }

                    if(!this.params.preview && this.track.q75 !== true && phpercentage >= 75) {
                        this.track.q75 = true;
                        this.track_q75();
                    }

                    this.callback_progress();

                    if(this.params.preview && ( this.playhead > this.params.preview ) ) {
                        this.pause();
                    }
                }
            break;
            case 'progress':

                if( this.params.autoplay && this.flag_ap_nonce) {
                    this.flag_ap_nonce = false;
                    this.play();
                }
                else
                if(this.proxy) {
                    for(let i = 0; i < this.proxy.buffered.length; i ++) {
                        this.buffered = ( this.proxy.buffered.end(i) / this.duration ) * 100;
                    }

                    this.dom_pbar.style.width = this.buffered+'%';

                    this.callback_loading();
                }
            break;

            case 'volumechange':
                if(this.isMuted()) {
                    this.dom_mute.style.display = 'none';
                    this.dom_unmute.style.display = 'block';

                    if(this.notifications.volume) {
                        this.track_mute();
                        this.callback_volume();
                    }
                } else {
                    this.dom_mute.style.display = 'block';
                    this.dom_unmute.style.display = 'none';
                    this.dom_bigsound.style.display = 'none';
                    if(this.notifications.volume) {
                        this.track_unmute();
                        this.callback_volume();
                    }
                }
            break;

            case 'waiting':
                this.flag_buffering = true;
                if( this.flag_playing && !this.ismobile &&
                    this.dom_preview.style.display != 'block' &&
                    this.dom_bigsound.style.display != 'block'
                ) {
                    this.dom_spinner.style.display = 'block';
                    this.reflow(true);
                    this.callback_buffer();
                }
            break;

            case 'playing':
                this.flag_buffering = false;
                if( this.playhead > 0 )
                    this.dom_spinner.style.display = 'none';
            break;

            case 'canplaythrough':
                if( this.playhead > 0 )
                    this.dom_spinner.style.display = 'none';
            break;

            case 'loadstart':
                
                if( this.params.autoplay ) {
                    this.dom_spinner.style.display = 'block';
                } else {
                    if(!this.params.chromeless) {
                        this.dom_bigplay.style.display = 'block';
                    }
                    this.dom_spinner.style.display = 'none';
                }

                this.callback_ready();

                this.reflow(true);
            break;

            case 'suspend':

            break;

            case 'error':
                console.log(e)
            break;

            case 'durationchange':
                this.duration = this.proxy.duration;
            break;

            default:
                this.trace(e.type);

        }
    },

    // TRACKING

    track: {
        started: false,
        q25: false,
        q50: false,
        q75: false
    },

    resetTracking() {
        this.playhead = 0;
        this.track.started = false;
        this.track.q25 = false;
        this.track.q50 = false;
        this.track.q75 = false;
    },

    track_cfs()                { this.trace('track_cfs',           'DEFAULT CALLBACK'); },
    track_preview_start()      { this.trace('track_preview_start', 'DEFAULT CALLBACK'); },
    track_preview_end()        { this.trace('track_preview_end',   'DEFAULT CALLBACK'); },

    track_start()              { this.trace('track_start',   'DEFAULT CALLBACK'); },
    track_stop()               { this.trace('track_stop',    'DEFAULT CALLBACK'); },
    track_end()                { this.trace('track_end',     'DEFAULT CALLBACK'); },
    track_play()               { this.trace('track_play',    'DEFAULT CALLBACK'); },
    track_replay()             { this.trace('track_replay',  'DEFAULT CALLBACK'); },
    track_pause()              { this.trace('track_pause',   'DEFAULT CALLBACK'); },
    track_mute()               { this.trace('track_mute',    'DEFAULT CALLBACK'); },
    track_unmute()             { this.trace('track_unmute',  'DEFAULT CALLBACK'); },
    track_q25()                { this.trace('track_q25',     'DEFAULT CALLBACK'); },
    track_q50()                { this.trace('track_q50',     'DEFAULT CALLBACK'); },
    track_q75()                { this.trace('track_q75',     'DEFAULT CALLBACK'); },
    track_enterfs()            { this.trace('track_enterfs', 'DEFAULT CALLBACK'); },
    track_exitfs()             { this.trace('track_exitfs',  'DEFAULT CALLBACK'); },

    callback_buffer()   {},
    callback_loading()  {},
    callback_progress() {},
    callback_ready()           { this.trace('callback_ready', 'DEFAULT CALLBACK'); },
    callback_end()             { this.trace('callback_end', 'DEFAULT CALLBACK'); },
    callback_play()            { this.trace('callback_play', 'DEFAULT CALLBACK'); },
    callback_stop()            { this.trace('callback_stop', 'DEFAULT CALLBACK'); },
    callback_pause()           { this.trace('callback_pause', 'DEFAULT CALLBACK'); },
    callback_start()           { this.trace('callback_start', 'DEFAULT CALLBACK'); },
    callback_error(str1, str2) { this.trace(str1, str2); },
    callback_volume()          { 

        let tempstr = '';

        if(this.notifications.volume) tempstr = this.isMuted() ? ' (muted)' : ' (unmuted)';

        this.trace('callback_volume'+tempstr, 'DEFAULT CALLBACK');
    },

    play(bool) {
        if(this.proxy) {

            // this.trace(this.playhead, 'playhead');
            // this.trace(this.proxy.buffered, 'buffered');
            
            if(this.flag_stopped) {
                this.resetPlayback();
                this.resetTracking();
                this.seek(0);
            }

            var promise = this.proxy.play();

            if(promise !== undefined) {
                promise.then( () => {
                    if(bool && !this.ismobile)
                        this.dom_controller.style.display = this.params.controlbar ? 'block' : 'none';
                } ).catch( () => {
                    // ONLY MAKE SURE IT HAPPENS WHEN LOADING
                    if(!this.flag_started) {
                        this.emergencyPlay();
                        this.callback_error('callback_error', 'DEFAULT CALLBACK');
                    }
                } );
            }
        }
    },
    emergencyPlay() {
        this.flag_playing = false;
        this.flag_paused = false;
        this.params.elementtrigger = true;
        this.params.startmuted = false;
        this.params.autoplay = false;
        this.params.preview = 0;

        this.dom_poster.style.display = 'block';
        this.dom_controller.style.display = 'none';

        for (var el in this.centered_controls )
            this.centered_controls[el].style.display = 'none';

        this.dom_bigplay.style.display = 'block';
        this.reflow();

        if(this.proxy) {
            this.unmute();
            
            if( this.ismobile && !this.params.chromeless ) 
                this.proxy.controls = true;
        }
    },

    pause() { 
        if( this.proxy ) 
            this.proxy.pause(); 
    },

    mute() { 
        if( this.proxy )
            this.proxy.muted = true; 
    },

    unmute() { 
        if( this.proxy )
            this.proxy.muted = false; 
    },

    isMuted() { 
        if( this.proxy )
            return this.proxy.muted; 
    },

    isPlaying() { 
        return this.flag_playing; 
    },

    stop() {
        if(this.proxy) {

            this.flag_progress = false;

            if(this.flag_playing) {

                this.callback_stop();

                this.flag_stopped = true;
                
                if(this.params.preview > 0) {
                    // PREVIEW END
                    this.params.preview = 0;
                    this.flag_completed = false;
                    this.track_preview_end();
                } else {
                    // REGULAR STOP
                    this.track_stop();
                }

                // SILENTLY ENABLE SOUND
                if(this.params.replaywithsound) {
                    this.disableNotification('volume');
                    this.unmute();
                }

                // RESET "STATE"
                if(!this.params.endfreeze) {
                    this.seek(0);
                }

                this.disableNotification('pause');
                this.pause();

                this.resetPlayback();

                // SHOW POSTER
                if(this.flag_hasposter && !this.params.endfreeze) {
                    this.dom_poster.style.display = 'block';
                }
            
                // SHOW PLAY BUTTON
                setTimeout(()=>{
                    if( !this.params.chromeless ) {
                        this.dom_bigplay.style.display = 'block';
                        this.dom_controller.style.display = 'none';
                    }
                    this.reflow();
                }, 10);

                
            }
        }
    },

    replay() {
        this.dom_spinner.style.display = 'block';
        this.dom_replay.style.display = 'none';
        this.reflow(true);
        
        if(this.params.replaywithsound) {
            this.disableNotification('volume');
            this.unmute();
        }

        this.play();
        this.seek(0);
    },

    cfs(bool) {
        this.disableNotification('volume');
        this.unmute();

        if(!this.params.continuecfs) this.seek(0);

        if(!this.flag_restartplay && !this.flag_cfs) {
            this.flag_cfs = true;
            this.track_cfs();

            if(this.ismobile && !this.params.chromeless)
                this.proxy.controls = this.params.controlbar ? true : false;
        }

        this.params.preview = 0;
        this.flag_restartplay = false;

        if(bool && !this.ismobile) {
            this.dom_controller.style.display = this.params.controlbar ? 'block':'none';
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
        else if (this.proxy.msRequestFullscreen)
            this.proxy.msRequestFullscreen(); // IE
    },

    getMediaType(str) {
        return this.mTypes[str.split('.')[str.split('.').length - 1]];
    },

    reflow(passive) {
        if(this.api) {
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

    trace(str, str2) {
        if(this.debug) {

            if(window['console']) {
                if(str2)
                    console.log(str, str2);
                else
                    console.log(str);
            }

            if( this.dom_debug ) {
                this.dom_debug.innerHTML += ( str2 ? str2 + ': ' : '' ) + str + '<br>';
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

    checkForSafari() {
        this.issafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    },

    checkForMobile() {
        const DESKTOP_AGENTS = [
            'desktop'
        ];

        let mobileFlag = true;

        if( window['device'] ) {
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

    help() {
        window.open('https://github.com/nargalzius/HTMLvideo');
    },
};