import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, CircularProgress, Button } from "@mui/material";
import Header from "../components/Header";
import NodeDistributionChart from "../components/NodeDistributionChart";
import axios from "axios";

interface K8sStats {
  clusters: number;
  namespaces: number;
  nodes: number;
  deployments: number;
  pods: number;
  containers: number;
  replicasets: number;
  services: number;
  daemonsets: number;
  cronjobs: number;
  jobs: number;
  statefulsets: number;
  hpas: number;
  vpas: number;
  crds: number;
  crs: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<K8sStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/k8s/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching Kubernetes stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowAll = () => setShowAll(!showAll);

  const getVisibleStats = () => {
    if (!stats) return [];
    const statEntries = Object.entries(stats);
    return showAll ? statEntries : statEntries.slice(0, 8);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ mt: "70px", px: 4, flex: 1, display: "flex", gap: 3 }}>
        {/* Node Distribution and Statistics in the Same Row */}
        <Paper 
          sx={{ 
            p: 3, 
            textAlign: "center", 
            borderRadius: "12px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)", 
            flex: "0 0 320px",
            height: "auto"
          }}
        >
          <NodeDistributionChart />
        </Paper>

        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: "12px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            flex: 1,
            backgroundColor: "#F8F9FC",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "auto"
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Kubernetes Cluster Statistics
          </Typography>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
                alignItems: "start",
                justifyContent: "center",
                height: "auto",
                minHeight: "160px"
              }}
            >
              {getVisibleStats().map(([label, value]) => (
                <Paper 
                  key={label}
                  sx={{ 
                    height: "100px", 
                    width: "150px", 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    backgroundColor: "#FFFFFF"
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: "bold", 
                      color: "#4A4A4A", 
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {label.toUpperCase()}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976D2" }}>
                    {value}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={toggleShowAll}
              sx={{ 
                textTransform: "none", 
                fontWeight: "bold", 
                backgroundColor: "#1976D2", 
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#1257A3"
                }
              }}
            >
              {showAll ? "View Less Resources" : "View More Resources"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
