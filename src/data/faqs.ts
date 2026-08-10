export interface FaqItem {
  question: string;
  answer: string;
  category: "Prescriptions" | "Shipping & Delivery" | "Returns & Warranty" | "Virtual Try-On" | "ILens Circle";
}

export const MOCK_FAQS: FaqItem[] = [
  {
    category: "Prescriptions",
    question: "How do I provide my optical prescription?",
    answer: "You can enter your prescription values manually (OD/OS sphere, cylinder, axis, add, PD) during the lens customization flow, or simply upload a photo or PDF of your doctor's script. Our certified optical technicians review every prescription before glazing."
  },
  {
    category: "Prescriptions",
    question: "What if I don't know my Pupillary Distance (PD)?",
    answer: "You can measure your PD in 10 seconds using our webcam PD tool, or ask your optometrist. Average adult single PD ranges from 54mm to 74mm."
  },
  {
    category: "Shipping & Delivery",
    question: "How long does lens crafting and delivery take?",
    answer: "Single vision orders ship within 2-4 business days. Custom progressive or high-index prescriptions ship in 4-6 business days. Express 2-Day Air is free on orders over $150."
  },
  {
    category: "Returns & Warranty",
    question: "What is the ILens 30-Day Guarantee & Warranty?",
    answer: "We offer a 30-day risk-free home trial with 100% money-back guarantee, including custom prescription lenses! Furthermore, all frames include a 1-year free warranty covering accidental manufacturing defects."
  },
  {
    category: "Virtual Try-On",
    question: "How accurate is the Virtual Try-On tool?",
    answer: "ILens VTO utilizes 3D facial mesh alignment to accurately scale frame dimensions relative to your interpupillary distance and ear height, delivering a photorealistic 1:1 scale preview."
  },
  {
    category: "ILens Circle",
    question: "What are the benefits of ILens Circle?",
    answer: "ILens Circle members earn 10 points per $1 spent, receive free annual frame polishing, early access to limited edition artisan drops, and free annual vision checkups."
  }
];
