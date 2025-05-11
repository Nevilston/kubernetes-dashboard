import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Box, Typography, Grid, Paper } from "@mui/material";
import WindowsIcon from "../assets/windows.svg"; // Make sure to have this SVG in your assets folder
import LinuxIcon from "../assets/linux.svg"; // Make sure to have this SVG in your assets folder

// Define colors for the chart
const COLORS = ["#3b82f6", "#34d399"];

const NodeDistributionChart: React.FC = () => {
  const [osDistribution, setOsDistribution] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetchNodeData();
  }, []);

  const fetchNodeData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/k8s/nodes");
      const nodes = response.data.data;

      // Counting the OS types
      const osCounts: { [key: string]: number } = { Windows: 0, Linux: 0 };

      nodes.forEach((node: any) => {
        if (node["OS-IMAGE"] && node["OS-IMAGE"].toLowerCase().includes("windows")) {
          osCounts.Windows += 1;
        } else {
          osCounts.Linux += 1;
        }
      });

      // Setting the chart data
      setOsDistribution([
        { name: "Windows Nodes", value: osCounts.Windows },
        { name: "Linux Nodes", value: osCounts.Linux }
      ]);
    } catch (error) {
      console.error("Failed to fetch node data:", error);
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        textAlign: "center", 
        borderRadius: "12px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Available Nodes by Operating System
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={osDistribution}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={60}
            label={({ name, value }) => `${name}: ${value}`}
            isAnimationActive={true}
            animationDuration={800}
          >
            {osDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      
      {/* SVG Icons for Windows and Linux (Aligned Opposite) */}
      <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={WindowsIcon} alt="Windows" style={{ height: "40px" }} />
          <Typography variant="subtitle1">Windows Nodes</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={LinuxIcon} alt="Linux" style={{ height: "40px" }} />
          <Typography variant="subtitle1">Linux Nodes</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default NodeDistributionChart;
