
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/models";

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrderTable({ orders, isLoading }: OrderTableProps) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | null;
    direction: 'ascending' | 'descending';
  }>({
    key: 'created_at',
    direction: 'descending',
  });

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortConfig.direction === 'ascending' ? aDate - bDate : bDate - aDate;
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Order) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: Order['payment_status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Paid</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full p-6">
        <div className="flex justify-center">
          <p>Loading orders...</p>
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="w-full p-6">
        <div className="text-center">
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-muted-foreground">Orders will appear here once customers place them.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left font-medium text-muted-foreground">
              <button 
                className="flex items-center gap-1" 
                onClick={() => requestSort('id')}
              >
                Order ID
                {sortConfig.key === 'id' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </button>
            </th>
            <th className="p-3 text-left font-medium text-muted-foreground">Customer</th>
            <th className="p-3 text-left font-medium text-muted-foreground">
              <button 
                className="flex items-center gap-1" 
                onClick={() => requestSort('total_amount')}
              >
                Amount
                {sortConfig.key === 'total_amount' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </button>
            </th>
            <th className="p-3 text-left font-medium text-muted-foreground">
              <button 
                className="flex items-center gap-1" 
                onClick={() => requestSort('status')}
              >
                Status
                {sortConfig.key === 'status' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </button>
            </th>
            <th className="p-3 text-left font-medium text-muted-foreground">
              <button 
                className="flex items-center gap-1" 
                onClick={() => requestSort('payment_status')}
              >
                Payment
                {sortConfig.key === 'payment_status' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </button>
            </th>
            <th className="p-3 text-left font-medium text-muted-foreground">
              <button 
                className="flex items-center gap-1" 
                onClick={() => requestSort('created_at')}
              >
                Date
                {sortConfig.key === 'created_at' && (
                  <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </button>
            </th>
            <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/50">
              <td className="p-3">{order.id.slice(0, 8).toUpperCase()}</td>
              <td className="p-3">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
              </td>
              <td className="p-3">KES {order.total_amount.toLocaleString()}</td>
              <td className="p-3">{getStatusBadge(order.status)}</td>
              <td className="p-3">{getPaymentBadge(order.payment_status)}</td>
              <td className="p-3">{formatDate(order.created_at)}</td>
              <td className="p-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
