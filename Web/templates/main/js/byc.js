var snum = sessionStorage.getItem('gnum')
    $(".a").click(function(){
        if($(".al").css("display")=="none"){
            $(".al").slideDown();
            $(".b,.c,.d,.b1,.c1,dl,.e").slideUp();

        }else{
            $(".al").slideUp();
            $(".b,.a,.c,.d,.e").slideDown();
        }
    })
    $(".b").click(function(){
        if($(".bl").css("display")=="none"){
            $(".bl").slideDown();
            $(".al,.a,.c,.c1,.d,.d1,.e").slideUp();
        }else{
            $(".bl").slideUp();
            $(".a,.c,.d,.e").slideDown();
        }
    });
    $(".c").click(function(){
        if($(".cl").css("display")=="none"){
            $(".cl").slideDown();
            $(".al,.a,.bl,.b,.d1,.d,.e").slideUp();
        }else{
            $(".cl").slideUp();
            $(".a,.b,.d,.e").slideDown();
        }
    });
    $(".d").click(function(){
        if($(".dl").css("display")=="none"){
            $(".dl").slideDown();
            $(".al,.a,.bl,.b,.c,.c1,.e").slideUp();
        }else{
            $(".dl").slideUp();
            $(".a,.b,.c,.e").slideDown();
        }
    });
    $(".e").click(function(){
        if($(".el").css("display")=="none"){
            $(".el").slideDown();
            $(".al,.a,.bl,.b,.c,.c1,.d,.d1").slideUp();
        }else{
            $(".el").slideUp();
            $(".a,.b,.c,.d").slideDown();
        }
    });
    if(snum == 0){
        // $(".al").slideDown();
        // $(".b,.c,.d,.b1,.c1,dl,.e").slideUp();
        $(".al").show()
        $(".b,.c,.d,.b1,.c1,dl,.e").hide()
    }
    if(snum == 1){
        $(".bl").show()
            $(".al,.a,.c,.c1,.d,.d1,.e").hide()
    }
    if(snum == 2){
        $(".cl").show()
            $(".al,.a,.bl,.b,.d1,.d,.e").hide()
    }
    if(snum == 3){
        $(".dl").show()
            $(".al,.a,.bl,.b,.c,.c1,.e").hide()
    }
    if(snum == 4){
        $(".el").show()
            $(".al,.a,.bl,.b,.c,.c1,.d,.d1").hide();
    }