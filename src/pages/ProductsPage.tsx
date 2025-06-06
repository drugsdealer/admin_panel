// src/pages/ProductsPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:8080/api/products");
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    await axios.post("http://localhost:8080/api/products", {
      name: newProduct.name,
      price: Number(newProduct.price),
    });
    setNewProduct({ name: "", price: "" });
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:8080/api/products/${id}`);
    fetchProducts();
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Управление товарами</Typography>
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="Название товара"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <TextField
          label="Цена"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddProduct}>
          ДОБАВИТЬ
        </Button>
      </Box>
      <List>
        {products.map((product: any) => (
          <ListItem
            key={product.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(product.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {product.name} — ${product.price}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProductsPage;