import { NestPgPool } from "nest-pg";

export async function updateRow<T>(
  pool: NestPgPool,
  id: string,
  table: string,
  columns: string[],
  values: any[]
) {
  const columnValueTuples: [string, any][] = columns.map((column, index) => [
    column,
    values[index],
  ]);
  const columnValueTuplesSanitized = columnValueTuples.filter(
    ([_, value]) => value !== undefined
  );
  const columnValueTuplesSanitizedAsString = columnValueTuplesSanitized.map(
    ([column], index) => `${column}=$${++index}`
  );

  return pool.rows<T>(
    `
      UPDATE ${table}
      SET ${columnValueTuplesSanitizedAsString}
      WHERE id = $1
      RETURNING *;
    `,
    [id, ...columnValueTuplesSanitized.map(([_, value]) => value)]
  );
}
