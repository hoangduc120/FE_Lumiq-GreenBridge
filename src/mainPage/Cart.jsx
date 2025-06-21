import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import StepProgressBar from "../utils/ProgressBar";
import { BiTrash } from "react-icons/bi";
import { Empty, Modal } from "antd";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast } from "react-toastify";
import { FiMinus, FiPlus } from "react-icons/fi";
import {
  selectCartItems,
  selectCartLoading,
  addToCart,
  removeFromCart,
  removeMultipleFromCart,
  fetchCart,
  selectCartIsFetched,
} from "../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);
  const cartIsFetched = useSelector(selectCartIsFetched);

  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonBack = useRef(null);
  const containerLeft = useRef(null);
  const container = useRef(null);
  const productRefs = useRef([]);

  const user = useMemo(() => {
    const storeUser = localStorage.getItem("user");
    return storeUser ? JSON.parse(storeUser) : null;
  }, []);

  useEffect(() => {
    if (user && !cartIsFetched) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = async () => {
    if (selectedItemId) {
      await removeItem(selectedItemId);
      setSelectedItemId(null);
      setSelectedItemName('');
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);

  useEffect(() => {
    const animateElements = () => {
      const tl = gsap.timeline();
      if (buttonBack.current) {
        tl.fromTo(
          buttonBack.current,
          { opacity: 0, x: -200 },
          { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
        );
      }
      if (productRefs.current.length > 0 && containerLeft.current) {
        tl.fromTo(
          containerLeft.current,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
        );
        tl.fromTo(
          productRefs.current,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.4, ease: "power3.out" }
        );
      }
    };

    const timeoutId = setTimeout(animateElements, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const animateContainer = () => {
      const tl = gsap.timeline();
      if (container.current) {
        tl.fromTo(
          container.current,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
        );
        tl.fromTo(
          container?.current?.querySelectorAll("h2, p, span, button"),
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, stagger: 0.1, duration: 0.3, ease: "power3.out" }
        );
      }
    };

    const timeoutId = setTimeout(animateContainer, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const getItemId = (item) => {
    if (user) {
      return item.productId?._id || item.productId;
    } else {
      return item.id;
    }
  };

  const getItemDetails = (item) => {
    if (user) {
      if (typeof item.productId === "object" && item.productId !== null) {
        return {
          id: item.productId._id,
          name: item.productId.name || "Sản phẩm không tên",
          price: item.productId.price || 0,
          image: item.productId.photos?.[0]?.url || "/placeholder.svg",
          gardener: item.productId.gardener?.name || "Không xác định",
          quantity: item.quantity || 1,
        };
      } else {
        return {
          id: item.productId,
          name: "Sản phẩm không tên",
          price: 0,
          image: "/placeholder.svg",
          gardener: "Không xác định",
          quantity: item.quantity || 1,
        };
      }
    } else {
      return {
        id: item.id,
        name: item.name || "Sản phẩm không tên",
        price: item.price || 0,
        image: item.image || "/placeholder.svg",
        gardener: "Không xác định",
        quantity: item.quantity || 1,
      };
    }
  };

  const calculateTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const itemDetails = getItemDetails(item);
      return selectedItems.includes(itemDetails.id)
        ? total + (itemDetails.price || 0) * (itemDetails.quantity || 1)
        : total;
    }, 0);
  }, [cart, selectedItems, user]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    try {
      if (user) {
        const currentItem = cart.find((item) => item.productId._id === itemId);
        const currentQuantity = currentItem?.quantity || 0;
        const quantityDifference = newQuantity - currentQuantity;

        if (quantityDifference > 0) {
          await dispatch(
            addToCart({
              productId: itemId,
              quantity: quantityDifference,
            })
          ).unwrap();
        } else if (quantityDifference < 0) {
          await dispatch(removeFromCart(itemId)).unwrap();
          await dispatch(
            addToCart({
              productId: itemId,
              quantity: newQuantity,
            })
          ).unwrap();
        }
      } else {
        toast.warn("Local cart update not implemented");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  const decreaseQuantity = (itemId) => {
    const item = cart.find((item) => getItemId(item) === itemId);
    if (!item) {
      toast.error("Item not found in cart");
      return;
    }

    const itemDetails = getItemDetails(item);
    if (itemDetails.quantity === 1) {
      setSelectedItemId(itemId);
      setSelectedItemName(itemDetails.name);
      showModal();
    } else {
      updateQuantity(itemId, itemDetails.quantity - 1);
    }
  };

  const removeItem = async (itemId) => {
    try {
      if (user) {
        await dispatch(removeFromCart(itemId)).unwrap();
      } else {
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleRemove = (id) => {
    setLoading(true);
    removeItem(id);
    setLoading(false);
  };

  const handleProceedToPayment = async () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    try {
      setLoading(true);

      const selectedProducts = cart
        .map((item) => getItemDetails(item))
        .filter((item) => selectedItems.includes(item.id));

      const orderData = {
        id: `ORDER_${Date.now()}`,
        items: selectedProducts,
        totalAmount: calculateTotalPrice + 20000,
        shippingAddress: {},
        shippingFee: 20000,
        createdAt: new Date().toISOString(),
      };

      if (user && selectedItems.length > 0) {
        await dispatch(removeMultipleFromCart(selectedItems)).unwrap();
        toast.success(`Đã xóa ${selectedItems.length} sản phẩm khỏi giỏ hàng`);

        setSelectedItems([]);
      }

      navigate("/payment", { state: { orderData } });
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      toast.error("Có lỗi xảy ra khi xử lý đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
        <div className="p-4">
          <StepProgressBar />
        </div>
        <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-primaryColor">
            Giỏ hàng trống
          </h1>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Giỏ hàng của bạn đang trống"
          />
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/viewall")}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Đi tới cửa hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 h-lvh bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out ">
      <div className="p-4">
        <StepProgressBar />
      </div>
      <Modal
        title="Bạn có chắc chắn muốn xóa sản phẩm này?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="my-auto"
      >
        <p className="pt-2 text-base text-primaryColor font-semibold">
          {selectedItemName}
        </p>
      </Modal>
      <div className="w-full xl:px-60 px-40 mx-auto pb-4">
        <button
          ref={buttonBack}
          className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 text-lg text-white font-semibold rounded-full"
          onClick={() => navigate("/viewall")}
        >
          <IoIosArrowRoundBack />
          <span>Quay lại</span>
        </button>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-6 p-8 pt-4 xl:px-60 px-40">
        <div
          ref={containerLeft}
          className="w-full lg:w-2/3 bg-white dark:bg-darkSecondary p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-bold my-4">Đơn hàng của bạn</h2>
          <hr />
          {cart.map((item, index) => {
            const itemDetails = getItemDetails(item);
            return (
              <div
                key={itemDetails.id}
                className="flex items-center justify-between p-4 border-b dark:border-darkBg"
                ref={(el) => (productRefs.current[index] = el)}
              >
                <input
                  type="checkbox"
                  className="mr-4 w-5 h-5 cursor-pointer"
                  checked={selectedItems.includes(itemDetails.id)}
                  onChange={() => toggleSelectItem(itemDetails.id)}
                />
                <img
                  src={itemDetails.image || "/placeholder.svg"}
                  alt={itemDetails.name}
                  className="w-16 h-16 object-cover rounded-md hover:scale-125 transition-transform duration-500 ease-in-out"
                />
                <div className="flex flex-col w-[40%] ml-4">
                  <h3 className="text-lg font-semibold">{itemDetails.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {(itemDetails.price || 0).toLocaleString()}đ / sản phẩm
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => decreaseQuantity(itemDetails.id)}
                    disabled={cartLoading}
                  >
                    <FiMinus />
                  </button>
                  <p className="text-center w-6">{itemDetails.quantity}</p>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() =>
                      updateQuantity(itemDetails.id, itemDetails.quantity + 1)
                    }
                    disabled={cartLoading}
                  >
                    <FiPlus />
                  </button>
                </div>
                <p className="text-sm font-bold text-green-600 px-4 w-20">
                  {(
                    (itemDetails.price || 0) * (itemDetails.quantity || 1)
                  ).toLocaleString()}
                  đ
                </p>
                <button
                  className="text-red-500 hover:text-red-700 text-xl"
                  onClick={() => {
                    setSelectedItemId(itemDetails.id);
                    setSelectedItemName(itemDetails.name);
                    showModal(); // 👉 chỉ hiện modal
                  }}
                  disabled={cartLoading}
                >
                  <BiTrash />
                </button>
              </div>
            );
          })}
        </div>

        <div
          ref={container}
          className="w-full lg:w-[30%] max-h-64 h-auto bg-white dark:bg-darkSecondary p-6 rounded-lg shadow relative lg:sticky lg:top-16"
        >
          <h2 className="text-xl font-bold mb-4">Thanh toán</h2>
          <p className="text-lg font-semibold">
            Tổng tiền sản phẩm:{" "}
            <span className="text-green-600">
              {(calculateTotalPrice || 0).toLocaleString()}đ
            </span>
          </p>
          <p className="text-lg font-semibold my-4">
            Phí vận chuyển: <span className="text-green-600">20.000đ</span>
          </p>
          <p className="text-lg font-semibold my-4">
            Tổng cộng:{" "}
            <span className="text-green-600">
              {((calculateTotalPrice || 0) + 20000).toLocaleString()}đ
            </span>
          </p>
          <div className="w-full flex justify-center">
            <button
              onClick={handleProceedToPayment}
              disabled={cartLoading || loading}
              className="w-auto bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 disabled:opacity-50"
            >
              {cartLoading || loading ? "Đang xử lý..." : "Xác nhận đơn hàng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
