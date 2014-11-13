function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

function setSize() {
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	if (!document.getElementById('J-overlay-mask')){return false;}
	var cover = document.getElementById('J-overlay-mask');
	cover.style.height = h + "px";
	cover.style.width = w + "px";
}

addLoadEvent(setSize);

//日历插件调用
YUI().use('node-base','node-event-delegate', function(Y){
	Y.one('.J-check-date--first').on('click',function(ev){
		if (Y.one('#datepicker').hasClass('wrapper--datepicker--hidden')) {
			Y.one('#datepicker').removeClass('wrapper--datepicker--hidden');
		} else {
			Y.one('#datepicker').addClass('wrapper--datepicker--hidden');
		}
	});
	Y.one('#datepicker').delegate('click',function(ev){
		Y.one('#datepicker').addClass('wrapper--datepicker--hidden');
	},'.yui3-calendar-day');
});


//日历插件
YUI({lang:'zh-Hans'}).use('node-base', 'calendar', function(Y){
	var calendar = new Y.Calendar({
		headerRenderer: "%Y年 %m月"
	}).render('#datepicker');

	calendar.after('selectionChange', function(ev){
		var date = ev.newSelection[0];
		date = Y.DataType.Date.format(date, {format:'%Y-%m-%d'});
		Y.one('.J-check-date--first').set('value', date);
	});
});

//本地对电话号码先进行一些判断
var phoneNum = document.getElementById('J-verify-phone');
EventUtil.addHandler(phoneNum, "input", function(e){
	if (isNaN(phoneNum.value) || (phoneNum.value.length!=11 && phoneNum.value.length!=0)) {
		document.getElementById('J-verify-hint').style.display = 'block';
	} else {
		document.getElementById('J-verify-hint').style.display = 'none';
	}
});

//电话和用户名二选一必填
YUI().use('node-base', function(Y){
	var phone = Y.one('#J-verify-phone'),
		user = Y.one('#J-verify-userid'),
		info = Y.one('#J-verify-login');
	var checkInput = function() {
		if(phone.get('value') === '' && user.get('value') === '') {
			return true;
		} else {
			return false;
		}
	}
	phone.on('blur', function(ev){
		if(checkInput()){
			document.getElementById('J-verify-login').style.display = 'block';
		} else {
			document.getElementById('J-verify-login').style.display = 'none';
		}
	});
	user.on('blur', function(ev){
		if(checkInput()){
			document.getElementById('J-verify-login').style.display = 'block';
		} else {
			document.getElementById('J-verify-login').style.display = 'none';
		}
	});

});

