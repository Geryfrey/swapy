import type { MentalHealthCenter, Resource } from "./types"

// Simulated ML prediction service
export function predictMentalHealth(responses: Record<string, any>) {
  // Simulate ML model predictions based on responses
  const conditions = []
  let riskLevel: "critical" | "moderate" | "low" = "low"
  let sentiment: "positive" | "negative" | "neutral" = "neutral"

  // Analyze responses (simplified logic)
  const stressIndicators = Object.values(responses).filter((r) => typeof r === "number" && r > 7).length

  const negativeResponses = Object.values(responses).filter(
    (r) => typeof r === "string" && (r.includes("anxious") || r.includes("depressed") || r.includes("stressed")),
  ).length

  if (stressIndicators > 3 || negativeResponses > 2) {
    conditions.push("Academic Stress", "Anxiety")
    riskLevel = "critical"
    sentiment = "negative"
  } else if (stressIndicators > 1 || negativeResponses > 0) {
    conditions.push("Mild Anxiety")
    riskLevel = "moderate"
    sentiment = "neutral"
  } else {
    conditions.push("General Wellness")
    riskLevel = "low"
    sentiment = "positive"
  }

  // Add more conditions based on specific patterns
  if (responses.sleep && responses.sleep < 6) {
    conditions.push("Sleep Disorders")
  }
  if (responses.social && responses.social < 5) {
    conditions.push("Social Anxiety")
  }

  return {
    conditions: [...new Set(conditions)],
    riskLevel,
    sentiment,
    confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
  }
}

export function getRecommendations(predictions: any): { centers?: MentalHealthCenter[]; resources: Resource[] } {
  const recommendations: { centers?: MentalHealthCenter[]; resources: Resource[] } = {
    resources: [],
  }

  if (predictions.riskLevel === "critical") {
    recommendations.centers = getMentalHealthCenters().slice(0, 3)
  }

  recommendations.resources = getRelevantResources(predictions.conditions)

  return recommendations
}

function getMentalHealthCenters(): MentalHealthCenter[] {
  return [
    {
      id: "1",
      name: "University Counseling Center",
      address: "123 Campus Drive, University City",
      phone: "+1-555-0123",
      email: "counseling@university.edu",
      specialties: ["Anxiety", "Depression", "Academic Stress"],
      availability: "Mon-Fri 9AM-5PM",
      rating: 4.8,
      distance: 0.5,
    },
    {
      id: "2",
      name: "Mental Health First Aid Clinic",
      address: "456 Health Street, Medical District",
      phone: "+1-555-0456",
      email: "info@mhfaclinic.com",
      specialties: ["Crisis Intervention", "Trauma", "Substance Abuse"],
      availability: "24/7 Emergency Services",
      rating: 4.6,
      distance: 2.1,
    },
    {
      id: "3",
      name: "Mindful Wellness Center",
      address: "789 Peaceful Lane, Wellness District",
      phone: "+1-555-0789",
      email: "contact@mindfulwellness.com",
      specialties: ["Mindfulness", "Stress Management", "Group Therapy"],
      availability: "Mon-Sat 8AM-8PM",
      rating: 4.7,
      distance: 1.8,
    },
  ]
}

