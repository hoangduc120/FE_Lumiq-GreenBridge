import React from "react";
import { FaLeaf, FaSeedling, FaUsers } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md";

function AboutUs() {
  return (
    <div className="min-h-screen p-8 md:p-16 text-white bg-gradient-to-br from-[#85b747] to-[#49b219]">
      <div className="text-center mb-12 px-auto mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg text-[#297F4E]">
          <span className="text-black">Về</span> GreenBridge
        </h1>
        <p className="text-xl">
          Chúng tôi cam kết kết nối con người với thiên nhiên thông qua các giải
          pháp làm vườn thông minh và bền vững.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {/* Smart Plant Care Section */}
        <div className="flex-1 basis-80 p-8 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20 transition-transform hover:scale-105 cursor-pointer">
          <div className="text-5xl mb-4 flex justify-center text-yellow-300">
            <MdSmartToy />
          </div>
          <h2 className="text-2xl mb-4 text-center max-w-70 mx-auto   text-gray-600">
            CHĂM SÓC CÂY THÔNG MINH VỚI AI
          </h2>
          <p className="text-base leading-relaxed">
            Để AI trở thành trợ lý cá nhân của bạn. Công nghệ của chúng tôi giúp
            bạn nhận diện cây, chẩn đoán vấn đề và thiết lập nhắc nhở thông minh
            một cách dễ dàng.
          </p>
        </div>

        {/* Quality Plants Section */}
        <div className="flex-1 basis-80 p-8 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20 transition-transform hover:scale-105 cursor-pointer">
          <div className="text-5xl mb-4 flex justify-center text-yellow-300">
            <FaSeedling />
          </div>
          <h2 className="text-2xl mb-4 text-center max-w-70 mx-auto text-gray-600 ">
            CÂY XANH CHẤT LƯỢNG, LỰA CHỌN TINH TẾ
          </h2>
          <p className="text-base leading-relaxed">
            Chúng tôi lựa chọn và chăm sóc từng cây để đảm bảo chúng phát triển
            tốt nhất trong không gian của bạn. Dù là nhà ở hay văn phòng,
            GreenBridge đều có loại cây phù hợp cho bạn.
          </p>
        </div>

        {/* Community Section */}
        <div className="flex-1 basis-80 p-8 rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20 transition-transform hover:scale-105 cursor-pointer">
          <div className="text-5xl mb-4 flex justify-center text-yellow-300">
            <FaUsers />
          </div>
          <h2 className="text-2xl mb-4 text-center max-w-70 mx-auto text-gray-600">
            CỘNG ĐỒNG & ĐỐI TÁC
          </h2>
          <p className="text-base leading-relaxed">
            Tham gia mạng lưới những người yêu cây và các chuyên gia cùng chung
            đam mê làm vườn thông minh, bền vững. Cùng nhau, chúng ta kiến tạo
            một môi trường xanh hơn!
          </p>
        </div>
      </div>

      <div className="text-center mt-16 pt-8 border-t border-white/20">
        <h3 className="mb-4">
          Hãy cùng chúng tôi lan tỏa sứ mệnh phủ xanh thế giới!
        </h3>
        <div className="flex justify-center mt-4">
          <FaLeaf className="text-4xl mx-2" />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
