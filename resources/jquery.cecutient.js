(function ($) {
	const COOKIE_BASENAME = 'cecutient';
	const COOKIE_FONT_NAME = COOKIE_BASENAME + '_font-size';
	const COOKIE_COLOR_NAME = COOKIE_BASENAME + '_color-scheme';
	const COOKIE_IMAGES = COOKIE_BASENAME + 'cecutient_hide-images';


	var savedIncrement = (getCookie(COOKIE_FONT_NAME) === undefined || getCookie(COOKIE_FONT_NAME) == '') ? 0 : getCookie(COOKIE_FONT_NAME);

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

		name = encodeURIComponent(name)
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


	$.fn.zoomtext = function (options) {
		options = options || {};
		options.min = options.min || 0;
		options.max = options.max || 10;
		options.increment = options.increment || 0;
		options.recovery = options.recovery || !1;
		options.skip = options.skip || !1;
		options.setCookie = options.setCookie || !1;
		options.mode = options.mode || 0;

		var $element = $(this);

		$element = $("*", $element).not($(options.skip)).not($(options.skip + " *"))
			.filter("p, ul, ol, h1, h2, h3, h4, table, blockquote");

		var cookieValue = getCookie(COOKIE_FONT_NAME);
		var newFSize = options.increment;
		var temp = cookieValue ? parseInt(cookieValue) + parseInt(newFSize) : newFSize;
		newFSize = temp;
		if (temp < options.min) {
			newFSize = 0;
			deleteCookie(COOKIE_FONT_NAME);
			options.increment = 0;
		} else if (temp > options.max) {
			newFSize = 0;
			options.increment = 0;
		}

		$element.each(function () {
			if (options.recovery) {
				$(this).css("fontSize", "").css("lineHeight", "");
			} else {
				if (options.mode) {
					$(this).css("fontSize", "+=" + newFSize);
				} else {
					$(this).css("fontSize", "+=" + options.increment);
				}
			}
		});

		if (options.setCookie) {
			var savedIncrement = cookieValue ? cookieValue : 0;
			var newIncrement = parseInt(savedIncrement) + parseInt(options.increment);
			jQuery(".font-value").text(newIncrement);
			setCookie(COOKIE_FONT_NAME, newIncrement);
		} else {
			var savedIncrement = cookieValue ? cookieValue : options.increment;
			jQuery(".font-value").text(savedIncrement);
		}

		return true;
	};

	$.fn.cecutient = function (options) {
		options = options || {};
		options.target = options.target || '#layout';
		options.imageClass = options.imageClass || '.cecutientImagesOn';
		options.minimumFontSize = options.minimumFontSize || 0;
		options.maximumFontSize = options.maximumFontSize || 10;
		options.increment = options.increment || +1;
		options.skipForFont = options.skipForFont || '.skipForFont';
		options.container = options.container || "#panelWrapper";
		options.containerPath = options.containerPath || "resources/templates";
		options.language = options.language || "en";

		var context = $(this),
			body = $("body");

		function cecutientOn() {
			console.log("Cecutient mode on");
			setCookie(COOKIE_BASENAME, 1);
			$('body').addClass('cecutient');
			$("#cecutientPanel").removeClass("hidden");
			if (getCookie(COOKIE_IMAGES) == 1) {
				cecutientImagesOff();
			} else {
				cecutientImagesOn();
			}
			if (getCookie(COOKIE_COLOR_NAME) !== undefined) {
				setColorScheme(getCookie(COOKIE_COLOR_NAME));
			}
			if (getCookie(COOKIE_FONT_NAME) !== undefined && getCookie(COOKIE_FONT_NAME) !== '') {
				$(options.target+ ":not('" + options.skipForFont + "')").zoomtext({
					increment: 0,
					setCookie: 0,
					mode: 1,
					min: options.minimumFontSize,
					max: options.maximumFontSize,
					skip: options.skipForFont});
			}
		}

		function cecutientOff() {
			console.log("Cecutient mode off");
			deleteCookie(COOKIE_BASENAME);
			$("#cecutientPanel").addClass("hidden");
			body.removeClass('cecutient colorWhite colorBlack colorBlue');
			$('img').removeClass('hidden');
			body.zoomtext({recovery: 1});
			deleteCookie(COOKIE_FONT_NAME);
		}

		function cecutientImagesOn() {
			deleteCookie(COOKIE_IMAGES);
			$('#switchOnImages').addClass('current');
			$('#switchOffImages').removeClass('current');
			$('img').removeClass('hidden');
		}

		function cecutientImagesOff() {
			setCookie(COOKIE_IMAGES, 1);
			$('#switchOnImages').removeClass('current');
			$('#switchOffImages').addClass('current');
			$('img:not(' + options.imageClass + ')').addClass('hidden');
		}

		function setColorScheme(color) {
			body.removeClass("colorWhite colorBlack colorBlue").addClass(color);
			setCookie(COOKIE_COLOR_NAME, color);
		}

		context.unbind("click").bind("click", function () {
			getCookie(COOKIE_BASENAME) == 1 ? cecutientOff() : cecutientOn();
		});

		$("#normal-mode").unbind("click").bind("click", function () {
			cecutientOff();
		});

		//Load cecutient panel in specified container
		$(options.container).load(options.containerPath +"/panel_" + options.language + ".html", function() {
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
				$(options.target).zoomtext({increment: -1, setCookie: 1, skip: options.skipForFont, min: options.minimumFontSize});
			});

			$('#increaseFontSize').unbind("click").bind("click", function () {
				$(options.target).zoomtext({increment: +1, setCookie: 1, skip: options.skipForFont, max: options.maximumFontSize});
			});
		});

		//check if cecutient version is enabled in cookie
		if (getCookie(COOKIE_BASENAME) == 1) {
			cecutientOn();
		}
	}
})(jQuery);
