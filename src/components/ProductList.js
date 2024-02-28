import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './product.css';

function ProductMaster() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;  

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const fetchProducts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    if (startIndex < products.length) {
      setProducts(products.slice(startIndex, startIndex + pageSize));
    } else {
      // Fetch products from the server 
      
      //axios.get(`http://localhost:3000/api/products?startIndex=${startIndex}&pageSize=${pageSize}`)
      axios.get(`https://nimap-test.onrender.com/api/products?startIndex=${startIndex}&pageSize=${pageSize}`)
        .then(response => {
          setProducts(response.data.products);
          setTotalPages(Math.ceil(response.data.totalCount / pageSize));
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  };

  const fetchCategories = () => {
    //axios.get('http://localhost:3000/api/categories')
    axios.get('https://nimap-test.onrender.com/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleAddProduct = () => {
    if (!newProductName.trim() || !categoryId) {
      console.error('Product name and category are required.');
      return;
    }

    //axios.post('http://localhost:3000/api/products', { name: newProductName, category_id: categoryId })
    axios.post('https://nimap-test.onrender.com/api/products', { name: newProductName, category_id: categoryId })
      .then(response => {
        fetchProducts();
        setNewProductName('');
        setCategoryId('');
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  const handleDeleteProduct = (productId) => {
    //axios.delete(`http://localhost:3000/api/products/${productId}`)
    axios.delete(`https://nimap-test.onrender.com/api/products/${productId}`)
      .then(response => {
        fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="product-master-container">
      <h2>Product Master</h2>
      <div className="input-container">
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Enter new product name"
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button className="add-product-button" onClick={handleAddProduct}>Add Product</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category Name</th>
              <th>Category ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product_name}</td>
                <td>{product.category_name}</td>
                <td>{product.category_id}</td>
                <td>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <div className="pagination">
        <button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

export default ProductMaster;
 