function getRelevantResources(conditions: string[]): Resource[] {
  const allResources: Resource[] = [
    {
      id: "1",
      title: "Managing Academic Stress: A Student's Guide",
      type: "article",
      content: `Academic stress is a common experience among students, but it doesn't have to overwhelm you. Here are evidence-based strategies to help you manage stress effectively:

## Understanding Academic Stress

Academic stress occurs when students feel overwhelmed by their educational responsibilities. Common triggers include:
- Heavy workload and tight deadlines
- Fear of failure or poor performance
- Competition with peers
- Financial pressures
- Uncertainty about the future

## Effective Stress Management Strategies

### 1. Time Management
- Use a planner or digital calendar
- Break large tasks into smaller, manageable chunks
- Prioritize tasks using the Eisenhower Matrix
- Set realistic goals and deadlines

### 2. Study Techniques
- Practice active learning methods
- Form study groups with classmates
- Use the Pomodoro Technique (25-minute focused sessions)
- Create a dedicated study space

### 3. Self-Care Practices
- Maintain a regular sleep schedule (7-9 hours)
- Exercise regularly, even if just a 20-minute walk
- Practice mindfulness or meditation
- Eat nutritious meals and stay hydrated

### 4. Seeking Support
- Talk to professors during office hours
- Utilize campus resources like tutoring centers
- Connect with friends and family
- Consider counseling services if stress becomes overwhelming

## When to Seek Professional Help

If you experience persistent symptoms like:
- Difficulty sleeping or concentrating
- Loss of appetite or overeating
- Feelings of hopelessness
- Physical symptoms like headaches or stomach issues

Don't hesitate to reach out to mental health professionals. Remember, seeking help is a sign of strength, not weakness.`,
      summary:
        "A comprehensive guide to understanding and managing academic stress with practical strategies and resources.",
      tags: ["Academic Stress", "Study Tips", "Self-Care"],
      author: "Dr. Sarah Johnson",
      publishedAt: new Date("2024-01-15"),
      readTime: 8,
    },
    {
      id: "2",
      title: "Understanding Anxiety: Symptoms and Coping Strategies",
      type: "article",
      content: `Anxiety is one of the most common mental health conditions, affecting millions of people worldwide. Understanding anxiety and learning effective coping strategies can significantly improve your quality of life.

## What is Anxiety?

Anxiety is a natural response to stress or danger. However, when anxiety becomes excessive, persistent, or interferes with daily activities, it may indicate an anxiety disorder.

### Common Types of Anxiety Disorders:
- Generalized Anxiety Disorder (GAD)
- Social Anxiety Disorder
- Panic Disorder
- Specific Phobias

## Recognizing Anxiety Symptoms

### Physical Symptoms:
- Rapid heartbeat or palpitations
- Sweating or trembling
- Shortness of breath
- Muscle tension
- Fatigue
- Digestive issues

### Emotional Symptoms:
- Excessive worry or fear
- Feeling restless or on edge
- Irritability
- Difficulty concentrating
- Sleep disturbances

## Effective Coping Strategies

### 1. Breathing Techniques
- Deep breathing exercises
- 4-7-8 breathing technique
- Box breathing (4-4-4-4 pattern)

### 2. Mindfulness and Meditation
- Practice present-moment awareness
- Use guided meditation apps
- Try progressive muscle relaxation

### 3. Cognitive Strategies
- Challenge negative thoughts
- Practice positive self-talk
- Use grounding techniques (5-4-3-2-1 method)

### 4. Lifestyle Changes
- Regular exercise
- Limit caffeine and alcohol
- Maintain a consistent sleep schedule
- Eat a balanced diet

### 5. Social Support
- Talk to trusted friends or family
- Join support groups
- Consider therapy or counseling

## Professional Treatment Options

If anxiety significantly impacts your life, consider:
- Cognitive Behavioral Therapy (CBT)
- Medication (consult with a healthcare provider)
- Support groups
- Specialized anxiety treatment programs

Remember, anxiety is treatable, and with the right support and strategies, you can learn to manage it effectively.`,
      summary:
        "Learn about anxiety symptoms, types, and evidence-based coping strategies to manage anxiety effectively.",
      tags: ["Anxiety", "Mental Health", "Coping Strategies"],
      author: "Dr. Michael Chen",
      publishedAt: new Date("2024-02-01"),
      readTime: 10,
    },
    {
      id: "3",
      title: "Building Resilience: Bouncing Back from Challenges",
      type: "blog",
      content: `Resilience is the ability to adapt and bounce back when things don't go as planned. It's not about avoiding difficulties, but rather learning how to cope with them effectively.

## What is Resilience?

Resilience isn't a trait that people either have or don't have. It involves behaviors, thoughts, and actions that can be learned and developed by anyone.

## Key Components of Resilience

### 1. Emotional Regulation
- Recognizing and managing emotions
- Developing healthy coping mechanisms
- Practicing self-compassion

### 2. Cognitive Flexibility
- Adapting thinking patterns
- Finding alternative solutions
- Reframing negative situations

### 3. Social Connection
- Building strong relationships
- Seeking support when needed
- Helping others in their struggles

### 4. Meaning-Making
- Finding purpose in challenges
- Learning from setbacks
- Maintaining hope for the future

## Building Resilience Skills

### Daily Practices:
- Keep a gratitude journal
- Practice mindfulness meditation
- Set small, achievable goals
- Celebrate small victories

### During Challenges:
- Focus on what you can control
- Break problems into manageable steps
- Seek support from others
- Practice self-care

### Long-term Strategies:
- Develop a growth mindset
- Build a strong support network
- Engage in meaningful activities
- Maintain physical health

## The Science of Resilience

Research shows that resilient people:
- Have better physical health
- Experience less depression and anxiety
- Perform better under pressure
- Have stronger relationships

## Conclusion

Remember, building resilience is a journey, not a destination. Be patient with yourself as you develop these skills, and don't hesitate to seek professional help when needed.`,
      summary: "Discover how to build resilience and develop the skills to bounce back from life's challenges.",
      tags: ["Resilience", "Personal Growth", "Mental Strength"],
      author: "Dr. Emily Rodriguez",
      publishedAt: new Date("2024-01-28"),
      readTime: 7,
    },
  ]

  return allResources.filter((resource) =>
    conditions.some((condition) =>
      resource.tags.some(
        (tag) =>
          tag.toLowerCase().includes(condition.toLowerCase()) || condition.toLowerCase().includes(tag.toLowerCase()),
      ),
    ),
  )
}
