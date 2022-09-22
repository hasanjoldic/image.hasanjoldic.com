import { NestPgPool } from "nest-pg";

export async function findRows<T>(
  pool: NestPgPool,
  table: string,
  filters?: { column: string; value: string }[]
) {
  const validFilters = filters?.filter(({ value }) => {
    if (["null", "boolean", "number", "string"].includes(typeof value)) {
      return true;
    }
  });

  let whereClause = validFilters
    ?.map(({ column }, index) => {
      return [column, `$${index + 1}`].join(" = ");
    })
    .join(" AND ");

  if (whereClause.length > 0) {
    whereClause = `WHERE ${whereClause}`;
  }

  return pool.rows<T>(
    `
      SELECT * 
      FROM ${table}
      ${whereClause};
    `,
    validFilters.map(({ value }) => value)
  );
}
