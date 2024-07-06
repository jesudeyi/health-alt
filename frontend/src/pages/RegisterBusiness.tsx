import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { QRCodeCanvas } from 'qrcode.react'
import html2canvas from 'html2canvas'
import AppButton from 'components/AppButton'
import Header from 'components/Header'
import { IoCloseSharp, IoSendSharp } from 'react-icons/io5'
import { PiDownloadSimpleBold } from 'react-icons/pi'
import { Business, RegistrationFormData } from '../../types'

const RegisterBusiness = () => {
  const [isRegisteringBusiness, setIsRegisteringBusiness] = useState(false)
  const [isDownloadingQRCode, setIsDownloadingQRCode] = useState(false)
  const [registeredBusiness, setRegisteredBusiness] = useState<Business | null>(
    null
  )
  const formContainerRef = useRef<HTMLDivElement>(null)
  const QRCodeDownloadRef = useRef<HTMLAnchorElement>(null)
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    address: '',
    menu: [
      {
        ingredients: '',
        name: ''
      }
    ]
  })

  useEffect(() => {
    formContainerRef?.current?.scroll({
      top: formContainerRef?.current?.scrollHeight,
      behavior: 'smooth'
    })
  }, [formData.menu])

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target

    if (name === 'menu-name' || name === 'menu-ingredients') {
      setFormData((prevState) => ({
        ...prevState,
        menu: prevState.menu.map((menuItem, i) => {
          if (i === index) {
            return {
              ...menuItem,
              [name.split('-')[1]]: value
            }
          }

          return menuItem
        })
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const addMenu = () => {
    setFormData((prevState) => ({
      ...prevState,
      menu: [
        ...prevState.menu,
        {
          ingredients: '',
          name: ''
        }
      ]
    }))
  }

  const checkAddMenuBtnIsDisabled = () => {
    return formData.menu.some(
      (menuItem) => menuItem.name === '' || menuItem.ingredients === ''
    )
  }

  const removeMenu = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      menu: prevState.menu.filter((_, i) => i !== index)
    }))
  }

  const validateRegistrationForm = () => {
    // Validate input to check if all fields are filled and alert browser

    if (formData.name === '') {
      return 'Business name is required'
    }

    if (formData.address === '') {
      return 'Business address is required'
    }

    if (
      formData.menu.some(
        (menuItem) => menuItem.name === '' || menuItem.ingredients === ''
      )
    ) {
      return 'All menu items must have a name and ingredients'
    }
  }

  const registerBusiness = async () => {
    setIsRegisteringBusiness(true)

    const errorMessage = validateRegistrationForm()
    if (errorMessage) {
      alert(errorMessage)
      setIsRegisteringBusiness(false)
      return
    }

    try {
      // const response = await axios.post('/api/v1/businesses', formData)

      // if (response.status === 201) {
      //   setRegisteredBusiness(response.data)
      // }

      setRegisteredBusiness({
        ...formData,
        _id: 'ABCDEFGH',
        regNumber: 123456,
        reports: []
      })
    } catch (error) {
      console.error('Unable to register business: ', error)
      alert(
        'We encountered an issue while registering your business. Please try again.'
      )
    } finally {
      setIsRegisteringBusiness(false)
    }
    console.log(formData)
  }

  const downloadQRCode = async () => {
    setIsDownloadingQRCode(true)

    // if (QRCodeDownloadRef.current) {
    const link = document.createElement('a')
    link.download = `${registeredBusiness?.name}-qrcode.png`
    const canvas = document.querySelector('.qr-code-container canvas')

    if (canvas) {
      console.log('CANVAS: ', canvas)
      link.download = `${registeredBusiness?.name}-qrcode.png`
      await link.click()
    }
    // }

    setIsDownloadingQRCode(false)
  }

  return (
    <main className="relative flex flex-col items-start justify-center">
      <Header />

      <div
        ref={formContainerRef}
        className="no-scrollbar mx-auto mt-8 flex h-[60vh] w-full flex-col items-center rounded-3xl bg-gray-800 px-4 pt-8 pb-2 md:h-[70vh] md:w-1/2 overflow-y-scroll"
      >
        {registeredBusiness ? (
          <>
            <div className="flex-col items-center">
              <div className="mb-6 text-center">
                <h2 className="text-2xl text-teal-500">
                  CONGRATULATIONS, {registeredBusiness.name.toUpperCase()}
                </h2>
                <h4 className="text-sm text-gray-400">
                  Download your QR Code below
                </h4>
              </div>

              <div className="w-full">
                <div className="mb-6 w-full">
                  <div className="qr-code-container w-fit mx-auto">
                    <QRCodeCanvas
                      value={registeredBusiness.regNumber as unknown as string}
                      size={270}
                    />
                  </div>
                </div>

                <div className="w-1/2 mx-auto">
                  <AppButton
                    buttonText="Download"
                    isLoading={isDownloadingQRCode}
                    icon={<PiDownloadSimpleBold size={20} />}
                    onClick={downloadQRCode}
                    customStyles=""
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl text-teal-500">REGISTER BUSINESS</h2>
              <h4 className="text-sm text-gray-400">
                Please ensure you&apos;re done with the physical verification
                before proceeding
              </h4>
            </div>

            <div className="w-full self-start px-6">
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block">
                  Business Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Ex. Pipeops Foods"
                  className="w-full rounded-lg  border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-teal-700"
                  onChange={handleFormChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="mb-2 block">
                  Business Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="Ex. 123, Gbagada Expressway, Lagos, Nigeria"
                  className="w-full rounded-lg  border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-teal-700"
                  onChange={handleFormChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="menu" className="mb-2 block">
                  Menu
                </label>

                <div className="space-y-4">
                  {formData.menu.map((menuItem, index) => (
                    <div
                      key={index}
                      className="group relative flex flex-row items-center justify-between space-x-10"
                    >
                      <input
                        type="text"
                        name="menu-name"
                        onChange={(e) => handleFormChange(e, index)}
                        value={menuItem.name}
                        placeholder="Name"
                        className="w-1/2 rounded-lg border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-teal-700"
                      />
                      {index !== 0 && (
                        <button
                          onClick={() => removeMenu(index)}
                          className="group-hover:block hidden rounded-full absolute left-[39.5%] p-2 transition-colors ease-in-out dark:hover:bg-gray-900/20"
                        >
                          <IoCloseSharp size={22} className="text-teal-500" />
                        </button>
                      )}
                      <input
                        type="text"
                        name="menu-ingredients"
                        onChange={(e) => handleFormChange(e, index)}
                        value={menuItem.ingredients}
                        placeholder="Ingredients"
                        className="w-1/2 rounded-lg border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-teal-700"
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    className={`mt-4 text-teal-500 text-sm mx-auto ${
                      checkAddMenuBtnIsDisabled()
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:underline'
                    }`}
                    // Disable if at least one menu doesn't have a name and ingredients
                    disabled={checkAddMenuBtnIsDisabled()}
                    onClick={addMenu}
                  >
                    Add Menu
                  </button>
                </div>
              </div>

              <div className="w-1/4 mx-auto">
                <AppButton
                  buttonText="Submit"
                  isLoading={isRegisteringBusiness}
                  icon={<IoSendSharp size={18} />}
                  onClick={registerBusiness}
                  customStyles=""
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default RegisterBusiness
