import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { answers, scores, riskLevel } = await request.json()

    // Extract written responses for sentiment analysis
    const writtenResponses = Object.values(answers)
      .filter((response) => typeof response === "string" && response.length > 10)
      .join(" ")

    const prompt = `
You are a mental health AI assistant analyzing a student wellness assessment. 

Assessment Results:
- Anxiety Score: ${scores.anxiety_score}/100
- Depression Score: ${scores.depression_score}/100  
- Stress Score: ${scores.stress_score}/100
- Overall Wellbeing Score: ${scores.overall_wellbeing_score}/100
- Risk Level: ${riskLevel}

Student Responses: ${JSON.stringify(answers)}
Written Content for Sentiment Analysis: "${writtenResponses}"

Please provide in plain text format (no markdown or special formatting):

1. SENTIMENT ANALYSIS:
   - Overall sentiment score (0-100, where 0 is very negative, 50 is neutral, 100 is very positive)
   - Sentiment label (very_negative, negative, neutral, positive, very_positive)
   - Brief explanation of the sentiment detected

2. MENTAL HEALTH ANALYSIS:
   A compassionate analysis of the student's mental health status (2-3 paragraphs)

3. RECOMMENDATIONS:
   5-7 specific, actionable recommendations for improving their wellbeing

Keep the tone supportive, non-judgmental, and encouraging. Focus on practical steps they can take.
Use plain text only - no bold, italics, or markdown formatting.
`

    // Function to strip markdown formatting
    const stripMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.*?)\*/g, "$1") // Remove italics
        .replace(/__(.*?)__/g, "$1") // Remove underline
        .replace(/_(.*?)_/g, "$1") // Remove underline
        .replace(/`(.*?)`/g, "$1") // Remove code
        .replace(/#{1,6}\s/g, "") // Remove headers
        .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
        .replace(/^\s*[-*+]\s/gm, "") // Remove bullet points
        .replace(/^\s*\d+\.\s/gm, "") // Remove numbered lists
        .trim()
    }

    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt,
      system:
        "You are a compassionate mental health AI assistant with expertise in sentiment analysis. Provide supportive, evidence-based guidance in plain text format without any markdown, bold text, or special formatting. Be clear that you are not a replacement for professional mental health care. Always include sentiment analysis when written content is provided.",
    })

    // Strip any markdown formatting from the response
    const cleanText = stripMarkdown(text)

    // Parse the response to extract different sections
    const sections = cleanText.split(/(?:SENTIMENT ANALYSIS:|MENTAL HEALTH ANALYSIS:|RECOMMENDATIONS:)/i)

    // Extract sentiment information
    const sentimentSection = sections[1] || ""
    const sentimentScoreMatch = sentimentSection.match(/(\d+)/)
    const sentimentScore = sentimentScoreMatch ? Number.parseInt(sentimentScoreMatch[1]) : 50

    const sentimentLabelMatch = sentimentSection.match(/(very_negative|negative|neutral|positive|very_positive)/i)
    const sentimentLabel = sentimentLabelMatch ? sentimentLabelMatch[1].toLowerCase() : "neutral"

    // Extract analysis and recommendations
    const analysis = sections[2] || cleanText.split("\n\n").slice(0, 2).join("\n\n")
    const recommendationsText = sections[3] || cleanText.split("\n\n").slice(2).join("\n\n")

    // Extract recommendations as array
    const recommendations = recommendationsText
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((rec) => rec.length > 0)

    return NextResponse.json({
      analysis,
      sentiment_score: sentimentScore,
      sentiment_label: sentimentLabel,
      sentiment_explanation:
        sentimentSection.split("\n").find((line) => line.includes("explanation") || line.includes("detected")) ||
        "Sentiment analysis completed based on written responses.",
      recommendations:
        recommendations.length > 0
          ? recommendations
          : [
              "Practice deep breathing exercises daily",
              "Maintain a regular sleep schedule",
              "Engage in physical activity you enjoy",
              "Connect with friends and family regularly",
              "Consider speaking with a counselor",
              "Practice mindfulness or meditation",
              "Limit caffeine and alcohol intake",
            ],
    })
  } catch (error) {
    console.error("Error analyzing assessment:", error)
    return NextResponse.json({ error: "Failed to analyze assessment" }, { status: 500 })
  }
}
