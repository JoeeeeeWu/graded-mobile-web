

//页面载入时

function LoadPages() {
    this.bImgLoad = false;
    this.bTime = false;
    this.picList = $(".picList");
    this.oWelcomePage = $("#welcome");
    this.init();
    this.bind();
}

LoadPages.prototype.isImgLoad = function () {
    var _this = this;
    var aPicUrl = ["image/1.jpg", "image/2.jpg", "image/3.jpg", "image/4.jpg", "image/5.jpg"];
    for (var i = 0; i < aPicUrl.length; i++) {
        (function () {
            var img = new Image();
            img.src = aPicUrl[i];
            img.onload = function () {
                _this.picList.html(function(index,oldHtml){
                    return oldHtml + '<li><img src=\"' + img.src + '\" alt=\"poster\"></li>';
                });
                if (i = aPicUrl.length - 1) {
                    _this.bImgLoad = true;
                }
            };
        })(i);
    }
}

LoadPages.prototype.isTimeout = function () {
    var _this = this;
    var iTime = new Date().getTime();
    var oTimer = setInterval(function () {
        if (new Date().getTime() - iTime >= 3500) {
            _this.bTime = true;
        }
        if (_this.bImgLoad && _this.bTime) {
            clearInterval(oTimer);
            _this.oWelcomePage.animate({
                "opacity" : 0
            },500,"ease-in");
            if (!Carousel.bExist) {
                new Carousel("tabPic");
                Carousel.bExist = true;
            }
            Score.bExist = false;
            if (!Score.bExist) {
                new Score();
                Score.bExist = true;
            }
            NextPage.isExist = false;
            if (!NextPage.isExist) {
                new NextPage();
                NextPage.isExist = true;
            }
        }
    }, 1000);
}

LoadPages.prototype.bind = function () {
    this.oWelcomePage.on("webkitTransitionEnd",function(){
        this.oWelcomePage.removeClass("pageShow");
    }.bind(this));
    this.oWelcomePage.on("transitionend",function(){
        this.oWelcomePage.removeClass("pageShow");
    }.bind(this));
}

LoadPages.prototype.init = function () {
    this.isImgLoad();
    this.isTimeout();
}

new LoadPages();

//首页轮播

function Carousel(cls) {
    this.oTab = $("#"+cls);
    this.oList = this.oTab.find('.picList');
    this.aNav = this.oTab.find("nav").children();
    this.iNow = 0;
    this.iX = 0;
    this.iW = document.documentElement.clientWidth;
    this.iStartTouchX = 0;
    this.iStartX = 0;
    this.oTimer = null;
    this.init();
    this.bind();
}

Carousel.bExist = false;

Carousel.prototype.autoPlay = function () {
    var _this = this;
    this.oTimer = setInterval(function () {
        _this.iNow++;
        _this.iNow = _this.iNow % _this.aNav.length;
        _this.switchImg();
    }, 2000);
};

Carousel.prototype.switchImg = function () {
    this.iX = -this.iNow * this.iW;
    this.oList.animate({
        "transform" : "translateX(" + this.iX + "px)"
    },500,"ease-in");
    for (var i = 0; i < this.aNav.length; i++) {
        this.aNav.eq(i).removeClass("active");
    }
    this.aNav.eq(this.iNow).addClass("active");
}

Carousel.prototype.start = function (ev) {
    ev = ev.changedTouches[0];
    this.iStartTouchX = ev.pageX;
    this.iStartX = this.iX;
    clearInterval(this.oTimer);
}

Carousel.prototype.move = function (ev) {
    ev = ev.changedTouches[0];
    var iDis = ev.pageX - this.iStartTouchX;
    this.iX = this.iStartX + iDis;
    this.oList.animate({
        "transform" : "translateX(" + this.iX + "px)"
    },0);
}

Carousel.prototype.end = function (ev) {
    this.iNow = -Math.round(this.iX / this.iW);
    if (this.iNow < 0) {
        this.iNow = 0;
    }
    if (this.iNow > this.aNav.length - 1) {
        this.iNow = this.aNav.length - 1;
    }
    this.iNow = this.iNow % this.aNav.length;
    this.switchImg();
    this.autoPlay();
}

Carousel.prototype.init = function () {
    this.autoPlay();
}

Carousel.prototype.bind = function () {
    this.oTab.on({
        "touchstart" : this.start.bind(this),
        "touchmove" : this.move.bind(this),
        "touchend" : this.end.bind(this)
    })
}

//评分

function Score() {
    this.arr = ["好失望", "没有想象的那么好", "很一般", "良好", "棒极了"];
    this.oScore = $("#score");
    this.aLi = this.oScore.find("li");
    this.setScore();
}

Score.prototype.setScore = function () {
    var _this = this;
    for (var i = 0; i < this.aLi.length; i++) {
        this.setStar(this.aLi.eq(i))
    }
}

Score.prototype.setStar = function (obj) {
    var _this = this;
    var aNav = obj.find("a");
    var oInput = obj.find("input");
    for (var i = 0; i < aNav.length; i++) {
        aNav.eq(i).on("touchstart",function () {
            for (var i = 0; i < aNav.length; i++) {
                if (i <= $(this).index()) {
                    aNav.eq(i).addClass("active");
                } else {
                    aNav.eq(i).removeClass("active");
                }
            }
            oInput.val(_this.arr[$(this).index()]);
        })
    }
}

