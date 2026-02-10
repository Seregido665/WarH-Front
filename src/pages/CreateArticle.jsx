import { useState } from 'react';
import { createProduct } from '../services/productService';
import { createCategory } from '../services/categoryService';
import { useNavigate } from 'react-router-dom';

const CreateArticle = () => {
  const [form, setForm] = useState({ title: '', description: '', price: '' , category: ''});
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      // 1. Create or get category by name
      let categoryId = form.category;
      if (!categoryId) {
        throw new Error('Category is required');
      }

      // Try to create the category; if it fails because it already exists, that's ok
      let catRes;
      try {
        catRes = await createCategory({ name: form.category });
        categoryId = catRes?._id || catRes?.id || catRes;
      } catch (catErr) {
        // If category creation fails (likely already exists), we'll try with the name
        // The backend will validate and return a proper error if invalid
        console.log('Category might already exist:', catErr.message);
      }

      // 2. Create the product
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      const priceValue = form.price === '' ? '' : Number(form.price);
      fd.append('price', priceValue);
      fd.append('category', categoryId || form.category);
      images.forEach((file) => fd.append('images', file));

      await createProduct(fd);
      navigate('/store');
    } catch (err) {
      const resp = err?.response?.data;
      if (resp?.errors) {
        setErrors(resp.errors);
      } else {
        const msg = resp?.message || err.message || 'Creation failed';
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Create New Article</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
