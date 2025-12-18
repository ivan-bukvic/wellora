import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a calm, supportive wellbeing assistant.

Your task is to summarize weekly activity patterns gently and non-judgmentally.

Rules:
- Observational, not instructional
- No pressure language
- No "you should"
- No numbers unless absolutely necessary
- Short, human sentences
- Encouraging tone
- No medical or fitness advice

You MUST respond with valid JSON only, no markdown, no explanations. Use this exact structure:
{
  "heroInsight": "One short sentence observation",
  "weeklySummary": ["Observation 1", "Observation 2", "Observation 3"],
  "indicators": [
    { "activity": "walking", "status": "steady|improving|inconsistent" },
    { "activity": "sleep", "status": "steady|improving|inconsistent" },
    { "activity": "hydration", "status": "steady|improving|inconsistent" }
  ],
  "microCopyCandidates": ["Short pattern observation 1", "Short pattern observation 2"]
}`;

const FALLBACK_RESPONSE = {
  heroInsight: "You've been building a steady routine.",
  weeklySummary: [],
  indicators: [],
  microCopyCandidates: []
};

interface ActivityData {
  userName: string;
  weekRange: string;
  activities: {
    walking?: string[];
    sleep?: string[];
    stretching?: string[];
    hydration?: string[];
    mindfulness?: string[];
  };
}

interface InsightResponse {
  heroInsight: string;
  weeklySummary: string[];
  indicators: { activity: string; status: string }[];
  microCopyCandidates: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPEN_AI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OPEN_AI_API_KEY not configured');
      return new Response(JSON.stringify(FALLBACK_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const activityData: ActivityData = await req.json();
    
    // Validate required fields
    if (!activityData.userName || !activityData.weekRange || !activityData.activities) {
      console.error('Invalid request body - missing required fields');
      return new Response(JSON.stringify(FALLBACK_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build user prompt from structured data
    const userPrompt = `Analyze this week's activity data for ${activityData.userName} (${activityData.weekRange}):

Walking: ${JSON.stringify(activityData.activities.walking || [])}
Sleep: ${JSON.stringify(activityData.activities.sleep || [])}
Stretching: ${JSON.stringify(activityData.activities.stretching || [])}
Hydration: ${JSON.stringify(activityData.activities.hydration || [])}
Mindfulness: ${JSON.stringify(activityData.activities.mindfulness || [])}

Generate a calm, supportive insight summary.`;

    console.log('Calling OpenAI API for weekly insight generation');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return new Response(JSON.stringify(FALLBACK_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in OpenAI response');
      return new Response(JSON.stringify(FALLBACK_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the JSON response from OpenAI
    let parsedInsight: InsightResponse;
    try {
      // Clean potential markdown code blocks
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      parsedInsight = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON');
      return new Response(JSON.stringify(FALLBACK_RESPONSE), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate response structure
    const validatedResponse: InsightResponse = {
      heroInsight: typeof parsedInsight.heroInsight === 'string' 
        ? parsedInsight.heroInsight 
        : FALLBACK_RESPONSE.heroInsight,
      weeklySummary: Array.isArray(parsedInsight.weeklySummary) 
        ? parsedInsight.weeklySummary.filter(s => typeof s === 'string')
        : [],
      indicators: Array.isArray(parsedInsight.indicators)
        ? parsedInsight.indicators.filter(i => i.activity && i.status)
        : [],
      microCopyCandidates: Array.isArray(parsedInsight.microCopyCandidates)
        ? parsedInsight.microCopyCandidates.filter(s => typeof s === 'string')
        : []
    };

    console.log('Successfully generated weekly insight');

    return new Response(JSON.stringify(validatedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in weekly-ai-insight function:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify(FALLBACK_RESPONSE), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
