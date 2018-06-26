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

	$('#video1').click(function(){
		createVideo1();
	});
	// $('#video2').click(function(){
	// 	createVideo1();
	// });

	video = new VideoPlayer();
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
		// chromeless: true,
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


	// $(window).on('resize', () => {
	// 	video.reflow();
	// });
}

function createVideo1(){
	// video = new VideoPlayer();
	// video.dom_debug = document.getElementById('debugField');
	// video.debug = true;
	// // video.preload = true;
	// // video.autoplay = false;
	// // video.startmuted = true;
	
	// // video.preview = 5;
	// // video.chromeless = true;
	// // video.controlbar = false;
	// // video.bigbuttons = false;
	// // video.elementtrigger = true;
	// // video.elementplayback = false;

	// video.init('videoPlayer');
	// video.load(multiSource, poster);
	// setTimeout(()=>{
	// 	video.stop();
	// }, 5000);
}

// function createVideo2(){
// 	video2 = new VideoPlayer();
// 	// video2.dom_debug = document.getElementById('debugField');
// 	video2.debug = true;
// 	video2.autoplay = true;
// 	// video2.startmuted = false;
// 	// video2.checkForMobile();
// 	// video2.preview = 5;
// 	// video2.chromeless = true;
// 	// video2.controlbar = false;
// 	// video2.bigbuttons = false;
// 	// video2.elementtrigger = true;
// 	// video2.elementplayback = false;

// 	video2.init('videoPlayer2');
// 	video2.load(singleSource, poster);
// }