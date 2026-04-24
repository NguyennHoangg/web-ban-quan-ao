import { Link } from 'react-router-dom';
import styles from './AboutUsPage.module.css';
import sampleImage3 from '../../assets/images/sample3.webp';
import sampleImage4 from '../../assets/images/sample4.webp';

const storySections = [
    {
        eyebrow: 'Since 2014',
        title: 'What We Do',
        description:
            'KHK Fashion mang đến các bộ sưu tập thời trang chất lượng cao, kết hợp giữa xu hướng hiện đại và tính ứng dụng hằng ngày. Chúng tôi tập trung vào chất liệu bền đẹp, phom dáng vừa vặn và trải nghiệm mua sắm dễ dàng.',
        buttonText: 'More',
        image: sampleImage4,
        reverse: false,
    },
    {
        eyebrow: '',
        title: 'When We Started',
        description:
            'Từ một nhóm nhỏ đam mê thời trang, KHK Fashion đã phát triển thành thương hiệu được khách hàng trẻ tin tưởng. Từng sản phẩm được chọn lọc kỹ lưỡng để giữ vững tiêu chí đẹp, thoải mái và bền vững theo thời gian.',
        buttonText: 'More',
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
            <section className={styles.heroSection}>
                <p className={styles.eyebrow}>About Us</p>
                <h1 className={styles.heroTitle}>Who we are.</h1>
                <p className={styles.heroDescription}>
                    KHK Fashion là đội ngũ yêu thời trang và tin rằng mỗi người đều xứng đáng mặc đẹp theo cách riêng.
                    Chúng tôi xây dựng một không gian mua sắm hiện đại, thân thiện và luôn cập nhật xu hướng mới nhất.
                </p>
                <Link className={styles.primaryButton} to="/products">
                    More
                </Link>
            </section>

            <section className={styles.storySection}>
                {storySections.map((item) => (
                    <article
                        key={item.title}
                        className={`${styles.storyRow} ${item.reverse ? styles.reverse : ''}`}
                    >
                        <div className={styles.storyContent}>
                            {item.eyebrow ? <p className={styles.eyebrow}>{item.eyebrow}</p> : null}
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                            <button className={styles.primaryButton} type="button">
                                {item.buttonText}
                            </button>
                        </div>
                        <div className={styles.imageStack}>
                            <img src={item.image} alt={item.title} className={styles.imageBack} />
                            <img src={item.image} alt={item.title} className={styles.imageMiddle} />
                            <img src={item.image} alt={item.title} className={styles.imageFront} />
                        </div>
                    </article>
                ))}
            </section>

            <section className={styles.teamSection}>
                <h2>Our Makers</h2>
                <p>
                    Đội ngũ KHK quy tụ những thành viên có kinh nghiệm trong thiết kế, vận hành và phát triển thương hiệu.
                    Chúng tôi cùng nhau tạo nên những bộ sưu tập phù hợp với nhiều phong cách sống.
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