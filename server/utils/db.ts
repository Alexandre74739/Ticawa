import postgres from "postgres";

let sql: postgres.Sql | undefined;

export function useDb() {
  if (!sql) {
    const { databaseUrl } = useRuntimeConfig();
    if (!databaseUrl) throw new Error("NUXT_DATABASE_URL manquante");
    sql = postgres(databaseUrl, { max: 5, prepare: false });
  }
  return sql;
}
