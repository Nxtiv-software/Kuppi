import React from 'react';
import { Star, Quote } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Kavindya Silva',
    text: 'I was failing Chemistry before joining Kuppi.lk. The organic chemistry sessions helped me understand molecular structures and reactions. Got an A for my O/L!',
    rating: 5,
    subject: 'Chemistry'
  },
  {
    name: 'Ravindu Jayasinghe',
    text: 'Mathematics was my biggest fear, especially algebra and geometry. The tutors here made calculus so simple with step-by-step explanations. Highly recommend!',
    rating: 5,
    subject: 'Mathematics'
  },
  {
    name: 'Ishara Kumari',
    text: 'Physics concepts like electricity and motion were confusing until I found this platform. The interactive sessions and real-world examples made everything clear.',
    rating: 4,
    subject: 'Physics'
  },
  {
    name: 'Sandun Fernando',
    text: 'Biology diagrams and processes seemed impossible to memorize. The tutors taught me amazing techniques for human biology and plant systems. Excellent platform!',
    rating: 5,
    subject: 'Biology'
  },
  {
    name: 'Nimasha Rathnayake',
    text: 'Economics theories and market concepts were too abstract for me. The practical examples and case studies here made microeconomics so much easier to understand.',
    rating: 4,
    subject: 'Economics'
  }
];

const Testimonials = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.backgroundPattern}>
        <div className={styles.patternShape}></div>
        <div className={styles.patternShape}></div>
        <div className={styles.patternShape}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            From Struggle to Success
          </h2>
          <p className={styles.subtitle}>
            See how our students transformed their learning experience
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.cardInner}>
                <div className={styles.subjectBadge}>{testimonial.subject}</div>
                
                <Quote className={styles.quoteIcon} />
                
                <div className={styles.content}>
                  <p className={styles.testimonialText}>
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                    <p className={styles.authorSubject}>{testimonial.subject}</p>
                  </div>
                  
                  <div className={styles.rating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className={styles.starIcon} />
                    ))}
                  </div>
                </div>

                <div className={styles.cardGradient}></div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.testimonialsGridBottom}>
          {testimonials.slice(3, 5).map((testimonial, index) => (
            <div key={index + 3} className={styles.testimonialCard}>
              <div className={styles.cardInner}>
                <div className={styles.subjectBadge}>{testimonial.subject}</div>
                
                <Quote className={styles.quoteIcon} />
                
                <div className={styles.content}>
                  <p className={styles.testimonialText}>
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                    <p className={styles.authorSubject}>{testimonial.subject}</p>
                  </div>
                  
                  <div className={styles.rating}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className={styles.starIcon} />
                    ))}
                  </div>
                </div>

                <div className={styles.cardGradient}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;