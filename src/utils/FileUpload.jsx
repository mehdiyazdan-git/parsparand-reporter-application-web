import React, { useState } from 'react';
import styled from 'styled-components';
import useHttp from "../components/contexts/useHttp";


const FileUpload = ({ uploadUrl, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('ورود اطلاعات با فایل اکسل...');
    const [uploadStatus, setUploadStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { upload} = useHttp();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        setFileName(file ? file.name : 'ورود اطلاعات با فایل اکسل...');
        setUploadStatus('');
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('لطفاً ابتدا یک فایل انتخاب کنید.');
            return;
        }

        setIsLoading(true); // Indicate loading state
        setError(null); // Clear any previous errors

        try {
            const response = await upload({ url: encodeURI(uploadUrl) }, { file });
            if (response.status === 200) {
                setUploadStatus('فایل با موفقیت آپلود شد.');
               await onSuccess();
                setFile(null);
                setFileName('');

                setTimeout(() => {
                    setUploadStatus('');
                    setFileName('انتخاب...');
                }, 3000);
            }
        } catch (error) {
            setError(error.message); // Set the error message from the thrown error
            console.error('Upload error:', error);
        } finally {
            setIsLoading(false); // Reset loading state regardless of success or failure
        }
    };

    return (
        <Container>
            <Label htmlFor="file-upload">{fileName}</Label>
            <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .png, .txt"
                style={{ display: 'none' }}
            />
            <Button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? 'در حال آپلود...' : 'آپلود'}
            </Button>
            {uploadStatus && (
                <Status isSuccess={uploadStatus === 'فایل با موفقیت آپلود شد.'}>
                    {uploadStatus}
                </Status>
            )}
            {error && (
                <Status isSuccess={false}>
                    {error}
                </Status>
            )}
        </Container>
    );
};

export default FileUpload;

const Status = styled.p`
      color: ${(props) => (props.isSuccess ? 'green' : 'red')};
      background-color: ${(props) => (props.isSuccess ? '#dff0d8' : '#f2dede')};
      margin-top: 8px;
      text-align: center;
      width: 100%;
      padding: 10px;
      border-radius: 5px;
      transition: background-color 0.3s;
    `;

const Container = styled.div`
  direction: rtl;
  display: flex;
  flex-direction: row; // Changed to row for horizontal alignment
  align-items: center; // Vertically center the items
  gap: 10px;
  margin: 0;
`;

const Label = styled.label`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  min-width:200px;
  min-height: 40px;
  display: inline-block;
  background-color: #f8f9fa;
  text-align: right;
  cursor: pointer;
  &:hover {
    background-color: #e9ecef;
  }
`;

const Input = styled.input``;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;



