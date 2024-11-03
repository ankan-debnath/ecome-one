function previewImage(event, previewId) {
    const file = event.target.files[0];
    const previewElement = document.getElementById(previewId);

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewElement.style.display = 'none';
    }
}
function showAddProductForm() {
    document.querySelector('.form-container').style.display = 'block';
}

function hideAddProductForm() {
    document.querySelector('.form-container').style.display = 'none';
}   

function addProduct() {
    alert('Product added successfully!');
    hideAddProductForm();
}

function updateOrderStatus() {
    alert('Order status updated!');
}

function deleteProduct(id, admin_id){
    
    window.location.href = `/delete-product/${admin_id}/${id}`
}