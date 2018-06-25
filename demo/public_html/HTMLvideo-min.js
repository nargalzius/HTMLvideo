'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 *  HTML VIDEO HELPER
 *
 *  5.3
 *
 *  author: Carlo J. Santos
 *  email: carlosantos@gmail.com
 *  documentation: https://github.com/nargalzius/HTMLvideo
 *
 *  Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

function VideoPlayer() {}

VideoPlayer.prototype = {
    // USER ACCESSIBLE
    debug: false,
    params: {},
    default_params: {
        id: 'video',
        src: ['https://joystick.cachefly.net/resources/video/video.mp4', 'https://joystick.cachefly.net/resources/video/video.webm', 'https://joystick.cachefly.net/resources/video/video.ogv'],
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
        preload: false,
        inline: true,
        preview: 0,
        continuecfs: false,
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
    flag_isfs: false,
    flag_first: true,

    flag_restartplay: false,
    flag_hasposter: false,
    flag_cfs: false,
    flag_nonce: true,
    flag_progress: true,
    flag_completed: false,
    flag_stopped: false,

    api: false,
    init_int: null,
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

    loadDelay: 0,

    disableNotification: function disableNotification(str) {
        this.notifications[str] = false;
    },
    enableNotifications: function enableNotifications() {
        var n = this.notifications;

        setTimeout(function () {
            for (var p in n) {
                n[p] = true;
            }
        }, 100);
    },
    dom_template_bigplay: function dom_template_bigplay() {
        this.dom_bigplay = document.createElement('div');
        this.dom_bigplay.style.backgroundColor = this.colors_bg;
        this.setVendor(this.dom_bigplay, 'borderRadius', '32px');
        this.dom_bigplay.innerHTML = this.svg.bigplay;
        this.dom_bigplay.style.pointerEvents = 'none';
        this.dom_bigplay.getElementsByTagName('path')[0].style.fill = this.colors_bigplay;
    },
    dom_template_bigsound: function dom_template_bigsound() {
        this.dom_bigsound = document.createElement('div');
        this.dom_bigsound.style.backgroundColor = this.colors_bg;
        this.setVendor(this.dom_bigsound, 'borderRadius', '32px');
        this.dom_bigsound.innerHTML = this.svg.bigsound;
        this.dom_bigsound.getElementsByTagName('path')[0].style.fill = this.colors_bigsound;
    },
    dom_template_replay: function dom_template_replay() {
        this.dom_replay = document.createElement('div');
        this.dom_replay.style.backgroundColor = this.colors_bg;
        this.setVendor(this.dom_replay, 'borderRadius', '32px');
        this.dom_replay.innerHTML = this.svg.replay;
        this.dom_replay.getElementsByTagName('path')[0].style.fill = this.colors_replay;
        this.dom_replay.getElementsByTagName('svg')[0].style.marginTop = '-5px';
    },
    dom_template_spinner: function dom_template_spinner() {
        this.dom_spinner = document.createElement('div');
        this.dom_spinner.innerHTML = this.svg.spinner;
        this.dom_spinner.style.width = '38px';
        this.dom_spinner.style.height = '38px';
        // this.dom_spinner.style.marginLeft = '-19px';
        // this.dom_spinner.style.marginTop = '-19px';
        // this.dom_spinner.style.left = '50%';
        // this.dom_spinner.style.top = '50%';
    },
    dom_template_play: function dom_template_play() {
        this.dom_play = document.createElement('span');
        this.dom_play.innerHTML = this.svg.play;
        this.dom_play.getElementsByTagName('path')[0].style.fill = this.colors_play_pause;
    },
    dom_template_pause: function dom_template_pause() {
        this.dom_pause = document.createElement('span');
        this.dom_pause.innerHTML = this.svg.pause;
        this.dom_pause.getElementsByTagName('path')[0].style.fill = this.colors_play_pause;
    },
    dom_template_mute: function dom_template_mute() {
        this.dom_mute = document.createElement('span');
        this.dom_mute.innerHTML = this.svg.mute;
        this.dom_mute.getElementsByTagName('path')[0].style.fill = this.colors_mute_unmute;
    },
    dom_template_unmute: function dom_template_unmute() {
        this.dom_unmute = document.createElement('span');
        this.dom_unmute.innerHTML = this.svg.unmute;
        this.dom_unmute.getElementsByTagName('path')[0].style.fill = this.colors_mute_unmute;
    },
    dom_template_fs: function dom_template_fs() {
        this.dom_fs = document.createElement('span');
        this.dom_fs.innerHTML = this.svg.fs;
        this.dom_fs.getElementsByTagName('path')[0].style.fill = this.colors_fs;
    },
    evaluate: function evaluate(params) {
        if (Object.keys(this.params).length === 0) for (var key in this.default_params) {
            this.params[key] = this.default_params[key];
        } // Object.assign(this.params, this.default_params);

        if (params && params.constructor === Object) {
            for (var _key in params) {
                switch (_key) {
                    default:
                        this.params[_key] = params[_key];
                }
            }
        } else if (params && params.constructor === String) {
            this.params.id = params;
        } else if (params && params.constructor === Boolean) {} else delete this.params['src'];

        // RESOLVE AUTOPLAY

        if (this.params.autoplay) {
            if (this.ismobile && !this.params.startmuted) {
                this.params.autoplay = false;
            } else if (this.issafari && !this.params.startmuted) this.params.autoplay = false;
        }

        if (this.params.inline) {
            if ("playsInline" in document.createElement('video')) {
                this.params.inline = true;
            } else {
                this.params.inline = false;

                if (this.ismobile) {
                    this.params.autoplay = false;
                    this.params.startmuted = false;
                }
            }
        }
    },
    init: function init(params) {
        var _this = this;

        if (!this.api) {
            if (this.ismobile === null) {
                this.checkForMobile();
            }
            if (this.issafari === null) {
                this.checkForSafari();
            }

            this.evaluate(params);

            if (this.params.preview) {
                this.params.autoplay = true;
                this.params.startmuted = true;

                // if(this.ismobile)
                //     this.params.inline = true;
            }

            if (this.params.autoplay && (this.ismobile || this.issafari)) {
                this.params.inline = true;
                this.params.startmuted = true;
            }

            this.dom_container = document.getElementById(this.params.id);
            this.dom_container.style.backgroundColor = '#000';
            this.dom_container.style.overflow = 'hidden';

            // GET Z-INDEX

            if (!this.zindex && document.defaultView && document.defaultView.getComputedStyle) {
                var s = document.defaultView.getComputedStyle(this.dom_container, '');
                this.zindex = parseInt(s.getPropertyValue('z-index'), 10);
            } else if (!this.zindex && this.dom_container.currentStyle) {
                this.zindex = parseInt(this.dom_container.currentStyle.zIndex, 10);
            }

            if (!this.zindex) {
                this.zindex = 0;
                this.trace("z-index for video container element not detected, make sure position property is set.\nzIndex set to 0");
            }

            // SET FULLSCREEN EXIT

            document.addEventListener("fullscreenchange", function () {
                _this.trace("fullscreen: " + document.fullscreen);

                if (document.fullscreen) {
                    _this.track_enterfs();
                    _this.flag_isfs = true;
                } else {
                    _this.track_exitfs();
                    _this.flag_isfs = false;
                }
            }, false);
            document.addEventListener("mozfullscreenchange", function () {
                _this.trace("fullscreen: " + document.mozFullScreen);

                if (document.mozFullScreen) {
                    _this.track_enterfs();
                    _this.flag_isfs = true;
                } else {
                    _this.track_exitfs();
                    _this.flag_isfs = false;
                }
            }, false);
            document.addEventListener("webkitfullscreenchange", function () {
                _this.trace("fullscreen: " + document.webkitIsFullScreen);

                if (document.webkitIsFullScreen) {
                    _this.track_enterfs();
                    _this.flag_isfs = true;
                } else {
                    _this.track_exitfs();
                    _this.flag_isfs = false;
                }
            }, false);
            document.addEventListener("MSFullscreenChange", function () {
                _this.trace("fullscreen: " + document.msFullscreenElement);

                if (document.msFullscreenElement) {
                    _this.track_enterfs();
                    _this.flag_isfs = true;
                } else {
                    _this.track_exitfs();
                    _this.flag_isfs = false;
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
            if (this.params.elementtrigger) {
                this.dom_poster.style.cursor = 'pointer';
            }

            // CONTROL

            this.dom_controller = document.createElement('div');
            this.dom_controller.style.display = this.params.controlbar ? 'block' : 'none';
            this.dom_controller.style.zIndex = this.zindex;
            this.dom_controller.style.position = 'relative';
            this.dom_controller.style.height = this.barsize + 'px';
            this.dom_controller.style.width = '100%';
            this.dom_controller.style.top = this.dom_container.offsetHeight - this.barsize + 'px';
            this.dom_controller.style.left = 0;
            this.dom_controller.style.display = 'none';
            this.dom_controller.className = 'v_control_bar';

            if (!this.params.chromeless) {
                this.dom_container.appendChild(this.dom_controller);
            }

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

            if (this.params.allowfullscreen) {
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

            var tcmmc = document.createElement('div');
            tcmmc.style.position = 'absolute';
            tcmmc.style.top = 0 + 'px';
            tcmmc.className = 'v_control_mu';
            tcmmc.style.textAlign = 'left';
            if (this.params.allowfullscreen) {
                tcmmc.style.right = 58 + 'px';
            } else {
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

            var ts = document.createElement('div');
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
            if (!this.params.chromeless) {
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
            if (!this.params.chromeless) {
                this.dom_container.appendChild(this.dom_preview);
            }
            this.dom_preview.style.display = 'none';
            this.centered_controls.push(this.dom_preview);

            if (this.params.uniquereplay) {
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
            if (!this.params.chromeless) {
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
            if (!this.params.chromeless) {
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

            this.api = true;
            this.trace('video api');

            if (this.params.src) this.load(this.params);
        } else {
            this.trace('already api');
        }
    },
    mEnter: function mEnter() {
        if (this.flag_started && !this.flag_isfs && !this.ismobile && this.dom_bigsound.style.display !== 'block' && this.dom_replay.style.display !== 'block' && this.dom_bigplay.style.display !== 'block' && this.dom_preview.style.display !== 'block') {
            this.dom_controller.style.display = this.params.controlbar ? 'block' : 'none';
        }
    },
    mLeave: function mLeave() {
        this.dom_controller.style.display = 'none';
    },
    mClick: function mClick() {

        this.reflow(true);

        if (this.flag_first) {
            this.dom_spinner.style.display = 'block';
            this.dom_replay.style.display = 'none';
            this.dom_bigplay.style.display = 'none';
        }

        if (this.params.elementtrigger) {

            if (!this.flag_playing || this.dom_bigplay.style.display === 'block' || this.dom_replay.style.display === 'block' || this.dom_preview.style.display === 'block') {

                this.play(true);
            }

            if (this.dom_bigsound.style.display === 'block') {
                this.cfs(true);
            }
        }
    },
    barSeek: function barSeek(e) {
        var ro = e.pageX - this.dom_pbar.getBoundingClientRect().left;
        var tp = ro / this.dom_container.offsetWidth;

        this.seek(this.duration * tp);

        if (this.dom_play.style.display === 'block' && this.params.playonseek) {
            this.play();
        }
    },
    seek: function seek(num) {
        this.proxy.currentTime = num;
    },
    load: function load(params) {
        var _this2 = this;

        if (this.api) {

            this.trackReset();

            this.evaluate(params);

            this.flag_first = true;

            this.unload();

            this.dom_spinner.style.display = 'block';

            if (this.params.poster) this.setPoster(this.params.poster);

            this.reflow(true);

            var tve = document.createElement('video');
            tve.width = this.dom_container.offsetWidth;
            tve.height = this.dom_container.offsetHeight;

            if (this.params.autoplay && 'autoplay' in tve) tve.autoplay = true;

            if (this.params.startmuted) tve.muted = true;

            tve.preload = this.params.preload ? "metadata" : "none";

            if (this.params.chromeless) {
                this.dom_controller.style.display = 'none';
                tve.controls = false;
            } else {

                if (this.ismobile) {
                    this.dom_controller.style.display = 'none';

                    if (!this.params.autoplay) tve.controls = this.params.controlbar ? true : false;
                }
            }

            if (_typeof(this.params.src) === 'object') {
                this.params.src.forEach(function (e) {
                    var tvs = document.createElement('source');
                    tvs.src = e;
                    tvs.type = _this2.getMediaType(e);
                    tve.appendChild(tvs);
                });
            } else {
                var tvs = document.createElement('source');
                tvs.src = this.params.src;
                tvs.type = this.getMediaType(this.params.src);
                tve.appendChild(tvs);
            }

            if (this.params.poster) {
                tve.poster = this.params.poster;
            }

            if (this.params.elementtrigger) {
                tve.style.cursor = 'pointer';
            }

            if (this.params.inline) {
                tve.playsInline = true;
            }

            this.dom_frame.appendChild(tve);

            this.proxy = tve;

            this.setListeners(); // COME BACK HERE

            if (!this.params.autoplay) {
                this.dom_spinner.style.display = 'none';
                this.dom_bigplay.style.display = 'block';
            }

            if (this.ismobile && this.params.autoplay) this.proxy.style.display = 'block';else this.proxy.style.display = 'none';

            this.proxy.addEventListener('click', function (e) {
                _this2.controlHandler(e);
            });

            this.reflow(true);

            if (this.params.autoplay) {
                this.play();
            }
        } else {
            setInterval(function () {
                _this2.load(params);
            }, 500);
        }
    },
    setPoster: function setPoster(str) {
        var _this3 = this;

        var newImg = new Image();
        newImg.onload = function () {
            _this3.trace('loaded: ' + str);

            _this3.dom_poster.style.backgroundImage = 'url(' + str + ')';
            _this3.dom_poster.style.display = 'block';

            if (_this3.params.autoplay) {
                _this3.dom_spinner.style.display = 'block';
                _this3.dom_bigplay.style.display = 'none';
            } else {
                _this3.dom_spinner.style.display = 'none';
                _this3.dom_bigplay.style.display = 'block';
            }

            _this3.reflow(true); // NOT SURE
        };
        newImg.src = str;

        this.flag_hasposter = true;
    },
    unload: function unload(bool) {

        this.playhead = 0;
        this.duration = 0;
        this.buffered = 0;
        this.flag_isfs = false;
        this.flag_started = false;
        this.flag_playing = false;
        this.flag_first = true;
        this.flag_completed = false;
        this.flag_hasposter = false;
        this.flag_restartplay = false;

        if (this.proxy) {

            // AVOID FIRING DURING DESTROY
            if (!bool) this.trace('unloading player');

            this.removeListeners();

            this.dom_bigplay.style.display = 'none';
            this.dom_bigsound.style.display = 'none';
            this.dom_replay.style.display = 'none';
            this.dom_poster.style.display = 'none';
            this.dom_controller.style.display = 'none';
            this.dom_spinner.style.display = 'none';

            // THOROUGHNESS ;P

            this.pause();
            this.proxy.src = "";
            this.proxy.load();
            this.proxy.parentNode.removeChild(this.proxy);
            this.proxy = null;

            this.dom_frame.innerHTML = '';
        }

        this.trackReset();
    },
    destroy: function destroy() {
        if (this.api) {
            this.unload(true);
            this.dom_container.innerHTML = '';
            this.api = false;
            this.trace('destroying player');
        } else {
            this.trace('nothing to destroy');
        }
    },
    setListeners: function setListeners() {
        var _this4 = this;

        this.dom_pbar.addEventListener('click', function (e) {
            _this4.barSeek(e);
        });
        this.dom_phead.addEventListener('click', function (e) {
            _this4.barSeek(e);
        });
        this.dom_container.addEventListener('mouseenter', function (e) {
            _this4.mEnter(e);
        });
        this.dom_container.addEventListener('mouseleave', function (e) {
            _this4.mLeave(e);
        });
        this.dom_container.addEventListener('click', function (e) {
            _this4.mClick(e);
        });
        this.dom_play.addEventListener('click', function (e) {
            _this4.controlHandler(e);
        });
        this.dom_pause.addEventListener('click', function (e) {
            _this4.controlHandler(e);
        });
        this.dom_mute.addEventListener('click', function (e) {
            _this4.controlHandler(e);
        });
        this.dom_unmute.addEventListener('click', function (e) {
            _this4.controlHandler(e);
        });
        // this.dom_bigplay.addEventListener(      'click',        (e) => { this.controlHandler(e); });
        this.dom_bigsound.addEventListener('click', function (e) {
            _this4.controlHandler(e);
        });
        this.dom_preview.addEventListener('click', function (e) {
            _this4.controlHandler(e);
        });
        this.dom_replay.addEventListener('click', function (e) {
            _this4.controlHandler(e);
        });
        if (this.params.allowfullscreen) {
            this.dom_fs.addEventListener('click', function (e) {
                _this4.controlHandler(e);
            });
        }
        this.proxy.addEventListener('ended', function (e) {
            _this4.dlEnded(e);
        });
        this.proxy.addEventListener('play', function (e) {
            _this4.dlPlay(e);
        });
        this.proxy.addEventListener('pause', function (e) {
            _this4.dlPause(e);
        });
        this.proxy.addEventListener('volumechange', function (e) {
            _this4.dlVolumeChange(e);
        });
        this.proxy.addEventListener('timeupdate', function (e) {
            _this4.dlTimeUpdate(e);
        });
        this.proxy.addEventListener('canplay', function (e) {
            _this4.dlCanPlay(e);
        });
        this.proxy.addEventListener('progress', function (e) {
            _this4.dlProgress(e);
        });
    },
    removeListeners: function removeListeners() {
        var _this5 = this;

        this.dom_pbar.removeEventListener('click', function (e) {
            _this5.barSeek(e);
        });
        this.dom_phead.removeEventListener('click', function (e) {
            _this5.barSeek(e);
        });
        this.dom_container.removeEventListener('mouseenter', function (e) {
            _this5.mEnter(e);
        });
        this.dom_container.removeEventListener('mouseleave', function (e) {
            _this5.mLeave(e);
        });
        this.dom_container.removeEventListener('click', function (e) {
            _this5.mClick(e);
        });
        this.dom_play.removeEventListener('click', function (e) {
            _this5.controlHandler(e);
        });
        this.dom_pause.removeEventListener('click', function (e) {
            _this5.controlHandler(e);
        });
        this.dom_mute.removeEventListener('click', function (e) {
            _this5.controlHandler(e);
        });
        this.dom_unmute.removeEventListener('click', function (e) {
            _this5.controlHandler(e);
        });
        this.dom_bigplay.removeEventListener('click', function (e) {
            _this5.controlHandler(e);
        });
        this.dom_bigsound.removeEventListener('click', function (e) {
            _this5.controlHandler(e);
        });
        this.dom_replay.removeEventListener('click', function (e) {
            _this5.controlHandler(e);
        });
        if (this.params.allowfullscreen) {
            this.dom_fs.removeEventListener('click', function (e) {
                _this5.controlHandler(e);
            });
        }
        this.proxy.removeEventListener('ended', function (e) {
            _this5.dlEnded(e);
        });
        this.proxy.removeEventListener('play', function (e) {
            _this5.dlPlay(e);
        });
        this.proxy.removeEventListener('pause', function (e) {
            _this5.dlPause(e);
        });
        this.proxy.removeEventListener('volumechange', function (e) {
            _this5.dlVolumeChange(e);
        });
        this.proxy.removeEventListener('timeupdate', function (e) {
            _this5.dlTimeUpdate(e);
        });
        this.proxy.removeEventListener('canplay', function (e) {
            _this5.dlCanPlay(e);
        });
        this.proxy.removeEventListener('progress', function (e) {
            _this5.dlProgress(e);
        });
    },
    dlEnded: function dlEnded() {
        this.flag_completed = true;

        if (!this.params.loop) this.flag_nonce = true;
        this.callback_end();

        if (this.params.loop) {

            this.play();
            this.trace('looping video...');
        } else {

            if (this.params.replaywithsound) {
                this.disableNotification('volume');
                this.unmute();
            }

            if (this.flag_hasposter && !this.params.endfreeze) {
                this.dom_poster.style.display = 'block';
            } else {
                if (!this.ismobile) {
                    this.dom_controller.style.display = 'none';
                }
            }

            if (!this.params.chromeless && !this.params.preview) {
                this.dom_replay.style.display = 'block';
            }

            if (!this.params.endfreeze) {
                this.proxy.style.display = 'none';
            }

            this.dom_bigsound.style.display = 'none';

            this.disableNotification('volume');

            if (this.params.preview) {
                this.dom_preview.style.display = 'block';
                this.params.preview = 0;
                this.flag_completed = false;
                this.track_preview_end();
            } else {
                this.track_end();
                this.trackReset();
                this.flag_playing = false;
            }

            this.dom_poster.style.cursor = 'pointer';
        }

        this.reflow(true);
    },
    dlPlay: function dlPlay() {

        this.dom_pause.style.display = 'block';
        this.dom_play.style.display = 'none';

        if (!this.track.started && !this.flag_completed) {
            this.track.started = true;

            if (this.params.preview) {
                // PREVIEW
                this.disableNotification('start');
                this.disableNotification('play');
                this.disableNotification('replay');
            } else {
                // REGULAR START
                this.disableNotification('play');
                this.disableNotification('preview_start');
                this.disableNotification('replay');
            }
        } else {
            if (this.flag_completed) {
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
                this.disableNotification('start');
            }
        }

        if (this.flag_restartplay) {
            this.cfs(true);
        }

        if (!this.flag_nonce) {

            if (!this.flag_stopped) {

                this.callback_play();

                if (this.notifications.play) this.track_play();

                this.enableNotifications();
            }
        }

        this.flag_progress = true;
    },
    dlPause: function dlPause() {
        this.dom_pause.style.display = 'none';
        this.dom_play.style.display = 'block';

        if (this.params.preview < this.playhead) {
            this.callback_pause();

            if (this.params.preview) {
                this.dom_bigsound.style.display = 'none';
                this.dom_preview.style.display = 'block';
                this.reflow();
                this.disableNotification('end');
                this.disableNotification('pause');
                this.flag_restartplay = true;
                this.trackReset();
                this.params.preview = 0;
                this.track_preview_end();
            } else {
                this.disableNotification('end');
                this.disableNotification('preview_end');
                if (this.notifications.pause && this.playhead !== this.duration) {
                    this.track_pause();
                }
            }
        }
    },
    dlVolumeChange: function dlVolumeChange() {
        if (this.isMuted()) {
            this.dom_mute.style.display = 'none';
            this.dom_unmute.style.display = 'block';

            if (this.notifications.volume) {
                this.track_mute();
            }
        } else {
            this.dom_mute.style.display = 'block';
            this.dom_unmute.style.display = 'none';
            this.dom_bigsound.style.display = 'none';
            if (this.notifications.volume) {
                this.track_unmute();
            }
        }

        this.callback_volume();
    },
    dlProgress: function dlProgress() {
        if (this.proxy) {
            for (var i = 0; i < this.proxy.buffered.length; i++) {
                this.buffered = this.proxy.buffered.end(i) / this.duration * 100;
            }

            this.dom_pbar.style.width = this.buffered + '%';

            this.callback_loading();
        }
    },
    dlTimeUpdate: function dlTimeUpdate() {

        if (this.flag_progress) {

            this.flag_playing = true;

            if (this.proxy && this.flag_first) {
                this.flag_first = false;
                this.flag_started = true;

                if (this.params.startmuted && this.params.autoplay) {

                    this.dom_bigsound.style.display = 'block';
                    this.dom_controller.style.display = 'none';
                    this.flag_playing = false;

                    this.reflow(true);
                }
            }

            if (this.proxy) {
                this.playhead = this.proxy.currentTime;
                this.duration = this.proxy.duration;
            }

            if (this.dom_controller.style.display === 'block' && this.ismobile) {
                this.dom_controller.style.display = 'none';
            }
            if (this.dom_bigplay.style.display === 'block') {
                this.dom_bigplay.style.display = 'none';
            }
            if (this.dom_replay.style.display === 'block') {
                this.dom_replay.style.display = 'none';
            }
            if (this.dom_preview.style.display === 'block') {
                this.dom_preview.style.display = 'none';
            }

            if (this.playhead > 0) {
                if (this.dom_spinner.style.display === 'block') {
                    this.dom_spinner.style.display = 'none';
                }
                if (this.dom_poster.style.display === 'block') {
                    this.dom_poster.style.display = 'none';
                }
                if (this.proxy && this.proxy.style.display === 'none') {
                    this.proxy.style.display = 'block';
                }
                if (!this.params.elementplayback && this.dom_bigsound.style.display === 'none' && this.dom_preview.style.display === 'none') {
                    this.proxy.style.cursor = 'auto';
                }

                if (this.flag_nonce) {

                    this.flag_nonce = false;

                    this.callback_play();
                    this.callback_start();

                    if (this.notifications.preview_start) {
                        this.track_preview_start();
                    }
                    if (this.notifications.start) {
                        this.track_start();
                    }
                    if (this.notifications.replay && !this.params.loop) {
                        this.track_replay();
                    }

                    this.enableNotifications();
                }
            }

            var phpercentage = this.playhead / this.duration * 100;

            this.dom_phead.style.width = phpercentage + '%';

            // QUARTILES

            if (!this.params.preview && this.track.q25 !== true && phpercentage >= 25) {
                this.track.q25 = true;
                this.track_q25();
            }

            if (!this.params.preview && this.track.q50 !== true && phpercentage >= 50) {
                this.track.q50 = true;
                this.track_q50();
            }

            if (!this.params.preview && this.track.q75 !== true && phpercentage >= 75) {
                this.track.q75 = true;
                this.track_q75();
            }

            this.callback_progress();

            if (this.params.preview && this.playhead > this.params.preview) {
                this.pause();
            }
        }
    },
    dlCanPlay: function dlCanPlay() {

        if (this.flag_first) {
            // NOT SURE ABOUT THIS

            // if(!this.params.autoplay) {
            //     this.dom_spinner.style.display = 'none';

            //     if(!this.ismobile) {
            //         this.dom_bigplay.style.display = 'block';
            //     }

            // }

            // if(!this.flag_hasposter && !this.params.autoplay && !this.ismobile) {
            //     this.trace('no poster');
            //     this.dom_bigplay.style.display = 'block';
            //     this.dom_controller.style.display = 'none';
            // }

            // if(this.ismobile) {
            //     this.dom_controller.style.display = 'none';

            //     if( this.params.autoplay ) {
            //         this.dom_spinner.style.display = 'block';
            //         this.dom_bigplay.style.display = 'none';
            //         this.dom_poster.style.display = 'none';
            //         this.proxy.style.display = 'block';
            //     } else {
            //         if(!this.params.chromeless)
            //             this.dom_bigplay.style.display = 'block';
            //     }
            // }

            this.reflow(true);
            // this.ready = true;
            this.callback_ready();
        }
    },
    callback_loading: function callback_loading() {/* this.trace('------------------ callback_loading'); */},
    callback_progress: function callback_progress() {/* this.trace('------------------ callback_progress'); */},
    callback_ready: function callback_ready() {
        this.trace('------------------ callback_ready');
    },
    callback_end: function callback_end() {
        this.trace('------------------ callback_end');
    },
    callback_play: function callback_play() {
        this.trace('------------------ callback_play');
    },
    callback_error: function callback_error() {
        this.trace('------------------ callback_error');
    },
    callback_stop: function callback_stop() {
        this.trace('------------------ callback_stop');
    },
    callback_pause: function callback_pause() {
        this.trace('------------------ callback_pause');
    },
    callback_start: function callback_start() {
        this.trace('------------------ callback_start');
    },
    callback_volume: function callback_volume() {

        var tempstr = '';

        if (this.notifications.volume) tempstr = this.isMuted() ? ' (muted)' : ' (unmuted)';

        this.trace('------------------ callback_volume' + tempstr);
    },


    // TRACKING

    track: {
        started: false,
        q25: false,
        q50: false,
        q75: false
    },

    trackReset: function trackReset() {
        this.playhead = 0;
        this.track.started = false;
        this.track.q25 = false;
        this.track.q50 = false;
        this.track.q75 = false;
    },
    track_start: function track_start() {
        this.trace('------------------ track_start');
    },
    track_stop: function track_stop() {
        this.trace('------------------ track_stop');
    },
    track_end: function track_end() {
        this.trace('------------------ track_end');
    },
    track_preview_start: function track_preview_start() {
        this.trace('------------------ track_preview_start');
    },
    track_preview_end: function track_preview_end() {
        this.trace('------------------ track_preview_end');
    },
    track_play: function track_play() {
        this.trace('------------------ track_play');
    },
    track_pause: function track_pause() {
        this.trace('------------------ track_pause');
    },
    track_replay: function track_replay() {
        this.trace('------------------ track_replay');
    },
    track_mute: function track_mute() {
        this.trace('------------------ track_mute');
    },
    track_unmute: function track_unmute() {
        this.trace('------------------ track_unmute');
    },
    track_q25: function track_q25() {
        this.trace('------------------ track_q25');
    },
    track_q50: function track_q50() {
        this.trace('------------------ track_q50');
    },
    track_q75: function track_q75() {
        this.trace('------------------ track_q75');
    },
    track_enterfs: function track_enterfs() {
        this.trace('------------------ track_enterfs');
    },
    track_exitfs: function track_exitfs() {
        this.trace('------------------ track_exitfs');
    },
    track_cfs: function track_cfs() {
        this.trace('------------------ track_cfs');
    },
    controlHandler: function controlHandler(e) {
        switch (e.currentTarget) {
            case this.dom_play:
                this.play();
                break;
            case this.dom_pause:
                this.pause();
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
                this.play();
                this.dom_spinner.style.display = 'block';
                this.dom_bigplay.style.display = 'none';
                this.reflow(true);
                break;
            case this.dom_replay:

                this.replay();

                if (this.params.replaywithsound || this.ismobile) {
                    this.disableNotification('volume');
                    this.unmute();
                }

                if (!this.ismobile) {
                    this.dom_controller.style.display = this.params.controlbar ? 'block' : 'none';
                } else {
                    this.dom_controller.style.display = 'none';
                }

                this.trackReset();

                break;
            case this.dom_preview:
                this.play();
                break;
            case this.dom_bigsound:
                this.cfs(true);
                break;
            case this.proxy:

                // ELEMENT TRIGGER
                if (this.params.elementtrigger && this.dom_play.style.display === 'block' && this.dom_bigsound.style.display === 'none' && this.params.elementplayback) {
                    if (!this.ismobile || this.ismobile && this.params.inline && !this.params.controlbar) this.play();
                }

                if (this.params.elementtrigger && this.dom_pause.style.display === 'block' && this.dom_bigsound.style.display === 'none' && this.params.elementplayback) {
                    if (!this.ismobile || this.ismobile && this.params.inline && !this.params.controlbar) this.pause();
                }

                // if( this.ismobile && this.params.elementtrigger && this.params.chromeless ) {

                // }


                break;
        }
    },
    play: function play(bool) {
        var _this6 = this;

        if (this.proxy) {

            if (this.flag_stopped) {
                this.stopSet();
                this.trackReset();
                this.seek(0);
            }

            var promise = this.proxy.play();

            if (promise !== undefined) {
                promise.then(function () {
                    if (bool && !_this6.ismobile) _this6.dom_controller.style.display = _this6.params.controlbar ? 'block' : 'none';
                }).catch(function (e) {
                    _this6.emergencyPlay();
                    _this6.callback_error(e);
                });
            }
        }
    },
    emergencyPlay: function emergencyPlay() {
        this.params.startmuted = false;
        this.params.autoplay = false;
        this.params.preview = 0;
        if (!this.params.chromeless) this.dom_bigplay.style.display = 'block';else this.params.elementtrigger = true;
        this.dom_poster.style.display = 'block';
        this.dom_bigsound.style.display = 'none';
        this.dom_replay.style.display = 'none';
        this.dom_controller.style.display = 'none';
        this.dom_spinner.style.display = 'none';
        this.reflow();

        if (this.proxy) {
            this.unmute();

            if (this.ismobile && !this.params.chromeless) this.proxy.controls = true;
        }
    },
    pause: function pause() {
        if (this.proxy) this.proxy.pause();
    },
    mute: function mute() {
        this.proxy.muted = true;
    },
    unmute: function unmute() {
        this.proxy.muted = false;
    },
    isMuted: function isMuted() {
        return this.proxy.muted;
    },
    isPlaying: function isPlaying() {
        return this.flag_playing;
    },
    stopSet: function stopSet() {
        if (!this.params.endfreeze) this.trackReset();
        this.flag_completed = false;
        this.flag_playing = false;
        this.flag_nonce = true;
    },
    stop: function stop() {
        var _this7 = this;

        if (this.proxy) {

            this.flag_progress = false;

            if (this.flag_playing) {

                this.callback_stop();

                this.flag_stopped = true;

                if (this.params.preview > 0) {
                    // PREVIEW END
                    this.params.preview = 0;
                    this.flag_completed = false;
                    this.track_preview_end();
                } else {
                    // REGULAR STOP
                    this.track_stop();
                }

                // SILENTLY ENABLE SOUND
                if (this.params.replaywithsound) {
                    this.disableNotification('volume');
                    this.unmute();
                }

                // RESET "STATE"
                if (!this.params.endfreeze) {
                    this.seek(0);
                }

                this.disableNotification('pause');
                this.pause();

                this.stopSet();

                // SHOW POSTER
                if (this.flag_hasposter && !this.params.endfreeze) {
                    this.dom_poster.style.display = 'block';
                }

                // SHOW PLAY BUTTON
                setTimeout(function () {
                    if (!_this7.params.chromeless) {
                        _this7.dom_bigplay.style.display = 'block';
                        _this7.dom_controller.style.display = 'none';
                    }
                    _this7.reflow();
                }, 10);
            }
        }
    },
    replay: function replay() {
        this.dom_spinner.style.display = 'block';
        this.dom_replay.style.display = 'none';
        this.reflow(true);

        if (this.params.replaywithsound) {
            this.disableNotification('volume');
            this.unmute();
        }

        this.play();
        this.seek(0);
    },
    cfs: function cfs(bool) {
        this.disableNotification('volume');
        this.unmute();

        if (!this.params.continuecfs) this.seek(0);

        if (!this.flag_restartplay && !this.flag_cfs) {
            this.flag_cfs = true;
            this.track_cfs();

            if (this.ismobile && !this.params.chromeless) this.proxy.controls = this.params.controlbar ? true : false;
        }

        this.params.preview = 0;
        this.flag_restartplay = false;

        if (bool && !this.ismobile) {
            this.dom_controller.style.display = this.params.controlbar ? 'block' : 'none';
        }

        this.enableNotifications();
    },
    goFS: function goFS() {
        if (this.proxy.requestFullscreen) this.proxy.requestFullscreen();else if (this.proxy.mozRequestFullScreen) this.proxy.mozRequestFullScreen(); // Firefox
        else if (this.proxy.webkitRequestFullscreen) this.proxy.webkitRequestFullscreen(); // Chrome and Safari
            else if (this.proxy.msRequestFullscreen) this.proxy.msRequestFullscreen(); // IE
    },
    getMediaType: function getMediaType(str) {
        return this.mTypes[str.split('.')[str.split('.').length - 1]];
    },
    reflow: function reflow(passive) {
        if (this.api) {
            if (this.proxy) {
                this.proxy.width = this.dom_container.offsetWidth;
                this.proxy.height = this.dom_container.offsetHeight;
            }

            this.dom_controller.style.top = this.dom_container.offsetHeight - this.barsize + 'px';
            this.dom_controller.style.left = 0;

            // CENTER ALL ELEMENTS FOUND IN center_controls ARRAY
            for (var key in this.centered_controls) {
                var item = this.centered_controls[key];

                item.style.top = '50%';
                item.style.marginTop = item.offsetHeight / 2 * -1 + 'px';
                item.style.left = '50%';
                item.style.marginLeft = item.offsetWidth / 2 * -1 + 'px';
            }

            if (!passive) {
                this.trace('reflow video');
            }
        } else if (!passive) {
            this.trace("reflow useless: video elements aren't ready");
        }
    },
    trace: function trace(str) {
        if (this.debug) {

            if (window.console) {
                window.console.log(str);
            }

            if (this.dom_debug) {
                this.dom_debug.innerHTML += str + '<br>';
            }
        }
    },
    setVendor: function setVendor(element, property, value) {
        var styles = window.getComputedStyle(element, '');
        var regexp = new RegExp(property + '$', "i");

        for (var key in styles) {
            if (regexp.test(key)) {
                element.style[key] = value;
            }
        }
    },
    addClass: function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    },
    removeClass: function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },
    checkForSafari: function checkForSafari() {
        this.issafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    },
    checkForMobile: function checkForMobile() {
        var DESKTOP_AGENTS = ['desktop'];

        var mobileFlag = true;

        if (window['device']) {
            // USE DEVICEJS IF AVAILABLE
            for (var i = 0; i < DESKTOP_AGENTS.length; i++) {
                var regex = void 0;
                regex = new RegExp(DESKTOP_AGENTS[i], 'i');

                if (window.document.documentElement.className.match(regex)) {
                    mobileFlag = false;
                }
            }
        } else {
            // BACKUP [RUDIMENTARY] DETECTION
            mobileFlag = 'ontouchstart' in window;
        }

        if (mobileFlag) {
            this.ismobile = true;
            this.trace("mobile browser detected");
        } else {
            this.ismobile = false;
            this.trace("desktop browser detected");
        }
    },
    help: function help() {
        window.open('https://github.com/nargalzius/HTMLvideo');
    }
};
