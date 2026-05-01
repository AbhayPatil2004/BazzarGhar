'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SellerOrderCard from '../components/order/SellerOrderCard';
import SellerOrderDetailsModal from '../components/order/SellerOrderDetailsModal';
import AcceptRejectModal from '../components/order/AcceptRejectModal';
import UpdateStatusModal from '../components/order/UpdateStatusModal';
import SendOTPModal from '../components/order/SendOTPModal';
import './sellerOrders.css';

const SellerOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showSendOTPModal, setShowSendOTPModal] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter && { status: statusFilter })
      });

      const response = await axios.get(
        `${API_BASE_URL}/order-management/seller/orders?${queryParams}`,
        { withCredentials: true }
      );

      const { orders: fetchedOrders, pagination } = response.data.data;
      setOrders(fetchedOrders || []);
      setTotalPages(pagination.pages);
      setError('');
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleAcceptReject = (order) => {
    setSelectedOrder(order);
    setShowAcceptRejectModal(true);
  };

  const handleAcceptOrder = async (orderId, itemIndices) => {
    try {
      await axios.post(
        `${API_BASE_URL}/order-management/seller/accept`,
        { orderId, itemIndices },
        { withCredentials: true }
      );

      alert('Order accepted successfully');
      setShowAcceptRejectModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Error accepting order:', err);
      alert(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId, itemIndices, reason) => {
    try {
      await axios.post(
        `${API_BASE_URL}/order-management/seller/reject`,
        { orderId, itemIndices, reason },
        { withCredentials: true }
      );

      alert('Order rejected successfully');
      setShowAcceptRejectModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert(err.response?.data?.message || 'Failed to reject order');
    }
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setShowUpdateStatusModal(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.post(
        `${API_BASE_URL}/order-management/seller/update-status`,
        { orderId, newStatus },
        { withCredentials: true }
      );

      alert('Order status updated successfully');
      setShowUpdateStatusModal(false);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSendOTP = (order) => {
    setSelectedOrder(order);
    setShowSendOTPModal(true);
  };

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'seller-requested', label: 'Seller Requested' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rejected-by-seller', label: 'Rejected' }
  ];

  return (
    <div className="seller-orders-container">
      <div className="seller-orders-header">
        <h1>Seller Order Management</h1>
        <button 
          onClick={() => router.back()}
          className="back-button"
        >
          ← Back
        </button>
      </div>

      {/* Statistics */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{orders.length}</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-label">Pending</div>
          <div className="stat-value">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className="stat-card confirmed">
          <div className="stat-label">Confirmed</div>
          <div className="stat-value">
            {orders.filter(o => o.status === 'confirmed').length}
          </div>
        </div>
        <div className="stat-card delivered">
          <div className="stat-label">Delivered</div>
          <div className="stat-value">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="seller-orders-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading State */}
      {loading && <div className="loading">Loading seller orders...</div>}

      {/* Orders List */}
      {!loading && orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found</p>
          <button 
            onClick={() => router.push('/seller/dashboard')}
            className="dashboard-button"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="orders-grid">
            {orders.map((order) => (
              <SellerOrderCard
                key={order._id}
                order={order}
                onViewDetails={() => handleViewDetails(order)}
                onAcceptReject={() => handleAcceptReject(order)}
                onUpdateStatus={() => handleUpdateStatus(order)}
                onSendOTP={() => handleSendOTP(order)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showDetailsModal && (
        <SellerOrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAcceptRejectModal && (
        <AcceptRejectModal
          order={selectedOrder}
          onClose={() => setShowAcceptRejectModal(false)}
          onAccept={handleAcceptOrder}
          onReject={handleRejectOrder}
        />
      )}

      {showUpdateStatusModal && (
        <UpdateStatusModal
          order={selectedOrder}
          onClose={() => setShowUpdateStatusModal(false)}
          onStatusUpdate={handleStatusUpdate}
          onSendOTP={handleSendOTP}
        />
      )}

      {showSendOTPModal && (
        <SendOTPModal
          order={selectedOrder}
          onClose={() => setShowSendOTPModal(false)}
          onSuccess={() => {
            setShowSendOTPModal(false);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default SellerOrdersPage;
