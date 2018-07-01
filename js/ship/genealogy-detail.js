WY.showMouseMove = function (options, handler) {
    options = options || {};
    handler = handler || {};
    var $move = $(options.move);
    var $content = $(options.content);
    var width = $content.width();
    var height = $content.height();
    return $move.each(function () {
        var $move = $(this);
        var isMouseDown = false,
            pageY, pageX, autoTop, autoLeft;
        $move.on('mousedown', function (e) {
            $(this).css({
                cursor: 'move'
            });
            isMouseDown = true;
            autoTop = parseFloat($move.css('marginTop'));
            autoLeft = parseFloat($move.css('marginLeft'));
            pageY = e.pageY;
            pageX = e.pageX;
            return false;
        });
        $move.on('mouseleave mouseup', function (e) {
            isMouseDown = false;
            $(this).css({
                cursor: 'auto'
            });
            return false;
        });
        $move.on('mousemove', function (e) {
            if (isMouseDown) {
                moveTo(autoTop + e.pageY - pageY, autoLeft + e.pageX - pageX);
            }
            return false;
        });

        function moveTo(marginTop, marginLeft) {
            var maxWidth = $move.width();
            var maxHeight = $move.height();
            if (height >= maxHeight) {
                if (marginTop < 0) {
                    handler.moveTop && handler.moveTop($move);
                    marginTop = 0;
                } else if (marginTop > height - maxHeight) {
                    handler.moveBottom && handler.moveBottom($move);
                    marginTop = height - maxHeight;
                }
            } else {
                if (marginTop > 0) {
                    handler.moveTop && handler.moveTop($move);
                    marginTop = 0;
                } else if (marginTop < height - maxHeight) {
                    handler.moveBottom && handler.moveBottom($move);
                    marginTop = height - maxHeight;
                }
            }
            if (width >= maxWidth) {
                if (marginLeft < 0) {
                    handler.moveLeft && handler.moveLeft($move);
                    marginLeft = 0;
                } else if (marginLeft > width - maxWidth) {
                    handler.moveRight && handler.moveRight($move);
                    marginLeft = width - maxWidth;
                }
            } else {
                if (marginLeft > 0) {
                    handler.moveLeft && handler.moveLeft($move);
                    marginLeft = 0;
                } else if (marginLeft < width - maxWidth) {
                    handler.moveRight && handler.moveRight($move);
                    marginLeft = width - maxWidth;
                }
            }
            $move.css({
                marginTop: marginTop,
                marginLeft: marginLeft
            });
            handler.moveStep && handler.moveStep();
        }
    });



};
WY.bind('modal-handler-mouse-move', function ($ele, options) {
    WY.showMouseMove({
        content: $ele,
        move: options.move || $ele.find('.move')
    }, options);
});
WY.genealogy = function (options) {
    options = $.extend({
        stepWidth: 150,
        itemWidth: 100,
        itemLeft: 30,
        itemHeight: 120,
        itemMargin: 25,
        itemLeftMargin: 15,
        concatLineColor: '#000',
        concatLineTop: 20,
        stepLineColor: '#eee',
        circleRadius: 5,
        startTop: 100,
        generationLeft: 100
    }, options);
    var editAble = options.editAble;
    var canvas = options.canvas;
    var canvasWidth, canvasHeight = 600;
    var ctx = canvas.getContext('2d');
    var $content = options.content;
    var itemClass = 'person-data-item';
    var editId, autoIndex = 0;

    function item(data, i) {
        this.personName = data.name;
        this.children = [];
        this.prev = [];
        this.id = data.genealogyPersonId;
        this.parentId = data.pId;
        this.childCount = data.childCount;
        var that = this;
        if (!this.parentId) {
            this.isShow = true;
            this.prevLength = 0;
            this.showChildren = true;
            this.level = 1;
            setTimeout(function () {
                that.showChild();
            });
        }
        if (i != null) {
            if (i > autoIndex) autoIndex = i;
        } else {
            i = ++autoIndex;
        }
        this.index = i;
        this.data = data;
        this.ele = $('<div code="' + this.id + '"class="box position-absolute z-index-100 ' + itemClass +
            '" id="' + this.id + '" >');
        // padding: 3px 3px;style="width:150px;height:60px;"
        this.createElement();
    }
    item.list = [];
    item.getById = function (id) {
        var o;
        this.list.every(function (a) {
            if (a.id == id) {
                o = a;
                return false;
            }
            return true;
        });
        return o;
    };
    item.start = function () {
        resetItemObject();
        drawStart();
    };
    item.getByParentId = function (parentId) {
        var o;
        this.list.every(function (a) {
            if (a.id == parentId) {
                o = a;
                return false;
            }
            return true;
        });
        return o;
    };
    item.remove = function (list) {
        list.forEach(function (a) {
            var index = item.list.indexOf(a);
            if (index > -1) {
                item.list.splice(index, 1);
            }
        });
    };
    item.prototype = {
        getLevel: function () {
            if (this.level == null) {
                this.level = this.getParent().getLevel() + 1;
                // if (this.level < 3) {
                if (true) {
                    this.showChildren = true;
                    this.showChild();
                }
            }
            return this.level;
        },
        showChild: function () {
            if (this.childCount && !this.isSearchChild) {
                this.searchChild(function () {
                    item.start();
                });
            }
        },
        searchChild: function (call) {
            if (this.isSearchChild || !this.childCount) {
                return call && call(this.children);
            }
            var that = this;
            options.search(this.id, function (data) {
                that.isSearchChild = true;
                createElement(data);
                call && call(data);
            });
        },
        reset: function () {
            this.childrenLength = 0;
            if (this.parentId) {
                this.isShow = true;
                this.prevLength = null;
            }
            var that = this;
            this.children = this.getChild();
            this.prev = item.list.filter(function (a) {
                return a.parentId == that.parentId && a.index < that.index;
            });
        },
        getChild: function () {
            var that = this;
            return item.list.filter(function (b) {
                return that.id == b.parentId;
            });
        },
        restart: function () {
            this.getLevel();
            var that = this;
            this.createElement();
            this.prevLength = this.getPrevLength();
            this.offsetTop = this.prevLength * (options.itemHeight + options.itemMargin) + options.startTop;
            //             if (that.children.length > 0) {
            //                 this.offsetTop *= that.children.length
            //             }
            this.offsetRight = (this.level - 1) * options.stepWidth + options.itemLeft + options.itemWidth;
            this.offsetLeft = (this.level - 1) * options.stepWidth + options.itemLeft - options.itemLeftMargin;
            this.stepRight = this.level * options.stepWidth;
            this.getParents().every(function (a) {
                if (!a.showChildren) {
                    that.isShow = false;
                    return false;
                }
                return true;
            });
        },
        getPrevLength: function () {
            if (this.prevLength != null) return this.prevLength;
            var len = 0,
                that = this;
            this.getParents().concat(this).forEach(function (a) {
                a.prev.forEach(function (b) {
                    var l = b.findChildLength();
                    // console.log(that.personName, b.personName, 'findChildLength', l);
                    len += l;
                });
            });
            return len;
        },
        getParent: function () {
            if (!this.parentId) return null;
            return item.getByParentId(this.parentId);
        },
        getParents: function () {
            var rt = [],
                parentObj = this.getParent();
            while (parentObj) {
                rt.push(parentObj);
                parentObj = parentObj.getParent();
            }
            return rt;
        },
        findChildren: function () {
            var children = this.children;
            this.children.forEach(function (a) {
                children = children.concat(a.findChildren());
            });
            return children;
        },
        findChildLength: function () {
            if (this.childrenLength) return this.childrenLength;
            if (!this.showChildren || !this.children.length) return 1;
            var len = 0;
            this.children.forEach(function (a) {
                len += a.findChildLength();
            });
            this.childrenLength = len;
            return len;
        },
        createElement: function () {
            this.ele.html('');
            var data = this.data;
            if (!data.pId && belong) {
                this.ele.append('<div  class="fz-12"><span class="cursor-pointer inline-block pr-5 add-item-btn" rel="up">新增</span></div>');
            }
            this.ele.append('<div class="fz-16"><div class="btn btn-small ' + (data.survivalMode == '活' ?
                    'btn-primary' : '') +(data.sex=="男" ? " boy" : " girl")+ '">' +
                '<img class="img-circle .img-responsive" width="28" height="28" src="' + (data.headImg ? imgBase+ data.headImg.replace(imgBase,"")+"_crop_28x28" : "../img/boy.jpg") + '"/>' +
                '<div class="jiapu-name">' + (data.name || "未知") + '</div></div>' +
                '<div class="btn btn-small ' + (data.spouseSurvivalMode == '活' ? 'btn-primary' : '') + (data.sex=="女" ? " boy" : " girl")+
                '"><img class="img-circle .img-responsive" width="28" height="28" src="' + (data.spouseHeadImg ? imgBase+data.spouseHeadImg.replace(imgBase,"")+"_crop_28x28" : "../img/girl.jpg") + '"/>' +
                '<div class="jiapu-name">' + (data.spouseName || "未知") + '</div></div>' +
                '</div>');
            if (belong) {
                this.ele.append('<div class="fz-12">' +
                    '<span class=" cursor-pointer inline-block pr-5 edit-item-btn">编辑</span>' +
                    '<span class="cursor-pointer inline-block pr-5 add-item-btn" rel="down">新增</span>' +
                    ((data.patId == null || data.flagCreator == true) ? '' : '<span class="cursor-pointer inline-block del-item-btn">删除</span>') +
                    '</div>');
            }
        }
    };

    function windowHandler($content, call) {
        $content.find('.submit-btn').click(function () {
            var data = $content.__serializeJSON();
            var valid = useValidate.genealogy.validator(data, 'person');
            if (!valid.valid) {
                useCommon.toast(valid.message);
                return false;
            }
            if (!data.genealogyPersonId) delete data.genealogyPersonId;
            if (isParent && parentId) {
                data.chouseId = parentId;
                data.createType = 'up';
            } else data.chouseId = editId;
            options.edit(data, function (o) {
                if (!parentId) {
                    parentId = o.genealogyPersonId;
                }
                if (data.createType === 'up') {
                    location.reload();
                    return;
                }
                $.modalLoadingHide();
                call && call(o);
            });
        });
    }
    $content.on("click",".btn",function (e) {
        e.stopPropagation();
        var itemClick = $(this).closest("[code]");
        editId = itemClick.attr("code");
        var obj = item.getById(editId);
        var left =parseInt(itemClick.css("left")) ;
        var top = parseInt(itemClick.css("top")) +itemClick.height();
        kyoPopupMenu.user = obj;
        kyoPopupMenu.id = editId;
        obj = obj.data;
        var  index = $(this).index();
        kyoPopupMenu.index =index;
        kyoPopupMenu.memorialId = index ==0 ? obj.memorialId : obj.spouseMemorialId;
        kyoPopupMenu.phone = index == 0 ? obj.phone : obj.spousePhone;
        kyoPopupMenu.name =  index == 0 ? obj.name : obj.spouseName;
        kyoPopupMenu.sys().css({left: left,top: top}).show();
        return false;
    });

    //编辑
    $content.on("click", '.edit-item-btn', function (e) {
        e.stopPropagation();
        editId = $(this).closest('[code]').attr('code');
        var itemObj = item.getById(editId);
        editSomeOne(itemObj, itemObj.getParent(), editId)
    });
    var dataList = options.dataList;
    var parentObj = dataList && dataList.filter(function (a) {
        return !a.pId;
    }).pop();
    var parentId = parentObj && parentObj.genealogyPersonId;
    var isParent;
    $content.on("click", '.add-item-btn', function (e) {
        e.stopPropagation();
        editId = $(this).closest('[code]').attr('code');
        var itemObj = item.getById(editId);
        addSomme(itemObj, itemObj.getParent(), $(this).attr("rel"))
    });
    //删除
    $content.on("click", '.del-item-btn', function (e) {
        e.stopPropagation();
        editId = $(this).closest('[code]').attr('code');
        var btnArray = ['否', '是'];
        mui.confirm('确定删除此成员及后代？', '删除', btnArray, function (e) {
            if (e.index == 1) {
                $.ajax({
                    headers: {
                        tokenInfo: window.localStorage.getItem("tokenInfo")
                    },
                    type: "POST",
                    url: urlBase + "/api/pedigreePerson/delete",
                    data: {
                        pedigreePersonId: editId
                    },
                    success: function (res) {
                        if (res.code == "SUCCESS") {
                            mui.alert(res.message, function () {
                                location.reload();
                            });
                        } else {
							mui.toast(res.message)
                        }
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });

            }

        })
    });

    //转化数据结构
    function setWidth(width) {
        if (canvasWidth != width) {
            canvasWidth = width;
            $(canvas).attr({
                width: width
            });
            $content.width(width);
        }
    }

    function setHeight(height) {
        if (canvasHeight != height) {
            canvasHeight = height;
            $(canvas).attr({
                height: height
            });
            $content.height(height);
        }
    }

    function drawStep(str, i) {
        //         var $step = $('<div class="height-40 width-150 lh-40 fz-16 back-black-1 color-white text-center position-absolute z-index-1 top-0 mt-10">第'+str+'代</div>')
        //         $step.css({
        //             top:i * options.stepWidth + options.generationLeft
        //         });
        //         $content.append($step);
        if (i) {
            ctx.moveTo(0, i * options.stepWidth);
            ctx.lineTo(canvasWidth, i * options.stepWidth);
            ctx.stroke();
        }
    }

    function createElement(data) {
        data.forEach(function (a, i) {
            item.list.push(new item(a, i));
        });
    }
    // 辈代数
    var allGeneration = 0,
        allHeightLength = 0;

    function resetItemObject() {
        allGeneration = 0;
        allHeightLength = 0;
        item.list.forEach(function (a) {
            a.reset();
        });
        item.list.forEach(function (a) {
            a.restart();
            if (a.level > allGeneration) allGeneration = a.level + 1;
            if (a.prevLength > allHeightLength) allHeightLength = a.prevLength;
        });
        // if (allGeneration < 7) allGeneration = 7;
    }


    function drawStart() {
        $content.find('.' + itemClass).hide();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        setHeight(options.stepWidth * allGeneration);
        setWidth(options.stepWidth * maxLength/3*2);
        $(".show-canvas-content").height($(window).height());
        ctx.strokeStyle = options.stepLineColor;
        for (var i = 1; i <= allGeneration; i++) {
            var str = i;
            drawStep(str, i - 1);
        }
        ctx.beginPath();
        ctx.strokeStyle = options.concatLineColor;
        item.list.forEach(function (a, index) {
            if (!a.isShow) return;
            a.ele.css({
                top: (a.level - 1) * options.stepWidth + options.itemLeft,
                left: a.offsetTop - options.itemHeight / 2 - options.circleRadius
            }).show();
            $content.append(a.ele);
            if (a.showChildren && a.children.length) {
                var level = a.offsetTop + options.concatLineTop;
                // var level = getLeft(a, index)
                level = (a.children[a.children.length - 1].offsetTop + a.offsetTop) / 2 + options.concatLineTop;
                a.ele.css({
                    left: level - options.itemHeight / 2 - options.circleRadius
                }).show();
                if (a.data.flagCreator) {
                    jQuery('.show-canvas-content').animate({
                        scrollTop: parseInt(a.ele.css("top"))  -$(window).height()/2 +a.ele.height()
                        ,scrollLeft:parseInt(a.ele.css("left")) - $(window).width()/2 + a.ele.width()/2
                    }, 0);
                }
                ctx.moveTo(level, a.offsetRight - 20);
                ctx.lineTo(level, a.stepRight);
                //console.log(a.offsetRight, a.stepRight)
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(level, a.stepRight);
                a.children.forEach(function (b) {
                    var levelB = (b.offsetTop + options.concatLineTop);
                    if (b.children.length) {
                        levelB = (b.children[b.children.length - 1].offsetTop + b.offsetTop) / 2 + options.concatLineTop;
                    }

                    ctx.lineTo(levelB, a.stepRight);
                    ctx.lineTo(levelB, b.offsetLeft - options.circleRadius * 2);
                    // console.log("b",levelB,a.stepRight,b.offsetLeft)
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(levelB, b.offsetLeft - options.circleRadius, options.circleRadius, 0,
                        Math.PI * 2);
                    ctx.stroke();
                    ctx.moveTo(levelB, a.stepRight);
                });

            }else{
                if (a.data.flagCreator) {
                    jQuery('.show-canvas-content').animate({
                        scrollTop: parseInt(a.ele.css("top"))  -$(window).height()/2 +a.ele.height()
                        ,scrollLeft:parseInt(a.ele.css("left")) - $(window).width()/2 + a.ele.width()/2
                    }, 0);
                }
				var parent = a.getParent();
				if(parent && parent.children.length == 1){
					a.ele.css("left",parent.ele.css("left"))
				}
			}
        });

    }
    createElement(dataList);
    resetItemObject();
    drawStart();
};

var kyoPopupMenu={};
kyoPopupMenu = (function(){
    return {
        sys: function (obj) {
            $('.popup_menu').remove();
            popupMenuApp =
                $('<div class="popup_menu app-menu"><ul><li><a menu="menu1">人物视觉</a></li><li><a menu="menu2">个人信息</a></li><li><a menu="menu3">纪念馆</a></li></ul></div>').
                find('a').attr('href','javascript:;').end().appendTo('.position-relative');
            //绑定事件
            $('.app-menu a[menu="menu1"]').on('click', function (){
                var phone = kyoPopupMenu.phone;
                if (phone) {
                    getDataFromServer("/api/pedigreePerson/people_perspective",{phone:phone},function (res) {
                        if (res.result){
                            location.href = "editship.html?pedigreeId="+res.result;
                        }else {
                            mui.alert(kyoPopupMenu.name +"还没有创建人物视角");
                        }
                    },function (error) {
                        console.log(error);
                    })
                }else {
                    mui.alert(kyoPopupMenu.name +"还没有创建人物视角");
                }
            });
            $('.app-menu a[menu="menu2"]').on('click', function (){
                showSomeOne(kyoPopupMenu.user,kyoPopupMenu.index);
            });
            $('.app-menu a[menu="menu3"]').on("click",function () {
                if (!kyoPopupMenu.memorialId){
                    mui.alert(kyoPopupMenu.name +"还没有创建纪念馆");
                }else {
                    goJiNianGuan(kyoPopupMenu.memorialId);
                }
            });
            return popupMenuApp;
        },
        user:null,
        id:null
    }})();
//取消右键
$('.show-canvas-content').on('click', function (){return false;}).click(function(){
    kyoPopupMenu.user=null;
    kyoPopupMenu.id=null;
    $('.popup_menu').hide();
});