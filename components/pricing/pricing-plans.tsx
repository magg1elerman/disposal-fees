"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, HelpCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState("monthly")

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small haulers just getting started",
      priceMonthly: 49,
      priceYearly: 470,
      features: [
        "Up to 250 customers",
        "5 routes",
        "Basic route optimization",
        "Email & SMS messaging",
        "Customer portal",
        "Basic reporting",
        "Email support",
      ],
      limitations: ["No API access", "No custom branding", "Limited integrations"],
    },
    {
      name: "Professional",
      description: "For growing waste management businesses",
      priceMonthly: 99,
      priceYearly: 950,
      popular: true,
      features: [
        "Up to 1,000 customers",
        "Unlimited routes",
        "Advanced route optimization",
        "Email & SMS messaging",
        "Customer portal",
        "Advanced reporting",
        "Priority email support",
        "API access",
        "Custom branding",
        "Integrations with accounting software",
      ],
      limitations: ["Limited white-labeling options"],
    },
    {
      name: "Enterprise",
      description: "For large haulers with complex needs",
      priceMonthly: 249,
      priceYearly: 2390,
      features: [
        "Unlimited customers",
        "Unlimited routes",
        "Advanced route optimization",
        "Email & SMS messaging",
        "Customer portal",
        "Advanced reporting & analytics",
        "24/7 phone & email support",
        "API access",
        "Full white-labeling",
        "Custom integrations",
        "Dedicated account manager",
        "Custom development options",
      ],
    },
  ]

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your waste management business. All plans include a 14-day free trial.
        </p>

        <div className="flex justify-center mt-6">
          <Tabs defaultValue="monthly" value={billingCycle} onValueChange={setBillingCycle} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-primary shadow-md" : ""}`}>
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly}
                </span>
                <span className="text-muted-foreground ml-1">/{billingCycle === "monthly" ? "month" : "year"}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    What's included
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">Features included in the {plan.name} plan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations && plan.limitations.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      Limitations
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">Features not included in the {plan.name} plan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h3>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start text-muted-foreground">
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">Need a custom solution?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          We offer custom solutions for large waste management companies with specific requirements. Contact our sales
          team to discuss your needs.
        </p>
        <Button size="lg">Contact Sales</Button>
      </div>

      <div className="mt-16 bg-muted/30 rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {[
            {
              question: "Can I switch plans later?",
              answer:
                "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the start of your next billing cycle.",
            },
            {
              question: "Is there a setup fee?",
              answer:
                "No, there are no setup fees for any of our plans. You only pay the advertised price for your selected plan.",
            },
            {
              question: "Do you offer discounts for non-profits?",
              answer:
                "Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information.",
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, ACH transfers, and wire transfers for annual plans.",
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer:
                "Yes, you can cancel your subscription at any time. If you cancel, you'll have access to your plan until the end of your current billing cycle.",
            },
            {
              question: "Is my data secure?",
              answer:
                "Yes, we take data security very seriously. All data is encrypted in transit and at rest. We are SOC 2 compliant and regularly undergo security audits.",
            },
          ].map((faq, i) => (
            <div key={i} className="space-y-2">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
