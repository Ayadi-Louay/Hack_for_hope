// Script temporaire pour fixer les mots de passe hashés
const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function fixPasswords() {
  const client = new Client({
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'hackforhope',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'hackforhope_db',
  });

  try {
    await client.connect();
    console.log('✅ Connecté à PostgreSQL');

    // Générer le hash pour "password123"
    const hash = await bcrypt.hash('password123', 10);
    console.log(`🔐 Hash généré : ${hash}`);

    // Mettre à jour tous les utilisateurs
    const result = await client.query('UPDATE users SET password_hash = $1', [hash]);
    console.log(`✅ ${result.rowCount} utilisateurs mis à jour`);

    // Vérifier un utilisateur
    const check = await client.query("SELECT email, password_hash FROM users WHERE email = 'psychologue.gammarth@sos.tn'");
    console.log('✅ Vérification :', check.rows[0]);

    await client.end();
    console.log('✅ Script terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur :', error);
    process.exit(1);
  }
}

fixPasswords();
