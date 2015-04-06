(function ($) {
	var savedIncrement = (getCookie('font-size') === undefined || getCookie('font-size') == '') ? 0 : getCookie('font-size');

	$.fn.zoomtext = function (c) {
		var a = {
			min: 12, //minimal font size; 0 - no limitations
			max: 26, //maximum font size; 0 - no limitations
			increment: "+=1", //increment or font-size, e.g. "24px"
			recovery: !1, // disable all font-size changes
			skip: !1,  //skip all children of element, css children's selector is "*"
			setCookie: !1
		}, a = $.extend(a, c);
		c = $("*", this).add(this);
		c.each(function (a, c) {
			var b = $(this).css("fontSize");
			!$(this).data("fontSize") && $(this).data("fontSize", b).css("fontSize", b);

		});
		a.skip && (c = c.not($(a.skip, this)));
		if (a.setCookie) {
			if (a.increment.indexOf("+=") != -1) {
				savedIncrement = parseInt(savedIncrement) + parseInt(a.increment.substr(2, a.increment.length - 1));
			} else if (a.increment.indexOf("-=") != -1) {
				savedIncrement = parseInt(savedIncrement) - parseInt(a.increment.substr(2, a.increment.length - 1));
			}
			setCookie('font-size', savedIncrement);
			console.log("saved: " + savedIncrement);
			console.log(getCookie('font-size') + " COOKIE");
		}
		return c.each(function (c, d) {
			var b = $(this).css("fontSize"),
				b = $("<div/>", {
					css: {
						fontSize: b
					}
				}).css("fontSize", a.increment).css("fontSize");
			a.max && parseFloat(b) > a.max && (b = a.max);
			a.min && parseFloat(b) < a.min && (b = a.min);
			if (a.recovery) {
				console.log("recovery size");
				$(this).removeAttr('style');
			} else {
				$(this).css({
					fontSize: b,
					lineHeight: parseFloat(b) + "px"
				});
			}
			console.log(b);
		});
	};


	$.fn.cecutient = function (options) {
		options = options || {};
		options.target = $(options.target || '#layout');
		options.imageClass = options.imageClass || '.cecutientImagesOn';
		options.minimumFontSize = options.minimumFontSize || 12;
		options.maximumFontSize = options.maximumFontSize || 26;
		options.increment = options.increment || 3;

		var context = $(this),
			body = $("body");

		function cecutientOn() {
			setCookie('cecutient', 1);
			$('body').addClass('cecutient');
			$("#cecutientPanel").removeClass("hidden");
			if (getCookie('hide-images') == 1) {
				cecutientImagesOff();
			} else {
				cecutientImagesOn();
			}
			if (getCookie('color-scheme') !== undefined) {
				setColorScheme(getCookie('color-scheme'));
			}
			if (getCookie('font-size') !== undefined && getCookie('font-size') !== '') {
				$(options.target).zoomtext({
					increment: "+=" + getCookie('font-size'),
					min: options.minimumFontSize});
			} else {
				$(options.target).zoomtext({
					increment: "+=0",
					min: options.minimumFontSize,
					setCookie: 1});
			}
		}

		function cecutientOff() {
			console.log("off");
			deleteCookie('cecutient');
			$("#cecutientPanel").addClass("hidden");
			body.removeClass('cecutient colorWhite colorBlack colorBlue');
			$('img').removeClass('hidden');
			body.zoomtext({recovery: 1});
			deleteCookie('font-size');
		}

		function cecutientImagesOn() {
			deleteCookie('hide-images');
			$('#switchOnImages').addClass('current');
			$('#switchOffImages').removeClass('current');
			$('img').removeClass('hidden');
		}

		function cecutientImagesOff() {
			setCookie('hide-images', 1);
			$('#switchOnImages').removeClass('current');
			$('#switchOffImages').addClass('current');
			$('img:not(' + options.imageClass + ')').addClass('hidden');
		}

		function setColorScheme(color) {
			body.removeClass("colorWhite colorBlack colorBlue").addClass(color);
			setCookie('color-scheme', color);
		}

		context.unbind("click").bind("click", function () {
			getCookie('cecutient') == 1 ? cecutientOff() : cecutientOn();
		});

		$("#normal-mode").unbind("click").bind("click", function () {
			cecutientOff();
		});

		$('.settingColor a').unbind("click").bind("click", function () {
			var color = $(this).attr("id");
			setColorScheme(color);
		});

		$("#switchOnImages").unbind("click").bind("click", function () {
			cecutientImagesOn();
		});

		$("#switchOffImages").unbind("click").bind("click", function () {
			cecutientImagesOff();
		});

		$('#reduceFontSize').unbind("click").bind("click", function () {
			$('#layout article').zoomtext({increment: "-=" + options.increment, setCookie: 1});
		});

		$('#increaseFontSize').unbind("click").bind("click", function () {
			$('#layout article').zoomtext({increment: "+=" + options.increment, setCookie: 1});
		});

		//check if cecutient version is enabled in cookie
		if (getCookie('cecutient') == 1) {
			cecutientOn();
		}
	}
})(jQuery);