//消息提醒

function Info(obj, str) {
    this.obj = obj;
    this.str = str;
    this.init();
}

Info.prototype.showInfo = function () {
    this.obj.html(this.str);
    this.obj.animate({
        "transform" : "scale(1)",
        "opacity" : 1
    },500,"ease-out")
}

Info.prototype.hideInfo = function () {
    var _this = this;
    setTimeout(function () {
        _this.obj.animate({
            "transform" : "scale(0)",
            "opacity" : 0
        },500,"ease-in");
    }, 1500);
}

Info.prototype.init = function () {
    this.showInfo();
    this.hideInfo();
}

//切换页面

function NextPage() {
    this.bScore = false;
    this.bTag = false;
    this.oIndex = $("#index");
    this.oScore = $("#score");
    this.oTag = $("#indexTag");
    this.aTagInput = this.oTag.find("input");
    this.aScoreInput = this.oScore.find("input");
    this.oInfo = this.oIndex.find(".info");
    this.oBtn = this.oIndex.find(".btn");
    this.oMask = $("#mask");
    this.oNews = $("#news");
    this.bind();
}

NextPage.prototype.shouldSwitch = function () {
    this.bScore = this.isScoreChecked();
    this.bTag = this.isTag();
    if (this.bScore) {
        if (this.bTag) {
            this.turnPage();
        } else {
            new Info(this.oInfo, "给景区添加标签");
        }
    } else {
        new Info(this.oInfo, "给景区评分");
    }
}

NextPage.prototype.isScoreChecked = function () {
    for (var i = 0; i < this.aScoreInput.length; i++) {
        if (this.aScoreInput.eq(i).val() == 0) {
            return false;
        }
    }
    return true;
}

NextPage.prototype.isTag = function () {
    for (var i = 0; i < this.aTagInput.length; i++) {
        if (this.aTagInput.eq(i).prop("checked")) {
            return true;
        }
    }
    return false;
}

NextPage.prototype.bind = function () {
    this.oBtn.on("tap",this.shouldSwitch.bind(this));
}

NextPage.prototype.turnPage = function () {
    var _this = this;
    this.oMask.addClass("pageShow");
    this.oNews.addClass("pageShow")
    setTimeout(function () {
        _this.oMask.animate({
            "opacity" : 1
        },500);
        _this.oIndex.animate({
            "filter" : "blur(5px)"
        },500);
    }, 20);
    setTimeout(function () {
         _this.oMask.animate({
            "opacity" : 0
        },500);
         _this.oIndex.animate({
            "filter" : "blur(0)"
        },500);
        _this.oNews.animate({
            "opacity" : 1
        });
        _this.oMask.removeClass("pageShow");
    }, 3000);
    if (!News.isExist) {
        new News();
        News.isExist = true;
    }
}

//新闻

function News() {
    this.oNews = $("#news");
    this.oForm = $("#form");
    this.oInfo = this.oNews.find(".info");
    this.aInput = this.oNews.find("input");
    this.bind();
}

News.isExist = false;

News.prototype.bind = function () {
    var _this = this;
    this.aInput.eq(0).on("change",function () {
        if (this.files[0].type.split("/")[0] == "video") {
            _this.turnPage();
            this.value = "";
        } else {
            new Info(_this.oInfo, "请上传视频！")
        }
    });
    this.aInput.eq(1).on("change",function () {
        if (this.files[0].type.split("/")[0] == "image") {
            _this.turnPage();
            this.value = "";
        } else {
            new Info(_this.oInfo, "请上传图片！")
        }
    })
}

News.prototype.turnPage = function () {
    this.oForm.addClass("pageShow");
    this.oNews.animate({
        "opacity" : 0
    });
    this.oNews.removeClass("pageShow");
    if (!Form.isExist) {
        new Form();
        Form.isExist = true;
    }
}

//表单

function Form() {
    this.oOver = $("#over");
    this.oForm = $("#form");
    this.oBtn = this.oForm.find(".btn");
    this.aFormTag = $("#formTag").find("label");
    this.isTag = false;
    this.bind();
}

Form.isExist = false;

Form.prototype.touchTag = function () {
    var _this = this;
    for (var i = 0; i < this.aFormTag.length; i++) {
        this.aFormTag.eq(i).on("tap",function () {
            _this.isTag = true;
            _this.oBtn.addClass("submit");
        })
    }
}

Form.prototype.touchBtn = function () {
    var _this = this;
    this.oBtn.on("tap",function () {
        if (_this.isTag) {
            for (var i = 0; i < _this.aFormTag.length; i++) {
                _this.aFormTag.eq(i).find("input").prop("checked",false);
            }
            _this.isTag = false;
            _this.oOver.addClass("pageShow");
            _this.oForm.removeClass("pageShow");
            _this.oBtn.removeClass("submit");
            if (!Reset.isExist) {
                new Reset();
                Reset.isExist = true;
            }
        }
    })
}


Form.prototype.bind = function () {
    this.touchTag();
    this.touchBtn();
}

//重新评价

function Reset() {
    this.oOver = $("#over");
    this.oBtn = this.oOver.find(".btn");
    this.clickBtn();
}

Reset.isExist = false;

Reset.prototype.clickBtn = function () {
    var _this = this;
    this.oBtn.on("tap",function () {
        _this.oOver.removeClass("pageShow");
    })
}