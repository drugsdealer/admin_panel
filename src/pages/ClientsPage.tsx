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

// Тип для клиента
interface Client {
  id: number;
  name: string;
}

const ClientsPage: React.FC = () => {
  const [name, setName] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/customers");
      console.log("Клиенты с сервера:", res.data);
      if (Array.isArray(res.data)) {
        setClients(res.data);
      } else {
        setClients([]); // если вдруг не массив
        console.error("Ожидался массив клиентов, но получен:", res.data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке клиентов", error);
    }
  };

  const addClient = async () => {
    if (!name.trim()) return;
    try {
      await axios.post("http://localhost:8080/api/customers", { name });
      setName("");
      fetchClients();
    } catch (error) {
      console.error("Ошибка при добавлении клиента", error);
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/customers/${id}`);
      fetchClients();
    } catch (error) {
      console.error("Ошибка при удалении клиента", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Управление клиентами
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Имя клиента"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button variant="contained" onClick={addClient}>
          ДОБАВИТЬ
        </Button>
      </Box>

      <List>
        {clients.map((client) => (
          <ListItem
            key={client.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteClient(client.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            {client.name}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ClientsPage;