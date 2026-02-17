import { useEffect, useState, useContext } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import Product from '../components/Product';
import AuthContext from '../contexts/authContext';
import "../styles/store.css";

const Store = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('-createdAt');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const limit = 10;
  const [total, setTotal] = useState(0);

  // --- CARGAR CATEGORÍAS ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const list = Array.isArray(res) ? res : res?.data || [];
        setCategories(list);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    loadCategories();
  }, []);

  // --- APLICAR FILTROS Y CARGAR PRODUCTOS ---
  useEffect(() => {
    if (authLoading) return;

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

        let allProducts = [];
        let totalCount = 0;

        // - PAGINACIÓN -
        if (res?.data && res?.pagination) {
          allProducts = res.data || [];
          totalCount = res.pagination.total || allProducts.length;
        } else if (Array.isArray(res)) {
          allProducts = res;
          totalCount = res.length;
        } else {
          allProducts = [];
          totalCount = 0;
        }

        // - SOLO PUEDE APLICAR FILTROS UN USUARIO LOGUEADO -
        const userId = user?._id || user?.id;
        const displayedProducts = userId && allProducts.length > 0
          ? allProducts.filter((product) => {
              const sellerId = product.seller?._id || product.seller?.id || product.seller;
              return sellerId !== userId && String(sellerId) !== String(userId);
            })
          : allProducts;

        setProducts(displayedProducts);
        setTotal(totalCount);
        setLoading(false);

      } catch (err) {
        console.error('Error al cargar productos:', err);
        setProducts([]);
        setTotal(0);
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, selectedSort, selectedStatus, currentPage, authLoading, user]);

  const totalPages = Math.ceil(total / limit);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSort('-createdAt');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h2>Tienda</h2>

      {/* -- FILTROS -- */}
      <div className="card mb-4 p-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">Categoría</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Ordenar por</label>
            <select
              className="form-select"
              value={selectedSort}
              onChange={handleSortChange}
            >
              <option value="-createdAt">Más recientes</option>
              <option value="price">Precio: menor a mayor</option>
              <option value="-price">Precio: mayor a menor</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">Estado</label>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">Todos</option>
              <option value="published">Publicado</option>
              <option value="sold">Vendido</option>
              <option value="archived">Reservado</option>
            </select>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-secondary w-100"
              onClick={handleResetFilters}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>


      {!loading && products.length === 0 && total === 0 && (
        <div className="alert alert-info" role="alert">
          No hay productos disponibles en este momento.
        </div>
      )}

      {/* - TOTAL DE PRODUCTOS */}
      {!loading && products.length > 0 && (
        <>
          <div className="mb-4">

            {products.map((product) => (
              <Product key={product._id || product.id} item={product} />
            ))}
          </div>

          {/* - PAGINACION - */}
          {totalPages > 1 && (
            <nav aria-label="Paginación de productos">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                <li className="page-item active">
                  <span className="page-link">
                    Página {currentPage} de {totalPages}
                  </span>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
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