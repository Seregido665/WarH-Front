import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProductById(id);
        const data = res?.data || res;
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          category: data.category?._id || data.category || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('price', Number(form.price));
      fd.append('category', form.category);
      images.forEach(file => fd.append('images', file));

      await updateProduct(id, fd);
      navigate(`/products/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Editar Producto</h3>
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
          <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input type="file" multiple accept="image/*" className="form-control" onChange={handleFiles} />
        </div>
        <button className="btn btn-primary" type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default EditProduct;
