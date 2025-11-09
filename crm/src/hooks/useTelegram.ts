import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
            is_premium?: boolean
          }
          chat_instance?: string
          chat_type?: string
          auth_date?: number
          hash: string
        }
        version: string
        platform: string
        colorScheme: 'light' | 'dark'
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
          secondary_bg_color?: string
        }
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        ready: () => void
        close: () => void
        expand: () => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          showProgress: (leaveActive?: boolean) => void
          hideProgress: () => void
        }
        BackButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        showPopup: (params: {
          title?: string
          message: string
          buttons?: Array<{
            id?: string
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
            text?: string
          }>
        }, callback?: (buttonId: string) => void) => void
        showAlert: (message: string, callback?: () => void) => void
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
        sendData: (data: string) => void
      }
    }
  }
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

export interface TelegramWebApp {
  user: TelegramUser | null
  initData: string
  initDataUnsafe: Record<string, unknown>
  isReady: boolean
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
  viewportHeight: number
  platform: string
  version: string
}

export const useTelegram = (): TelegramWebApp & {
  showMainButton: (text: string, onClick: () => void) => void
  hideMainButton: () => void
  showBackButton: (onClick: () => void) => void
  hideBackButton: () => void
  hapticFeedback: (style: 'light' | 'medium' | 'heavy') => void
  showAlert: (message: string) => Promise<void>
  showConfirm: (message: string) => Promise<boolean>
  close: () => void
  expand: () => void
  sendData: (data: string) => void
} => {
  const [isReady, setIsReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [webApp, setWebApp] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      setWebApp(tg)
      tg.ready()
      setIsReady(true)
      if (!tg.isExpanded) {
        tg.expand()
      }
    } else {
      setIsReady(true)
    }
  }, [])

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text)
      webApp.MainButton.onClick(onClick)
      webApp.MainButton.show()
    }
  }

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide()
    }
  }

  const showBackButton = (onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick)
      webApp.BackButton.show()
    }
  }

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide()
    }
  }

  const hapticFeedback = (style: 'light' | 'medium' | 'heavy') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(style)
    }
  }

  const showAlert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (webApp?.showAlert) {
        webApp.showAlert(message, () => resolve())
      } else {
        alert(message)
        resolve()
      }
    })
  }

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp?.showConfirm) {
        webApp.showConfirm(message, (confirmed: boolean) => resolve(confirmed))
      } else {
        resolve(confirm(message))
      }
    })
  }

  const close = () => {
    if (webApp?.close) {
      webApp.close()
    }
  }

  const expand = () => {
    if (webApp?.expand) {
      webApp.expand()
    }
  }

  const sendData = (data: string) => {
    if (webApp?.sendData) {
      webApp.sendData(data)
    }
  }

  return {
    user: webApp?.initDataUnsafe?.user || null,
    initData: webApp?.initData || '',
    initDataUnsafe: webApp?.initDataUnsafe || {},
    isReady,
    colorScheme: webApp?.colorScheme || 'light',
    themeParams: webApp?.themeParams || {},
    viewportHeight: webApp?.viewportHeight || window.innerHeight,
    platform: webApp?.platform || 'unknown',
    version: webApp?.version || 'unknown',
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    close,
    expand,
    sendData
  }
}