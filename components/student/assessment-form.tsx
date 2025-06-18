"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import type { User, Assessment } from "@/lib/types"
import { predictMentalHealth, getRecommendations } from "@/lib/ml-predictions"

interface AssessmentFormProps {
  user: User
  onComplete: (assessment: Assessment) => void
}

export function AssessmentForm({ user, onComplete }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const questions = [
    {
      id: "stress_level",
      title: "Academic Stress Level",
      description: "How would you rate your current level of academic stress?",
      type: "slider",
      min: 1,
      max: 10,
      labels: ["Very Low", "Very High"],
    },
    {
      id: "anxiety_level",
      title: "Anxiety Level",
      description: "How anxious have you been feeling lately?",
      type: "slider",
      min: 1,
      max: 10,
      labels: ["Not Anxious", "Extremely Anxious"],
    },
    {
      id: "sleep_quality",
      title: "Sleep Quality",
      description: "How many hours of sleep do you typically get per night?",
      type: "slider",
      min: 3,
      max: 12,
      labels: ["3 hours", "12 hours"],
    },
    {
      id: "mood",
      title: "Overall Mood",
      description: "How would you describe your mood over the past week?",
      type: "radio",
      options: [
        { value: "very_positive", label: "Very Positive" },
        { value: "positive", label: "Positive" },
        { value: "neutral", label: "Neutral" },
        { value: "negative", label: "Negative" },
        { value: "very_negative", label: "Very Negative" },
      ],
    },
    {
      id: "social_interaction",
      title: "Social Interaction",
      description: "How comfortable do you feel in social situations?",
      type: "slider",
      min: 1,
      max: 10,
      labels: ["Very Uncomfortable", "Very Comfortable"],
    },
    {
      id: "symptoms",
      title: "Recent Symptoms",
      description: "Which of the following have you experienced in the past two weeks?",
      type: "checkbox",
      options: [
        { value: "difficulty_concentrating", label: "Difficulty concentrating" },
        { value: "fatigue", label: "Fatigue or low energy" },
        { value: "irritability", label: "Irritability" },
        { value: "headaches", label: "Frequent headaches" },
        { value: "appetite_changes", label: "Changes in appetite" },
        { value: "sleep_issues", label: "Sleep problems" },
      ],
    },
    {
      id: "thoughts",
      title: "Current Thoughts",
      description: "Please describe any thoughts or concerns you'd like to share (optional):",
      type: "textarea",
    },
  ]

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleResponse = (value: any) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Get ML predictions
    const predictions = predictMentalHealth(responses)
    const recommendations = getRecommendations(predictions)

    const assessment: Assessment = {
      id: Date.now().toString(),
      studentId: user.id,
      responses,
      predictions,
      recommendations,
      createdAt: new Date(),
    }

    onComplete(assessment)
    setLoading(false)
  }

  const renderQuestion = () => {
    const question = currentQuestion
    const currentValue = responses[question.id]

    switch (question.type) {
      case "slider":
        return (
          <div className="space-y-4">
            <div className="px-3">
              <Slider
                value={[currentValue || question.min]}
                onValueChange={(value) => handleResponse(value[0])}
                min={question.min}
                max={question.max}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.labels[0]}</span>
              <span className="font-medium">{currentValue || question.min}</span>
              <span>{question.labels[1]}</span>
            </div>
          </div>
        )

      case "radio":
        return (
          <RadioGroup value={currentValue} onValueChange={handleResponse}>
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(currentValue || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const current = currentValue || []
                    if (checked) {
                      handleResponse([...current, option.value])
                    } else {
                      handleResponse(current.filter((v: string) => v !== option.value))
                    }
                  }}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        )

      case "textarea":
        return (
          <Textarea
            value={currentValue || ""}
            onChange={(e) => handleResponse(e.target.value)}
            placeholder="Share your thoughts here..."
            rows={4}
          />
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="text-lg font-medium">Analyzing Your Responses</h3>
            <p className="text-gray-600">
              Our AI is processing your assessment and generating personalized recommendations...
            </p>
            <Progress value={75} className="w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mental Health Assessment</CardTitle>
            <CardDescription>
              Question {currentStep + 1} of {questions.length}
            </CardDescription>
          </div>
          <div className="text-sm text-gray-500">{Math.round(progress)}% Complete</div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">{currentQuestion.title}</h3>
          <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
          {renderQuestion()}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!responses[currentQuestion.id] && currentQuestion.type !== "textarea"}>
            {currentStep === questions.length - 1 ? "Complete Assessment" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
