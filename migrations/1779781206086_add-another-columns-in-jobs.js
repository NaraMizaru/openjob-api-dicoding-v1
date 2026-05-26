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
    pgm.addColumns("jobs", {
        job_type: {
            type: "VARCHAR(50)",
            notNull: false,
        },
        salary_min: {
            type: "INTEGER",
            notNull: false,
        },
        salary_max: {
            type: "INTEGER",
            notNull: false,
        },
        is_salary_visible: {
            type: "BOOLEAN",
            notNull: false,
            default: true,
        },
        status: {
            type: "VARCHAR(20)",
            notNull: false,
            default: "open",
        },
        experience_level: {
            type: "VARCHAR(50)",
            notNull: false,
        },
        location_type: {
            type: "VARCHAR(20)",
            notNull: false,
        },
        location_city: {
            type: "VARCHAR(100)",
            notNull: false,
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
