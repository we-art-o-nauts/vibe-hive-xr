window.addEventListener('load', function() {
  $('#music').on('click', function() {
    $('#music').hide(); 
    $('#soundcloud').show().attr('src', SOUNDCLOUD_LINK);
  });
});

$('#restart').on('click', function() {
	location.reload();
});

let timeTotal = 30;
let startAnim = false;

$('.start-btn').hide().on('click', function() {
	which = $(this).data('dur');
	console.log('Starting', which);
	if (which == 'pomodoro') {
		timeTotal = 60 * 25;
	} else if (which == 'midnight') {
		let d = new Date();
		d.setDate(d.getDate() + 1); 
		d.setHours(0); d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
		timeTotal = (d - new Date()) / 1000;
	}
	startAnim = true;
	$('#thePod,#theWorld').each(function() {
		this.emit(`letsGo`, null, true);
	});
	$(this).parent().hide();
});


AFRAME.registerComponent('updater', {

  textSpeed: 2,
  timePause: 6,
  timeStart: null,
  textShown: '',
  textCurrent: '',
	
	init: function()
	{
		this.writenow('breathe in.');
		$('.start-btn').show();
	},
	
	writenow: function (what) {
    if (this.textCurrent == what) return;
    this.textShown = '';
    this.textCurrent = what;
	},
	
	typeit: function() {
    let cur = this.textShown;
    const txt = this.textCurrent;
    if (cur.length < txt.length) {
      cur += txt.charAt(cur.length);
      this.textShown = cur;
      if (cur.length < txt.length) {
        cur += '|';
      }
      this.el.setAttribute("text", "value", cur);
      //console.log(this.textShown, this.textCurrent);
    }
  },

	tick: function (time, timeDelta) 
	{
		if (!startAnim) return;

    if (this.timeStart == null) {
      this.timeStart = time + ((timeTotal + this.timePause) * 1000);
    }
		let t = Math.round((this.timeStart - time)/1000);
		let tString = (t < 10 ? ' ' + t : t);
		let dur = moment.utc(moment.duration(t*1000).asMilliseconds());
		if (t > 60 * 60) {
			tString = dur.format('h:mm');
		} else if (t > 60) {
			tString = dur.format('m:ss');
		}
		let newText = "𝅳   " + " ".repeat(10 - tString.length) + tString;
		let currentText = this.el.getAttribute("text")["value"];

		// only update if newText is different than current text displayed.
		if (newText != currentText && t < timeTotal && t > 0) {
			this.writenow(newText);
		}
		else if (t > timeTotal && t < timeTotal + 3) {
      this.writenow('breathe out ...')
		}
		else if (t < 1 && t > -5) {
      this.writenow("feeling the vibe");
		}
		else if (t < -4) {
      this.el.setAttribute("text", "color", "#fee190");
      this.writenow("The Vibe Hive");
		}
		
		this.typeit();		
	}
	
});