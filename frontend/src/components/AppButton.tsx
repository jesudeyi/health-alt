import React, { ComponentProps, ReactElement, forwardRef } from 'react'
import { ClipLoader } from 'react-spinners'

interface AppButtonProps extends ComponentProps<'button'> {
  bgColor?: string
  borderColor?: string
  borderWidth?: string
  buttonText: string
  disabled?: boolean
  customStyles?: string
  icon?: ReactElement
  isLoading?: boolean
  isPrimary?: boolean
  marginBottom?: string
  marginTop?: string
  onClick: () => void
  useDefault?: boolean
  width?: string
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => {
    const {
      buttonText,
      customStyles,
      icon,
      isLoading,
      isPrimary = true,
      ...nativeProps
    } = props

    return (
      <div className="text-base mx-auto flex w-full items-center justify-center transition-transform ease-in-out hover:scale-[98%]">
        <div
          className={`h-[46px] w-full rounded-md  transition-colors ease-in-out md:px-3 ${
            isPrimary
              ? 'bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600'
              : 'dark:bg-gray-900 border-2 border-teal-700'
          }`}
        >
          <button
            ref={ref}
            className={`
        flex h-full w-full items-center justify-center gap-x-2 rounded-md ${
          nativeProps.disabled ? 'opacity-30 dark:opacity-50' : ''
        }
 ${customStyles ? customStyles : ''}`}
            {...nativeProps}
          >
            <span
              className={`${icon ? 'mr-1' : ''} ${
                isPrimary ? 'text-white dark:text-white' : 'text-teal-500'
              }`}
            >
              {buttonText}
            </span>
            {isLoading && (
              <ClipLoader
                color={`${isPrimary ? '#FFF' : '#14B8A6 '}`}
                loading={isLoading}
                size={18}
              />
            )}
            {icon && !isLoading ? icon : null}
          </button>
        </div>
      </div>
    )
  }
)

AppButton.displayName = 'AppButton'

export default AppButton
