function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export async function createHash(file: File) {
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    await file.arrayBuffer()
  );
  return buf2hex(digest);
}

export function calculateFileListSize(fileList?: FileList) {
  const files = fileList ? Array.from(fileList) : [];
  const bytes: number = files.reduce((prev, curr) => {
    return prev + curr.size;
  }, 0);

  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}
