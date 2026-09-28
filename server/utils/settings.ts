export interface UserSettings {
  notifications: boolean;
  channelPush: boolean;
  channelEmail: boolean;
}

export interface UserSettingsRow {
  notifications: boolean;
  channel_push: boolean;
  channel_email: boolean;
  updated_at: Date;
}

export const SETTING_KEYS = [
  "notifications",
  "channelPush",
  "channelEmail",
] as const satisfies readonly (keyof UserSettings)[];

const DEFAULTS: UserSettings = {
  notifications: true,
  channelPush: false,
  channelEmail: true,
};

export function toSettings(row?: UserSettingsRow): UserSettings {
  if (!row) return { ...DEFAULTS };
  return {
    notifications: row.notifications,
    channelPush: row.channel_push,
    channelEmail: row.channel_email,
  };
}

export async function findUserSettings(userId: string) {
  const [row] = await useDb()<UserSettingsRow[]>`
    select notifications, channel_push, channel_email, updated_at
    from user_settings where user_id = ${userId}
  `;
  return row;
}

export async function saveUserSettings(userId: string, settings: UserSettings) {
  const [row] = await useDb()<UserSettingsRow[]>`
    insert into user_settings (user_id, notifications, channel_push, channel_email)
    values (
      ${userId},
      ${settings.notifications},
      ${settings.channelPush},
      ${settings.channelEmail}
    )
    on conflict (user_id) do update set
      notifications = excluded.notifications,
      channel_push = excluded.channel_push,
      channel_email = excluded.channel_email,
      updated_at = now()
    returning notifications, channel_push, channel_email, updated_at
  `;
  return row!;
}
