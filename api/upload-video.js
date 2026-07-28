import { supabase, STORAGE_BUCKET } from './storage.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const file = req.files?.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `video/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, file.data, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(fileName);

        res.status(200).json({
            url: publicUrl,
            public_id: fileName,
            name: file.name,
            size: file.size,
            format: fileExt,
            type: 'video',
            created_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
}
