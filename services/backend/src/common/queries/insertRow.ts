import { NestPgPool } from "nest-pg";

export async function insertRow<T>(
  pool: NestPgPool,
  table: string,
  columns: string[],
  values: any[]
) {
  const columnValueTuples: [string, any][] = columns.map((column, index) => [
    column,
    values[index],
  ]);
  const columnValueTuplesSanitized = columnValueTuples.filter(
    ([_, value]) => value != null
  );

  return pool.rows<T>(
    `
      INSERT INTO ${table}
      (${columnValueTuplesSanitized.map(([column]) => column).join(",")})
      VALUES (${columnValueTuplesSanitized.map((o, i) => `$${++i}`).join(",")})
      RETURNING *;
    `,
    columnValueTuplesSanitized.map(([_, value]) => value)
  );
}
