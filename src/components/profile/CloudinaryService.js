// src/utils/CloudinaryService.js

export const openUploadWidget = (callback) => {
    const uploadOptions = {
        cloudName: "dilorvvtv", // Replace with your cloud name
        sources: ["local", "url", "camera", "image_search", "google_drive", "dropbox", "instagram", "facebook"],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1,
        showAdvancedOptions: false,
        showCompletedButton: true,
        maxImageTags: 30,
        maxImageFileSize: 2000000,
        maxFileSize: 3000000,
        clientAllowedFormats: ["png", "jpg", "jpeg"],
        maxFiles: 1,
    };

    const myWidget = window.cloudinary.createUploadWidget(
        uploadOptions,
        (error, result) => {
            if (callback) {
                callback(error, result);
            }
        }
    );

    myWidget.open();
};