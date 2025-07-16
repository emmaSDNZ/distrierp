"use client";

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import InternalContainer from '../../components/internal/InternalContainer';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const theme = useTheme();

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploaded(true);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleRemoveFile = () => {
    setFile(null);
    setFileUploaded(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="start" width="100%" mt={8} px={2}>
      {!fileUploaded ? (
        <Paper
          {...getRootProps()}
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 700,
            
            px: 6,
            py: 8,
            border: '2px solid',
            borderColor: isDragActive ? theme.palette.primary.main : 'grey.400',
            bgcolor: isDragActive ? theme.palette.action.hover : 'white',
            cursor: 'pointer',
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              backgroundColor: theme.palette.action.hover,
            },
            borderRadius: 2,
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          <input {...getInputProps()} />
          {file ? (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <InsertDriveFileIcon color="success" fontSize="large" />
              <Typography variant="subtitle1" mt={1} color="textPrimary">
                Archivo seleccionado:
              </Typography>
              <Typography variant="body1" color="primary" fontWeight="medium">
                {file.name}
              </Typography>
              <IconButton onClick={handleRemoveFile} color="error" aria-label="Cambiar archivo">
                <RestartAltIcon />
              </IconButton>
              <Typography variant="caption" color="error" sx={{ userSelect: 'none' }}>
                Cambiar archivo
              </Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1.2}>
              <UploadFileIcon sx={{ fontSize: 36, color: theme.palette.primary.main }} />
              <Typography variant="h6" color="textPrimary" fontWeight="bold" mb={0.5}>
                Arrastrá o subí el archivo
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={0.5}>
                Archivos soportados: <strong>.xlsx</strong>, <strong>.csv</strong>
              </Typography>
              <Typography variant="caption" color="textSecondary" mb={1}>
                Tamaño máximo recomendado: 5MB
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ textDecoration: 'underline', fontWeight: 500, userSelect: 'none', cursor: 'pointer' }}
              >
                Seleccionar archivo manualmente
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        <Box mt={5} width="100%" maxWidth={700}>
          <InternalContainer file={file} />
        </Box>
      )}
    </Box>
  );
}
