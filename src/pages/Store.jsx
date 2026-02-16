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
  
  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('-createdAt');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const limit = 10;
  const [total, setTotal] = useState(0);

  // Cargar categorías al montar el componente
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

  // Cargar productos cuando cambian filtros, orden o página
  useEffect(() => {
    // Esperar a que termine la restauración del usuario para evitar
    // mostrar productos momentáneamente antes de aplicar el filtro
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
        const data = res?.data || res;

        let allProducts = [];
        let totalCount = 0;

        // Normalizamos la respuesta según el formato que devuelva el backend
        if (data?.data && data?.pagination) {
          // Formato paginado típico (ej: { data: [...], pagination: { total, page, limit } })
          allProducts = data.data || [];
          totalCount = data.pagination.total || allProducts.length;
        } else if (Array.isArray(data)) {
          // Respuesta plana (array de productos)
          allProducts = data;
          totalCount = data.length;
        } else {
          allProducts = [];
          totalCount = 0;
        }

        // Obtenemos el ID del usuario autenticado (si existe)
        const userId = user?._id || user?.id;

        // Filtramos solo si hay usuario logueado
        const displayedProducts = userId
          ? allProducts.filter((product) => {
              const sellerId = product.seller?._id || product.seller?.id || product.seller;
              return sellerId && String(sellerId) !== String(userId);
            })
          : allProducts;

        setProducts(displayedProducts);
        setTotal(totalCount); // ← Total real del backend (lo más común en tiendas)

      } catch (err) {
        console.error('Error al cargar productos:', err);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    selectedCategory,
    selectedSort,
    selectedStatus,
    currentPage,
    authLoading,
    user?._id,   // Dependencia explícita
    user?.id
  ]);

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

      {/* Sección de filtros */}
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
              <option value="-createdAt">Más recientes primero</option>
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
            <label className="form-label fw-bold d-block">Limpiar</label>
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

      {/* Lista de productos */}
      {!loading && products.length > 0 && (
        <>
          <div className="mb-4">

            {products.map((product) => (
              <Product key={product._id || product.id} item={product} />
            ))}
          </div>

          {/* Paginación */}
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

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;