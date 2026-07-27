
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = async function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { public_id } = req.query;

        if (!public_id) {
            return res.status(400).json({ error: 'public_id requis' });
        }

        const result = await cloudinary.uploader.destroy(public_id);

        res.status(200).json({
            success: true,
            result: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
