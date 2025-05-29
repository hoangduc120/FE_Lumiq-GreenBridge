import React, { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Empty, Spin, Button } from "antd";
import axiosInstance from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const ManagePlant = () => {
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPlants = async () => {
    try {
      const res = await axiosInstance.get(`/product/gardener/${user.id}`);
      setPlants(res.data);
    } catch (err) {
      console.error("Failed to fetch plants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/product/${id}`);
      setPlants((prev) => prev.filter((plant) => plant._id !== id));
    } catch (err) {
      console.error("Failed to delete plant:", err);
    }
  };

  return (
    <div className="bg-[#fafafa] rounded-lg p-6 shadow-md min-h-[70vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#27B074]">Your Products</h1>
        <Link to="/gardener/add-plant">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-green-500"
          >
            Add Plant
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : plants.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500">You have no products yet.</span>
            }
          >
            <Link to="/gardener/add-plant">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-green-500"
              >
                Add Plant
              </Button>
            </Link>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {plants.map((plant) => (
            <div
              key={plant._id}
              onClick={() => navigate(`/gardener/edit-plant/${plant._id}`)}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col items-center text-center hover:shadow-md transition cursor-pointer relative"
            >
              <div className="absolute top-0 right-0">
                <Button
                  onClick={(e) => handleDelete(e, plant._id)}
                  icon={<DeleteOutlined />}
                  className="bg-red-500 text-white hover:bg-red-600"
                  color="danger" variant="solid"
                />
              </div>

              <img
                src={plant.photos?.[0]?.url || plant.image}
                alt={plant.name}
                className="w-28 h-28 object-cover rounded-md mb-2"
              />
              <p className="text-sm font-semibold">{plant.name}</p>
              <p className="text-xs text-gray-500">
                Rs. {plant.price} ({plant.reviews?.length || 0} reviews)
              </p>
            </div>
          ))}

          {/* Add new card */}
          <Link to="/gardener/add-plant">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-lg h-36 hover:bg-green-50 cursor-pointer transition">
              <PlusOutlined className="text-2xl text-green-600" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManagePlant;