//查询
YUI().use('io-base', 'node-base','node-event-delegate', 'json-parse', 'io-form', 'node-load', function (Y) {
	var ndSendMs = Y.one('#J-send'),
		pageNav = Y.one('.J-pointNav');
	ndSendMs.on('click', function(ev){
		ev.preventDefault();
		if (checkInFront()) {
			Y.one('.J-pageId').set('value', '1');
			getViewCoupon();
		}
	});
	//分页
	pageNav.delegate('click', function(ev){
		if (!ev.target.hasClass('selected')) {
			var pageId = ev.target.getAttribute('page-id');
			Y.one('.J-pageId').set('value', pageId);
			if (checkInFront()) {
				getViewCoupon();
			}
		}
	}, 'li');

	var checkInFront = function() {
		var dateS = Y.one('.J-check-date--first'),
			phone = Y.one('#J-verify-phone'),
			user = Y.one('#J-verify-userid');
		if ('block' !== document.getElementById('J-verify-hint').style.display && !(phone.get('value') === '' && user.get('value') === '')) {
			return true;
		} else {
			if (phone.get('value') === '' && user.get('value') === '') {
				document.getElementById('J-verify-login').style.display = 'block';
			}
			return false;
		}
	}

	var getViewCoupon = function() {
		Y.io('search.php', {
			method:'GET',
			form: {id: Y.one('#coupons-query-form')},
			on: {
				success: function(id,res){
					if (res.status >= 200 && res.status < 300) {
						var pageNum = Math.ceil(Y.JSON.parse(res.responseText).totalCount/20); 
						var answer = Y.JSON.parse(res.responseText).ktvOrderList;
						var ndTable = Y.one('#J-standard-table');
						ndTable.setHTML('');
						pageNav.setHTML('');

						var poiArray = new Array();
						var poiSelection = Y.all('.J-ui-select option');
						Y.each(poiSelection,function(i) {
							poiArray[i.get('value')] = i.get('innerHTML');
						})
						Y.each(answer, function (i) {
							var poiName = poiArray[i.poiId];	
							var statusText = '', statusBtn = '';

							switch (i.status) 
							{
								case '0':
									statusText = '未支付';
									break;
								case '1':
									statusText = '已支付';
									break;
								case '2':
									statusText = '已预订';
									statusBtn = '<input type="button" data-id="' + i.orderId + '" value="退款" class="form-button form-button--side J-form-button">';
									break;
								case '3':
									statusText = '退款中';
									break;								
								case '4':
									statusText = '已退款';
									break;						
								case '5':
									statusText = '已取消';
									break;				
								case '6':
									statusText = '已消费';
									break;
								case '-1':
									statusText = '不可用';
									break;
							}
							var ndTd = '<tr>' +
											'<td>' + i.orderId + '</td>' +
											'<td>' + poiName + '</td>' +
											'<td></td><td></td><td></td><td></td><td></td>'+
											'<td>' + i.saleDate + '</td>' +
											'<td>' + i.startTime + '-' + i.endTime + '</td>' +
											'<td>' + i.roomTypeName + '</td>' +
											'<td>' + i.arrivalTime + '</td>' +
											'<td>' + i.phone + '</td>' +
											'<td>' + statusText + '</td><td>' + statusBtn + '</td>' +
										'</tr>';
							ndTable.append(ndTd);
						});
						var ndNav = '';
						var currentPage = parseInt(Y.one('.J-pageId').get('value')),
							nextPage = currentPage + 1,
							prevPage = currentPage - 1;
						if(pageNum === 1) {
							ndNav = ''
						} else {
							ndNav = '<li class="previous J-pointPre';
							if (currentPage == 1) {
								ndNav += ' list--hidden';
							}
							ndNav += '" page-id="' + prevPage + '" ><i class="tri"></i>上一页</li>';
							for (var i = 1; i <= pageNum; i ++) {
								if ( i === currentPage) {
									ndNav += '<li page-id="1" class="selected">' + i + '</li>';
								} else {
									ndNav += '<li page-id="' + i + '">' + i + '</li>';
								}
							}
							ndNav += '<li class="next J-pointNex';
							if (currentPage == pageNum) {
								ndNav += ' list--hidden';
							}
							ndNav += '" page-id="' + nextPage + '" ><i class="tri"></i>下一页</li>';
						}
						pageNav.append(ndNav);
					}
				},
				failure:function(){
					alert("加载失败, 稍后重试");		
				}
			}
		});
	};
});

//确认消费按钮
YUI().use('node-base','node-event-delegate', 'io-base', 'json-parse', function(Y){
	var ndTable = Y.one('#J-standard-table'),
		ndCover = Y.one('#J-overlay'),
		ndBack = Y.one('#J-overlay-mask'); 
	ndTable.delegate('click', function(ev) {
		ndCover.removeClass('wrapper--overlay--hidden');
		ndBack.removeClass('wrapper--overlay-mask--hidden');
		var poID = ev.target.getAttribute('data-id');
		Y.one('.J-over-confirm').setAttribute('data-id',poID);
		var oElement = ev.target.get('parentNode');
		oElement.addClass('J-status-btn');
		oElement.previous().addClass('J-status-show');
	}, '.J-form-button');

	ndCover.delegate('click', function(ev) {
		if (ev.target.hasClass('J-over-confirm')) {
			var poID = ev.target.getAttribute('data-id');
			Y.io('php/confirm.php/'+poID, {
				method:'GET',
				on: {
					success: function(id,res){
						if (res.status >= 200 && res.status < 300) {
							var answer = Y.JSON.parse(res.responseText);
							if (answer.status == 200)	{
								Y.one('.J-status-btn').set('innerHTML', '');
								Y.one('.J-status-show').set('innerHTML', '已消费');
								Y.one('.J-status-btn').removeClass('J-status-btn');
								Y.one('.J-status-show').removeClass('J-status-show');
							} else {
								alert(answer.msg);
							}
						}	
					},
					failure: function(){
						alert('提交失败，稍后重试');		 
					}
				}
			});
		}
		ndCover.addClass('wrapper--overlay--hidden');
		ndBack.addClass('wrapper--overlay-mask--hidden');
	}, '.form-button');
});

