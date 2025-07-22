import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { assets } from '../assets/assets';
import { addToCart } from '../utils/shopifyCart';


// const GRAPHQL_URL = 'https://naj9vi-zx.myshopify.com/api/2024-04/graphql.json';
// const ACCESS_TOKEN = 'd64d7024dc6ea00c329778b8c71e7fce';
const GRAPHQL_URL = 'https://q3uepe-ic.myshopify.com/api/2024-04/graphql.json';
const ACCESS_TOKEN = '76df5b05e1b2db908234960f1757df67';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [maleBlackImages, setMaleBlackImages] = useState([]);
  const [femaleBlackImages, setFemaleBlackImages] = useState([]);
  const [maleBeigeImages, setMaleBeigeImages] = useState([]);
  const [femaleBeigeImages, setFemaleBeigeImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [maleIndex, setMaleIndex] = useState(0);
  const [femaleIndex, setFemaleIndex] = useState(0);
  const [details, setDetails] = useState(false);
  const [chartDetails, setChartDetails] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [videoSetIndex, setVideoSetIndex] = useState(0);
  const [firstIndex, setFirstIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(0);
  const [firstdownimage, setFirstDownImage] = useState(1);
  const [seconddownimage, setSecondDownImage] = useState(2);
  const [bottomBlackMaleImage, setBottomBlackMaleImage] = useState(null);
  const [bottomBlackFemaleImage, setBottomBlackFemaleImage] = useState(null);
  const [bottomBeigeMaleImage, setBottomBeigeMaleImage] = useState(null);
  const [bottomBeigeFemaleImage, setBottomBeigeFemaleImage] = useState(null);
  const [hasExtendedImages, setHasExtendedImages] = useState(false);

  // Extract available colors from product variants
  const colors = [];
  if (product) {
    const colorSet = new Set();
    product.variants.edges.forEach(({ node }) => {
      const colorOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'color');
      if (colorOption) {
        colorSet.add(colorOption.value);
      }
    });
    colorSet.forEach(color => {
      colors.push({
        name: color,
        bg: color,
      });
    });
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const globalId = `gid://shopify/Product/${productId}`;
      const query = `
        query {
          product(id: "${globalId}") {
            id
            title
            descriptionHtml
            images(first: 100) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
      });

      const result = await res.json();
      const productData = result.data?.product;

      if (productData) {
        setProduct(productData);
        if (productData.variants.edges.length > 0) {
          setSelectedVariant(productData.variants.edges[0].node);
          // Set initial color from first variant
          const colorOption = productData.variants.edges[0].node.selectedOptions.find(
            opt => opt.name.toLowerCase() === 'color'
          );
          if (colorOption) {
            setSelectedColor(colorOption.value);
          }
        }
      }
    };
    fetchProduct();
  }, [productId]);

  console.log("Product Data:", product);



  useEffect(() => {
    if (product) filterImagesByColorAndGender(product.images.edges);
  }, [product]);

  useEffect(() => {
    const interval = setInterval(() => {
      const maleImages = selectedColor === 'Black' ? maleBlackImages : maleBeigeImages;
      const femaleImages = selectedColor === 'Black' ? femaleBlackImages : femaleBeigeImages;
      setMaleIndex((prev) => (prev + 1) % maleImages.length);
      setFemaleIndex((prev) => (prev + 1) % femaleImages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedColor, maleBlackImages, femaleBlackImages, maleBeigeImages, femaleBeigeImages]);

  // const filterImagesByColorAndGender = (images) => {
  //   const maleBlack = [], femaleBlack = [], maleBeige = [], femaleBeige = [];

  //   images.forEach(({ node }) => {
  //     const url = node.url;
  //     if (
  //       url.includes('/files/1_') || url.includes('/files/2_') || url.includes('/files/3_') ||
  //       url.includes('/files/4_') || url.includes('/files/5_') || url.includes('/files/6_') ||
  //       url.includes('/files/7_') || url.includes('/files/8_') ||  url.includes('/files/1') || url.includes('/files/2') || url.includes('/files/3') ||
  //       url.includes('/files/4') || url.includes('/files/5') || url.includes('/files/6') ||
  //       url.includes('/files/7') || url.includes('/files/8')
  //     ) {
  //       if (maleBlack.length < 8) maleBlack.push(url);
  //       else if (femaleBlack.length < 8) femaleBlack.push(url);
  //       else if (maleBeige.length < 8) maleBeige.push(url);
  //       else if (femaleBeige.length < 8) femaleBeige.push(url);
  //     }
  //   });

  //   setMaleBlackImages(maleBlack);
  //   setFemaleBlackImages(femaleBlack);
  //   setMaleBeigeImages(maleBeige);
  //   setFemaleBeigeImages(femaleBeige);
  // };

 // In your filterImagesByColorAndGender function:
const filterImagesByColorAndGender = (images) => {
  const maleBlack = [], femaleBlack = [], maleBeige = [], femaleBeige = [];
  const bottomBlackMale = [], bottomBlackFemale = [], bottomBeigeMale = [], bottomBeigeFemale = [];
  
  // First 8 images for male black (1-8)
  for (let i = 0; i < 8; i++) {
    if (images[i]?.node?.url) maleBlack.push(images[i].node.url);
  }
  
  // Next 8 images for female black (9-16)
  for (let i = 8; i < 16; i++) {
    if (images[i]?.node?.url) femaleBlack.push(images[i].node.url);
  }
  
  // Next 8 images for male beige (17-24)
  for (let i = 16; i < 24; i++) {
    if (images[i]?.node?.url) maleBeige.push(images[i].node.url);
  }
  
  // Next 8 images for female beige (25-32)
  for (let i = 24; i < 32; i++) {
    if (images[i]?.node?.url) femaleBeige.push(images[i].node.url);
  }

  // Handle special cases for bottom images only
  if (images.length >= 38) {
    // If there are 38+ images
    bottomBlackMale.push(images[33]?.node?.url || maleBlack[7]);
    bottomBlackFemale.push(images[34]?.node?.url || femaleBlack[7]);
    bottomBeigeMale.push(images[35]?.node?.url || maleBeige[7]);
    bottomBeigeFemale.push(images[36]?.node?.url || femaleBeige[7]);
  } else if (images.length >= 36) {
    // If there are exactly 36 images - only use male images
    bottomBlackMale.push(images[33]?.node?.url || maleBlack[7]);
    bottomBlackFemale.push(null); // No female image for 36
    bottomBeigeMale.push(images[34]?.node?.url || maleBeige[7]);
    bottomBeigeFemale.push(null); // No female image for 36
  } else {
    // Default case - use the last image from each category
    bottomBlackMale.push(maleBlack[7]);
    bottomBlackFemale.push(femaleBlack[7]);
    bottomBeigeMale.push(maleBeige[7]);
    bottomBeigeFemale.push(femaleBeige[7]);
  }

  setMaleBlackImages(maleBlack);
  setFemaleBlackImages(femaleBlack);
  setMaleBeigeImages(maleBeige);
  setFemaleBeigeImages(femaleBeige);
  
  // Set the bottom images separately
  setBottomBlackMaleImage(bottomBlackMale[0]);
  setBottomBlackFemaleImage(bottomBlackFemale[0]);
  setBottomBeigeMaleImage(bottomBeigeMale[0]);
  setBottomBeigeFemaleImage(bottomBeigeFemale[0]);
  
  // Store whether we have 38+ images
  setHasExtendedImages(images.length >= 38);
};
  const handleColorChange = (color) => {
    setSelectedColor(color);
    setMaleIndex(0);
    setFemaleIndex(0);
    // Reset selected size when color changes
    setSelectedSize(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    // Find the matching variant for selected color and size
    if (product) {
      const selectedVariant = product.variants.edges.find(({ node }) => {
        const colorOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'color');
        const sizeOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'size');
        return colorOption?.value === selectedColor && sizeOption?.value === size;
      });
      if (selectedVariant) {
        setSelectedVariant(selectedVariant.node);
      }
    }
  };






  if (!product) return <p className="text-center text-gray-300 mt-12">Loading...</p>;

  const maleImages = selectedColor === 'Black' ? maleBlackImages : maleBeigeImages;
  const femaleImages = selectedColor === 'Black' ? femaleBlackImages : femaleBeigeImages;

  // Extract available sizes for the selected color
  // Extract available sizes for the selected color with stock check
  const availableSizes = [];
  if (product) {
    const sizeSet = new Set();
    product.variants.edges.forEach(({ node }) => {
      const colorOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'color');
      const sizeOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'size');
      if (colorOption?.value === selectedColor && sizeOption && node.quantityAvailable > 0) {
        sizeSet.add(sizeOption.value);
      }
    });
    sizeSet.forEach(size => availableSizes.push({ size }));
  }


  const selectedProduct = {
    name: product.title,
    description: product.descriptionHtml,
    price: parseFloat(selectedVariant?.price.amount || '0'),
    discountPrice: parseFloat(selectedVariant?.price.amount || '0') * 0.9,
  };

  const variant = {
    images: product.images.edges.map(edge => edge.node.url),
    sizesInfo: availableSizes,
    sizeChart: [
      { ref: 'A', label: 'Length', XS: '68', S: '70', M: '72', L: '74', XL: '76' },
      { ref: 'B', label: 'Chest', XS: '52', S: '54', M: '56', L: '58', XL: '60' }
    ]
  };

  const firstImages = maleImages;
  const secondImages = femaleImages;

  const convertPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const currency = selectedVariant?.price.currencyCode || 'USD';

  return (
    <>
      <div className='w-10/12 m-auto'>
        <div className="fixed inset-0 flex left-0 justify-center items-center pointer-events-none z-10">
          <img src={assets.s4} alt="Logo" className="w-70 mix-blend-multiply opacity-40" />
        </div>

        {/* Mobile View with Swiper */}
        <div className="lg:hidden block mb-30">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            navigation={false}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {/* Animation images slides */}
            <SwiperSlide>
              <div className='flex'>
                {firstImages.length > 0 && (
                  <div className="w-[50%]">
                    <img
                      src={maleImages[maleIndex]}
                      alt="First Variant Animation"
                      className="w-full max-h-[400px] object-contain"
                    />
                  </div>
                )}
                {secondImages.length > 0 && (
                  <div className="w-[50%]">
                    <img
                      src={femaleImages[femaleIndex]}
                      alt="Second Variant Animation"
                      className="w-full max-h-[400px] object-contain"
                    />
                  </div>
                )}
              </div>
            </SwiperSlide>

            {/* Static images - matching desktop view */}
          {/* Mobile View Swiper Slides */}
{selectedColor === 'Black' ? (
  <>
    <SwiperSlide className="block md:hidden">
      <div className="w-full">
        <img
          src={bottomBlackMaleImage}
          alt="Black Male"
          className="w-full max-h-[400px] object-contain"
        />
      </div>
    </SwiperSlide>

    {hasExtendedImages && bottomBlackFemaleImage && (
      <SwiperSlide className="block md:hidden">
        <div className="w-full">
          <img
            src={bottomBlackFemaleImage}
            alt="Black Female"
            className="w-full max-h-[400px] object-contain"
          />
        </div>
      </SwiperSlide>
    )}
  </>
) : (
  <>
    <SwiperSlide className="block md:hidden">
      <div className="w-full">
        <img
          src={bottomBeigeMaleImage}
          alt="Beige Male"
          className="w-full max-h-[400px] object-contain"
        />
      </div>
    </SwiperSlide>

    {hasExtendedImages && bottomBeigeFemaleImage && (
      <SwiperSlide className="block md:hidden">
        <div className="w-full">
          <img
            src={bottomBeigeFemaleImage}
            alt="Beige Female"
            className="w-full max-h-[400px] object-contain"
          />
        </div>
      </SwiperSlide>
    )}
  </>
)}

          </Swiper>
        </div>

        {/* Desktop View */}
        <div className='grid grid-cols-1 lg:grid-cols-10 sm:ml-[30px] ml-0 md:gap-2'>
          {/* Left Panel */}
          <div className='lg:col-span-3 product_cont'>
            <div className='sticky lg:fixed w-full top-[50%] transform translate-y-[-50%]'>
              <h4 className='text-[8px] uppercase text-[#A9ABAE] font-medium'>{selectedProduct.name}</h4>

              <div className="price-display mt-[-10px]">
                {selectedProduct.discountPrice !== selectedProduct.price ? (
                  <span className="text-[8px] text-[#A9ABAE]">
                    {convertPrice(selectedProduct.price, currency)} {currency}
                  </span>
                ) : (
                  <span className="text-[8px] text-[#A9ABAE]">
                    {convertPrice(selectedProduct.price, currency)}
                  </span>
                )}
              </div>
              <h4 className='text-[8px] uppercase text-[#A9ABAE] font-medium'>INCLUSIVE OF TAXES.DUTIES ON ARRIVAL.</h4>

              {/* Colors */}
              <div className='flex gap-3 my-5'>
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full cursor-pointer border ${selectedColor === color.name ? 'ring-2 ring-[#605B55]' : ''}`}
                    style={{ backgroundColor: color.bg }}
                    onClick={() => handleColorChange(color.name)}
                  />
                ))}
              </div>

              {/* Size Selector */}
              <div className="flex flex-wrap gap-2 my-3">
                {product?.variants.edges
                  .filter(({ node }) => {
                    const colorOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'color');
                    return colorOption?.value === selectedColor;
                  })
                  .map(({ node }) => {
                    const sizeOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'size');
                    const isOutOfStock = node.quantityAvailable === 0;
                    return (
                      <span
                        key={node.id}
                        onClick={() => !isOutOfStock && handleSizeSelect(sizeOption.value)}
                        className={`w-6 h-6 items-center flex justify-center rounded text-[8px] text-[#d2d3d4] cursor-pointer
            ${selectedSize === sizeOption.value ? "bg-gray-200 text-black" : "bg-[#605B55] hover:bg-gray-200 hover:text-black"}
            ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {sizeOption.value}
                      </span>
                    );
                  })}
              </div>


              {/* Add to Bag */}
              <div className="flex justify-center relative max-w-[280px] py-2 my-3 text-[8px] text-[#D2D3D5] cursor-pointer bg-[#605B55] rounded-2xl shadow-amber-100 items-center">
                {selectedSize ? (
                  selectedVariant?.quantityAvailable > 0 ? (
                    <button
                      onClick={async () => {
                        try {
                          const cart = await addToCart(selectedVariant.id, 1);
                          if (cart) {
                            window.location.href = '/cart';
                          } else {
                            alert("Failed to add to cart.");
                          }
                        } catch (err) {
                          alert("Something went wrong.");
                          console.error(err);
                        }
                      }}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button disabled className="opacity-60 cursor-not-allowed">
                      Out of Stock
                    </button>
                  )
                ) : (
                  <button>Please Select Size</button>
                )}
                <div className="absolute right-3">
                  <FaArrowRightLong />
                </div>
              </div>


              {/* Product Details */}
              <div className='p-0 m-0'>
                <button onClick={() => setDetails(!details)} className="cursor-pointer text-[8px] text-[#A9ABAE] rounded-lg">
                  Product Details {details ? "-" : "+"}
                </button>
                {details && (
                  <div
                    className="my-1 text-[8px] text-[#A9ABAE] sm:max-w-[300px] w-full overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                  />
                )}
              </div>

              {/* Chart Details */}
              <div className='p-0 m-0 mt-[-10px]'>
                <button onClick={() => setChartDetails(!chartDetails)} className='cursor-pointer text-[8px] text-[#A9ABAE] rounded-lg'>
                  Chart Details {chartDetails ? "-" : "+"}
                </button>
              </div>
            </div>
          </div>

          {chartDetails && (
            <div className='fixed top-[50%] transform translate-y-[-50%] flex flex-row left-0 w-[100%] z-50 text-[10px] text-[#d2d2d4]'>
              <div className="z-50 left-4 bg-black/50 w-fit p-6 rounded-lg relative">
                <div className='sm:flex space-y-4 sm:space-y-0 gap-16 sm:items-center sm:justify-center'>
                  <div className='bg-[#7f7f7f50] w-[250px] z-50 left-4 relative border'>
                    <button className="absolute top-0 right-0 text-[10px] border w-6 h-6 font-bold bg-white text-black z-50"
                      onClick={() => setChartDetails(false)}>
                      ✖
                    </button>
                    {variant.images.length === 6 ? (
                      <img
                        src={variant.images[5]}
                        alt={selectedProduct.name}
                        className='object-cover h-[132px] w-full'
                      />
                    ) : (
                      <img
                        src={variant.images[3]}
                        alt={selectedProduct.name}
                        className='object-cover h-[132px] w-full'
                      />
                    )}
                  </div>
                  <div className="sm:max-w-4xl max-w-3xl border border-gray-300 shadow-md">
                    <table className="w-full text-center">
                      <thead>
                        <tr className="text-[8px]">
                          <th className="py-1">Ref</th>
                          <th className="py-1">Measurement (cm)</th>
                          {variant.sizesInfo.map((s) => (
                            <th key={s.size} className="py-1">{s.size}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {variant.sizeChart.map((item, index) => (
                          <tr key={index} className="text-[8px]">
                            <td className="px-4 py-1">{item.ref}</td>
                            <td className="px-4 py-1">{item.label}</td>
                            {variant.sizesInfo.map((s) => (
                              <td key={s.size} className="px-4 py-1">{item[s.size]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Media Panel - Desktop */}
          <div className='lg:col-span-7 relative lg:block hidden'>
            <div className='relative flex items-center justify-center transition-all duration-500 ease-in-out'>
              <div className="flex md:gap-10 w-full mt-[-45px] 2xl:mt-[-100px] justify-end items-center overflow-hidden h-auto ">
                <div className="animation-image-container">
                  {firstImages.length > 0 && (
                    <img
                      src={maleImages[maleIndex]}
                      className="h-[90vh]"
                      alt="First Variant Animation"
                    />
                  )}
                </div>
                <div className="animation-image-container">
                  {secondImages.length > 0 && (
                    <img
                      src={femaleImages[femaleIndex]}
                      className="h-[90vh]"
                      alt="Second Variant Animation"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* <div className="max-w-[600px] mt-[15vh] w-full mx-auto">
              <img
                src={selectedColor === 'Black' ? maleBlackImages[7] : maleBeigeImages[7]}
                alt="Bottom Detail"
                className="w-full h-[90vh] object-contain"
              />

            </div> */}
            <div className="w-full flex flex-row gap-5 mt-[15vh]  justify-end">
  {selectedColor === 'Black' ? (
    <>
      <img
        src={bottomBlackMaleImage}
        alt="Black Male"
        className=" w-[50%] object-contain"
      />
      {hasExtendedImages && bottomBlackFemaleImage && (
        <img
          src={bottomBlackFemaleImage}
          alt="Black Female"
          className=" w-[50%] object-contain"
        />
      )}
    </>
  ) : (
    <>
      <img
        src={bottomBeigeMaleImage}
        alt="Beige Male"
        className=" h-[90vh] object-contain"
      />
      {hasExtendedImages && bottomBeigeFemaleImage && (
        <img
          src={bottomBeigeFemaleImage}
          alt="Beige Female"
          className=" h-[90vh] object-contain"
        />
      )}
    </>
  )}
</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;