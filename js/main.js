document.body.style.height = document.documentElement.clientHeight + 'px';

//页面载入时

function LoadPages() {
    this.bImgLoad = false;
    this.bTime = false;
    this.picList = document.getElementsByClassName("picList")[0];
    this.oWelcomePage = id("welcome");
    this.init();
    this.bind();
}

LoadPages.prototype.isImgLoad = function () {
    var _this = this;
    var aPicUrl = ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg"];
    for (var i = 0; i < aPicUrl.length; i++) {
        (function () {
            var img = new Image();
            img.src = aPicUrl[i];
            img.onload = function () {
                _this.picList.innerHTML += '<li><img src=\"' + img.src + '\" alt=\"poster\"></li>';
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
            _this.oWelcomePage.style.opacity = 0;
            Carousel.bExist = false;
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
    addEvent(this.oWelcomePage, "webkitTransitionEnd", function () {
        removeClass(this.oWelcomePage, "pageShow")
    }.bind(this));
    addEvent(this.oWelcomePage, "transitionend", function () {
        removeClass(this.oWelcomePage, "pageShow")
    }.bind(this));
}

LoadPages.prototype.init = function () {
    this.isImgLoad();
    this.isTimeout();
}

new LoadPages();

//首页轮播

function Carousel(cls) {
    this.oTab = id(cls);
    this.oList = this.oTab.getElementsByClassName('picList')[0];

    this.aNav = this.oTab.getElementsByTagName("nav")[0].children;
    this.iNow = 0;
    this.iX = 0;
    this.iW = document.documentElement.clientWidth;
    this.iStartTouchX = 0;
    this.iStartX = 0;
    this.oTimer = null;
    this.init();
    this.bind();
}

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
    this.oList.style.transition = "0.5s";
    this.oList.style.WebkitTransform = this.oList.style.transform = "translateX(" + this.iX + "px)";
    for (var i = 0; i < this.aNav.length; i++) {
        removeClass(this.aNav[i], "active");
        addClass(this.aNav[this.iNow], "active");
    }
}

Carousel.prototype.start = function (ev) {
    this.oList.style.transition = "none";
    ev = ev.changedTouches[0];
    this.iStartTouchX = ev.pageX;
    this.iStartX = this.iX;
    clearInterval(this.oTimer);
}

Carousel.prototype.move = function (ev) {
    ev = ev.changedTouches[0];
    var iDis = ev.pageX - this.iStartTouchX;
    this.iX = this.iStartX + iDis;
    this.oList.style.WebkitTransform = this.oList.style.transform = "translateX(" + this.iX + "px)";
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
    addEvent(this.oTab, "touchstart", this.start.bind(this));
    addEvent(this.oTab, "touchmove", this.move.bind(this));
    addEvent(this.oTab, "touchend", this.end.bind(this));
}

//评分

function Score() {
    this.arr = ["好失望", "没有想象的那么好", "很一般", "良好", "棒极了"];
    this.oScore = id("score");
    this.aLi = this.oScore.getElementsByTagName("li");
    this.setScore();
}

Score.prototype.setScore = function () {
    var _this = this;
    for (var i = 0; i < this.aLi.length; i++) {
        this.setStar(this.aLi[i])
    }
}

Score.prototype.setStar = function (obj) {
    var _this = this;
    var aNav = obj.getElementsByTagName("a");
    var oInput = obj.getElementsByTagName("input")[0];
    for (var i = 0; i < aNav.length; i++) {
        aNav[i].index = i;
        addEvent(aNav[i], "touchstart", function () {
            for (var i = 0; i < aNav.length; i++) {
                if (i <= this.index) {
                    addClass(aNav[i], "active");
                } else {
                    removeClass(aNav[i],
                        "active");
                }
            }
            oInput.value = _this.arr[this.index];
        });
    }
}

//消息提醒

function Info(obj, str) {
    this.obj = obj;
    this.str = str;
    this.init();
}

Info.prototype.showInfo = function () {
    this.obj.innerHTML = this.str;
    this.obj.style.WebkitTransform = "scale(1)";
    this.obj.style.transform = "scale(1)";
    this.obj.style.opacity = 1;
}

Info.prototype.hideInfo = function () {
    var _this = this;
    setTimeout(function () {
        _this.obj.style.WebkitTransform = "scale(0)";
        _this.obj.style.transform = "scale(0)";
        _this.obj.style.opacity = 0;
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
    this.oIndex = id("index");
    this.oScore = id("score");
    this.oTag = id("indexTag");
    this.aTagInput = this.oTag.getElementsByTagName("input");
    this.aScoreInput = this.oScore.getElementsByTagName("input");
    this.oInfo = this.oIndex.getElementsByClassName("info")[0];
    this.oBtn = this.oIndex.getElementsByClassName("btn")[0];
    this.oMask = id("mask");
    this.oNews = id("news");
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
        if (this.aScoreInput[i].value == 0) {
            return false;
        }
    }
    return true;
}

NextPage.prototype.isTag = function () {
    for (var i = 0; i < this.aTagInput.length; i++) {
        if (this.aTagInput[i].checked) {
            return true;
        }
    }
    return false;
}

NextPage.prototype.bind = function () {
    addEvent(this.oBtn, "touchend", this.shouldSwitch.bind(this));
}

NextPage.prototype.turnPage = function () {
    var _this = this;
    addClass(this.oMask, "pageShow");
    addClass(this.oNews, "pageShow");
    setTimeout(function () {
        _this.oMask.style.opacity = 1;
        _this.oIndex.style.WebkitFilter = "blur(5px)";
        _this.oIndex.style.filter = "blur(5px)";
    }, 20);
    setTimeout(function () {
        _this.oNews.style.transition = "0.5s";
        _this.oMask.style.opacity = 0;
        _this.oIndex.style.WebkitFilter = "blur(0px)";
        _this.oIndex.style.filter = "blur(0px)";
        _this.oNews.style.opacity = 1;
        removeClass(_this.oMask, "pageShow");
    }, 3000);
    News.isExist = false;
    if (!News.isExist) {
        new News();
        News.isExist = true;
    }
}

//新闻

function News() {
    this.oNews = id("news");
    this.oForm = id("form");
    this.oInfo = this.oNews.getElementsByClassName("info")[0];
    this.aInput = this.oNews.getElementsByTagName("input");
    this.bind();
}

News.prototype.bind = function () {
    var _this = this;
    this.aInput[0].onchange = function () {
        if (this.files[0].type.split("/")[0] == "video") {
            _this.turnPage();
            this.value = "";
        } else {
            new Info(_this.oInfo, "请上传视频！")
        }
    }
    this.aInput[1].onchange = function () {
        if (this.files[0].type.split("/")[0] == "image") {
            _this.turnPage();
            this.value = "";
        } else {
            new Info(_this.oInfo, "请上传图片！")
        }
    }
}

News.prototype.turnPage = function () {
    addClass(this.oForm, "pageShow");
    this.oNews.style.cssText = "";
    removeClass(this.oNews, "pageShow");
    Form.isExist = false;
    if (!Form.isExist) {
        new Form();
        Form.isExist = true;
    }
}

//表单

function Form() {
    this.oOver = id("over");
    this.oForm = id("form");
    this.oBtn = this.oForm.getElementsByClassName("btn")[0];
    this.aFormTag = id("formTag").getElementsByTagName("label");
    this.isTag = false;
    this.bind();
}

Form.prototype.touchTag = function () {
    var _this = this;
    for (var i = 0; i < this.aFormTag.length; i++) {
        addEvent(this.aFormTag[i], "touchend", function () {
            _this.isTag = true;
            addClass(_this.oBtn, "submit");
        })
    }
}

Form.prototype.touchBtn = function () {
    var _this = this;
    addEvent(this.oBtn, "touchend", function () {
        if (_this.isTag) {
            for (var i = 0; i < _this.aFormTag.length; i++) {
                _this.aFormTag[i].getElementsByTagName("input")[0].checked = false;
            }
            _this.isTag = false;
            addClass(_this.oOver, "pageShow");
            removeClass(_this.oForm, "pageShow");
            removeClass(_this.oBtn, "submit");
            Reset.isExist = false;
            if (!Reset.isExist) {
                new Reset();
                Reset.isExist = true;
            }
        }
    });
}


Form.prototype.bind = function () {
    this.touchTag();
    this.touchBtn();
}

//重新评价

function Reset() {
    this.oOver = id("over");
    this.oBtn = this.oOver.getElementsByClassName("btn")[0];
    this.clickBtn();
}

Reset.prototype.clickBtn = function () {
    var _this = this;
    addEvent(this.oBtn, "touchend", function () {
        removeClass(_this.oOver, "pageShow");
    })
}