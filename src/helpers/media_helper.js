const { unlink } = require('fs/promises');
const multer = require('multer');
const path = require('path');

const ALLOWED_EXTENSIONS = {
    'image/jpg': '.jpg', 
    'image/jpeg': '.jpeg', 
    'image/png': '.png', 
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = ALLOWED_EXTENSIONS[file.mimetype];
        if (!ext) {
            return cb(new Error(`Invalid Image type\n${file.mimetype} is not allowed.`));
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

exports.upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const ext = ALLOWED_EXTENSIONS[file.mimetype];
        let uploadError = new Error(`Invalid Image type\n${file.mimetype} is not allowed.`);
        if (!ext) {
            return cb(uploadError);
        }
        return cb(null, true);
    }
});

exports.deleteImages = async function (imageUrls, continueOnErrorName) {
    await Promise.all(
        imageUrls.map(async (imageUrl) => {
            const imagePath = path.resolve(
                __dirname,
                '..',
                'public',
                'uploads',
                path.basename(imageUrl),
            );
            try {
                await unlink(imagePath);
            } catch (error) {
                 if (error.code === continueOnErrorName) {
                    console.error(`Continuing with the next image: ${error.message}`);
                 } else {
                    console.error(`Error deleting image: ${error.message}`);
                    throw error; // Re-throw the error if it's not the expected one
                 }
            }
        })
    )
}