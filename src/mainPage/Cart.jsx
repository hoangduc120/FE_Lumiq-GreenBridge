import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import StepProgressBar from '../utils/ProgressBar';
import { BiTrash } from 'react-icons/bi';
import { Empty, Modal } from 'antd';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { toast } from 'react-toastify';
import { cartActions } from '../redux/slices/cartSlice';
import { FiMinus, FiPlus } from 'react-icons/fi';

const Cart = () => {
  const cart = useSelector((state) => state.cart.cartItems); // Adjusted to match current state structure
  const user = useSelector((state) => state?.userState?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const productRefs = useRef([]);
  const containerLeft = useRef(null);
  const container = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonBack = useRef(null);

  // Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
    if (selectedItemId) {
      handleRemove(selectedItemId);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      buttonBack.current,
      { opacity: 0, x: -200 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
    );
    if (productRefs.current.length > 0) {
      tl.fromTo(
        containerLeft.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
      tl.fromTo(
        productRefs.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      container.current,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
    );
    tl.fromTo(
      container?.current?.querySelectorAll('h2, p, span, button'),
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.3, ease: 'power3.out' }
    );
  }, []);

  // Toggle item selection
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Calculate total price of selected items
  const calculateTotalPrice = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        selectedItems.includes(item.id) ? total + item.price * item.quantity : total,
      0
    );
  }, [cart, selectedItems]);

  // Update quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    dispatch(cartActions.updateCartItemQuantity({ itemId, quantity: newQuantity }));
    toast.success('Đã cập nhật số lượng sản phẩm');
  };

  // Decrease quantity with modal for zero
  const decreaseQuantity = (id) => {
    const cartItem = cart.find((item) => item.id === id);
    if (!cartItem) {
      console.error('Item not found in cart');
      return;
    }

    if (cartItem.quantity === 1) {
      setSelectedItemId(id);
      setSelectedItemName(cartItem.name); // Adjusted to match current item structure
      showModal();
    } else {
      updateQuantity(id, cartItem.quantity - 1);
    }
  };

  // Remove item
  const removeItem = (itemId) => {
    dispatch(cartActions.removeFromCart(itemId));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  // Handle remove with loading
  const handleRemove = (id) => {
    setLoading(true);
    removeItem(id);
    setLoading(false);
  };

  // Proceed to confirmation
  const handleProceedToPayment = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    const selectedProducts = cart.filter((item) => selectedItems.includes(item.id));
    const orderData = {
      id: `ORDER_${Date.now()}`,
      items: selectedProducts,
      totalAmount: calculateTotalPrice + 20000, // Including shipping fee
      shippingAddress: {},
      shippingFee: 20000,
      createdAt: new Date().toISOString(),
    };

    navigate('/payment', { state: { orderData } });
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
        <div className="p-4">
          <StepProgressBar />
        </div>
        <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-primaryColor">
            No items selected
          </h1>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Your cart is empty" />
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-2 bg-primaryColor text-white rounded-lg"
            >
              Go to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <div className="p-4">
        <StepProgressBar />
      </div>
      <Modal
        title="Are you sure you want to remove this item?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="my-auto"
      >
        <p className="pt-2 text-base text-primaryColor font-semibold">{selectedItemName}</p>
      </Modal>
      <div className="w-full xl:px-60 px-40 mx-auto pb-4">
        <button
          ref={buttonBack}
          className="cursor-pointer flex items-center gap-2 bg-primaryColor hover:bg-red-600 px-4 py-2 text-lg text-white font-semibold rounded-full"
          onClick={() => navigate('/menu')}
        >
          <IoIosArrowRoundBack />
          <span>Back</span>
        </button>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-6 p-8 pt-4 xl:px-60 px-40">
        <div ref={containerLeft} className="w-full lg:w-2/3 bg-white dark:bg-darkSecondary p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold my-4">Your Order</h2>
          <hr />
          {cart.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border-b dark:border-darkBg"
              ref={(el) => (productRefs.current[index] = el)}
            >
              <input
                type="checkbox"
                className="mr-4 w-5 h-5 cursor-pointer"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelectItem(item.id)}
              />
              <img
                src={item.image || '/placeholder.svg'} // Adjusted to match current item structure
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md hover:scale-125 transition-transform duration-500 ease-in-out"
              />
              <div className="flex flex-col w-[40%] ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.price.toLocaleString()}đ / product</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  <FiMinus />
                </button>
                <p className="text-center w-6">{item.quantity}</p>
                <button
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={loading}
                >
                  <FiPlus />
                </button>
              </div>
              <p className="text-sm font-bold text-primaryColor px-4 w-20">
                {(item.price * item.quantity).toLocaleString()}đ
              </p>
              <button
                className="text-headingColor hover:text-red-700 text-xl"
                onClick={() => {
                  setSelectedItemId(item.id);
                  setSelectedItemName(item.name);
                  showModal();
                }}
              >
                <BiTrash />
              </button>
            </div>
          ))}
        </div>

        <div
          ref={container}
          className="w-full lg:w-[30%] max-h-64 h-auto bg-white dark:bg-darkSecondary p-6 rounded-lg shadow relative lg:sticky lg:top-16"
        >
          <h2 className="text-xl font-bold mb-4">Payment</h2>
          <p className="text-lg font-semibold">
            Total items price:{' '}
            <span className="text-headingColor">{calculateTotalPrice.toLocaleString()}đ</span>
          </p>
          <p className="text-lg font-semibold my-4">
            Shipping cost: <span className="text-headingColor">20.000đ</span>
          </p>
          <p className="text-lg font-semibold my-4">
            Total amount:{' '}
            <span className="text-primaryColor">
              {(calculateTotalPrice + 20000).toLocaleString()}đ
            </span>
          </p>
          <div className="w-full flex justify-center">
            <button
              onClick={handleProceedToPayment}
              className="w-auto bg-primaryColor hover:bg-red-700 text-white rounded-lg p-2"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;