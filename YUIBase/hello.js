YUI.add('hello',function(Y){
	Y.namespace('Hello');
	Y.Hello.sayHello = function(){
		return 'GREETING';
	}

	function setNodeMesassage(node,html){
		node=Y.one(node);
		if(node){
			node.setHTML(html);
		}
	}
	Y.Hello.sayHi = function(node){
		setNodeMesassage(node,'HIHIHI');
	};


	Y.Hello.press = function(node1,node2){
		setPress(node1,node2);
	};
},'0.0.1',{requires:['node-base']});
