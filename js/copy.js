var isDom = (typeof HTMLElement === 'object') ?
    function (obj) {
        return obj instanceof HTMLElement;
    } :
    function (obj) {
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };
	function copyTxtFun(id) {
	    if (isDom(id)) {
	        id = $(id).attr('id');
	    }
	    console.log(id);
	    var clipboard = new Clipboard('#' + id);
	    console.log(clipboard);
	    clipboard.on('success', function (e) {
	    });
	    clipboard.on('error', function (e) {
	    });
	}
