"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Container,
  InputAdornment,
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

// Specialties component with MUI Chips
function Specialties({ specialties }: { specialties: string[] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {specialties.map((specialty, i) => (
        <Chip
          key={i}
          label={specialty}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ m: 0.25 }}
        />
      ))}
    </Box>
  );
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Table headers
  const headers = [
    "First Name",
    "Last Name",
    "City",
    "Degree",
    "Specialties",
    "Experience",
    "Phone",
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
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Solace Advocates
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          component="label"
          sx={{ display: "block", mb: 1 }}
        >
          Search Advocates
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
          <TextField
            id="search"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, city, degree, etc."
            InputProps={{
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={resetSearch}
                    aria-label="clear search"
                  >
                    <ClearIcon />
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500 }}
          />
          <Button
            variant="outlined"
            onClick={resetSearch}
            sx={{ minWidth: 100 }}
          >
            Reset
          </Button>
        </Box>
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

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="advocates table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              {headers.map((header, index) => (
                <TableCell key={index} sx={{ fontWeight: "bold" }}>
                  {header}
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
                    <TableCell key={i}>
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
