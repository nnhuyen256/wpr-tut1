let screen = document.getElementById('screen');

function pushBtn(obj){
    let push = obj.innerHTML;
    if (push == '=') {
        screen.innerHTML = eval(screen.innerHTML);
    } else if (push == 'C') {
        screen.innerHTML = '';
    } else {
        if (screen.innerHTML == '') {
            screen.innerHTML = push;
        } else {
            screen.innerHTML += push;
        }
    }
}