function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // On successful file read
    reader.onload = () => resolve(reader.result);

    // On error
    reader.onerror = (error) => reject(error);

    // Read the file as a Data URL (Base64 string)
    reader.readAsDataURL(file);
  });
}

export default convertFileToBase64;
