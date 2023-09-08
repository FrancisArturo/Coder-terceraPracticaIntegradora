
const deleteProduct = async (pid) => {
    const productDelete = await fetch(`/api/v1/products/${pid}`, {
        method: "DELETE",
    });
    const data = await productDelete.json();
    if (data.message == "No product found") {
        alert("No product found"); 
    } else {
        alert("Product deleted successfully");
    };
    window.location.replace("/views/home");
}