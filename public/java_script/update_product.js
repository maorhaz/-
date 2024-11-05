async function fetchProducts() {
  try {
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      const productList = document.getElementById('product-list');
      const updateProductList = document.getElementById('update-product-list');
      productList.innerHTML = '';
      updateProductList.innerHTML = '';
      data.forEach(product => {
          const option = document.createElement('option');
          option.value = product._id;
          option.text = product.name;
          productList.appendChild(option);

          const updateOption = document.createElement('option');
          updateOption.value = product._id;
          updateOption.text = product.name;
          updateProductList.appendChild(updateOption);
      });
  } catch (error) {
      console.error('Error fetching products:', error);
  }
}

fetchProducts();

document.getElementById('product-list-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const selectedProductId = document.getElementById('product-list').value;
  const confirmation = confirm('Are you sure you want to delete this product?');
  if (confirmation) {
      try {
          const response = await fetch(`http://localhost:3000/api/products/${selectedProductId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          if (response.ok) {
              alert('Product deleted successfully');
              fetchProducts();
          } else {
              const errorData = await response.json();
              alert(`Failed to delete product: ${errorData.message}`);
          }
      } catch (error) {
          console.error('Error deleting product:', error);
      }
  }
});

document.getElementById('new-product-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const newProduct = {
      product_id: parseInt(document.getElementById('product_id').value, 10),
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
      price: parseFloat(document.getElementById('price').value),
      category_id: parseInt(document.getElementById('category_id').value, 10)
  };

  try {
      const response = await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
      });
      const data = await response.json();
      console.log('Server response:', data);
      if (data.message === 'Product added successfully') {
          alert('Product added successfully');
          fetchProducts();
      } else {
          alert(`Failed to add product: ${data.message}`);
      }
  } catch (error) {
      console.error('Error adding product:', error);
  }
});

document.getElementById('update-product-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const selectedProductId = document.getElementById('update-product-list').value;
  const updatedProduct = {};

  const name = document.getElementById('update-name').value;
  if (name) updatedProduct.name = name;

  const description = document.getElementById('update-description').value;
  if (description) updatedProduct.description = description;

  const price = document.getElementById('update-price').value;
  if (price) updatedProduct.price = parseFloat(price);

  const category_id = document.getElementById('update-category_id').value;
  if (category_id) updatedProduct.category_id = parseInt(category_id, 10);

  try {
      const response = await fetch(`http://localhost:3000/api/products/${selectedProductId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProduct)
      });
      const data = await response.json();
      console.log('Server response:', data);
      if (data.message === 'Product updated successfully') {
          alert('Product updated successfully');
          fetchProducts();
      } else {
          alert(`Failed to update product: ${data.message}`);
      }
  } catch (error) {
      console.error('Error updating product:', error);
  }
});