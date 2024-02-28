import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './category.css'; 

function CategoryMaster() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    //axios.post('http://localhost:3000/api/categories', { name: newCategoryName })
    axios.post('https://nimap-test.onrender.com/api/categories', { name: newCategoryName })
      .then(response => {
        fetchCategories();
        setNewCategoryName('');
      })
      .catch(error => {
        console.error('Error adding category:', error);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    //axios.delete(`http://localhost:3000/api/categories/${categoryId}`)
    axios.delete(`https://nimap-test.onrender.com/api/categories/${categoryId}`)
      .then(response => {
        fetchCategories();
      })
      .catch(error => {
        console.error('Error deleting category:', error);
      });
  };

  const handleEditCategory = (categoryId, categoryName) => {
    setEditCategoryId(categoryId);
    setEditedCategoryName(categoryName);
  };

  const handleSubmitEdit = () => {
    if (!editedCategoryName.trim() || !editCategoryId) return;

    //axios.put(`http://localhost:3000/api/categories/${editCategoryId}`, { name: editedCategoryName })
    axios.put(`https://nimap-test.onrender.com/api/categories/${editCategoryId}`, { name: editedCategoryName })
      .then(response => {
        fetchCategories();
        setEditCategoryId(null);
        setEditedCategoryName('');
      })
      .catch(error => {
        console.error('Error editing category:', error);
      });
  };

  return (
    <div className="category-master-container">
      <h2>Category Master</h2>
      <div className="center-input">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter new category name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id} className="category-item">
            {editCategoryId === category.id ? (
              <div>
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
                <button onClick={handleSubmitEdit}>Save</button>
              </div>
            ) : (
              <div className="category-details">
                <span>{category.name}</span>
                <div className="category-buttons">
                  <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                  <button onClick={() => handleEditCategory(category.id, category.name)}>Edit</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryMaster;
 