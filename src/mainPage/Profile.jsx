import React, { useEffect, useState } from "react";
import { IoMdReturnLeft, IoMdMail } from "react-icons/io";
import { Link } from "react-router-dom";
import { Avatar, Button } from "antd";
import { getUserById, updateUserById } from "../api/userApi";
import CountrySelector from "../utils/CountrySelector";
import AddressSelector from "../utils/AddressSelector";
import DateSelector from "../utils/DateSelector";
import { getCoordinates } from "../api/geoApi";

function UserProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [editedAddressInput, setEditedAddressInput] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(storedUser.id);
        setUser(response);
        setEditUser(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [storedUser.id]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (editedAddressInput.trim().length > 3) {
        try {
          const coords = await getCoordinates(editedAddressInput);
          console.log("SUGGESTIONS:", coords);
          if (coords?.suggestions) {
            setAddressSuggestions(coords.suggestions); // giả sử API trả về `suggestions`
          } else {
            setAddressSuggestions([]);
          }
        } catch (err) {
          setAddressSuggestions([]);
        }
      } else {
        setAddressSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [editedAddressInput]);

  const handleSave = async () => {
    try {
      const updated = await updateUserById(user._id, editUser);
      setUser(updated);
      setEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancel = () => {
    setEditUser(user);
    setEditing(false);
  };

  const handleChange = (field) => (e) => {
    const value = e.target?.value || e;
    setEditUser((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Link to="/">
        <span className="border-2 flex gap-1 text-[#2B8B35] p-2 rounded-full w-25 ml-40 mt-5">
          <IoMdReturnLeft />
          <p>Go back</p>
        </span>
      </Link>

      <div className="container mx-auto mt-10 max-w-6xl">
        <h2 className="text-[#3E435D] text-3xl font-semibold">
          Welcome, {user.nickName || user.fullName}
        </h2>

        <div className="flex justify-between items-end">
          <div className="flex gap-4 items-center">
            <Avatar src={user.avatar} size={70} />
            <div>
              <p className="font-semibold text-[#3E435D]">{user.fullName}</p>
              <p className="text-[#3E435D]">{user.email}</p>
            </div>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          ) : (
            <Button type="primary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="flex flex-col gap-6">
            <InputField
              label="Full Name"
              value={editUser.fullName}
              editing={editing}
              onChange={handleChange("fullName")}
            />
            <InputField
              label="Gender"
              value={editUser.gender}
              editing={editing}
              onChange={handleChange("gender")}
              type="select"
              options={["Male", "Female", "Other"]}
            />
            <InputField
              label="Phone"
              value={editUser.phone}
              editing={editing}
              onChange={handleChange("phone")}
            />
          </div>

          <div className="flex flex-col gap-6">
            <InputField
              label="Nick Name"
              value={editUser.nickName}
              editing={editing}
              onChange={handleChange("nickName")}
            />
            <div>
              <label className="block text-lg mb-1">Country</label>
              {editing ? (
                <CountrySelector
                  value={editUser.country}
                  onChange={handleChange("country")}
                  isEditing={true}
                />
              ) : (
                <div className="bg-white px-4 py-3 rounded-md border shadow-sm text-[#3E435D]">
                  {editUser.country}
                </div>
              )}
            </div>
            <div>
              <label className="block text-lg mb-1">Address</label>
              {editing ? (
                <div className="flex flex-col gap-2 relative">
                  <input
                    type="text"
                    className="w-full bg-white border px-4 py-3 rounded-md shadow-sm"
                    placeholder="Enter your address"
                    value={editedAddressInput}
                    onChange={(e) => setEditedAddressInput(e.target.value)}
                  />
                  {addressSuggestions.length > 0 && (
                    <ul className="absolute top-full mt-1 w-full max-h-48 overflow-y-auto border bg-white rounded-md shadow z-50">
                      {addressSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setEditedAddressInput(suggestion.label);
                            setEditUser({
                              ...editUser,
                              address: {
                                fullAddress: suggestion.label,
                                coordinates: suggestion.coordinates,
                              },
                            });
                            setAddressSuggestions([]);
                          }}
                        >
                          {suggestion.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="bg-white px-4 py-3 rounded-md border shadow-sm text-[#3E435D]">
                  {editUser.address?.fullAddress || "No address"}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-lg mb-1">Date of Birth</label>
          {editing ? (
            <DateSelector
              value={editUser.dateOfBirth}
              onChange={(val) => setEditUser({ ...editUser, dateOfBirth: val })}
              disabled={!editing}
            />
          ) : (
            <p className="mt-2 text-[#3E435D]">
              {`${editUser.dateOfBirth?.day || "--"}/${
                editUser.dateOfBirth?.month || "--"
              }/${editUser.dateOfBirth?.year || "--"}`}
            </p>
          )}
        </div>

        <div className="mt-8 flex gap-3 items-center">
          <IoMdMail className="text-blue-500 text-2xl" />
          <p className="text-xl text-[#3E435D]">{editUser.email}</p>
        </div>
      </div>
    </>
  );
}

const InputField = ({
  label,
  value,
  editing,
  onChange,
  type = "text",
  options = [],
}) => (
  <div>
    <label className="block text-lg mb-1">{label}</label>
    {editing ? (
      type === "select" ? (
        <select
          className="w-full bg-white border px-4 py-3 rounded-md shadow-sm"
          value={value}
          onChange={onChange}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="w-full bg-white border px-4 py-3 rounded-md shadow-sm"
          value={value}
          onChange={onChange}
        />
      )
    ) : (
      <div className="bg-white px-4 py-3 rounded-md border shadow-sm text-[#3E435D]">
        {value}
      </div>
    )}
  </div>
);

export default UserProfile;
