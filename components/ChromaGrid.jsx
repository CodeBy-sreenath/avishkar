import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ChromaGrid = ({ items, className = '' }) => {
  const demo = [
    {
      image: 'https://i.pravatar.cc/300?img=8',
      title: 'Alex Rivera',
      subtitle: 'Full Stack Developer',
      handle: '@alexrivera',
      borderColor: '#4F46E5',
      gradient: 'linear-gradient(145deg,#4F46E5,#000)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=11',
      title: 'Jordan Chen',
      subtitle: 'DevOps Engineer',
      handle: '@jordanchen',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg,#10B981,#000)',
      url: 'https://linkedin.com/in/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=3',
      title: 'Morgan Blake',
      subtitle: 'UI/UX Designer',
      handle: '@morganblake',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg,#F59E0B,#000)',
      url: 'https://dribbble.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=16',
      title: 'Casey Park',
      subtitle: 'Data Scientist',
      handle: '@caseypark',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg,#EF4444,#000)',
      url: 'https://kaggle.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=25',
      title: 'Sam Kim',
      subtitle: 'Mobile Developer',
      handle: '@thesamkim',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(225deg,#8B5CF6,#000)',
      url: 'https://github.com/'
    },
    {
      image: 'https://i.pravatar.cc/300?img=60',
      title: 'Tyler Rodriguez',
      subtitle: 'Cloud Architect',
      handle: '@tylerrod',
      borderColor: '#06B6D4',
      gradient: 'linear-gradient(135deg,#06B6D4,#000)',
      url: 'https://aws.amazon.com/'
    }
  ];

  const data = items?.length ? items : demo;

  const handleCardClick = url => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCardMove = e => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 ${className}`}>
      {data.map((c, i) => (
        <Card key={i} data={c} index={i} onCardMove={handleCardMove} onCardClick={handleCardClick} />
      ))}
    </div>
  );
};

const Card = ({ data, index, onCardMove, onCardClick }) => {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    // Stagger the animation start time for each card
    const delay = index * 0.5;

    // Create pulsing color animation
    const tl = gsap.timeline({ repeat: -1, delay });

    tl.to(overlay, {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut'
    })
    .to(overlay, {
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut'
    });

    return () => tl.kill();
  }, [index]);

  return (
    <article
      ref={cardRef}
      onMouseMove={onCardMove}
      onClick={() => onCardClick(data.url)}
      className="group relative flex flex-col flex-1 min-w-[260px] max-w-[450px]  rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
      style={{
        '--card-border': data.borderColor || 'transparent',
        background: data.gradient,
        '--spotlight-color': 'rgba(255,255,255,0.3)'
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
        }}
      />
      <div className="relative z-10 flex-1 p-[10px] box-border">
        <img src={data.image} alt={data.title} loading="lazy" className="w-full h-full object-cover rounded-[10px]" />
      </div>
      <footer className="relative z-10 p-3 text-white font-sans grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
        <h3 className="m-0 text-[1.05rem] font-semibold">{data.title}</h3>
        {data.handle && <span className="text-[0.95rem] opacity-80 text-right">{data.handle}</span>}
        <p className="m-0 text-[0.85rem] opacity-85">{data.subtitle}</p>
        {data.location && <span className="text-[0.85rem] opacity-85 text-right">{data.location}</span>}
      </footer>
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-15"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          opacity: 1
        }}
      />
    </article>
  );
};

export default ChromaGrid;