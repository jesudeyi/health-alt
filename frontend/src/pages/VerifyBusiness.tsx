import React, { useState, useRef } from 'react'
import axios from 'axios'
import { PiUploadBold } from 'react-icons/pi'
import { BsQrCodeScan } from 'react-icons/bs'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { IoSendSharp } from 'react-icons/io5'
import Header from 'components/Header'
import { Business } from '../../types'
import jsQR from 'jsqr'
import { QrReader } from 'react-qr-reader'
import AppButton from 'components/AppButton'
import { ClipLoader } from 'react-spinners'
const VerifyBusiness = () => {
  const [verifiedBusiness, setVerifiedBusiness] = useState<Business | null>(
    null
  )
  const [report, setReport] = useState('')
  const [isVerifyingBusiness, setIsVerifyingBusiness] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isReportingBusiness, setIsReportingBusiness] = useState(false)
  const [isShowingReportForm, setIsShowingReportForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleScan = async (data: string | null) => {
    if (data) {
      setIsVerifyingBusiness(true)

      // await fetchBusiness(data)

      setTimeout(() => {
        setVerifiedBusiness({
          _id: 'ABCDEFGH',
          address: '123, Gbagada Expressway, Lagos, Nigeria',
          menu: [
            {
              ingredients: 'Yam Flour',
              name: 'Amala'
            }
          ],
          name: 'Iya Moria',
          regNumber: 123456,
          reports: []
        })
        setIsVerifyingBusiness(false)
        setIsScanning(false)
      }, 2000)
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()

        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
          context?.drawImage(img, 0, 0, img.width, img.height)
          const imageData = context?.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          )

          if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height)
            setIsUploading(false)
            if (code) {
              console.log('CODE: ', code)
              await handleScan(code.data)
            } else {
              console.error('No QR code found in the image')
              alert('No QR code found in the image uploaded')
              // You might want to show an error message to the user here
            }
          }
        }

        img.src = e.target?.result as string
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
        setIsUploading(false)
        alert(
          'We encountered an issue while reading the QR Code. Please try again'
        )
      }

      reader.readAsDataURL(file)
    }
  }

  const fetchBusiness = async (regNumber: string) => {
    try {
      // const response = await axios.get(`/api/v1/business?regNumber=${regNumber}`)
      // if (response.status === 200) {
      //   setVerifiedBusiness(response.data)
      // }
    } catch (error) {
      console.error('Error fetching business:', error)
      alert(
        'An error occurred while fetching business details. Please try again later.'
      )
    }
  }

  const submitReport = async () => {
    setIsReportingBusiness(true)

    try {
      // const response = await axios.put(
      //   `/api/v1/business/${verifiedBusiness?._id}`,
      //   {
      //     updatedFields: {
      //       ...verifiedBusiness,
      //       reports: [...verifiedBusiness?.reports, report]
      //     }
      //   }
      // )

      // if (response.status === 200) {
      //   alert('Report submitted successfully')
      //   setReport('')
      //   setIsShowingReportForm(false)
      // }

      setTimeout(() => {
        alert('Report submitted successfully')
        setReport('')
        setIsShowingReportForm(false)
      }, 2000)
    } catch (error) {
      console.error('Error submitting report:', error)
      alert(
        'An error occurred while submitting your report. Please try again later.'
      )
    } finally {
      setIsReportingBusiness(false)
    }
  }

  return (
    <main className="relative flex flex-col items-start justify-center">
      <Header />

      <div className="no-scrollbar mx-auto mt-8 flex h-[60vh] w-full flex-col items-center overflow-y-scroll rounded-3xl bg-gray-800 px-4 pb-2 pt-8 md:h-[70vh] md:w-1/2">
        {verifiedBusiness ? (
          <>
            <div className="w-full flex items-center justify-between mb-12 text-center">
              <div className="flex items-center justify-start">
                <button
                  onClick={() =>
                    isReportingBusiness
                      ? setIsReportingBusiness(false)
                      : setVerifiedBusiness(null)
                  }
                  className="rounded-full p-2 transition-colors ease-in-out dark:hover:bg-gray-900"
                >
                  <FaArrowLeftLong size={24} className="text-teal-500" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl text-teal-500">
                  {isShowingReportForm
                    ? `REPORT ${verifiedBusiness.name.toUpperCase()}`
                    : 'VERIFICATION SUCCESSFUL'}
                </h2>
                <h4 className="text-sm text-gray-400">
                  Let&apos;s hear your complaints and feedback on this business
                </h4>
              </div>
            </div>

            {isShowingReportForm ? (
              <>
                <div className="w-full md:px-12 my-auto">
                  <textarea
                    name="report"
                    rows={8}
                    value={report}
                    placeholder="Detail your report here..."
                    className="w-full rounded-lg  border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-teal-700 resize-none"
                    onChange={(e) => setReport(e.target.value)}
                  />
                </div>

                <div className="w-1/3 mt-auto mx-auto">
                  <AppButton
                    buttonText="Submit"
                    disabled={isReportingBusiness || !report}
                    isLoading={isReportingBusiness}
                    icon={<IoSendSharp size={18} />}
                    onClick={submitReport}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-full md:px-12 my-auto">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-gray-400">
                    <p className="text-lg text-teal-500">NAME</p>
                    <p className="text-lg">{verifiedBusiness.name}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg text-teal-500">ADDRESS</p>
                    <p className="text-lg">{verifiedBusiness.address}</p>
                  </div>
                </div>

                <div className="w-1/3 mt-auto mx-auto">
                  <AppButton
                    buttonText="Report Business"
                    isLoading={isReportingBusiness}
                    isPrimary={false}
                    onClick={() => setIsShowingReportForm(true)}
                  />
                </div>
              </>
            )}
          </>
        ) : isVerifyingBusiness ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <ClipLoader
              color={'#14B8A6 '}
              loading={isVerifyingBusiness}
              size={65}
            />

            <p className="text-lg text-center">VERIFYING BUSINESS...</p>
          </div>
        ) : isScanning ? (
          <div className="w-full max-w-sm">
            <div className="text-center">
              <h2 className="text-2xl text-teal-500">SCAN BUSINESS QR CODE</h2>
              <h4 className="text-sm text-gray-400">
                Fit the QR code in the frame below
              </h4>
            </div>

            <QrReader onScan={handleScan} style={{ width: '100%' }} />

            <button
              className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white"
              onClick={() => setIsScanning(false)}
            >
              Cancel Scan
            </button>
          </div>
        ) : (
          <>
            <div className="mb-12 text-center">
              <h2 className="text-2xl text-teal-500">VERIFY BUSINESS</h2>
              <h4 className="text-sm text-gray-400">
                Scan QR code or upload from your device
              </h4>
            </div>

            <div className="flex w-full items-center justify-center space-x-6">
              <div
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-y-8 rounded-xl bg-gray-900 p-4 transition-transform ease-in-out hover:scale-105 md:h-64 md:w-[45%]"
                onClick={() => setIsScanning(true)}
              >
                <BsQrCodeScan className="size-28 text-teal-600" />
                <button className="mx-auto w-fit text-center text-2xl font-bold text-teal-500 md:text-xl">
                  Scan QR Code
                </button>
              </div>

              <div
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-y-8 rounded-xl bg-gray-900 p-4 transition-transform ease-in-out hover:scale-105 md:h-64 md:w-[45%]"
                onClick={() => fileInputRef.current?.click()}
              >
                <PiUploadBold className="size-28 text-teal-600" />
                <button className="mx-auto w-fit text-center text-2xl font-bold text-teal-500 md:text-xl">
                  Upload From Device
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default VerifyBusiness
