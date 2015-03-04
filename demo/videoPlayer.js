/**
 * Escola Panamericana - 2012 
 * 
 * Code by Felipe Lopes Lage @ umstudio
 * 
 */


/*========================
==========================
	Video Player 
==========================
==========================
*/

(function(root, $, undefined){

	function addEvent(target, event, handler){
		if(window.addEventListener){
			target.addEventListener(event, handler);
		}else {
			target.AttachEvent(event, handler);
		}
	}

	function VideoPlayerPButton(div, handler){
		
	}

	function VideoPlayerProgress(div, handler){
		var dragger = div.children(".dragger"),
			slider = dragger.children(".slider"),
			bg = dragger.children("#bg"),
			sliderTrack = dragger.children("#sliderTrack"),
			tracker = dragger.children("#tracker"),
			progress = dragger.children("#progress"),
			sliderW = slider.width(),
			draggerW = dragger.width() - (sliderW * 0.5),
			scope;

		slider.draggable({axis:"x", containment: "parent", drag:onDragHandler});
		sliderTrack.width(sliderTrack.width()+4);

		tracker.mousedown(onMouseDown);

		function onDragHandler(e){
			slideTo(parseInt(slider.css("left")), true)
		}

		function onMouseDown(e){
			slideTo(e.clientX - dragger.offset().left, true);
		}

		function slideTo(value, withMouse){
			var sliderLeft = value,
				percent = sliderLeft/draggerW,
				percentW = (draggerW * percent);

			slider.css("left",value);
			progress.width(percentW);
			if(withMouse) handler((percent > 1) ? 1 : percent);
		}

		scope = {
			set : function(percent){
				slideTo(percent*draggerW);
			}
		}

		return scope;
	}

	
	function VideoPlayer(div){
		var path = div.attr("data-path"),
			controls = div.children("div.controls"),
			pButton = controls.children("div.play"),
			volumeButton = controls.children("div.volume"),
			mButton = volumeButton.children("span.on"),
			time = controls.children("p.time"),
			video = div.find("video")[0],
			isAutoPlay = Boolean(div.attr("data-auto-play") ==  "true"),
			duration = video.duration,
			progress,volume;
			
		function buttonHandler(){
			alert("button handler!")
		}

		function progressDragHandler(percent){
			video.currentTime = video.duration * percent;
		}

		function volumeHandler(percent){
			video.volume = percent;
			if(percent > 0 && mButton.hasClass("off")) toggleMute();
			if(percent == 0 && mButton.hasClass("on")) toggleMute();
		}

		function updateTime(current, total){
			function maskTime(value){
				var hour = Math.floor(value/3600),
					min = Math.floor(value / 60),
					sec = Math.floor(value);
				min = (min < 10) ? "0"+min : min;
				sec = (sec < 10) ? "0"+sec : sec;
				return min+":"+sec;
			}

			time.empty().append(maskTime(current)+" | "+maskTime(total));			
		}

		function togglePlay(reset){
			var button = pButton.children("span"), isPlaying = button.hasClass("play");
			if(reset == true){
				button.removeClass("pause").addClass("play");
				video.pause();
				return;
			}
			if(isPlaying){
				button.removeClass("play").addClass("pause");
				video.play();
			}else{
				button.removeClass("pause").addClass("play");
				video.pause();
			}
		}

		function toggleMute(){
			var button = mButton, isPlaying = button.hasClass("on"),
				vDragger = volumeButton.children(".dragger");
			if(isPlaying){
				button.removeClass("on").addClass("off");
				video.muted = true;
				volume.set(0);
			}else{
				button.removeClass("off").addClass("on");
				video.muted = false;
				volume.set(1);
			}
		}

		function bindEvents(){
			progress = new VideoPlayerProgress(controls.children(".progresso"), progressDragHandler);
			volume = new VideoPlayerProgress(controls.children(".volume"), volumeHandler);
			pButton.mousedown(togglePlay);
			mButton.mousedown(toggleMute);
			$(video).mousedown(togglePlay);
			addEvent(video, "timeupdate", function(e){
				progress.set(video.currentTime/video.duration);
				updateTime(video.currentTime, video.duration);
			});

			addEvent(video, "ended", function(e){
				togglePlay(true);
			});
			
			if(isAutoPlay) togglePlay();
		}

		scope = {
			init : function(div){
				if(video.duration){
					bindEvents();
				}else{
					addEvent(video, "canplay", bindEvents);
				}
			}
		}

		scope.init(div);
		return scope;	
	}

	root.init = function(jDom){
		var player;
		jDom.each(function(index, item){
			player = new VideoPlayer($(item));
		});
	}	

})(window.videoPlayer = window.videoPlayer || {}, jQuery)



