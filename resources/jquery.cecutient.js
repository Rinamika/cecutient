(function ($) {
	var savedIncrement = (getCookie('cecutient_font-size') === undefined || getCookie('cecutient_font-size') == '') ? 0 : getCookie('cecutient_font-size');

	function getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookie(name, value, options) {
		options = options || {};

		var expires = options.expires;

		if (typeof expires == "number" && expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);


		var updatedCookie = name + "=" + value + "; path=/";

		for (var propName in options) {
			updatedCookie += "; " + propName;
			var propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue;
			}
		}
		document.cookie = updatedCookie;
	}

	function deleteCookie(name) {
		setCookie(name, "", { expires: -1 })
	}

	$.fn.zoomtext = function (c) {
		var a = {
			min: 12, //minimal font size; 0 - no limitations
			max: 26, //maximum font size; 0 - no limitations
			increment: "+=1", //increment or font-size, e.g. "24px"
			recovery: !1, // disable all font-size changes
			skip: !1,  //skip all children of element, css children's selector is "*"
			setCookie: !1
		}, a = $.extend(a, c);
		c = $("*", this).not($(a.skip)).not($(a.skip + " > *"));
		c.each(function (a, c) {
			var b = $(this).css("fontSize");
			!$(this).data("fontSize") && $(this).data("fontSize", b).css("fontSize", b);
		});
		if (a.setCookie) {
			if (a.increment.indexOf("+=") != -1) {
				savedIncrement = parseInt(savedIncrement) + parseInt(a.increment.substr(2, a.increment.length - 1));
			} else if (a.increment.indexOf("-=") != -1) {
				savedIncrement = parseInt(savedIncrement) - parseInt(a.increment.substr(2, a.increment.length - 1));
			}
			setCookie('cecutient_font-size', savedIncrement);
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
				$(this).removeAttr('style');
			} else {
				$(this).css({
					fontSize: b,
					lineHeight: parseFloat(b) + "px"
				});
			}
		});
	};


	$.fn.cecutient = function (options) {
		options = options || {};
		options.target = options.target || '#layout';
		options.imageClass = options.imageClass || '.cecutientImagesOn';
		options.minimumFontSize = options.minimumFontSize || 12;
		options.maximumFontSize = options.maximumFontSize || 26;
		options.increment = options.increment || 3;
		options.skipForFont = options.skipForFont || '.skipForFont';
		options.container = options.container || "#panelWrapper";
		options.language = options.language || "en";

		var context = $(this),
			body = $("body");

		function cecutientOn() {
			console.log("Cecutient mode on");
			setCookie('cecutient', 1);
			$('body').addClass('cecutient');
			$("#cecutientPanel").removeClass("hidden");
			if (getCookie('cecutient_hide-images') == 1) {
				cecutientImagesOff();
			} else {
				cecutientImagesOn();
			}
			if (getCookie('cecutient_color-scheme') !== undefined) {
				setColorScheme(getCookie('color-scheme'));
			}
			if (getCookie('cecutient_font-size') !== undefined && getCookie('cecutient_font-size') !== '') {
				$(options.target+ ":not('" + options.skipForFont + "')").zoomtext({
					increment: "+=" + getCookie('cecutient_font-size'),
					min: options.minimumFontSize,
					skip: options.skipForFont});
			} else {
				$(options.target).zoomtext({
					increment: "+=0",
					min: options.minimumFontSize,
					setCookie: 1,
					skip: options.skipForFont});
			}
		}

		function cecutientOff() {
			console.log("Cecutient mode off");
			deleteCookie('cecutient');
			$("#cecutientPanel").addClass("hidden");
			body.removeClass('cecutient colorWhite colorBlack colorBlue');
			$('img').removeClass('hidden');
			body.zoomtext({recovery: 1});
			deleteCookie('cecutient_font-size');
		}

		function cecutientImagesOn() {
			deleteCookie('cecutient_hide-images');
			$('#switchOnImages').addClass('current');
			$('#switchOffImages').removeClass('current');
			$('img').removeClass('hidden');
		}

		function cecutientImagesOff() {
			setCookie('cecutient_hide-images', 1);
			$('#switchOnImages').removeClass('current');
			$('#switchOffImages').addClass('current');
			$('img:not(' + options.imageClass + ')').addClass('hidden');
		}

		function setColorScheme(color) {
			body.removeClass("colorWhite colorBlack colorBlue").addClass(color);
			setCookie('cecutient_color-scheme', color);
		}

		context.unbind("click").bind("click", function () {
			getCookie('cecutient') == 1 ? cecutientOff() : cecutientOn();
		});

		$("#normal-mode").unbind("click").bind("click", function () {
			cecutientOff();
		});

		//Load cecutient panel in specified container
		$(options.container).load("/resources/templates/panel_" + options.language + ".html", function() {
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
				$(options.target).zoomtext({increment: "-=" + options.increment, setCookie: 1, skip: options.skipForFont});
			});

			$('#increaseFontSize').unbind("click").bind("click", function () {
				$(options.target).zoomtext({increment: "+=" + options.increment, setCookie: 1, skip: options.skipForFont});
			});
		});

		//check if cecutient version is enabled in cookie
		if (getCookie('cecutient') == 1) {
			cecutientOn();
		}
	}
})(jQuery);
