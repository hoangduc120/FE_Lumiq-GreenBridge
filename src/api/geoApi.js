import axios from "axios";

export async function getCoordinates(address) {
  try {
    const response = await axios.post(
      "https://websocket-cloud.onrender.com/get_coordinates",
      {
        address: address,
      }
    );
    return response.data;
  } catch {
    throw new Error("Lỗi lấy tọa độ");
  }
}
