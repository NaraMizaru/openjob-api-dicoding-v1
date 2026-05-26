/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("documents", {
        id: {
            type: "varchar(50)",
            primaryKey: true,
        },

        original_name: {
            type: "text",
            notNull: true,
        },

        file_name: {
            type: "text",
            notNull: true,
        },

        mime_type: {
            type: "text",
            notNull: true,
        },

        size: {
            type: "integer",
            notNull: true,
        },

        file_path: {
            type: "text",
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
};
