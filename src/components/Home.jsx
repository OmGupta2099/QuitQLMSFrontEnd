import React, { useEffect, useState } from "react";
import ProductService from "../services/ProductService";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
 
const productService = new ProductService();
 
export default function Home() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
 
  useEffect(() => {
    console.log("Fetching products...");
    productService.getAllProducts().then((response) => {
      setProductList(response.data);
      console.log("Products:", response.data);
    });
 
    console.log("Fetching offers...");
    fetchOffers();
  }, []);
 
  const fetchOffers = async () => {
    productService.getOffers().then((response) => {
      setOfferList(response.data);
      console.log("offers:", response.data);
    });
    // const mockAPI = [
    //   {
    //     offerId: "629ea428-b9e2-4310-8416-26e15b4da237", 
    //     tierId: "eb2c581f-b3c1-46f1-8d15-52724b49f1ba", 
    //     programId: "b1cd0e9e-94a8-4afc-9944-93122d0938a5", 
    //     offerTitle: "12.12.24", 
    //     offerDescription: "60% off on all brands for Platinum users", 
    //     imageUrl: "https://img.freepik.com/free-vector/paper-style-12-12-sale-banner-template_52683-77491.jpg?t=st=1734279057~exp=1734282657~hmac=b174e457a7ed74f61bbf528df318cbcd9713df9cb804f02c4e675558480eb20b&w=996", 
    //     benefit: 60, 
    //     status: true,
    //   }, 
    //   {
    //     offerId: "629ea428-b9e2-4310-8416-26e15b4da238", 
    //     tierId: "eb2c581f-b3c1-46f1-8d15-52724b49f1bb", 
    //     programId: "b1cd0e9e-94a8-4afc-9944-93122d0938a5", 
    //     offerTitle: "12.12.24", 
    //     offerDescription: "50% off on all brands for Gold users", 
    //     imageUrl: "https://img.freepik.com/free-vector/paper-style-12-12-sale-banner-template_52683-77491.jpg?t=st=1734279057~exp=1734282657~hmac=b174e457a7ed74f61bbf528df318cbcd9713df9cb804f02c4e675558480eb20b&w=996", 
    //     benefit: 50, 
    //     status: true,
    //   },
    //   {
    //     offerId: "629ea428-b9e2-4310-8416-26e15b4da239", 
    //     tierId: "eb2c581f-b3c1-46f1-8d15-52724b49f1bc", 
    //     programId: "b1cd0e9e-94a8-4afc-9944-93122d0938a5", 
    //     offerTitle: "12.12.24", 
    //     offerDescription: "40% off on all brands for Silver users", 
    //     imageUrl: "https://img.freepik.com/free-vector/paper-style-12-12-sale-banner-template_52683-77491.jpg?t=st=1734279057~exp=1734282657~hmac=b174e457a7ed74f61bbf528df318cbcd9713df9cb804f02c4e675558480eb20b&w=996", 
    //     benefit: 40, 
    //     status: true,
    //   },
    //   {
    //     offerId: "629ea428-b9e2-4310-8416-26e15b4da240", 
    //     tierId: "eb2c581f-b3c1-46f1-8d15-52724b49f1bd", 
    //     programId: "b1cd0e9e-94a8-4afc-9944-93122d0938a5", 
    //     offerTitle: "12.12.24", 
    //     offerDescription: "30% off on all brands for New and Free tier users", 
    //     imageUrl: "https://img.freepik.com/free-vector/paper-style-12-12-sale-banner-template_52683-77491.jpg?t=st=1734279057~exp=1734282657~hmac=b174e457a7ed74f61bbf528df318cbcd9713df9cb804f02c4e675558480eb20b&w=996", 
    //     benefit: 30, 
    //     status: true,
    //   },
    // ];
    // setOfferList(mockAPI);
  };
 
  const imgClickHandler = (product_name, product_id) => {
    navigate(`/customer/${product_name}/${product_id}`);
  };
 
  const totalPages = Math.ceil(productList.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = productList.slice(
    startIndex,
    startIndex + productsPerPage
  );
 
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
 
  const highestBenefit = offerList.reduce(
    (max, offer) => (offer.benefit > max ? offer.benefit : max),
    0
  );
 
  return (
<div className="container-fluid homecontainer">
      {/* Carousel */}
<Carousel className="mb-4">
        {offerList.map((offer) => (
<Carousel.Item key={offer.offerId}>
<img
              className="d-block w-100"
              src={offer.imageUrl}
              alt={offer.offerTitle}
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
<Carousel.Caption>
<h3>{offer.offerTitle}</h3>
<p>{offer.offerDescription}</p>
</Carousel.Caption>
</Carousel.Item>
        ))}
</Carousel>

<div className="row">
        {currentProducts.map((product) => {
          const discPrice = offerList.length
            ? product.price - (highestBenefit / 100) * product.price
            : product.price;
 
          return (
<div className="custom-col-5 col-md-3" key={product.product_id}>
<div
                className="card"
                onClick={() =>
                  imgClickHandler(product.product_name, product.product_id)
                }
>
                {offerList.length > 0 && (
<div className="offer-bubble">
                    Upto {highestBenefit}% off
</div>
                )}
<img
                  className="card-img-top"
                  src={product.imgUrl}
                  alt="Card image cap"
                />
<div className="card-body">
<h6 className="card-subtitle mb-2 text-muted">
                    {product.brand}
</h6>
<h5 className="card-title">{product.product_name}</h5>
                  {offerList.length > 0 ? (
<div className="price-section">
<h5 className="card-title text-danger">
<b>₹{discPrice.toFixed(2)}</b>
</h5>
<h6 className="text-muted text-decoration-line-through">
₹{product.price}
</h6>
</div>
                  ) : (
<h5 className="card-title text-success">
<b>${product.price}</b>
</h5>
                  )}
</div>
</div>
</div>
          );
        })}
</div>
 
      {productList.length > productsPerPage && (
<nav aria-label="Page navigation">
<ul className="pagination justify-content-center mt-4">
<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
<button
                className="page-link"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
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
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
>
                Next
</button>
</li>
</ul>
</nav>
      )}
</div>
  );
}