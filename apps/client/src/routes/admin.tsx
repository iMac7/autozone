import { Button } from "@/components/ui/button";
import { client } from "@/utils/client";
import { storageClient } from "@/utils/storageclient";
import { txHash } from "@lens-protocol/client";
import { fetchApp } from "@lens-protocol/client/actions";
import { useState } from "react";

export default function Admin() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<any>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
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
            const url = await storageClient.uploadFile(selectedImage);
            console.log('uploaded url=>', url)
            setUploadedUrl(url);
            //example result
            // {
            //     "storageKey": "adf9f84bd89932b1098bb44aca30afc7f7ee0269205e80fd40bb8f75032a8fd2",
            //     "gatewayUrl": "https://storage-api.testnet.lens.dev/adf9f84bd89932b1098bb44aca30afc7f7ee0269205e80fd40bb8f75032a8fd2",
            //     "uri": "lens://adf9f84bd89932b1098bb44aca30afc7f7ee0269205e80fd40bb8f75032a8fd2"
            // }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        }
    };

    async function fetch_app() {
        try {
            const result = await fetchApp(client, {
                txHash: txHash("0xe7fd241c955b0aa3b677c35fd94f4d90d315c4e30b9689be6af8ed8f39955e0f"),
            });

            if (result.isErr()) {
                console.error('Failed to fetch app:', result.error);
                alert('Failed to fetch app');
                return;
            }

            const app = result.value;
            console.log('Fetched app:', app);
        } catch (error) {
            console.error('Error fetching app:', error);
            alert('Error fetching app');
        }
    }

    return (
        <div>
            <h1>Admin</h1>
            <Button onClick={() => { }}>Create App</Button>

            <div className="mt-4">
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageSelect}
                    className="mb-4"
                />

                {previewUrl && (
                    <div className="mb-4">
                        <h3>Preview:</h3>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-[300px] max-h-[300px] object-contain"
                        />
                    </div>
                )}

                {selectedImage && (
                    <Button onClick={handleUpload} className="mb-4">
                        Upload Image
                    </Button>
                )}

                {uploadedUrl && (
                    <div>
                        <h3>Uploaded URL:</h3>
                        <p className="break-all">{uploadedUrl}</p>
                    </div>
                )}
            </div>

            <div>
                <Button onClick={fetch_app}>Fetch App</Button>
            </div>
        </div>
    );
}