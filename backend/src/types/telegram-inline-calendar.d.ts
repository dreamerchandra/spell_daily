declare module 'telegram-inline-calendar' {
  import type TelegramBot from 'node-telegram-bot-api';
  export interface CalendarOptions {
    /**
     * Language for calendar labels (default: 'en')
     */
    language?: string;

    /**
     * Date format using dayjs format tokens (default: 'YYYY-MM-DD')
     */
    date_format?: string;

    /**
     * Bot API framework being used (default: 'node-telegram-bot-api')
     */
    bot_api?: 'node-telegram-bot-api' | 'telegraf' | 'telebot' | 'grammy';

    /**
     * Close calendar after date selection (default: true)
     */
    close_calendar?: boolean;

    /**
     * Starting day of the week (0 = Sunday, 1 = Monday, etc.) (default: 0)
     */
    start_week_day?: number;

    /**
     * Enable time selector mode (default: false)
     */
    time_selector_mod?: boolean;

    /**
     * Time range for time selector (default: "00:00-23:59")
     */
    time_range?: string;

    /**
     * Time step for time selector (e.g., "30m", "1h") (default: "30m")
     */
    time_step?: string;

    /**
     * Allow user to select language (default: false)
     */
    user_lang_select?: boolean;

    /**
     * Skip years in navigation (default: false)
     */
    skip_years?: number | false;

    /**
     * Start date limit ('now' or date string) (default: false)
     */
    start_date?: string | 'now' | false;

    /**
     * Stop date limit ('now' or date string) (default: false)
     */
    stop_date?: string | 'now' | false;

    /**
     * Custom start message (default: false)
     */
    custom_start_msg?: string | false;

    /**
     * Lock specific datetimes (default: false)
     */
    lock_datetime?: boolean;

    /**
     * Lock specific dates (default: false)
     */
    lock_date?: boolean;
  }

  export default class Calendar {
    constructor(bot: any, options?: CalendarOptions);

    /**
     * The bot instance
     */
    bot: any;

    /**
     * Calendar options
     */
    options: Required<CalendarOptions>;

    /**
     * Map of chat IDs to message IDs for tracking active calendars
     */
    chats: Map<number, number>;

    /**
     * User language map (available when user_lang_select is enabled)
     */
    user_lang?: Map<number, string>;

    /**
     * Array of locked datetimes (available when lock_datetime is enabled)
     */
    lock_datetime_array?: string[];

    /**
     * Array of locked dates (available when lock_date is enabled)
     */
    lock_date_array?: string[];

    /**
     * Start the calendar navigation
     */
    startNavCalendar(msg: any): void;

    /**
     * Start the time selector
     */
    startTimeSelector(msg: any): void;

    /**
     * Handle calendar button clicks
     * @returns Selected date string or -1 if navigation button
     */
    clickButtonCalendar(query: any): string | -1;

    /**
     * Change the calendar language
     */
    changeLang(lang: string): void;

    /**
     * Create the start calendar UI
     */
    createStartCalendar(msg: any): void;

    /**
     * Create the start time selector UI
     */
    createTimeSelector(
      msg: any,
      date: Date,
      from_calendar: boolean
    ): TelegramBot.InlineKeyboardMarkup;

    /**
     * Check current language for a chat
     */
    checkLanguage(chat_id: number): string;

    /**
     * Check current language for a chat
     */
    createNavigationKeyboard(lan: any, date: Date): TelegramBot.InlineKeyboardMarkup;
  }
}
