import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { BsCamera } from 'react-icons/bs'
import { IoIosOptions } from 'react-icons/io'
import { IoSendSharp } from 'react-icons/io5'
import localData from 'cache'
interface FormData {
  allergies: string
  dietGoal: string
  dietaryPreference: string
  healthConditions: string
  fitnessLevel: string
  lifeStage: string
  meal: string
}

interface AIResponse {
  overview: string
  alternatives: Alternative[]
}


const Home = () => {
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState<boolean>(true)
  const [isFetchingResponse, setIsFetchingResponse] = useState<boolean>(false)
  const [latestAIResponse, setLatestAIResponse] = useState<AIResponse | null>(
    null
  )
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  )

  const [formData, setFormData] = useState<FormData>({
    allergies: '',
    dietGoal: '',
    dietaryPreference: '',
    healthConditions: '',
    fitnessLevel: '',
    lifeStage: '',
    meal: ''
  })

  const cachedMeals = [
    'fried puff puff',
    'shawarma',
    'jam doughnut',
    'milky doughnut'
  ]

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: [...prevData[name as keyof FormData], value]
        }))
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: prevData[name as keyof FormData].filter(
            (item) => item !== value
          )
        }))
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const validateForm = () => {
    const {
      meal,
      allergies,
      dietGoal,
      dietaryPreference,
      healthConditions,
      fitnessLevel,
      lifeStage
    } = formData

    if (!meal.trim()) {
      return false
    }

    if (
      !allergies.trim() &&
      !dietGoal.trim() &&
      !dietaryPreference.trim() &&
      !healthConditions.trim() &&
      !fitnessLevel.trim() &&
      !lifeStage.trim()
    ) {
      return false
    }

    return true
  }

  const startConversationWithAI = async () => {
    const formIsValid = validateForm()

    if (formIsValid) {
      if (cachedMeals.includes(formData.meal.toLowerCase())) {
        console.log(
          'Loading from cache: ',
          localData[formData.meal.toLowerCase()]
        )
        setIsFetchingResponse(true)
        setTimeout(() => {
          setIsFetchingResponse(false)
          setLatestAIResponse(localData[formData.meal.toLowerCase()])
        }, 2000)

        return
      }
      setIsFetchingResponse(true)
      console.log('Form data: ', formData)

      const newMessage = { role: 'user', content: JSON.stringify(formData) }

      try {
        const response = await axios.post('/api/v1/ai-conversation', {
          messageHistory: [...messages, newMessage]
        })

        if (JSON.parse(response.data.msg.content[0].text)?.error) {
          alert('Your input has no relation with food health')
        }
        const aiResponse = transformAIResponse(
          JSON.parse(response.data.msg.content[0].text)
        )

        console.log('Parsed Response: ', aiResponse)

        setLatestAIResponse(aiResponse)

        setMessages([])
      } catch (error) {
        console.error(error)
        alert(
          'We encountered a problem while trying to recommend your healthier dishes. Please try again later'
        )
      } finally {
        setIsFetchingResponse(false)
      }
    } else {
      alert(
        "Please provide your health information to help you better. We don't know you, your data is safe and doesn't leave your device"
      )
    }
  }

  const transformAIResponse = (responseBody: unknown): AIResponse => {
    const { overview, alternatives } = responseBody

    const transformedAlternatives: Alternative[] = alternatives.map(
      (alt: unknown) => ({
        name: alt.name,
        comparison: { isOpen: false, content: alt.comparison },
        ingredients: { isOpen: false, content: alt.ingredients },
        recipe: { isOpen: false, content: alt.recipe }
      })
    )

    const transformedResponse: AIResponse = {
      overview,
      alternatives: transformedAlternatives
    }

    return transformedResponse
  }


  return (
    <div className="relative flex flex-col items-start justify-center overflow-y-scroll">
      <div
        className={`my-auto ${
          sideMenuIsVisible ? 'w-2/3' : 'w-full'
        } flex-col items-center justify-center`}
      >
        {/* A. Topmost section */}
        <div className="mb-12 flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex-1 text-center">
            <h1 className="font-[cursive] text-4xl font-medium tracking-wider">
              <span>health</span>
              <span className="text-teal-500">ALT</span>
            </h1>
          </div>

          {!sideMenuIsVisible && (
            <div className="absolute right-0 top-2 flex items-center space-x-4">
              <button
                onClick={() => setSideMenuIsVisible(true)}
                className="rounded-full p-2 transition-colors ease-in-out hover:bg-gray-800 dark:bg-teal-700 dark:hover:bg-teal-600"
              >
                <IoIosOptions size={24} />
              </button>
            </div>
          )}
        </div>

        {/* B. Next section */}
        <div
          className={`mx-auto h-full ${
            sideMenuIsVisible ? 'w-3/4' : 'w-1/2'
          } space-y-4 px-4`}
        >
          {/* Greeting */}
          <h2 className="text-center text-4xl font-medium">
            Hello, My Favorite Human
          </h2>

          {/* Input section */}
          <div className="relative">
            <input
              value={formData.meal}
              onChange={handleFormChange}
              name="meal"
              type="text"
              placeholder="What junk am I helping you with today?"
              className="w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 outline-none transition-colors ease-in-out focus:outline-none focus:ring-2  focus:ring-teal-700 dark:border-teal-800 dark:bg-gray-800 dark:hover:border-teal-700"
            />
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 space-x-2">
              <button
                disabled={isFetchingResponse}
                className="rounded-lg border px-3 py-2 dark:border-teal-900/80 dark:bg-gray-900"
              >
                <BsCamera size={18} />
              </button>
              <button
                disabled={isFetchingResponse}
                onClick={startConversationWithAI}
                className={`flex items-center rounded-lg text-white bg-teal-700 px-3 py-2 transition-colors ease-in-out dark:bg-teal-500 dark:hover:bg-teal-600 ${
                  isFetchingResponse ? 'opacity-70' : ''
                }`}
              >
                <span className="mt-0.5">healthALT</span>
                {isFetchingResponse ? (
                  <ClipLoader
                    color={'#FFF'}
                    loading={isFetchingResponse}
                    size={18}
                    className="ml-2"
                  />
                ) : (
                  <IoSendSharp size={18} className="ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side menu */}
      <div></div>
    </div>
  )
}

export default Home
