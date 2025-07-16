import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  useMediaQuery,
  IconButton,
  DialogContent,
  useTheme,
} from "@mui/material";

export function MuiModal({ open, onClose, title, children, maxWidth = "md" }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 2,
          position: "relative",
          maxHeight: "80vh",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {title}
        <IconButton
          aria-label="cerrar"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
