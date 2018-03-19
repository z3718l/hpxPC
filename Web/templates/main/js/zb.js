function onlyNumber(input, n) {
    input.value = input.value.replace(/[^0-9\.]/ig, '');
    var dotIdx = input.value.indexOf('.'), dotLeft, dotRight;
    if (dotIdx >= 0) {
        dotLeft = input.value.substring(0, dotIdx);
        dotRight = input.value.substring(dotIdx + 1);
        if (dotRight.length > n) {
            dotRight = dotRight.substring(0, n);
        }
        input.value = dotLeft + '.' + dotRight;
    }
}
     
