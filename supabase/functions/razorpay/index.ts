
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = 'https://glqyolncdcylutzklgtj.supabase.co'
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    const { amount, currency = "INR", courseId, userId } = await req.json()

    // Validate required parameters
    if (!amount || !courseId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Razorpay order
    const razorpay_key_id = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpay_key_secret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpay_key_id || !razorpay_key_secret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay configuration missing' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const orderData = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
      currency,
      receipt: `order_${Date.now()}`,
    }

    console.log('Creating Razorpay order:', orderData)

    const auth = btoa(`${razorpay_key_id}:${razorpay_key_secret}`)
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    const order = await response.json()

    if (!response.ok) {
      console.error('Razorpay order creation failed:', order)
      throw new Error(order.error.description)
    }

    console.log('Razorpay order created:', order)

    return new Response(
      JSON.stringify({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: razorpay_key_id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
