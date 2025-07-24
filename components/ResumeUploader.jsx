'use client';

export default function ResumeUploader({ jobId }) {
    const handleUpload = async (files) => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('resumes', file);
        });
        formData.append('jobId', jobId);

        const response = await fetch('/api/jobs/upload', {
            method: 'POST',
            body: formData
        });

        return response.json();
    };

    return (
        <div>
            <input
                type="file"
                multiple
                onChange={(e) => handleUpload(e.target.files)}
                accept=".pdf"
            />
        </div>
    );
}