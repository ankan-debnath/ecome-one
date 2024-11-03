const menu = document.querySelector('#mobile button');
const nav = document.querySelector('#navbar');
const close = document.querySelector('.close-menu');
console.log(menu, nav)

menu.addEventListener('click', ()=>{
    nav.style.right = 0;
});

close.addEventListener('click', ()=>{
    nav.style.right = "-999px";
});

function removeItem(id){
    let item = document.getElementById(id);
    item.remove();
}
function increase(btnID){
    let box = document.querySelector('#' + btnID + ' input');
    let val = parseInt(box.value);
    box.value = val < 10 ? val + 1 : 10;
}
function decrease(btnID){
    let box = document.querySelector('#' + btnID + ' input');
    let val = parseInt(box.value);
    box.value = val > 1 ? val - 1 : 1;
}

let btn = document.querySelector('#navbar button'); 
let logout = document.querySelector('.profile-menu');

btn.addEventListener('click', ()=>{
    if(logout.classList.contains('close'))
        logout.classList.remove('close');
    else
        logout.classList.add('close');
});

function gotoProductPage(id){
    console.log(id);
    window.location.href = `/product/${id}`;
}
