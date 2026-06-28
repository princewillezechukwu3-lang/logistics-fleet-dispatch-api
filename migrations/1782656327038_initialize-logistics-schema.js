// migrations/1782656327038_initialize-logistics-schema.js

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    // 1. Build the dispatchers table with an IF NOT EXISTS safeguard
    pgm.createTable('dispatchers', {
        id: 'id',
        username: { type: 'varchar(100)', notNull: true, unique: true },
        password_hash: { type: 'varchar(255)', notNull: true },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    }, { ifNotExists: true }); // 🛡️ Safeguard added here!

    // 2. Build the drivers table with an IF NOT EXISTS safeguard
    pgm.createTable('drivers', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        license_number: { type: 'varchar(100)', notNull: true, unique: true },
        status: { type: 'varchar(50)', notNull: true, default: 'Available' },
    }, { ifNotExists: true }); // 🛡️ Safeguard added here!
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropTable('drivers', { ifExists: true });
    pgm.dropTable('dispatchers', { ifExists: true });
};