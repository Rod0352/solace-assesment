"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
};

type ApiResponse = {
  data: Advocate[];
};

// Custom scrollbar style
const scrollbarStyle = {
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#265b4e",
    outline: "1px solid slategrey",
    borderRadius: "10px",
  },
};

// Specialties component with MUI Chips
function Specialties({ specialties }: { specialties: string[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        overflow: "auto",
        maxHeight: 90,
        ...scrollbarStyle,
      }}
    >
      {specialties.map((specialty, i) => (
        <Chip
          key={i}
          label={specialty}
          size="small"
          variant="outlined"
          sx={{ m: 0.25, color: "#265b4e" }}
        />
      ))}
    </Box>
  );
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Table headers with minimum width configuration
  const headers = [
    { title: "First Name", minWidth: 100 },
    { title: "Last Name", minWidth: 100 },
    { title: "City", minWidth: 110 },
    { title: "Degree", minWidth: 100 },
    { title: "Specialties", minWidth: 160 },
    { title: "Experience", minWidth: 30 },
    { title: "Phone", minWidth: 120 },
  ];

  // Fetch advocates from API
  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetch("/api/advocates");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse: ApiResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (err) {
        console.error("Error fetching advocates:", err);
      }
    };

    fetchAdvocates();
  }, []);

  // Reset filtered advocates when search term is empty
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAdvocates(advocates);
    }
  }, [searchTerm, advocates]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredAdvocates(advocates);
      return;
    }

    const lowercaseTerm = term.toLowerCase();
    // Filter based on search term
    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(lowercaseTerm) ||
        advocate.lastName.toLowerCase().includes(lowercaseTerm) ||
        advocate.city.toLowerCase().includes(lowercaseTerm) ||
        advocate.degree.toLowerCase().includes(lowercaseTerm) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(lowercaseTerm)
        ) ||
        advocate.yearsOfExperience.toString().includes(term)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        textAlign={"center"}
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold", color: "#265b4e" }}
      >
        Solace Advocates
      </Typography>

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <TextField
          id="search"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, city, degree, etc."
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  edge="end"
                  size="small"
                  disabled={!searchTerm}
                  onClick={resetSearch}
                >
                  <ClearIcon />
                </IconButton>
              ),
            },
          }}
          sx={{
            maxWidth: 500,
            "& .MuiOutlinedInput-root": {
              borderRadius: 50,
              borderColor: "#265b4e",
              "&:hover fieldset": {
                borderColor: "#265b4e",
              },
            },
          }}
        />
        {searchTerm && (
          <Typography variant="body2" color="text.secondary">
            Searching for:{" "}
            <Box component="span" sx={{ fontWeight: "medium" }}>
              {searchTerm}
            </Box>
            {filteredAdvocates.length > 0 ? (
              <Box component="span"> ({filteredAdvocates.length} results)</Box>
            ) : (
              <Box component="span"> (No results found)</Box>
            )}
          </Typography>
        )}
      </Box>

      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          overflow: "auto",
          maxHeight: window.innerHeight - 250,
          ...scrollbarStyle,
        }}
      >
        <Table stickyHeader sx={{ minWidth: 900 }} aria-label="advocates table">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    minWidth: header.minWidth,
                    fontWeight: "bold",
                    backgroundColor: "#265b4e",
                    color: "white",
                    whiteSpace: "nowrap",
                    padding: "16px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {header.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdvocates.length > 0 &&
              filteredAdvocates.map((advocate, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  }}
                >
                  {Object.values(advocate).map((value, i) => (
                    <TableCell key={i} sx={{ whiteSpace: "nowrap" }}>
                      {i === 4 ? (
                        <Specialties specialties={value as string[]} />
                      ) : (
                        value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
