import { useState } from 'react';
import { createProduct } from '../services/productService';
import { createCategory } from '../services/categoryService';
import { useNavigate } from 'react-router-dom';
import "../styles/createForm.css";

const CreateArticle = () => {
  const [form, setForm] = useState({ title: '', description: '', price: '' , category: ''});
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    try {
      let categoryId = form.category;
      let catRes;
      try {
        catRes = await createCategory({ name: form.category });
        categoryId = catRes?._id || catRes?.id || catRes;
      } catch (catErr) {
        console.log('Category might already exist:', catErr.message);
      }

      // 2. Create the product
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', categoryId || form.category);
      images.forEach((file) => fd.append('images', file));

      await createProduct(fd);
      navigate('/store');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h3>Create New Article</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input name="price" type="number" min="0" step="0.01" className="form-control" value={form.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input name="category" className="form-control" value={form.category} onChange={handleChange} placeholder="e.g. Imperio, Caos, Aeldari..." required />
        </div>
        <div className="mb-3">
          <label className="form-label">Images</label>
          <input type="file" multiple accept="image/*" className="form-control" onChange={handleFiles} />
        </div>
        {errors?.general && <div className="text-danger mb-2">{errors.general}</div>}
        {errors?.title && <div className="text-danger">Title: {errors.title}</div>}
        {errors?.description && <div className="text-danger">Description: {errors.description}</div>}
        {errors?.price && <div className="text-danger">Price: {errors.price}</div>}
        {errors?.category && <div className="text-danger">Category: {errors.category}</div>}
        <button className="btn btn-primary" type="submit">
          CREAR
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
