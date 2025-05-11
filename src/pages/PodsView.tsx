import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
} from "@mui/material";
import Header from "../components/Header";
import axios from "axios";

interface Pod {
  NAME: string;
  NAMESPACE: string;
  STATUS: string;
  RESTARTS: string;
  NODE: string;
  IP: string;
  AGE: string;
  READY: string;
  CPU: string;
  MEMORY: string;
}

const PodsView: React.FC = () => {
  const [pods, setPods] = useState<Pod[]>([]);
  const [filteredPods, setFilteredPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [namespaceFilter, setNamespaceFilter] = useState<string>("All");
  const [namespaceList, setNamespaceList] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 9;

  useEffect(() => {
    fetchPods();
  }, []);

  const fetchPods = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/k8s/pods");
      if (response.data.success) {
        setPods(response.data.data);
        setFilteredPods(response.data.data);

        const namespaces = [...new Set(response.data.data.map((pod: Pod) => pod.NAMESPACE))];
        setNamespaceList(["All", ...namespaces]);
      } else {
        setError("Failed to load pods data.");
      }
    } catch (err) {
      setError("Error fetching pods data.");
    } finally {
      setLoading(false);
    }
  };

  const handleNamespaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedNamespace = event.target.value;
    setNamespaceFilter(selectedNamespace);
    setPage(1);

    if (selectedNamespace === "All") {
      setFilteredPods(pods);
    } else {
      const filtered = pods.filter((pod) => pod.NAMESPACE === selectedNamespace);
      setFilteredPods(filtered);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getCellStyle = (value: string) => {
    const percentage = parseFloat(value.match(/\((\d+\.?\d*)%\)/)?.[1] || "0");
    return {
      color: percentage > 80 ? "#d32f2f" : "#388e3c",
      fontWeight: "bold",
    };
  };

  const calculateRelativeAge = (isoDate: string): string => {
    const now = new Date();
    const date = new Date(isoDate);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const displayedPods = filteredPods.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <Header />
      <Box sx={{ mt: "70px", px: 4, flex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          Kubernetes Pods
        </Typography>
        
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            select
            label="Filter by Namespace"
            value={namespaceFilter}
            onChange={handleNamespaceChange}
            variant="outlined"
            sx={{ width: 300 }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    overflowY: "auto",
                  },
                },
              },
            }}
          >
            {namespaceList.map((namespace) => (
              <MenuItem key={namespace} value={namespace}>
                {namespace}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ overflowX: "auto", borderRadius: 2 }}>
              <Table stickyHeader sx={{ minWidth: 1000, tableLayout: "fixed" }}>
                <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Namespace</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Restarts</strong></TableCell>
                    <TableCell><strong>Node</strong></TableCell>
                    <TableCell><strong>IP</strong></TableCell>
                    <TableCell><strong>Age</strong></TableCell>
                    <TableCell><strong>Ready</strong></TableCell>
                    <TableCell><strong>CPU Usage</strong></TableCell>
                    <TableCell><strong>Memory Usage</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedPods.map((pod, index) => (
                    <TableRow 
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                        '&:hover': { backgroundColor: "#e3f2fd" },
                        fontSize: "0.875rem",
                      }}
                    >
                      <TableCell>{pod.NAME}</TableCell>
                      <TableCell>{pod.NAMESPACE}</TableCell>
                      <TableCell>
                        <Chip 
                          label={pod.STATUS} 
                          color={pod.STATUS === "Running" ? "success" : "error"} 
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell>{pod.RESTARTS}</TableCell>
                      <TableCell>{pod.NODE}</TableCell>
                      <TableCell>{pod.IP}</TableCell>
                      <TableCell>{calculateRelativeAge(pod.AGE)}</TableCell>
                      <TableCell>{pod.READY}</TableCell>
                      <TableCell sx={getCellStyle(pod.CPU)}>{pod.CPU}</TableCell>
                      <TableCell sx={getCellStyle(pod.MEMORY)}>{pod.MEMORY}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(filteredPods.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PodsView;
