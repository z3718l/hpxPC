hpxAdminApp.controller('handWritingController', function ($location, $rootScope, $scope, $state, $stateParams, $http, billService, FILE_URL) {
    //1.修改鼠标移出canvas页面,移回到canvas无反应  2016.10.28
    //2.移除无用函数  2016.10.28
    //3.通过input暴露图片地址 2016.10.28
    var bill_id = $location.search().billid;
    var type = $location.search().type;

    var curRotate = 0;

    var canvasWidth = 800;			//定义canvas宽高
    var canvasHeight = 800;

    var isMouseDown = false;			//检测按下鼠标动作
    var lastLoc = {x: 0, y: 0};		//上一次的坐标

    var canvas = document.getElementById("canvas");		//获取canvas对象
    var context = canvas.getContext("2d");			//取得图形上下文
    var mosicIndex = 0;                 //当前灰度索引
    var mosicLevel = 30;                //灰度的层级
    var oldStartX = oldStartY = -1;
    canvas.width = canvasWidth;			//定义canvas宽高
    canvas.height = canvasHeight;

    $scope.size = 15;


    var pencil = $scope.pencil = {
        thickness: 30,
        color: 'rgba(0,0,0,0)'
    };


    function initProgress() {
        $scope.progressInfo = "保存中...";

        $scope.progressStyle = {
            "width": "2%"
        };
    }

    var image = new Image();
    image.crossOrigin = '*';

    initImage();
    function initImage() {
        if ($stateParams.data == null) return;
        var model = $stateParams.data.model;
        var type = $stateParams.data.type;
        console.log($stateParams);

        $scope.imgUrl = type == 0 ? model.bill_front_photo_path : model.bill_back_photo_path;
        //image = document.getElementById("originImg");
        image.src = $scope.imgUrl + "?" + new Date().getTime();
        //image.crossOrigin = "Anonymous";

        image.onload = function () {
            context.drawImage(image, 0, 0, canvasWidth, canvasHeight);		//绘制图像
        }
    }

    //当鼠标在外部并且松开的时候
    $("body").mouseup(function () {
        isMouseDown = false;
    });

    //鼠标左键按下事件
    canvas.onmousedown = function (e) {
        e.preventDefault();
        isMouseDown = true;

        lastLoc = windowToCanvas(e.clientX, e.clientY);
    };
    //鼠标左键松开事件
    canvas.onmouseup = function (e) {
        e.preventDefault();
        isMouseDown = false;
    };
    //鼠标移动事件
    canvas.onmousemove = function (e) {
        e.preventDefault();
        if (isMouseDown) {
            var size = $scope.size;
            var curLoc = windowToCanvas(e.clientX, e.clientY);
            //var pixelData = context.getImageData(curLoc.x, curLoc.y, Math.abs(lastLoc.x-curLoc.x),Math.abs(lastLoc.y-curLoc.y));    // 获得区域数据
            var r = g = b = 0;
            var s = "";
            var startX = startY = 0;

            startX = parseInt(curLoc.x / size) * size;
            startY = parseInt(curLoc.y / size) * size;
            if (oldStartX != startX || oldStartY != startY)
            {
                r = g = b = mosicIndex * mosicLevel + 80;
                mosicIndex = (mosicIndex + 1) % 6;
                s = 'rgb(' + r + ',' + g + ',' + b + ')';
                context.fillStyle = s;
                context.fillRect(startX, startY, size, size);
                oldStartX = startX;
                oldStartY = startY;
            }

            //for (i = 0; i < pixelData.height; i+=size) {
            //    for (j = 0; j < pixelData.width; j+=size) {
            //        var x = i * 4 * pixelData.width + j * 4;
            //        r = pixelData.data[x];
            //        g = pixelData.data[x + 1];
            //        b = pixelData.data[x + 2];
            //        context.fillStyle = s;
            //        context.fillRect(startX+j, startY+i, size, size);
            //    }
            //}
            //r = parseInt(r / (size * size));
            //g = parseInt(g / (size * size));
            //b = parseInt(b / (size * size));
            //context.beginPath();
            //context.moveto(curLoc.x, curLoc.y);
            //context.lineTo(curLoc.x, curLoc.y);			//从起始位置创建到当前位置的一条线
            //context.strokeStyle = pencil.color;			//设置笔触的颜色
            //context.stroke();
            ////context.fillStyle = pencil.color;
            // 此处增加获取平均颜色
            //context.fillStyle = s;
            //context.fillRect(curLoc.x, curLoc.y, size, size);

            // 马赛克效果


            //var curLoc = windowToCanvas(e.clientX, e.clientY);

            //绘制涂抹 老的代码
            //context.beginPath();
            //context.moveTo(lastLoc.x, lastLoc.y);		//移动到起始位置
            //context.lineTo(curLoc.x, curLoc.y);			//从起始位置创建到当前位置的一条线

            //context.strokeStyle = pencil.color;			//设置笔触的颜色
            //context.lineWidth = pencil.thickness;			//只设置这一项，出现类似毛边的情况
            //context.lineCap = "round";		//绘制圆形结束线帽
            //context.lineJoin = "round";		//当两条线交汇的时候创建边角的类型
            //context.stroke();
            //context.fillRect(curLoc.x,curLoc.y,5,5);

            lastLoc = curLoc;
        }
    };
    function windowToCanvas(x, y) {				//计算canvas上面的坐标
        var point = canvas.getBoundingClientRect();			//元素边框距离页面的距离

        x = Math.round(x - point.left);
        y = Math.round(y - point.top);
        return {x: x, y: y};
    }

    $scope.saveImage = function(){
        $scope.save(0);
    };
    $scope.replaceImage = function(){
        $scope.save(1);
    };
    $scope.save = function (type) {
        initProgress();

        $("#progressModal").modal('show');

        // 获取Base64编码后的图像数据，格式是字符串
        // 后面的部分可以通过Base64解码器解码之后直接写入文件。
        var data_url = canvas.toDataURL("image/png");
        var blob = dataURLtoBlob(data_url);
        var fileName;
        if(type == 0){
            fileName = getEndorsementFileName($scope.imgUrl);
        }else{
            fileName = $scope.imgUrl;
        }
        var fd = new FormData();
        fd.append("file", blob, fileName);
        var xhr;
        if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE 6 and older
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.addEventListener('load', onLoadHandler, false);
        xhr.upload.addEventListener('progress', $scope.onProgressHandler, false);
        xhr.open('POST', FILE_URL + '/fileWithName', true);
        xhr.send(fd);

    };

    var onLoadHandler = function (event) {
        if (this.status == 200 || this.status == 304) {
            //var result = JSON.parse(this.responseText);
            //alert("保存成功");
        }
    };

    $scope.onProgressHandler = function (event) {
        if (event.lengthComputable) {
            var percentComplete = parseInt(event.loaded / event.total * 100) + "%";
            $scope.progressStyle.width = percentComplete;
            if (event.loaded == event.total) {
                console.log("保存成功");
                $scope.progressInfo = "保存成功";
                //保存成功后续处理
                afterSave();
            }
            $scope.$apply();
        }
    };

    function afterSave() {
        $("#progressModal").modal('hide');
        var data = {
            bill: $stateParams.data.model
        };
        $state.go('app.constants.checkBill', {data: data});
    }

    $scope.resetCanvas = function () {
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    //获取背书对应的文件名称
    function getEndorsementFileName(imgUrl) {
        var url = imgUrl.split("/");
        var preNames = url[url.length - 1].split(".");
        return preNames[0] + "-1." + preNames[1];
    }

    //顺时针旋转
    $scope.clockwise = function() {
        console.log(curRotate);
        curRotate = curRotate + 1;
        refreshImg();
    };

    //逆时针旋转
    $scope.eastern = function() {
        console.log(curRotate);
        curRotate = curRotate - 1;
        refreshImg();
    };

    function refreshImg() {
        context.save();
        var rotation = curRotate * Math.PI / 2;
        context.clearRect(0,0,canvasWidth,canvasHeight)
        context.translate(canvasWidth/2,canvasHeight/2);
        context.rotate(rotation);
        context.translate(-canvasWidth/2,-canvasHeight/2);
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        context.restore();//恢复状态
    }
});