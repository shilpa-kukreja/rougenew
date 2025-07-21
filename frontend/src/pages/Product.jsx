import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import DealTimer from '../component/DealTimer';

const Product = () => {
  const { products, timerExpire } = useContext(ShopContext);
  const [showProduct, setShowProduct] = useState([]);
  const [dealOver, setDealOver] = useState(false);

  useEffect(() => {
    if (products?.length > 0) {
      setShowProduct(products);
    }
  }, [products]);

  const handleDealEnd = () => {
    setDealOver(true);
  };

  return (
    <>
      <DealTimer onDealEnd={handleDealEnd} />

      {timerExpire && (
        <div className='sm:max-w-[680px] md:max-w-[700px] lg:max-w-[1024px] 2xl:max-w-[1600px] h-[75vh] items-center justify-center mx-auto'>
          {/* Swiper Product Slider */}
          <div className='h-[65vh] flex justify-center mt-5 items-center'>
            <Swiper
              slidesPerView={6}
              spaceBetween={10}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop={true}
              modules={[Pagination, Autoplay]}
              breakpoints={{
                320: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
              className="mySwiper w-full flex items-center justify-center"
            >
              {showProduct.map((product, index) => {
                const mainImage = product.images?.edges?.[32]?.node?.url;
                const productId = product.id?.split("/").pop(); // Shopify ID last part

                return (
                  <SwiperSlide key={product.id || index} className="cursor-pointer flex justify-center items-center">
                    <Link to={`/product/${productId}`}>
                      <img
                        src={mainImage || "https://via.placeholder.com/150"}
                        alt={product.title}
                        className="2xl:h-[500px] sm:h-full lg:h-[400px] h-[450px] object-contain"
                      />
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Overlay Logo */}
          <div className="fixed inset-0 opacity-50 flex justify-center items-center pointer-events-none z-10">
            <img
              src={assets.s4}
              alt="Logo"
              className="w-50 mix-blend-multiply"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
