export function getFileType(fileUrl: string) {
    if (!fileUrl) return null;

    const fileExtension = fileUrl.split('.').pop();
    if (!fileExtension) return null;

    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

    if (imageExtensions.includes(fileExtension)) {
        return 'image';
    } else if (videoExtensions.includes(fileExtension)) {
        return 'video';
    }

    return null;
}
