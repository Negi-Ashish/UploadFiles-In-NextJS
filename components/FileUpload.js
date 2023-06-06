import { useState } from 'react';
import axios from 'axios';

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    console.log(event.target.files)
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      var formData = new FormData();
      console.log(formData,"this");
      console.log(formData.values(),"this");
      formData.append('file', selectedFile);
      console.log(formData.has(selectedFile),"this");

      if (selectedFile) {
        // Perform upload logic here
        console.log('File attached:', selectedFile);
        // Call your API endpoint to upload the file
        await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } 



      setMessage('File uploaded successfully');
    } catch (error) {
      setMessage('Error uploading file');
      console.error(error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!selectedFile}>
        Upload File
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}