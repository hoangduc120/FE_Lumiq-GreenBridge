import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Image, Descriptions, Tag, Input, message, Spin } from "antd";
import axiosInstance from "../../api/axios";   
import moment from "moment";

const ManageGardenerProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfiles = async () => {
    try {
      const res = await axiosInstance.get("/user/gardener/apply");
      setProfiles(res.data.data);
    } catch (err) {
      console.error("Failed to fetch profiles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await axiosInstance.patch(`/user/gardener/apply/${id}/approve`);
      message.success("Profile approved");
      setModalVisible(false);
      fetchProfiles();
    } catch (err) {
      console.error("Approval failed", err);
      message.error("Failed to approve profile");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return message.error("Please provide a rejection reason");
    setActionLoading(true);
    try {
      await axiosInstance.patch(`/user/gardener/apply/${id}/reject`, { reason: rejectReason });
      message.success("Profile rejected");
      setModalVisible(false);
      fetchProfiles();
    } catch (err) {
      console.error("Rejection failed", err);
      message.error("Failed to reject profile");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => <Tag color={status === "pending" ? "orange" : status === "approved" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Submitted At",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => { setSelectedProfile(record); setModalVisible(true); setRejectReason(""); }}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Manage Gardener Applications</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table rowKey="_id" columns={columns} dataSource={profiles} />
      )}

      <Modal
        title="Gardener Application Review"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedProfile && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Email">
                {selectedProfile.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedProfile.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Bank">
                {selectedProfile.bankName} - {selectedProfile.bankAccountNumber}
              </Descriptions.Item>
              <Descriptions.Item label="CCCD">
                {selectedProfile.nationalId}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {selectedProfile.placeAddress}
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4">
              <p className="font-semibold mb-1">Garden Photos:</p>
              <div className="flex gap-3 flex-wrap">
                {selectedProfile.gardenPhoto.map((img, idx) => (
                  <Image key={idx} src={img.url} width={100} height={100} />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-1">CCCD Photos:</p>
              <div className="flex gap-3 flex-wrap">
                {selectedProfile.nationalIdPhoto.map((img, idx) => (
                  <Image key={idx} src={img.url} width={100} height={100} />
                ))}
              </div>
            </div>

            {selectedProfile.status === "pending" && (
              <div className="mt-4 space-y-2">
                <Input.TextArea
                  rows={3}
                  placeholder="Enter rejection reason (if any)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button danger onClick={() => handleReject(selectedProfile._id)} loading={actionLoading}>
                    Reject
                  </Button>
                  <Button type="primary" onClick={() => handleApprove(selectedProfile._id)} loading={actionLoading}>
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default ManageGardenerProfile;
