import { BasicDetails, Section } from '../types/resume';

export const testBasicDetails: BasicDetails = {
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@email.com",
    city: "Toronto",
    province: "ON",
    github: "https://github.com/priyasharma",
    linkedin: "https://linkedin.com/in/priyasharma",
    portfolio: "https://priyasharma.dev"
};

export const testSections: Section[] = [
    {
        id: 'profile_summary',
        type: 'profile_summary',
        content: {
            format: 'bullets',
            bullets: [
                "Data Engineer with 3+ years of experience building scalable data pipelines and analytics solutions",
                "Specialized in Python, SQL, and cloud technologies with proven track record of optimizing data workflows",
                "Strong communicator with experience mentoring junior team members and presenting insights to stakeholders"
            ]
        },
        visible: true,
    },
    {
        id: 'tech_skills',
        type: 'tech_skills',
        content: {
            categories: [
                {
                    name: "Programming Languages",
                    skills: "Python, SQL, Java, JavaScript, R"
                },
                {
                    name: "Data Engineering",
                    skills: "Apache Spark, Airflow, Kafka, DBT, Snowflake"
                },
                {
                    name: "Cloud & DevOps",
                    skills: "AWS (S3, Lambda, Glue, Redshift), Docker, Kubernetes, Terraform"
                },
                {
                    name: "Databases",
                    skills: "PostgreSQL, MySQL, MongoDB, Redis, Cassandra"
                },
                {
                    name: "Tools & Frameworks",
                    skills: "Git, Pandas, NumPy, React, FastAPI, Django"
                }
            ]
        },
        visible: true,
    },
    {
        id: 'experience',
        type: 'experience',
        content: {
            entries: [
                {
                    company: "Royal Bank of Canada (RBC)",
                    title: "Data Engineer",
                    location: "Toronto, ON",
                    startDate: "Jan 2021",
                    endDate: "Dec 2024",
                    bullets: [
                        "Built and maintained 15+ data pipelines processing 2TB+ daily data using Apache Spark and Airflow, reducing processing time by 40%",
                        "Migrated legacy SQL Server databases to Google Cloud Platform (BigQuery), improving query performance by 60%",
                        "Developed real-time fraud detection system using Kafka and Python, preventing $2M+ in fraudulent transactions",
                        "Collaborated with data scientists to productionize ML models, serving 10K+ predictions per day",
                        "Mentored 3 junior engineers on best practices for data engineering and code review processes"
                    ]
                },
                {
                    company: "TechStart Solutions",
                    title: "Junior Data Analyst",
                    location: "Mississauga, ON",
                    startDate: "Jun 2019",
                    endDate: "Dec 2020",
                    bullets: [
                        "Created automated reporting dashboards using Python and Tableau, saving 20 hours/week of manual work",
                        "Performed exploratory data analysis on customer behavior data to identify growth opportunities",
                        "Optimized SQL queries reducing report generation time from 45 minutes to 5 minutes",
                        "Collaborated with marketing team to build customer segmentation model using K-means clustering"
                    ]
                }
            ]
        },
        visible: true,
    },
    {
        id: 'projects',
        type: 'projects',
        content: {
            entries: [
                {
                    name: "Real-Time Stock Analytics Platform",
                    description: [
                        "Built end-to-end data pipeline ingesting real-time stock data from multiple APIs using Python and Kafka",
                        "Implemented streaming analytics with Apache Flink to detect price anomalies and trading patterns",
                        "Created interactive dashboard with React and D3.js serving 1000+ concurrent users",
                        "Deployed on AWS using Docker and ECS with 99.9% uptime over 6 months"
                    ],
                    technologies: "Python, Kafka, Apache Flink, React, AWS, Docker, PostgreSQL",
                    link: "https://github.com/priyasharma/stock-analytics",
                    date: "2024"
                },
                {
                    name: "Canadian Job Market Analysis Tool",
                    description: [
                        "Scraped 50K+ job postings from Canadian job boards using Python and BeautifulSoup",
                        "Built ETL pipeline with Airflow to clean, transform, and load data into PostgreSQL database",
                        "Performed NLP analysis using spaCy to extract skill requirements and salary trends",
                        "Created public-facing insights dashboard helping 500+ job seekers understand market demands"
                    ],
                    technologies: "Python, Airflow, PostgreSQL, spaCy, Pandas, Plotly",
                    link: "https://github.com/priyasharma/job-market-analysis",
                    date: "2023"
                },
                {
                    name: "E-commerce Recommendation Engine",
                    description: [
                        "Developed collaborative filtering recommendation system using Python and Surprise library",
                        "Processed 1M+ user interactions to generate personalized product recommendations",
                        "Implemented A/B testing framework showing 25% increase in click-through rate",
                        "Deployed FastAPI backend serving recommendations with <100ms latency"
                    ],
                    technologies: "Python, Surprise, FastAPI, Redis, MongoDB, Docker",
                    link: "https://github.com/priyasharma/ecommerce-recommendations",
                    date: "2023"
                }
            ]
        },
        visible: true,
    },
    {
        id: 'volunteer',
        type: 'volunteer',
        content: {
            entries: [
                {
                    organization: "Girls Who Code Toronto",
                    title: "Volunteer Mentor",
                    location: "Toronto, ON",
                    startDate: "Sep 2022",
                    endDate: "Present",
                    bullets: [
                        "Mentor 15 high school students in Python programming and data science fundamentals",
                        "Organize monthly coding workshops covering topics from web scraping to machine learning",
                        "Help students build portfolio projects and prepare for tech internships"
                    ]
                },
                {
                    organization: "Data for Good Canada",
                    title: "Data Engineer Volunteer",
                    location: "Remote",
                    startDate: "Mar 2021",
                    endDate: "Aug 2022",
                    bullets: [
                        "Built data pipeline for nonprofit analyzing housing affordability across Canadian cities",
                        "Automated data collection from government APIs saving 30 hours/month of manual work",
                        "Created visualization dashboard used by policy makers to inform housing decisions"
                    ]
                }
            ]
        },
        visible: true,
    },
    {
        id: 'education',
        type: 'education',
        content: {
            entries: [
                {
                    institution: "University of Toronto",
                    degree: "Bachelor of Science in Computer Science",
                    startDate: "2015",
                    endDate: "2019"
                },
                {
                    institution: "DataCamp",
                    degree: "Data Engineer Professional Certificate",
                    startDate: "2020",
                    endDate: "2020"
                }
            ]
        },
        visible: true,
    }
];
