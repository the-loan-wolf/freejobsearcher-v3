"use client";

import { Card, CardContent } from "@/components/landingpage-components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const reviews = [
  {
    name: "Sunidhi Singh",
    role: "Software Engineer",
    company: "TechCorp",
    avatar: "/professional-woman-smiling.png",
    rating: 5,
    text: "FreeJobSearcher helped me land my dream job at a top tech company in just 2 weeks! The AI matching was incredibly accurate.",
  },
  {
    name: "Aniket Sharma",
    role: "Product Manager",
    company: "InnovateCo",
    avatar: "/professional-man-smiling.png",
    rating: 5,
    text: "The personalized job recommendations were spot-on. I received 5 interview invitations in my first week!",
  },
  {
    name: "Sapna Kumari",
    role: "UX Designer",
    company: "DesignStudio",
    avatar: "/professional-woman-designer.png",
    rating: 5,
    text: "Amazing platform! The career coaching feature helped me negotiate a 40% salary increase. Highly recommend!",
  },
  {
    name: "Abhishek Kumar",
    role: "Data Scientist",
    company: "DataTech",
    avatar: "/professional-data-scientist.png",
    rating: 5,
    text: "The AI-powered matching is revolutionary. Found my perfect role that I never would have discovered otherwise.",
  },
  {
    name: "Vikas Kumar",
    role: "Marketing Director",
    company: "BrandCorp",
    avatar: "/professional-woman-marketing.png",
    rating: 5,
    text: "FreeJobSearcher made job searching actually enjoyable. The interface is beautiful and the results are phenomenal.",
  },
  {
    name: "Rahul Singh",
    role: "DevOps Engineer",
    company: "CloudSys",
    avatar: "/professional-person-engineer.jpg",
    rating: 5,
    text: "Landed 3 job offers in one month! The platform really understands what I was looking for in my next role.",
  },
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % Math.ceil(reviews.length / 3),
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleReviews = () => {
    const startIndex = currentIndex * 3;
    return reviews.slice(startIndex, startIndex + 3);
  };

  return (
    <section
      id="reviews"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-50/50 to-blue-50/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Join thousands of professionals who&apos;ve transformed their
            careers with FreeJobSearcher. Here&apos;s what they have to say
            about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {getVisibleReviews().map((review, index) => (
            <Card
              key={`${currentIndex}-${index}`}
              className="glass-card border-0 animate-fade-in-up"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Image
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-card-foreground">
                      {review.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {review.role} at {review.company}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-muted-foreground text-pretty">
                  &quot;{review.text}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(reviews.length / 3) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
