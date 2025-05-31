import React, { useState, useRef } from "react";
import { Button, Input, Upload, message } from "antd";
import { SendOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import chatbotApi from "../api/chatbotApi";
import { MdKeyboardReturn } from "react-icons/md";
import { Link } from "react-router-dom";

function Chatbox() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Xin chào! Tôi là AI Assistant của GreenBridge. Tôi có thể giúp bạn gì hôm nay?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setLoading(true);

    try {
      const response = await chatbotApi.ask({ message: currentInput });
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text:
          response.data?.reply ||
          response.reply ||
          "Xin lỗi, tôi không thể trả lời ngay bây giờ.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.status === "fail") {
        console.log("2:", error?.message);

        message.error(
          error?.message.message || "Đã xảy ra lỗi khi gửi tin nhắn."
        );
        return;
      }
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      message.error("Không thể gửi tin nhắn. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const imageMessage = {
        id: Date.now().toString(),
        text: "Đã gửi hình ảnh",
        isUser: true,
        timestamp: new Date(),
        image: reader.result,
      };
      setMessages((prev) => [...prev, imageMessage]);
      setLoading(true);

      try {
        // Convert image to base64 and send to API
        const base64Image = reader.result;
        const response = await chatbotApi.ask({
          message: "Hãy phân tích hình ảnh này",
          image: base64Image,
        });

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text:
            response.data?.reply ||
            response.reply ||
            "Tôi đã nhận được hình ảnh của bạn.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error analyzing image:", error);
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: "Xin lỗi, tôi không thể phân tích hình ảnh này ngay bây giờ.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        message.error("Không thể phân tích hình ảnh. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
    return false; // Prevent upload
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-[#2D8952] text-white flex flex-col">
        <div className="p-4">
          <Link
            to="/"
            className="border-white border-3 rounded-full round w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-green-600 transition"
          >
            <MdKeyboardReturn className="text-lg" />
          </Link>
        </div>
        <div className="p-6 border-b border-green-600">
          <h2 className="text-2xl font-bold mb-2">GreenBridge AI</h2>
          <p className="text-green-200 text-sm">Trợ lý AI thông minh</p>
        </div>

        <div className="flex-1 p-4">
          <span
            className="flex items-center gap-2 w-full mb-4 bg-[#39462C] border-green-600 hover:bg-gray-600 p-2 rounded-lg"
            onClick={() => {}}
          >
            <PlusOutlined />
            Cuộc trò chuyện mới
          </span>

          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-green-600 cursor-pointer hover:bg-green-700 transition">
              <div className="text-sm font-medium">Hỏi về sản phẩm</div>
              <div className="text-xs text-green-200">2 phút trước</div>
            </div>
            <div className="p-3 rounded-lg hover:bg-green-600 cursor-pointer transition">
              <div className="text-sm font-medium">Tư vấn gói dịch vụ</div>
              <div className="text-xs text-green-200">1 giờ trước</div>
            </div>
            <div className="p-3 rounded-lg hover:bg-green-600 cursor-pointer transition">
              <div className="text-sm font-medium">Hướng dẫn sử dụng</div>
              <div className="text-xs text-green-200">Hôm qua</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-green-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-lg font-bold">
              U
            </div>
            <div>
              <div className="text-sm font-medium">Người dùng</div>
              <div className="text-xs text-green-200">Thành viên</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#FAF1E4] flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-[#2D8952]">
            Trò chuyện với AI Assistant
          </h3>
          <p className="text-gray-500 text-sm">
            Hỏi tôi bất cứ điều gì về GreenBridge!
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isUser
                    ? "bg-[#2D8952] text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="max-w-full h-auto rounded-lg mb-2"
                  />
                )}
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isUser ? "text-green-200" : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    AI đang trả lời...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-[#FAF1E4] p-4 border-t border-gray-200">
          <div className="flex items-end gap-3">
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button
                icon={<PictureOutlined />}
                size="large"
                className="border-gray-300 hover:border-[#2D8952] hover:text-[#2D8952]"
              >
                Ảnh
              </Button>
            </Upload>

            <div className="flex-1">
              <Input.TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn của bạn..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="resize-none border-gray-300 focus:border-[#2D8952]"
              />
            </div>

            <Button
              type="primary"
              icon={<SendOutlined />}
              size="large"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              className="bg-[#2D8952] border-[#2D8952] hover:bg-[#245a3f]"
            >
              Gửi
            </Button>
          </div>

          <div className="text-xs text-gray-400 mt-2 text-center">
            Nhấn Enter để gửi, Shift + Enter để xuống dòng
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
