const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const { createClient } = require('@supabase/supabase-js');

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

            // 1. Upload vers Cloudinary
            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'ansfal',
                resource_type: 'image'
            });

            // 2. Enregistrer dans Supabase
            const { data, error } = await supabase
                .from('media')
                .insert({
                    type: 'image',
                    url: result.secure_url,
                    public_id: result.public_id,
                    name: file.originalFilename || 'Image'
                })
                .select();

            if (error) {
                console.error('Erreur Supabase:', error);
                // L'image est sur Cloudinary mais pas enregistrée
                return res.status(500).json({ 
                    error: 'Erreur lors de l\'enregistrement',
                    cloudinary: result.secure_url 
                });
            }

            // 3. Retourner la réponse
            res.status(200).json({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
                database: data
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
};
