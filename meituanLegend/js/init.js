YUI().use('node-base', 'node-event-delegate', function(Y){
// 轮播图
	var ndBannerIcon = Y.one('.J-banner-icon'),
		ndBanner = Y.one('.J-banner'),
		TCount = ndBannerIcon.one('li');
	ndBannerIcon.delegate('click', function(ev){
		if (!ev.target.hasClass('selected')) {
			timer(ev.target);
		}
	}, 'li');

	var timer = function(node){
		ndBannerIcon.all('li').removeClass('selected');
		ndBanner.all('li').addClass('banner-nav--hidden');
		node.addClass('selected');
		Y.one('.banner-nav--' + node.getAttribute('data-id')).removeClass('banner-nav--hidden');
	}

	setTimeout(function(){
		if (TCount.next()) {
			TCount = TCount.next();	
		} else {
			TCount = ndBannerIcon.one('li');
		}
		timer(TCount);
		setTimeout(arguments.callee,3000)
	},4000);

//Tab切换
	var ndContent = Y.one('.J-content-header');
	var index = 1;
	ndContent.delegate('click', function(ev){
		var node = ev.target;
		if (!node.hasClass('selected')) {
			ndContent.all('li').removeClass('selected');
			node.addClass('selected');
			Y.all('.content-main').addClass('content-main--hidden');
			Y.one('.content-main--' + node.getAttribute('data-id')).removeClass('content-main--hidden');
		}

		var ndTap = Y.one('.J-content-tap');
		if (ndTap) {
			var ndNav = Y.one('.J-content-nav'),	
				num = Math.ceil(ndNav.all('li').size()/4);
			Y.one('.J-tap-current').set('text', index);
			Y.one('.J-tap-all').set('text', '/ '+num);
			ndTap.delegate('click', function(ev){
				if (ev.target.hasClass('J-tap-prev')) {
					index --;
					if (index <= 0) {
						index = num;
					}
				} else {
					index ++;
					if (index > num) {
						index = 1;
					}
				}
			Y.one('.J-tap-current').set('text', index);
			document.getElementById('J-content-nav').style.left = '-' + ((index-1)*980) + 'px';
			}, 'a');
		}

	}, 'li');

//小Tap切换
	
	
	

});
