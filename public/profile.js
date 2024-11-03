let btns = document.querySelectorAll('.tab-btn');
let content = document.querySelectorAll('.detail');

for(let i = 0; i < btns.length; i++){
    btns[i].addEventListener('click', function () {
        let openBtn = document.querySelector('.btn-active');
        let openContent = document.querySelector('.open')
        openBtn.classList.remove('btn-active');
        this.classList.add('btn-active');
        openContent.classList.remove('open');
        content[i].classList.add('open');
    });
}

let new_address_btn = document.querySelector('.new-address-btn');
new_address_btn.addEventListener('click', ()=>{
    let address_form = document.querySelector('.address-form');
    address_form.classList.toggle('close');
});



// let form = document.querySelector('.address-form');
// form.addEventListener('submit', async function (event) {
//     event.preventDefault();

//     let formData = new URLSearchParams(new FormData(this));
//     console.log(formData);
    
//     fetch('./add-address', {
//         method : 'POST', 
//         headers : {
//             'Content-Type': 'application/x-www-form-urlencoded', // Specify URL encoding
//         }, 
//         body: formData 
//     })
//     .then(responce => responce.json())
//     .then( (data) =>{
//         let address = document.querySelector('.details:nth-child(2)');
//         address.appendChild(`<div class="add">
//                             <h5>${data.type}</h5>
//                             <p> ${data.name} </p>
//                             <p> ${data.mobile}</p>
//                             <p> ${data.add1} </p>
//                             <p> ${data.add2} </p>
//                             <p> ${data.distrt}</p>
//                             <p>PIN : <%= add.pin %></p>
//                         </div>`);
//     });
// });
