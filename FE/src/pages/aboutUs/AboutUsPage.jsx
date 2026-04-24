import { Link } from 'react-router-dom';
import styles from './AboutUsPage.module.css';
import sampleImage3 from '../../assets/images/sample3.webp';
import sampleImage4 from '../../assets/images/sample4.webp';
import TextType from '../../components/TextType/TextType';

const storySections = [
    {
        eyebrow: 'Since 2014',
        title: 'What We Do',
        description:
            'KHK Fashion offers high-quality fashion collections that combine modern trends with everyday wearability. We focus on durable materials, flattering fits, and an easy shopping experience. Our mission is to help customers express their unique style with confidence and comfort.',
        
        image: sampleImage4,
        reverse: false,
    },
    {
        eyebrow: '',
        title: 'When We Started',
        description:
            'From a small group of fashion enthusiasts, KHK Fashion has grown into a trusted brand among young customers. Each product is carefully selected to maintain the criteria of beauty, comfort, and durability over time. We are committed to providing a seamless shopping experience and continuously updating our collections to meet the evolving tastes of our customers.',
        image: sampleImage3,
        reverse: true,
    },
];

const teamMembers = [
    {
        name: 'Trần Huỳnh Minh Kiệt',
        role: 'Co Founder',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop',
    },
    {
        name: 'Đinh Tấn Khiêm',
        role: 'CTO',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop',
    },
    {
        name: 'Nguyễn Huy Hoàng',
        role: 'CEO',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop',
    },
];

export default function AboutUsPage() {
    return (
        <div className={styles.aboutPage}>
            <section className={styles.heroSection} data-aos="fade-up">
                <h1 className={styles.heroTitle}>Who we are?</h1>
                <p className={styles.heroDescription}>
                    <TextType
                        texts={[
                            'KHK Fashion is a team of fashion enthusiasts who believe that everyone deserves to look and feel great in their own unique way. We create a modern, friendly shopping experience and stay up-to-date with the latest trends.'
                        ]}
                        typingSpeed={50}
                        pauseDuration={2000}
                        showCursor={false}
                    />
                </p>
            </section>

            <section className={styles.storySection} >
                {storySections.map((item) => (
                    <article
                        key={item.title}
                        className={`${styles.storyRow} ${item.reverse ? styles.reverse : ''}`}
                        data-aos="fade-up"
                    >
                        <div className={styles.storyContent}>
                            {item.eyebrow ? <p className={styles.eyebrow}>{item.eyebrow}</p> : null}
                            <h2>{item.title}</h2>
                            <p>
                                <TextType
                                    texts={[item.description]}
                                    typingSpeed={40}
                                    pauseDuration={2000}
                                    showCursor={false}
                                />
                            </p>
                        </div>
                        <div className={styles.imageStack}>
                            <img src={item.image} alt={item.title} className={styles.imageBack} />
                            <img src={item.image} alt={item.title} className={styles.imageMiddle} />
                            <img src={item.image} alt={item.title} className={styles.imageFront} />
                        </div>
                    </article>
                ))}
            </section>

            <section className={styles.teamSection} data-aos="fade-up">
                <h2>Our Makers</h2>
                <p>
                    <TextType
                        texts={[
                            "KHK's team brings together experienced professionals in design, operations, and brand development. We collaborate to create collections that cater to diverse lifestyles."
                        ]}
                        typingSpeed={50}
                        pauseDuration={2000}
                        showCursor={false}
                    />
                </p>

                <div className={styles.teamGrid}>
                    {teamMembers.map((member) => (
                        <article key={member.name} className={styles.memberCard}>
                            <img src={member.image} alt={member.name} loading="lazy" />
                            <h3>{member.name}</h3>
                            <span>{member.role}</span>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}