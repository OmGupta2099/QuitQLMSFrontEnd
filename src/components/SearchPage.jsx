import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import "../css/SearchPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const productService = new ProductService();

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brandFilter, setBrandFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 0]);
  const [resultsTitle, setResultsTitle] = useState(`Results for "${query}"`); // State for dynamic title
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const categories = [
    "FOOTWEAR",
    "ELECTRONICS",
    "MEN_WEAR",
    "WOMEN_WEAR",
    "HOME_APPLIANCES",
    "BEAUTY",
    "SPORTS",
    "JEWELRY",
    "TOYS",
    "BOOKS",
    "GROCERY",
    "FURNITURE",
  ];

  useEffect(() => {
    // Initial load: Fetch products based on the query
    fetchProducts();
  }, [query, categoryFilter]);

  const fetchProducts = () => {
    if (categoryFilter === "") {
      productService.searchProductsByName(query).then((response) => {
        const data = response.data;
        if (data && data.length > 0) {
          setProducts(data);
          extractBrands(data);
          setMinMaxPrice(data); // Set the min and max price
          applyFilters(data);
        } else {
          productService.getProductsByBrand(query).then((response) => {
            const data = response.data;
            setProducts(data);
            extractBrands(data);
            setMinMaxPrice(data); // Set the min and max price
            applyFilters(data);
          });
        }
      });
    } else {
      productService.getProductsByCategory(categoryFilter).then((response) => {
        const data = response.data;
        setProducts(data);
        extractBrands(data);
        setMinMaxPrice(data); // Set the min and max price
        applyFilters(data);
      });
    }
  };

  const extractBrands = (products) => {
    const uniqueBrands = [...new Set(products.map((product) => product.brand))];
    setBrands(uniqueBrands);
  };

  const handleBrandChange = (brand) => {
    const updatedBrandFilter = brandFilter.includes(brand)
      ? brandFilter.filter((item) => item !== brand)
      : [...brandFilter, brand];
    setBrandFilter(updatedBrandFilter);
    updateResultsTitle(); // Update the results title
  };

  const setMinMaxPrice = (productsList) => {
    const prices = productsList.map((product) => product.price);
    const min = Math.floor(Math.min(...prices)); // Keep the minimum price floored
    const max = Math.ceil(Math.max(...prices) / 100) * 100; // Ceil the maximum price to the nearest hundred
    setMinPrice(min);
    setMaxPrice(max);
    setSelectedPriceRange([min, max]);
  };

  const handlePriceRangeChange = (min, max) => {
    // Ensure the sliders don't overlap
    if (min >= max) min = max - 100;
    if (max <= min) max = min + 100;

    setSelectedPriceRange([min, max]);
    updateResultsTitle(); // Update the results title
  };

  const applyFilters = (productsList = products) => {
    let filtered = productsList;

    if (brandFilter.length > 0) {
      filtered = filtered.filter((product) =>
        brandFilter.includes(product.brand)
      );
    }

    // Filter by price range
    if (selectedPriceRange[0] && selectedPriceRange[1]) {
      filtered = filtered.filter(
        (product) =>
          product.price >= selectedPriceRange[0] &&
          product.price <= selectedPriceRange[1]
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
    updateResultsTitle(); // Update title after applying filters
  };

  useEffect(() => {
    applyFilters();
  }, [brandFilter, selectedPriceRange]);

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    updateResultsTitle(); // Update the results title
  };

  const updateResultsTitle = () => {
    let title = `Results for "${query}"`; // Default title with the query

    // If category is applied
    if (categoryFilter) {
      title = `Results for "${categoryFilter}"`; // Set title to category
    }

    // If brand filters are applied
    if (brandFilter.length > 0) {
      title += " (Filtered)"; // Indicate filtering
    }

    // If both category and brand filters are applied
    if (categoryFilter && brandFilter.length > 0) {
      title = `Results for "${categoryFilter}" (Filtered)`; // Set title for category with filters
    }

    setResultsTitle(title);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="search-page-container">
      {/* Left section: Category and Filters */}
      <div className="left-section">
        {/* Filter Section */}
        <div className="filters">
          <h4>Filters</h4>
          <br />
          {/* Brand Filter */}
          <div className="filter-group">
            <h6>Brand</h6>
            <div>
              {brands.map((brand, index) => (
                <div key={index} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={brand}
                    onChange={() => handleBrandChange(brand)}
                    checked={brandFilter.includes(brand)}
                    aria-label={`Checkbox for ${brand}`}
                  />
                  <label className="form-check-label">{brand}</label>
                </div>
              ))}
            </div>
          </div>

          <br />

          {/* Price Filter - Flipkart Style */}
          <div className="filter-group">
            <h6>Price</h6>
            <div className="price-slider">
              <div className="price-slider-container">
                <label htmlFor="minPriceRange">Min:</label>
                <input
                  id="minPriceRange"
                  type="range"
                  className="form-range"
                  min={minPrice}
                  max={maxPrice}
                  value={selectedPriceRange[0]}
                  step="100"
                  onChange={(e) =>
                    handlePriceRangeChange(
                      Number(e.target.value),
                      selectedPriceRange[1]
                    )
                  }
                />
                <span>${selectedPriceRange[0]}</span>
              </div>
              <div className="price-slider-container">
                <label htmlFor="maxPriceRange">Max:</label>
                <input
                  id="maxPriceRange"
                  type="range"
                  className="form-range"
                  min={minPrice}
                  max={maxPrice}
                  value={selectedPriceRange[1]}
                  step="100"
                  onChange={(e) =>
                    handlePriceRangeChange(
                      selectedPriceRange[0],
                      Number(e.target.value)
                    )
                  }
                />
                <span>${selectedPriceRange[1]}</span>
              </div>
              {/* Display Price Range */}
              <div>
                <h6>
                  ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
                </h6>
              </div>

              {/* Slider Track Style */}
              <div
                className="slider-track"
                style={{
                  background: `linear-gradient(to right, #ddd ${
                    ((selectedPriceRange[0] - minPrice) /
                      (maxPrice - minPrice)) *
                    100
                  }% , #4CAF50 ${
                    ((selectedPriceRange[0] - minPrice) /
                      (maxPrice - minPrice)) *
                    100
                  }% , #4CAF50 ${
                    ((selectedPriceRange[1] - minPrice) /
                      (maxPrice - minPrice)) *
                    100
                  }%, #ddd ${
                    ((selectedPriceRange[1] - minPrice) /
                      (maxPrice - minPrice)) *
                    100
                  }%)`,
                }}
              ></div>
            </div>
          </div>

          <center>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => applyFilters(products)}
            >
              Apply Filters
            </button>
          </center>
        </div>

        <br />

        {/* Category Selection */}
        <div className="category-section">
          <h5>Select Category</h5>
          <div className="category-item">
            <input
              type="radio"
              aria-label="Radio button for category None"
              value=""
              onChange={() => handleCategoryChange("")}
              checked={categoryFilter === ""}
            />
            <span>None</span>
          </div>
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <input
                type="radio"
                aria-label={`Radio button for category ${category}`}
                value={category}
                onChange={() => handleCategoryChange(category)}
                checked={categoryFilter === category}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Results */}
      <div className="product-results">
        <h5>{resultsTitle}</h5> {/* Use the dynamic title here */}
        <div className="row">
          {currentProducts.map((product) => (
            <div className="custom-col-5 col-md-3" key={product.product_id}>
              <div
                className="card"
                onClick={() =>
                  navigate(
                    `/quitq/${product.product_name}/${product.product_id}`
                  )
                }
              >
                <img
                  className="search-img-top"
                  src={product.imgUrl}
                  alt="Product image"
                />
                <div className="card-body searchbody">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {product.brand}
                  </h6>
                  <h5 className="card-title">{product.product_name}</h5>
                  <h6 className="card-title">₹{product.price}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        {filteredProducts.length > itemsPerPage && (
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                  key={index}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
