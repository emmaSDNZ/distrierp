export function formatDate(date) {
  return new Date(date).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}


export function formatBytes(bytes) {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}