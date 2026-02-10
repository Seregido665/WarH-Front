import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import Product from '../components/Product';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('-createdAt');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const list = Array.isArray(res) ? res : res?.data || [];
        setCategories(list);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  // Load products when filters/sort/page change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit,
          sort: selectedSort,
        };
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        
        if (selectedStatus) {
          params.status = selectedStatus;
        }

        const res = await getProducts(params);
        const data = res?.data || res;
        
        // Handle paginated response
        if (data?.data && data?.pagination) {
          setProducts(data.data);
          setTotal(data.pagination.total);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
        } else {
          setProducts([]);
          setTotal(0);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, selectedSort, selectedStatus, currentPage]);

  const totalPages = Math.ceil(total / limit);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to page 1
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mt-5">
      <h2>Store</h2>

      {/* Filters Section */}
      <div className="card mb-4 p-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">Category</label>
            <select 
              className="form-select" 
              value={selectedCategory} 
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Sort by Price</label>
            <select 
              className="form-select" 
              value={selectedSort} 
              onChange={handleSortChange}
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Status</label>
            <select 
              className="form-select" 
              value={selectedStatus} 
              onChange={handleStatusChange}
            >
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold d-block">&nbsp;</label>
            <button 
              className="btn btn-secondary w-100"
              onClick={() => {
                setSelectedCategory('');
                setSelectedSort('-createdAt');
                setSelectedStatus('');
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="alert alert-info" role="alert">
          No products found. Try adjusting your filters.
        </div>
      )}

      {/* Products List */}
      {!loading && products.length > 0 && (
        <>
          <div className="mb-4">
            <p className="text-muted">
              Showing {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, total)} of {total} products
            </p>
            {products.map((p) => (
              <Product key={p.id || p._id} item={p} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item active">
                  <span className="page-link">
                    Page {currentPage} of {totalPages}
                  </span>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Store;
