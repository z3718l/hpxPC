 //function onlyNumber(input, n) {
 //    input.value = input.value.replace(/[^0-9\d{1}.]/ig, '');
 //          var dotIdx = input.value.indexOf('.'), dotLeft, dotRight;
 //          if (dotIdx >= 0) {
 //              dotLeft = input.value.substring(0, dotIdx);
 //              dotRight = input.value.substring(dotIdx + 1);
 //              if (dotRight.length > n) {
 //                  dotRight = dotRight.substring(0, n);
 //              }
 //              input.value = dotLeft + '.' + dotRight;
 //          }
 //      }

function checkInt(n, max) {
    var regex = /^\d+$/;
    if (regex.test(n)) {
        if (n < max && n > 0) {
            alert("输入正确")
        } else {
            alert("这不是小于" + max + "的正整数！1请重新输入！")
        }
    } else {
        alert("请输入小于100的正整数");
    }
}


 function onlyNumber(input, n) {
 
     input.value = input.value.replace(/[^0-9\.]/ig, '');
     var dotIdx = input.value.indexOf('.'), dotLeft, dotRight;
     if (input.value >= 100) {
         input.value = 99.999;
     }else
     if (dotIdx >= 0) {
         dotLeft = input.value.substring(0, dotIdx);
             dotRight = input.value.substring(dotIdx + 1);
             if (dotRight.length > n) {
                 dotRight = dotRight.substring(0, n);
             }
             input.value = dotLeft + '.' + dotRight;
         

     }
 }
