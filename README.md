# cecutient
A quick way to customize website for the convenience of visually impaired people.

## Internet is for everybody.
------
There are a lot of people with poor eyesight, who feel uncomfortable while surfing Internet.

We produce "Cecutient" - a simple tool that provides a panel for manipulating with font size, color schemes and enabling of images.

### Installation
------
Put the following in head section:

```javascript
<script src="/path/to/jquery.js"></script>
<script src="/path/to/utils.js"></script>
<script src="/path/to/jquery.cecutient.js"></script>
<link rel="stylesheet" href="path/to/jquery.cecutient.css"/>

<script type="text/javascript">
	jQuery(function($) {
		$('#cecutient').cecutient({
			increment: 1,
			target: "#layout article",
			imageClass: ".cecutientImagesOn",
			minimumFontSize : 0,
			maximumFontSize : 10,
			skipForFont: ".skip",
			container: "#panelWrapper",
			containerPath: "resources/templates",
			language: 'en'
		});
	});
</script>
```

And right after that, click event will hang on element with **id = 'cecutient'** for enable/disable cecutient version (and show/hide configuration panel).
Once you click specified element, all backgrounds and font styles will disappear.

In repository you can find `panel_en.htm` and `panel_ru.htm` - English and Russian versions of cecutient panel. Below is example of panel in English:

```html
<div id="cecutientPanel" class="hide-on-normal">
	<div class="settingFontSize"><div>Font size</div><div><a id="reduceFontSize" href="#"><span>-</span></a><a id="increaseFontSize" href="#"><span>+</span></a></div></div>
	<div class="settingColor"><div>Color scheme</div><div><a id="colorWhite" href="#"></a><a id="colorBlack" href="#"></a><a id="colorBlue" href="#"></a></div></div>
	<div class="settingImages"><div>Images</div><div><a class="" id="switchOnImages" href="#"><span>On</span></a><a class="current" id="switchOffImages" href="#"><span>Off</span></a></div></div>
</div>
```

Panel in loaded in `container` that you specified.

By default, here are three color schemes: white, black and blue. You can specify your owns by adding links to panel and css in `cecutient.css`, or modify existing.

### Options
------

| Name | Description | Default value |
| ------------- |:-------------:| :-----:|
| increment      | A step for inc/dec font-size | 3 |
| target     | Element, where all magic happens  |  layout |
| imageClass | Class for images that are always visible  | ".cecutientImagesOn" |
| minimumFontSize | Minimum increment for font when cecutient is enabled |  0 |
| maximumFontSize | Maximum increment for font when cecutien is enabled  | 10 |
| skipForFont | Don't change font-size for specified container and its children  | .skipForFont |
| container | Container for cecutient panel  | #panelWrapper |
| containerPath | Path to directory with cecutient panel *.html file  | "resources/templates" |
| language | Language of panel ('en' or 'ru')  | 'en' |

### One more..

~~Only today and just for 0.99$..~~

Feel free to use and contribute :)

------
_**Cecutient** in French means "visually impaired"._