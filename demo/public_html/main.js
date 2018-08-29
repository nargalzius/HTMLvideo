var video;
var video2;
var multiSource = [
	'https://joystick.cachefly.net/resources/video/video.mp4',
	'https://joystick.cachefly.net/resources/video/video.webm',
	'https://joystick.cachefly.net/resources/video/video.ogv'
	];
var poster = 'https://farm9.staticflickr.com/8557/10238331725_b82c75be44_o.jpg';
	// poster = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMbLEGXk2ADDBlqJxM9RtalzYamN_z1-WoB-49QYugyEl1JHzCAQ';
var singleSource = 'https://joystick.cachefly.net/JMC/v/vid_become_legend.mp4';
var resetVars;

$( document ).ready(init);

function init(){
	console.log()
	// $('#video2').click(function(){
	// 	createVideo1();
	// });

	video = new VideoPlayer();
	// video.default_params.poster = null;
	video.debug = true;
	video.dom_debug = document.getElementById('debug');
	video.track_q25 = function() {
		// video.unload();
	}
	
	var params = {
		// endfreeze: true,
		autoplay: true,
		// src: 'https://joystick.cachefly.net/JMC/v/vid_become_legend.mp4',
		startmuted: true,
		chromeless: true,
		// elementtrigger: false,
		// elementplayback: false,
		// controlbar: false,
		// preview: 5,
		// continuecfs: true,
		// inline: false,
		preload: 0,
		// allowfullscreen: true,
	}
	video.init(params);
	// video.init(true);
	// video.load(multiSource, poster);
	// video.load(multiSource);
}

