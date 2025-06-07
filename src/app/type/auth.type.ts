export type Auth = {
    'token': string | null,
    'scadenza': number | null,
    'idUtente': number | null,
    'attivo': boolean | null,
    'amministratore': boolean | null,
    'membro': boolean | null,
    'nomeCompleto': string |null
}