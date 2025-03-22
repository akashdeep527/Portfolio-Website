import { ResumeData } from './types';

const initialData: ResumeData = {
  profile: {
    name: "Akashdeep Tomar",
    title: "FinCrime Analyst | Risk & Compliance Specialist",
    email: "adeep5955@gmail.com",
    phone: "9041552126",
    location: "Gurugram",
    description: "Results-driven FinCrime Analyst with hands-on experience in AML investigations, risk assessment, KYC/KYB, and regulatory compliance. Skilled in analyzing customer profiles, conducting due diligence, and ensuring adherence to global financial regulations (FATF, FinCEN, RBI). Adept at reducing fraud risks, monitoring transactions, and escalating suspicious activity reports (SARs). Recognized as a Process Champion with experience in leading teams and improving operational efficiency."
  },
  stats: [
    {
      id: "stat1",
      value: "95%",
      label: "Compliance Accuracy",
      icon: "Gauge"
    },
    {
      id: "stat2",
      value: "150+",
      label: "Monthly Reviews",
      icon: "Target"
    },
    {
      id: "stat3",
      value: "30%",
      label: "Efficiency Improvement",
      icon: "Tool"
    }
  ],
  experience: [
    {
      id: "exp1",
      company: "TaskUs India PVT LTD",
      position: "FinCrime Analyst",
      period: "07/2023 – Present",
      challenges: [
        {
          id: "challenge1",
          challenge: "High volume of false-positive alerts in transaction monitoring.",
          result: "Implemented advanced negative media screening and root-cause analysis techniques, reducing false-positive alerts by 30%."
        },
        {
          id: "challenge2",
          challenge: "Ensuring compliance with Fintech regulations.",
          result: "Conducted KYC/KYB reviews for 150+ high-risk customer profiles monthly, reducing fraud risks by 20%."
        },
        {
          id: "challenge3",
          challenge: "Meeting monthly production targets.",
          result: "Led a team of 4 analysts, achieving 95% compliance accuracy and exceeding monthly targets by 15%."
        }
      ]
    },
    {
      id: "exp2",
      company: "Genpact India",
      position: "Process Associate (Dispute Investigation)",
      period: "10/2021 – 03/2023",
      challenges: [
        {
          id: "challenge4",
          challenge: "High volume of unresolved chargeback disputes.",
          result: "Resolved 200+ complex chargeback disputes annually, recovering $500K+ in fraudulent transactions."
        },
        {
          id: "challenge5",
          challenge: "Inefficient dispute resolution process.",
          result: "Implemented root-cause analysis for 95% of cases, reducing turnaround time by 10 days."
        }
      ]
    },
    {
      id: "exp3",
      company: "Byjus",
      position: "Business Development Associate (BDA)",
      period: "12/2019 – 08/2020",
      challenges: [
        {
          id: "challenge6",
          challenge: "Low conversion rates in competitive market.",
          result: "Achieved 120% of monthly sales targets for 6 consecutive months, contributing to ₹1000K+ in revenue."
        }
      ]
    },
    {
      id: "exp4",
      company: "Teleperformance India Mohali",
      position: "Customer Support Advisor",
      period: "07/2018 – 12/2019",
      challenges: [
        {
          id: "challenge7",
          challenge: "High volume of customer complaints.",
          result: "Improved customer satisfaction scores by 25% and reduced complaint escalation rates by 15%."
        }
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      degree: "B.Tech",
      institution: "Chandigarh Group Of Colleges, Mohali",
      period: "08/2014 – 07/2018"
    },
    {
      id: "edu2",
      degree: "12th",
      institution: "P.S.E.B, Mohali",
      period: "03/2013 – 03/2014"
    },
    {
      id: "edu3",
      degree: "10th",
      institution: "P.S.E.B, Mohali",
      period: "03/2011 – 03/2012"
    }
  ],
  skills: [
    { id: "skill1", name: "AML/CFT Compliance", category: "core" },
    { id: "skill2", name: "KYC/KYB/CDD/EDD", category: "core" },
    { id: "skill3", name: "Transaction Monitoring", category: "core" },
    { id: "skill4", name: "Fraud Detection", category: "core" },
    { id: "skill5", name: "Risk Assessment", category: "core" },
    { id: "skill6", name: "Regulatory Reporting", category: "core" },
    { id: "skill7", name: "PEP & Sanctions Screening", category: "core" },
    { id: "skill8", name: "SAR/STR Filing", category: "core" },
    { id: "skill9", name: "Actimize", category: "tool" },
    { id: "skill10", name: "SAS", category: "tool" },
    { id: "skill11", name: "World-Check", category: "tool" },
    { id: "skill12", name: "LexisNexis", category: "tool" },
    { id: "skill13", name: "Oracle", category: "tool" },
    { id: "skill14", name: "Confluence", category: "tool" },
    { id: "skill15", name: "MS Office", category: "tool" }
  ],
  languages: ["English", "Hindi", "Punjabi"]
};

export default initialData;