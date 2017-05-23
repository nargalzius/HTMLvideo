var video;
var multiSource = [
	'https://joystick.cachefly.net/resources/video/video.mp4',
	'https://joystick.cachefly.net/resources/video/video.webm',
	'https://joystick.cachefly.net/resources/video/video.ogv'];
var poster = 'https://farm9.staticflickr.com/8557/10238331725_b82c75be44_o.jpg';
	// poster = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMbLEGXk2ADDBlqJxM9RtalzYamN_z1-WoB-49QYugyEl1JHzCAQ';
var singleSource = 'https://joystick.cachefly.net/JMC/v/vid_become_legend.mp4';
var resetVars;

$( document ).ready(init);

function init(){
	$('#groupwrapper1').css('display', 'none');
	$('#groupwrapper2').css('display', 'none');

	video = new VideoPlayer();
	video.dom_debug = document.getElementById('debugField');
	video.debug = true;
	video.autoplay = true;
	video.startmuted = true;
	video.checkForMobile();
	video.progressive = false;
	// video.preview = 5;
	// video.chromeless = true;
	// video.controlbar = false;
	// video.bigbuttons = false;
	// video.elementtrigger = true;
	// video.elementplayback = false;
	video.init('videoPlayer');
	video.load(multiSource, poster);
	// video.load(multiSource);

var video2 = document.createElement('video');
	video2.playsInline = true;
	video2.muted = true;
	video2.autoplay = true;
	video2.controls = true;

	for(var key in video2) {

		console.log(key);
		
		// if(	key === 'playsInline' || 
		// 	key === 'muted' || 
		// 	key === 'autoplay'
		// ) {
		// 	// alert(video[key]);	
		// }
	}

var src = document.createElement('source');
	src.setAttribute('src','https://joystick.cachefly.net/resources/video/video.mp4');
	src.setAttribute('type','video/mp4');
	video2.appendChild(src);

	// document.getElementById('videoPlayer2').appendChild(video2);
   
}

