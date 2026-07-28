import { supabase, STORAGE_BUCKET } from './storage.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { public_id } = req.body;
        
        if (!public_id) {
            return res.status(400).json({ error: 'No file ID provided' });
        }

        // Ne pas supprimer les URLs externes
        if (public_id.startsWith('url_')) {
            return res.status(200).json({ success: true });
        }

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([public_id]);

        if (error) throw error;

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
}
