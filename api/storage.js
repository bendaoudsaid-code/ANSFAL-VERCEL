
// ==================== STORAGE POUR VERCEL ====================
// Ce fichier simule un stockage persistant
// En production, utilisez une vraie base de données

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
        const body = JSON.parse(req.body);
        const { action, key, value } = body;

        // ⚠️ ATTENTION : Vercel n'a pas de stockage persistant
        // Pour une solution de production, utilisez :
        // - MongoDB Atlas (gratuit)
        // - Supabase (gratuit)
        // - Vercel KV (payant)
        // - Cloudflare D1 (gratuit)

        // SOLUTION TEMPORAIRE : Stockage en mémoire
        // ⚠️ Les données seront perdues à chaque redémarrage
        if (action === 'get') {
            // Renvoyer null car pas de stockage persistant
            return res.status(200).json({ 
                value: null,
                message: 'Utilisez localStorage côté client'
            });
        } else if (action === 'set') {
            return res.status(200).json({ 
                success: true,
                message: 'Données stockées côté client'
            });
        } else if (action === 'remove') {
            return res.status(200).json({ 
                success: true,
                message: 'Données supprimées côté client'
            });
        } else {
            return res.status(400).json({ error: 'Action non reconnue' });
        }
    } catch (error) {
        console.error('Storage error:', error);
        res.status(500).json({ error: error.message });
    }
};
