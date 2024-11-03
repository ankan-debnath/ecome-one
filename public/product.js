const MainImg = document.querySelector("#MainImg");
const imgs = document.querySelectorAll('.small-img');

for(let img of imgs ){
    img.addEventListener('click', ()=>{
        MainImg.src = img.src;
    });
}

function addToCart(user, product){
    const quantity = document.querySelector('#quantity');
    console.log(quantity.value);
    window.location.href = `/add-to-cart/${user}/${product}`; 
}