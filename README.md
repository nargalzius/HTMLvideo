# HTML Video "class"

#### [Codepen Demo](http://codepen.io/nargalzius/pen/WvKOBv?editors=001)

Minified version can be found in the `demo/public_html` folder

==

## Abstract

This HTML video player aims to simplify the setup and playback of [vanilla] HTML video. All you have to do is create ONE div element, set it to the size you want, and initialize the player with it. There are no dependencies of any external CSS, etc. This player is entirely self-contained.

All sub-elements (tags, controls, etc.) will be generated automatically (inline SVG). This should eliminate the need for coding/creating nested elements for any video implementation.

To load a video, I've implemented some fuzzy logic into it. This means that you have the option of just inputting a single string for a single file, or an array of filepaths for multiple files. The code should be smart enough to determine the filetype which it'll use for the `<source>` tag(s) it'll generate.

You can also input an optional second string parameter for a poster file.

The video has rudimentary detection what browser environment you're on. If you're on a mobile browser, once playback starts, it will remove all "custom" controls and default to built-in browser player controls - this is to ensure proper behavior/compatibility. Of course, I did say "rudimentary" (i.e. not bullet-proof), so you can always manually set it via the `ismobile` variable.


## Quick Start

First, Create your div in the HTML - give it an ID (let's assume it's `videoPlayer`). Style it as you wish (set WxH via CSS)

Next, instanciate video player instance and assign it to the div you just created

```javascript
var video = new VideoPlayer();
	video.init('videoPlayer');
```

Next, load your video and (optional) poster.

```javascript
video.load('VIDEO_FILE', 'POSTER_FILE');
```

That's it ;)

## Parameters
#### Behavioral settings for the player

`autoplay` | Default: `false`  
Auto plays video. 

`startmuted` | Default: `false`  
Mutes video on initial (auto) play. Requires `autoplay` to be true. 

`replaywithsound` | Default: `false`  
Force unmutes video on replay (by default it uses the last audio setting). 

`loop` | Default: `false`  
Loops the video. 

`allowfullscreen` | Default: `false`  
Enables manual fullscreen button. 

`playonseek` | Default: `true`  
Forces playback whenever you move the playhead. If set to `false` it stays on its last play/pause state even after jumping/seeking.  

`uniqereplay` | Default: `true`  
Uses a replay icon for the replay. When set to `false`, it'll use the same icon as the play button. 

`chromeless` | Default: `false`  
Removes all controls. Useful for preview videos on collapsed states for desktop units where you don't want video controls visible. Clicking on the player itself only toggles play/pause. 

`progressive` | Default: `true`  
Preloads the entire video (or a huge chunk of it) before playback. 

`ismobile` | Default: auto-detect  
Reverts to built-in video player and controls. Naturally a lot of the "special behaviors above" will be disabled in this mode.

`elementtrigger` | Default: `true`  
Allows clicking of the entire video container itself to play/pause. If set to `false`, you'll have to use the control icons/buttons.

`debug` | Default: `false`  
Output player logs to console. 

## Callbacks and Tracking
#### Callbacks that can be overriden

`callback_end` 
`callback_play` 
`callback_pause` 
`callback_volume` 
`callback_loading` 
`callback_progress` 
`callback_ready` 

`track_start` 
`track_play` 
`track_replay` 
`track_end` 
`track_pause` 
`track_mute` 
`track_unmute` 
`track_q25` 
`track_q50` 
`track_q75` 
`track_enterfs` 
`track_exitf` 

#### Example(s)

To override, simply override the method your video instance. For example to add in a Studio tracking event on video start:

```javascript
VIDEO_INSTANCE.track_start = function(e) {
    Enabler.counter('VIDEO_STARTS', true);
};
```

Or let's say you want to do something else in the unit when video playback ends:

```javascript
VIDEO_INSTANCE.callback_end = function(e) {
    // DO SOMETHING ELSE
};
```

Alternatively, you could inject it to `track_end` instead. More than one way to skin a cat ;)


## Control Skinning
#### Overriding control DOM elements

While the position of control elements are pretty much fixed (the big play butotn will always be centered, etc.), you CAN change the actual 'buttons' used.

These are the methods you can override:

`dom_template_bigplay` 
`dom_template_bigsound` 
`dom_template_replay` 
`dom_template_spinner` 
`dom_template_play` 
`dom_template_pause` 
`dom_template_mute` 
`dom_template_unmute` 
`dom_template_fs`

#### Example(s)

As an example, by default, this is the current template for the big play button:

```javascript
dom_template_bigplay: function() {
	this.dom_bigplay = document.createElement('div');
	this.dom_bigplay.innerHTML = this.svg.bigplay; // USES an SVG in another variable
	this.dom_bigplay.getElementsByTagName('path')[0].style.fill = this.colors_bigplay;
}
```

Let's say you just want to use an image that was provided by the client. Then you'd override it with:

```javascript
VIDEO_INSTANCE.dom_template_bigplay = function() {
	VIDEO_INSTANCE.dom_bigplay = document.createElement('img');
	VIDEO_INSTANCE.dom_bigplay.src = 'YOUR_IMAGE_HERE';
};
```

Note: you have to use the `dom_bigplay` within the overriden method because the player subroutines manipulates that element (to toggle visibility, etc.)

## Convenience Methods
#### Some methods that are available but not necessarily advertized.

`reflow`:  
Can be called if you dynamically change the size of the video container and need the control elements to re-position relative to the new container dimensions.

`unload`:  
Unloads the video. Instance itself is still active.

`destroy`:  
Destroys the video instance completely. You'll have to re-initialize it if you want to use it again.

## Convenience variables
#### Some variables you can check for current video status.

`playhead`  
Position of the playhead

`duration`  
Total duration of the video

`isplaying`  
Check if video is currently playing

`proxy`  
If for some reason, you want to access the `<video>` element itself, you can do it through this :)