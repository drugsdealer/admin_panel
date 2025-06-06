// src/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [newStatus, setNewStatus] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCustomerId, setNewCustomerId] = useState("");
  const [newProductIds, setNewProductIds] = useState<number[]>([]);

  const fetchOrders = async () => {
    try {
      const res = selectedCustomer
        ? await axios.get(`http://localhost:8080/api/orders/customer/${selectedCustomer}`)
        : await axios.get("http://localhost:8080/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке заказов", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке клиентов", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке продуктов", err);
    }
  };

  const createOrder = async () => {
    if (!newCustomerId || !newStatus || !newDate) return;
    try {
      await axios.post("http://localhost:8080/api/orders", {
        status: newStatus,
        date: newDate,
        customer: { id: newCustomerId },
        products: newProductIds.map((id) => ({ id })),
      });
      setNewStatus("");
      setNewDate("");
      setNewCustomerId("");
      setNewProductIds([]);
      fetchOrders();
    } catch (err) {
      console.error("Ошибка при создании заказа", err);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Ошибка при удалении заказа", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedCustomer]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Управление заказами
      </Typography>

      <FormControl fullWidth sx={{ maxWidth: 300, mb: 3 }}>
        <InputLabel id="filter-customer-label">Клиент</InputLabel>
        <Select
          labelId="filter-customer-label"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          label="Клиент"
        >
          <MenuItem value="">Все</MenuItem>
          {customers.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Новый заказ
        </Typography>
        <FormControl fullWidth sx={{ maxWidth: 300, mb: 2 }}>
          <InputLabel id="create-customer-label">Клиент</InputLabel>
          <Select
            labelId="create-customer-label"
            value={newCustomerId}
            onChange={(e) => setNewCustomerId(e.target.value)}
            label="Клиент"
          >
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Статус"
          fullWidth
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          sx={{ maxWidth: 300, mb: 2 }}
        />

        <TextField
          label="Дата"
          type="date"
          fullWidth
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          sx={{ maxWidth: 300, mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth sx={{ maxWidth: 300, mb: 2 }}>
          <InputLabel id="product-select-label">Продукты</InputLabel>
          <Select
            labelId="product-select-label"
            multiple
            value={newProductIds}
            onChange={(e) => setNewProductIds(e.target.value as number[])}
            renderValue={(selected) =>
              products
                .filter((p) => selected.includes(p.id))
                .map((p) => p.name)
                .join(", ")
            }
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={createOrder}>
          Создать заказ
        </Button>
      </Box>

      <List>
        {orders.map((order: any) => (
          <ListItem
            key={order.id}
            divider
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteOrder(order.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`Заказ #${order.id}`}
              secondary={`Клиент: ${order.customer?.name || "-"}, Статус: ${order.status}, Дата: ${order.date}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default OrdersPage;