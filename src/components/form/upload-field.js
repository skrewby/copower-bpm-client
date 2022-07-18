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
import { bpmServer } from '../../api/bpm/bpm-server';
import { bpmAPI } from '../../api/bpm/bpm-api';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export const UploadField = (props) => {
    const { formik, name, onUpload, onDelete, allowMultiple = false } = props;
    const [files, setFiles] = useState([]);

    const onFileUpload = async (error, file) => {
        if (error) {
            console.log(error);
            return;
        }

        const response = await bpmAPI.addFile({
            name: file.filename,
            extension: file.fileExtension,
            path: file.serverId,
            pondID: file.id,
        });

        if (formik) {
            formik.setFieldValue(name, response.id);
        }

        if (onUpload) {
            try {
                onUpload(file, response.id);
            } catch (error) {
                console.log('Error on provided upload function');
                console.log(error.message);
            }
        }
    };

    const onFileDelete = async (error, file) => {
        if (error) {
            console.log(error);
            return;
        }
        // Save the id because it will disappear after deleting the file
        const file_id = file.id;

        await bpmAPI.deleteFile(file.id);

        if (formik) {
            formik.resetForm({ values: { ...formik.values, name: '' } });
        }

        if (onDelete) {
            try {
                onDelete(file_id);
            } catch (error) {
                console.log('Error on provided delete function');
                console.log(error.message);
            }
        }
    };

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
                onupdatefiles={setFiles}
                data-max-file-size="10MB"
                allowMultiple={allowMultiple}
                labelIdle='Drop your files or <span class="filepond--label-action">Browse</span>'
                name="files"
                server={bpmServer.uploadURL()}
                onprocessfile={onFileUpload}
                onremovefile={onFileDelete}
                credits={false}
            />
        </>
    );
};
