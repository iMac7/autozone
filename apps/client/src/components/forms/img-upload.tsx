import { Button } from "@/components/ui/button";
import { storageClient } from "@/utils/storageclient";
import { useState } from "react";

export default function ImageUpload({ uploadedUrl, setUploadedUrl }: {
    uploadedUrl: string | null
    setUploadedUrl: (url: string | null) => void
}) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                alert('Please select a PNG, JPG, or JPEG image');
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;
        try {
            const { uri } = await storageClient.uploadFile(selectedImage);
            console.log('uploaded url=>', uri)
            setUploadedUrl(uri);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        }
    };

    return (
        <div className="">
            <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleImageSelect}
                className="mb-4"
            />

            {selectedImage && <Button onClick={() => {
                setSelectedImage(null)
                setUploadedUrl(null)
            }
            } className="mb-4">
                Cancel
            </Button>}

            {selectedImage && previewUrl && (
                <div className="mb-4">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-[300px] max-h-[300px] object-contain"
                    />
                </div>
            )}

            {selectedImage && !uploadedUrl && (
                <Button onClick={handleUpload} className="mb-4">
                    Upload Image
                </Button>
            )}

        </div>
    );
}