import { FC } from 'react'

interface NotificationProps {
  type: string
  message: string
  isVisible: boolean
  title: string
}

export const NotificationToast: FC<NotificationProps> = ({ type, message, title, isVisible }) => {
  const getAlertType = () => {
    switch (type) {
      case 'no.rules.matched':
        return 'alert-warning'
      case 'application.submitted':
        return 'alert-info'
      case 'document.requested':
      case 'document.request.created':
        return 'alert-success'
      default:
        return 'alert-success'
    }
  }

  return (
    <div className={`alert ${getAlertType()} transition-opacity duration-500 flex flex-col items-start ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="font-bold">{title.toUpperCase()}</h3>
      <p className="mt-2">{message}</p>
    </div>
  )
}
