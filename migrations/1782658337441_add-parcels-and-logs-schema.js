// migrations/XXXXXXXXXXXXX_add-parcels-and-logs-schema.js

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    // 1. Build the parcels table with an IF NOT EXISTS safeguard
    pgm.createTable('parcels', {
        id: 'id',
        tracking_number: { type: 'varchar(100)', notNull: true, unique: true },
        destination: { type: 'varchar(255)', notNull: true },
        weight_kg: { type: 'numeric(6,2)' },
        status: { type: 'varchar(50)', notNull: true, default: 'Pending' },
        driver_id: { 
            type: 'integer', 
            references: 'drivers(id)', 
            onDelete: 'SET NULL' // Safeguard from our relational engineering milestone!
        },
    }, { ifNotExists: true });

    // 2. Build the maintenance_logs table with an IF NOT EXISTS safeguard
    pgm.createTable('maintenance_logs', {
        id: 'id',
        ticket_number: { type: 'varchar(100)', notNull: true, unique: true },
        vehicle_type: { type: 'varchar(100)', notNull: true },
        scheduled_date: { type: 'date', notNull: true },
        status: { type: 'varchar(50)', notNull: true, default: 'Pending' },
        driver_id: { 
            type: 'integer', 
            references: 'drivers(id)', 
            onDelete: 'CASCADE' 
        },
    }, { ifNotExists: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropTable('maintenance_logs', { ifExists: true });
    pgm.dropTable('parcels', { ifExists: true });
};