var btns = $("button");
var slct = $("select");
var currentBtn = 0;

$(document).ready(function(){
    btns.click(function(){
        for(var i = 0; i < btns.length; i++){
            if(btns[i] == this){
                currentBtn = i;
            }
        }
        getCat(currentBtn);
    });
});


function getCat(x){
    if(slct[x].value == "Block"){
        if(Math.random() >= 0.5){
            alert("Attempted to block: Success!");
        } else {
            alert("Attempted to block: Failed. ");
        }
    }
}
