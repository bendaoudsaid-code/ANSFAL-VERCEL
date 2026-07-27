
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async function(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const file = files.image;
            if (!file) {
                return res.status(400).json({ error: 'Aucune image' });
            }

            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'ansfal',
                resource_type: 'image'
            });

            res.status(200).json({
                url: result.secure_url,
                public_id: result.public_id
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
