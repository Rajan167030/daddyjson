"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is daddy-json?",
    answer:
      "daddy-json is a modern, open-source, and feature-rich starter kit for building amazing web applications with Next.js, TypeScript, and Tailwind CSS. It comes with pre-built components, authentication, and a blog, so you can focus on building your unique features.",
  },
  {
    question: "How do I get started?",
    answer:
      "You can get started by cloning the repository from GitHub and following the setup instructions in the README.md file. It's designed to be quick and easy to get your project up and running.",
  },
  {
    question: "Can I customize the design?",
    answer:
      "Absolutely! The project is built with Tailwind CSS and shadcn/ui, making it highly customizable. You can easily change the colors, fonts, and layout to match your brand.",
  },
  {
    question: "Is it mobile-friendly?",
    answer:
      "Yes, the starter kit is fully responsive and optimized for all screen sizes, from mobile phones to desktops. Your application will look great on any device.",
  },
]

export function Faq() {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
