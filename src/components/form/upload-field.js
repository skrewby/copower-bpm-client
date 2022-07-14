import React, { useState } from 'react';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Typography } from '@mui/material';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export const UploadField = (props) => {
    const [files, setFiles] = useState([]);

    return (
        <>
            <Typography
                sx={{
                    color: 'text.primary',
                    fontSize: 14,
                    fontWeight: 500,
                    md: 5,
                }}
            >
                Panel Design
            </Typography>
            <FilePond
                files={files}
                allowReorder={true}
                allowMultiple={true}
                onupdatefiles={setFiles}
                labelIdle='Drop your files or <span class="filepond--label-action">Browse</span>'
            />
        </>
    );
};
