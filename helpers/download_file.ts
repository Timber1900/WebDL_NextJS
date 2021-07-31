export default function download_file(data: Uint8Array, name: string) {
  const newBlob = new Blob([data]);
  const blobUrl = window.URL.createObjectURL(newBlob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
